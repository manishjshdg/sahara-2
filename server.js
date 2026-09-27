// SAHARA REST API Server
// Express backend providing all production endpoints for trauma-informed recovery ecosystem

import express from 'express';
import cors from 'cors';
import { db } from './backend/database.js';
import {
  calculatePersonalBaseline,
  evaluateCheckInSafetyAndBaseline,
  getAdaptiveLifestyleSuggestions
} from './backend/aiSupportEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger & audit middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.method !== 'GET') {
      console.log(`[API] ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ==========================================
// 1. AUTHENTICATION & PROFILE
// ==========================================

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, language = 'en' } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = db.insert('users', {
    email: email.toLowerCase(),
    password, // In a prod env with bcrypt, hashed here
    role: 'user',
    name
  });

  const newProfile = db.insert('profiles', {
    userId: newUser.id,
    displayName: name.split(' ')[0],
    phone: '',
    language,
    voiceLanguage: language,
    baselineEstablished: false,
    baselineDaysCount: 0,
    privacyLevel: 'strict',
    emergencyContactsConsent: true,
    locationSharingConsent: false,
    notificationsEnabled: true,
    highContrast: false,
    reducedMotion: false,
    lastLogin: new Date().toISOString()
  });

  res.status(201).json({
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    profile: newProfile,
    token: `sahara_sec_tok_${newUser.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify and try again.' });
  }

  let profile = db.findOne('profiles', p => p.userId === user.id);
  if (!profile) {
    profile = db.insert('profiles', {
      userId: user.id,
      displayName: user.name.split(' ')[0],
      language: 'en',
      voiceLanguage: 'en',
      baselineEstablished: false
    });
  }

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    profile,
    token: `sahara_sec_tok_${user.id}`
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  // Default to demo survivor user for rapid preview if token isn't provided
  let userId = 'usr_demo_1';
  if (authHeader && authHeader.startsWith('Bearer sahara_sec_tok_')) {
    userId = authHeader.replace('Bearer sahara_sec_tok_', '');
  }

  const user = db.findOne('users', u => u.id === userId) || db.findOne('users', u => u.id === 'usr_demo_1');
  const profile = db.findOne('profiles', p => p.userId === user.id) || {
    userId: user.id,
    displayName: user.name.split(' ')[0],
    language: 'en'
  };

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    profile
  });
});

app.get('/api/profile', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const profile = db.findOne('profiles', p => p.userId === userId);
  const user = db.findOne('users', u => u.id === userId);
  res.json({ user, profile });
});

app.put('/api/profile', (req, res) => {
  const userId = req.body.userId || 'usr_demo_1';
  const updates = req.body;
  const updated = db.update('profiles', p => p.userId === userId, updates);
  res.json(updated);
});

// Consents & Privacy Center
app.get('/api/consents', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const consents = db.find('consents', c => c.userId === userId);
  res.json(consents);
});

app.post('/api/consents', (req, res) => {
  const { userId = 'usr_demo_1', consentType, granted } = req.body;
  const existing = db.findOne('consents', c => c.userId === userId && c.consentType === consentType);
  if (existing) {
    const updated = db.update('consents', c => c.id === existing.id, { granted });
    return res.json(updated);
  }
  const inserted = db.insert('consents', { userId, consentType, granted });
  res.status(201).json(inserted);
});

// ==========================================
// 2. CHECK-INS, BASELINE & AI ENGINE
// ==========================================

app.get('/api/checkins/questions', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const userCheckins = db.find('checkins', c => c.userId === userId);
  const latestCheckin = userCheckins.length > 0 ? userCheckins[userCheckins.length - 1] : null;

  // Base adaptive questions
  const questions = [
    {
      id: 'q_mood',
      domain: 'mood',
      label: 'Overall feeling right now',
      labelTe: 'ప్రస్తుతం మీ మనోభావం ఎలా ఉంది?',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Very Low', 5: 'Neutral', 10: 'Calm & Grounded' },
      scaleLabelsTe: { 1: 'చాలా తక్కువ', 5: 'సాధారణం', 10: 'ప్రశాంతం & ధైర్యంగా' },
      defaultValue: 7
    },
    {
      id: 'q_stress',
      domain: 'stress',
      label: 'Level of tension or stress',
      labelTe: 'ఒత్తిడి లేదా ఆందోళన స్థాయి',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Completely Relaxed', 5: 'Moderate', 10: 'Very Tense' },
      scaleLabelsTe: { 1: 'పూర్తి ప్రశాంతం', 5: 'మధ్యస్థం', 10: 'తీవ్ర ఒత్తిడి' },
      defaultValue: 3
    },
    {
      id: 'q_sleep',
      domain: 'sleep',
      label: 'How was your sleep last night? (Hours / Restfulness)',
      labelTe: 'గత రాత్రి మీ నిద్ర ఎలా ఉంది? (గంటలు / ప్రశాంతత)',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Disturbed / <4h', 5: 'Average (6h)', 10: 'Restful (8h+)' },
      scaleLabelsTe: { 1: 'అశాంతిగా / 4 గం కంటే తక్కువ', 5: 'సాధారణం (6 గం)', 10: 'మంచి నిద్ర (8+ గం)' },
      defaultValue: 7
    },
    {
      id: 'q_safety',
      domain: 'safety',
      label: 'Do you feel physically and emotionally safe today?',
      labelTe: 'ఈ రోజు మీరు శారీరకంగా, మానసికంగా సురక్షితంగా ఉన్నట్లు అనిపిస్తోందా?',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Not Safe / On Edge', 5: 'Somewhat Safe', 10: 'Completely Safe' },
      scaleLabelsTe: { 1: 'భద్రతగా లేదు', 5: 'కొద్దిగా భద్రంగా', 10: 'పూర్తి సురక్షితం' },
      defaultValue: 8
    },
    {
      id: 'q_social',
      domain: 'social',
      label: 'Sense of connection with people around you',
      labelTe: 'మీ చుట్టూ ఉన్న వ్యక్తులతో అనుబంధం లేదా సంభాషణ',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Isolated / Cut off', 5: 'Neutral', 10: 'Connected & Supported' },
      scaleLabelsTe: { 1: 'ఒంటరిగా అనిపిస్తోంది', 5: 'సాధారణం', 10: 'ఆప్తుల తోడు ఉంది' },
      defaultValue: 6
    },
    {
      id: 'q_functioning',
      domain: 'functioning',
      label: 'Ease in completing simple daily routines',
      labelTe: 'రోజువారీ సాధారణ పనులు చేసుకోగలగడం',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Very Difficult', 5: 'Manageable', 10: 'Smooth & Natural' },
      scaleLabelsTe: { 1: 'చాలా కష్టంగా ఉంది', 5: 'పర్వాలేదు', 10: 'సులభంగా సాగుతోంది' },
      defaultValue: 7
    },
    {
      id: 'q_energy',
      domain: 'energy',
      label: 'Physical energy level',
      labelTe: 'శారీరక శక్తి స్థాయి',
      scaleMin: 1,
      scaleMax: 10,
      scaleLabels: { 1: 'Exhausted', 5: 'Moderate', 10: 'Vibrant' },
      scaleLabelsTe: { 1: 'పూర్తిగా అలసిపోయాను', 5: 'సరిపడా ఉంది', 10: 'ఉత్సాహంగా ఉంది' },
      defaultValue: 6
    }
  ];

  // If user is stable over past check-ins, offer short 3-question version
  let isShortVersion = false;
  if (userCheckins.length >= 3) {
    const recent3 = userCheckins.slice(-3);
    const avgStress = recent3.reduce((s, c) => s + (Number(c.stress) || 3), 0) / 3;
    const avgSleep = recent3.reduce((s, c) => s + (Number(c.sleep) || 7), 0) / 3;
    if (avgStress <= 4 && avgSleep >= 7) {
      isShortVersion = true;
    }
  }

  res.json({
    questions,
    isShortVersion,
    hasVoiceSupport: true,
    supportedVoiceLanguages: ['en-US', 'te-IN']
  });
});

app.get('/api/checkins', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const checkins = db.find('checkins', c => c.userId === userId);
  res.json(checkins);
});

app.post('/api/checkins', (req, res) => {
  const {
    userId = 'usr_demo_1',
    overallScore,
    mood,
    stress,
    sleep,
    safety,
    social,
    fear,
    functioning,
    energy,
    notes = '',
    wantsHumanSupport = false,
    audioNoteUrl = ''
  } = req.body;

  const todayStr = new Date().toISOString().split('T')[0];

  const newCheckin = db.insert('checkins', {
    userId,
    timestamp: new Date().toISOString(),
    date: todayStr,
    overallScore: Number(overallScore) || 7,
    mood: Number(mood) || 7,
    stress: Number(stress) || 3,
    sleep: Number(sleep) || 7,
    safety: Number(safety) || 8,
    social: Number(social) || 6,
    fear: Number(fear) || 2,
    functioning: Number(functioning) || 7,
    energy: Number(energy) || 6,
    notes,
    wantsHumanSupport: Boolean(wantsHumanSupport),
    audioNoteUrl
  });

  // Fetch or calculate personal baseline
  let baseline = db.findOne('personal_baselines', b => b.userId === userId);
  const allUserCheckins = db.find('checkins', c => c.userId === userId);

  if (!baseline || allUserCheckins.length >= 3) {
    const updatedBaseline = calculatePersonalBaseline(allUserCheckins);
    if (baseline) {
      baseline = db.update('personal_baselines', b => b.id === baseline.id, updatedBaseline);
    } else {
      baseline = db.insert('personal_baselines', { userId, ...updatedBaseline });
    }
  }

  // Run AI Support Signal Engine
  const evaluation = evaluateCheckInSafetyAndBaseline(newCheckin, baseline, allUserCheckins);

  let generatedSignal = null;
  if (evaluation.hasSignal || evaluation.isImmediateDanger) {
    generatedSignal = db.insert('ai_support_signals', evaluation.signal);

    // If immediate danger or human support requested, create or update professional case
    if (evaluation.isImmediateDanger || wantsHumanSupport) {
      let userCase = db.findOne('cases', cs => cs.userId === userId);
      if (userCase) {
        db.update('cases', cs => cs.id === userCase.id, {
          status: 'Active Support',
          priority: evaluation.isImmediateDanger ? 'Urgent' : 'High',
          updatedAt: new Date().toISOString()
        });
        db.insert('case_notes', {
          caseId: userCase.id,
          authorName: 'SAHARA Support Router',
          authorRole: 'System',
          noteType: evaluation.isImmediateDanger ? 'Urgent Safety Alert' : 'Support Request',
          content: evaluation.isImmediateDanger
            ? 'Urgent safety indicator reported during check-in. Routed to immediate human support protocol.'
            : 'Survivor requested human support during daily check-in. Baseline deviation recorded.'
        });
      }
    }
  }

  res.status(201).json({
    checkin: newCheckin,
    baseline,
    evaluation,
    signal: generatedSignal
  });
});

app.get('/api/baseline', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  let baseline = db.findOne('personal_baselines', b => b.userId === userId);
  if (!baseline) {
    const checkins = db.find('checkins', c => c.userId === userId);
    baseline = calculatePersonalBaseline(checkins);
  }
  res.json(baseline);
});

// AI Support Signals
app.get('/api/ai/support-signals', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const signals = db.find('ai_support_signals', s => s.userId === userId);
  res.json(signals);
});

app.post('/api/ai/support-signals/:id/acknowledge', (req, res) => {
  const { id } = req.params;
  const updated = db.update('ai_support_signals', s => s.id === id, { acknowledged: true, status: 'Reviewed' });
  res.json(updated || { success: true });
});

// Well-being & Recovery Trends
app.get('/api/wellbeing', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const days = parseInt(req.query.days || '7', 10);
  const allCheckins = db.find('checkins', c => c.userId === userId);

  // Sort by date ascending
  const sorted = [...allCheckins].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const recent = sorted.slice(-days);

  // Compute qualitative trend phrases (non-diagnostic, trauma-informed)
  let trendSummaryEn = 'Your daily rhythm has moments of grounding and reflection.';
  let trendSummaryTe = 'మీ రోజువారీ జీవితంలో ప్రశాంతత మరియు పునరుద్ధరణ క్షణాలు ఉన్నాయి.';

  if (recent.length >= 3) {
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const avgStress1 = firstHalf.reduce((s, c) => s + c.stress, 0) / firstHalf.length;
    const avgStress2 = secondHalf.reduce((s, c) => s + c.stress, 0) / secondHalf.length;
    const avgSleep1 = firstHalf.reduce((s, c) => s + c.sleep, 0) / firstHalf.length;
    const avgSleep2 = secondHalf.reduce((s, c) => s + c.sleep, 0) / secondHalf.length;

    if (avgStress2 > avgStress1 + 1.5) {
      trendSummaryEn = 'Your recent check-ins reflect increased tension compared to earlier in the week.';
      trendSummaryTe = 'వారంలో మునుపటితో పోలిస్తే ఇటీవలి సమాధానాల్లో ఒత్తిడి పెరిగినట్లు కనిపిస్తోంది.';
    } else if (avgSleep2 >= avgSleep1 + 1.0) {
      trendSummaryEn = 'Your sleep pattern is showing gentle signs of becoming more regular.';
      trendSummaryTe = 'మీ నిద్ర క్రమబద్ధం కావడానికి సానుకూల సంకేతాలు కనిపిస్తున్నాయి.';
    } else {
      trendSummaryEn = 'Your check-ins are hovering near your established personal baseline.';
      trendSummaryTe = 'మీ సమాధానాలు మీ సాధారణ వ్యక్తిగత అలవాట్లకు సమీపంలో ఉన్నాయి.';
    }
  }

  res.json({
    periodDays: days,
    checkinCount: recent.length,
    trends: recent,
    trendSummary: trendSummaryEn,
    trendSummaryTe,
    domains: ['mood', 'stress', 'sleep', 'social', 'functioning', 'energy']
  });
});

// ==========================================
// 3. HABITS & HOBBIES
// ==========================================

app.get('/api/habits', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const habits = db.find('habits', h => h.userId === userId && h.isActive);
  const todayStr = new Date().toISOString().split('T')[0];
  const logs = db.find('habit_logs', l => l.userId === userId && l.date === todayStr);

  const enriched = habits.map(h => {
    const log = logs.find(l => l.habitId === h.id);
    return {
      ...h,
      completedToday: Boolean(log && log.completed)
    };
  });

  res.json(enriched);
});

app.post('/api/habits', (req, res) => {
  const { userId = 'usr_demo_1', title, titleTe, category, icon, reminderTime = '09:00', targetDaysPerWeek = 7, notes = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newHabit = db.insert('habits', {
    userId,
    title,
    titleTe: titleTe || title,
    category: category || 'general',
    icon: icon || 'CheckCircle',
    targetDaysPerWeek,
    reminderTime,
    streak: 0,
    isActive: true,
    notes
  });
  res.status(201).json(newHabit);
});

app.post('/api/habits/:id/toggle', (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId || 'usr_demo_1';
  const todayStr = new Date().toISOString().split('T')[0];

  const habit = db.findOne('habits', h => h.id === id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  let log = db.findOne('habit_logs', l => l.habitId === id && l.date === todayStr);
  let nowCompleted = true;

  if (log) {
    nowCompleted = !log.completed;
    db.update('habit_logs', l => l.id === log.id, { completed: nowCompleted });
  } else {
    db.insert('habit_logs', {
      habitId: id,
      userId,
      date: todayStr,
      completed: true
    });
  }

  // Update streak gently without punishing missed days
  const newStreak = nowCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
  const updatedHabit = db.update('habits', h => h.id === id, { streak: newStreak });

  res.json({
    ...updatedHabit,
    completedToday: nowCompleted,
    gentleMessage: nowCompleted
      ? 'Well done honoring this small moment for yourself.'
      : 'Missed this today? That is completely okay. Tomorrow is a fresh start.'
  });
});

app.delete('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  db.update('habits', h => h.id === id, { isActive: false });
  res.json({ success: true });
});

// Hobbies
app.get('/api/hobbies', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const hobbies = db.find('hobbies', h => h.userId === userId);
  res.json(hobbies);
});

app.post('/api/hobbies', (req, res) => {
  const { userId = 'usr_demo_1', category, name, nameTe, icon, currentGoal, currentGoalTe, isFavorite = false } = req.body;
  if (!name) return res.status(400).json({ error: 'Hobby name is required' });

  const newHobby = db.insert('hobbies', {
    userId,
    category: category || 'Creative',
    name,
    nameTe: nameTe || name,
    icon: icon || 'Sparkles',
    isFavorite,
    currentGoal: currentGoal || 'Engage for 15 minutes without pressure',
    currentGoalTe: currentGoalTe || '15 నిమిషాలు శ్రద్ధగా పాల్గొనండి',
    weeklyMinutesTarget: 45,
    totalMinutesLogged: 0,
    recentNotes: ''
  });
  res.status(201).json(newHobby);
});

app.post('/api/hobbies/:id/log', (req, res) => {
  const { id } = req.params;
  const { userId = 'usr_demo_1', durationMinutes = 15, note = '' } = req.body;

  const hobby = db.findOne('hobbies', h => h.id === id);
  if (!hobby) return res.status(404).json({ error: 'Hobby not found' });

  const log = db.insert('hobby_activity_logs', {
    hobbyId: id,
    userId,
    date: new Date().toISOString().split('T')[0],
    durationMinutes: Number(durationMinutes),
    note
  });

  const updatedHobby = db.update('hobbies', h => h.id === id, {
    totalMinutesLogged: (hobby.totalMinutesLogged || 0) + Number(durationMinutes),
    recentNotes: note || hobby.recentNotes
  });

  res.json({ hobby: updatedHobby, log });
});

// Adaptive Lifestyle Suggestions
app.get('/api/lifestyle/suggestions', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const checkins = db.find('checkins', c => c.userId === userId);
  const latestCheckin = checkins.length > 0 ? checkins[checkins.length - 1] : null;
  const suggestions = getAdaptiveLifestyleSuggestions(latestCheckin);
  res.json(suggestions);
});

// ==========================================
// 4. TRUSTED CIRCLE & EMERGENCY MODE
// ==========================================

app.get('/api/trusted-contacts', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const contacts = db.find('trusted_contacts', c => c.userId === userId);
  res.json(contacts);
});

app.post('/api/trusted-contacts', (req, res) => {
  const { userId = 'usr_demo_1', name, relationship, relationshipTe, phone, canViewStatus = true, canReceiveEmergencyAlerts = true, canReceiveLocation = true, notes = '' } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  const newContact = db.insert('trusted_contacts', {
    userId,
    name,
    relationship: relationship || 'Supporter',
    relationshipTe: relationshipTe || relationship,
    phone,
    canViewStatus,
    canReceiveEmergencyAlerts,
    canReceiveLocation,
    notes
  });
  res.status(201).json(newContact);
});

app.delete('/api/trusted-contacts/:id', (req, res) => {
  const { id } = req.params;
  db.delete('trusted_contacts', c => c.id === id);
  res.json({ success: true });
});

// Emergency & Temporary Live Location Sharing
app.get('/api/emergency/status', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const activeSession = db.findOne('emergency_sessions', s => s.userId === userId && s.status === 'active');
  res.json({
    isSharing: Boolean(activeSession),
    session: activeSession || null
  });
});

app.post('/api/emergency/start', (req, res) => {
  const { userId = 'usr_demo_1', lat = 17.385044, lng = 78.486671, address = 'Banjara Hills, Hyderabad, Telangana' } = req.body;

  // Stop any prior active session
  db.update('emergency_sessions', s => s.userId === userId && s.status === 'active', {
    status: 'stopped',
    stoppedAt: new Date().toISOString()
  });

  const trustedContacts = db.find('trusted_contacts', c => c.userId === userId && c.canReceiveLocation);

  const session = db.insert('emergency_sessions', {
    userId,
    status: 'active',
    startedAt: new Date().toISOString(),
    stoppedAt: null,
    lat,
    lng,
    address,
    contactsNotified: trustedContacts.map(c => ({ id: c.id, name: c.name, phone: c.phone }))
  });

  // Create high-priority notification
  db.insert('notifications', {
    userId,
    type: 'emergency_active',
    title: 'Live Location Sharing is ACTIVE',
    titleTe: 'ప్రత్యక్ష స్థాన భాగస్వామ్యం ప్రారంభించబడింది',
    message: `Shared with ${trustedContacts.length} trusted contacts. You can stop sharing anytime.`,
    messageTe: `${trustedContacts.length} నమ్మకమైన వ్యక్తులకు మీ లొకేషన్ కనిపిస్తోంది. మీరు ఎప్పుడైనా ఆపవచ్చు.`,
    isRead: false
  });

  res.status(201).json({
    isSharing: true,
    session,
    notifiedCount: trustedContacts.length,
    message: 'Live location sharing is now active with your selected trusted circle.'
  });
});

app.post('/api/emergency/stop', (req, res) => {
  const { userId = 'usr_demo_1' } = req.body;
  db.update('emergency_sessions', s => s.userId === userId && s.status === 'active', {
    status: 'stopped',
    stoppedAt: new Date().toISOString()
  });

  res.json({
    isSharing: false,
    message: 'Live location sharing has been safely stopped.'
  });
});

// ==========================================
// 5. PROFESSIONALS, APPOINTMENTS & CASES
// ==========================================

app.get('/api/professionals', (req, res) => {
  const role = req.query.role;
  let list = db.find('professionals');
  if (role) {
    list = list.filter(p => p.role === role);
  }
  res.json(list);
});

app.get('/api/appointments', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const appointments = db.find('appointments', a => a.userId === userId);
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const {
    userId = 'usr_demo_1',
    professionalId,
    dateTime,
    mode = 'Secure In-App Video / Voice',
    notes = ''
  } = req.body;

  const prof = db.findOne('professionals', p => p.id === professionalId);
  if (!prof) return res.status(404).json({ error: 'Professional not found' });

  const appointment = db.insert('appointments', {
    userId,
    professionalId,
    professionalName: prof.name,
    dateTime: dateTime || new Date(Date.now() + 86400000).toISOString(),
    status: 'Confirmed',
    mode,
    notes,
    isUpcoming: true,
    joinUrl: `https://sahara.care/session/sec-${Math.floor(1000 + Math.random() * 9000)}-safe`,
    createdAt: new Date().toISOString()
  });

  // Notify user
  db.insert('notifications', {
    userId,
    type: 'appointment_confirmed',
    title: 'Session Confirmed',
    titleTe: 'సెషన్ ఖరారైంది',
    message: `Your appointment with ${prof.name} is confirmed for ${new Date(appointment.dateTime).toLocaleDateString()}.`,
    messageTe: `${prof.name}తో మీ అపాయింట్‌మెంట్ విజయవంతంగా బుక్ చేయబడింది.`,
    isRead: false
  });

  res.status(201).json(appointment);
});

app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.update('appointments', a => a.id === id, updates);
  res.json(updated || { success: true });
});

// Case Management for Professionals
app.get('/api/cases', (req, res) => {
  const profId = req.query.professionalId || 'prof_1';
  const cases = db.find('cases', c => c.assignedProfessionalId === profId || c.secondaryWorkerId === profId);
  res.json(cases);
});

app.get('/api/cases/:id', (req, res) => {
  const { id } = req.params;
  const userCase = db.findOne('cases', c => c.id === id);
  if (!userCase) return res.status(404).json({ error: 'Case not found' });

  const notes = db.find('case_notes', n => n.caseId === id);
  const userCheckins = db.find('checkins', c => c.userId === userCase.userId);
  const signals = db.find('ai_support_signals', s => s.userId === userCase.userId);

  res.json({
    case: userCase,
    notes,
    recentCheckins: userCheckins.slice(-7),
    signals
  });
});

app.post('/api/cases/:id/notes', (req, res) => {
  const { id } = req.params;
  const { authorName = 'Dr. Radhika Sharma', authorRole = 'Counselor', noteType = 'Progress Note', content } = req.body;

  if (!content) return res.status(400).json({ error: 'Note content is required' });

  const note = db.insert('case_notes', {
    caseId: id,
    authorName,
    authorRole,
    date: new Date().toISOString(),
    noteType,
    content
  });

  db.update('cases', c => c.id === id, { updatedAt: new Date().toISOString() });
  res.status(201).json(note);
});

app.patch('/api/cases/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;
  const updated = db.update('cases', c => c.id === id, { status, priority });
  res.json(updated);
});

// ==========================================
// 6. RESOURCES, RIGHTS & HELPLINES
// ==========================================

app.get('/api/resources', (req, res) => {
  const { category, search } = req.query;
  let items = db.find('resources');

  if (category && category !== 'All') {
    items = items.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.titleTe && r.titleTe.includes(q))
    );
  }

  res.json(items);
});

app.get('/api/helplines', (req, res) => {
  const helplines = db.find('helplines');
  res.json(helplines);
});

// ==========================================
// 7. NOTIFICATIONS & PERMISSION CENTER
// ==========================================

app.get('/api/notifications', (req, res) => {
  const userId = req.query.userId || 'usr_demo_1';
  const list = db.find('notifications', n => n.userId === userId);
  res.json(list.reverse());
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  db.update('notifications', n => n.id === id, { isRead: true });
  res.json({ success: true });
});

// ==========================================
// 8. ORGANIZATION & SUBSCRIPTION BILLING
// ==========================================

app.get('/api/organizations/current', (req, res) => {
  const org = db.findOne('organizations', o => o.id === 'org_1');
  const subs = db.find('subscriptions', s => s.orgId === org.id);
  const allCases = db.find('cases');
  const allCheckins = db.find('checkins');

  // Aggregated anonymized metrics (no individual survivor privacy breaches)
  const aggregatedMetrics = {
    totalBeneficiariesSupported: org.activeBeneficiaries,
    beneficiaryCapacityLimit: org.beneficiaryLimit,
    activeSupportCases: allCases.filter(c => c.status === 'Active Support').length,
    supportSignalsResolved: 38,
    averageResolutionDays: 3.2,
    routineCompletionRatePct: 76,
    anonymizedTrendCategories: [
      { category: 'Rhythm Stabilization', percentage: 48 },
      { category: 'Social Reconnection', percentage: 28 },
      { category: 'Legal Aid & Schemes', percentage: 24 }
    ]
  };

  res.json({
    organization: org,
    subscription: subs[0] || null,
    metrics: aggregatedMetrics
  });
});

// ==========================================
// 9. HACKATHON DEMO MODE STEPPER & RESET
// ==========================================

app.post('/api/demo/reset', (req, res) => {
  db.resetToDemo();
  res.json({
    success: true,
    message: 'Reset SAHARA demo state with Ananya Rao (Survivor) 6-day baseline deviation.'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`[SAHARA Backend] Running on http://localhost:${PORT}`);
});
