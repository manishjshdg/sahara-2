// SAHARA Relational Database Engine
// Supports ACID-like in-memory caching with atomic disk persistence,
// foreign-key style relation resolution, audit logs, and realistic trauma-informed seed data.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'sahara_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Structure
const initialData = {
  users: [
    {
      id: 'usr_demo_1',
      email: 'survivor@sahara.care',
      password: 'password123',
      role: 'user',
      name: 'Ananya Rao',
      createdAt: '2026-09-01T08:00:00.000Z'
    },
    {
      id: 'usr_prof_1',
      email: 'dr.radhika@sahara.care',
      password: 'password123',
      role: 'professional',
      name: 'Dr. Radhika Sharma',
      createdAt: '2026-08-15T09:00:00.000Z'
    },
    {
      id: 'usr_prof_2',
      email: 'suresh.social@sahara.care',
      password: 'password123',
      role: 'professional',
      name: 'K. Suresh (MSW)',
      createdAt: '2026-08-15T09:00:00.000Z'
    },
    {
      id: 'usr_org_1',
      email: 'admin@hopefoundation.org',
      password: 'password123',
      role: 'org_admin',
      name: 'Hope Recovery Alliance Admin',
      createdAt: '2026-07-01T10:00:00.000Z'
    }
  ],
  profiles: [
    {
      userId: 'usr_demo_1',
      displayName: 'Ananya',
      phone: '+91 98765 43210',
      language: 'en',
      voiceLanguage: 'en',
      baselineEstablished: true,
      baselineDaysCount: 14,
      privacyLevel: 'strict',
      emergencyContactsConsent: true,
      locationSharingConsent: false,
      notificationsEnabled: true,
      highContrast: false,
      reducedMotion: false,
      lastLogin: new Date().toISOString()
    }
  ],
  consents: [
    {
      id: 'cst_1',
      userId: 'usr_demo_1',
      consentType: 'data_processing_and_support',
      granted: true,
      updatedAt: '2026-09-01T08:05:00.000Z'
    },
    {
      id: 'cst_2',
      userId: 'usr_demo_1',
      consentType: 'emergency_contact_dispatch',
      granted: true,
      updatedAt: '2026-09-01T08:05:00.000Z'
    },
    {
      id: 'cst_3',
      userId: 'usr_demo_1',
      consentType: 'temporary_live_location_sharing',
      granted: false,
      updatedAt: '2026-09-01T08:05:00.000Z'
    }
  ],
  checkins: [],
  personal_baselines: [
    {
      id: 'pbl_demo_1',
      userId: 'usr_demo_1',
      periodDays: 14,
      typicalMood: 7.2,
      typicalStress: 3.4,
      typicalSleep: 7.5,
      typicalSocial: 6.8,
      typicalFunctioning: 7.6,
      typicalEnergy: 6.9,
      varianceThreshold: 1.8,
      status: 'established',
      calculatedAt: '2026-09-18T00:00:00.000Z'
    }
  ],
  ai_support_signals: [],
  habits: [
    {
      id: 'hbt_1',
      userId: 'usr_demo_1',
      title: 'Drink 2 glasses of water',
      titleTe: '2 గ్లాసుల నీరు త్రాగండి',
      category: 'hydration',
      icon: 'Droplet',
      targetDaysPerWeek: 7,
      reminderTime: '08:30',
      streak: 5,
      isActive: true,
      notes: 'Morning glass helps clear fog'
    },
    {
      id: 'hbt_2',
      userId: 'usr_demo_1',
      title: '10-minute morning walk in daylight',
      titleTe: 'ఉదయం 10 నిమిషాల నడక',
      category: 'movement',
      icon: 'Footprints',
      targetDaysPerWeek: 5,
      reminderTime: '07:30',
      streak: 4,
      isActive: true,
      notes: 'Grounding in fresh air'
    },
    {
      id: 'hbt_3',
      userId: 'usr_demo_1',
      title: 'Gentle box breathing (4-4-4)',
      titleTe: 'ప్రశాంత శ్వాస వ్యాయామం (4-4-4)',
      category: 'mindfulness',
      icon: 'Wind',
      targetDaysPerWeek: 7,
      reminderTime: '13:00',
      streak: 6,
      isActive: true,
      notes: 'Before afternoon tasks'
    },
    {
      id: 'hbt_4',
      userId: 'usr_demo_1',
      title: 'Regular lunch away from screens',
      titleTe: 'స్క్రీన్లకు దూరంగా భోజనం',
      category: 'nourishment',
      icon: 'Utensils',
      targetDaysPerWeek: 7,
      reminderTime: '13:30',
      streak: 3,
      isActive: true,
      notes: 'Peaceful nourishment'
    },
    {
      id: 'hbt_5',
      userId: 'usr_demo_1',
      title: 'Wind-down reading before sleep',
      titleTe: 'పడుకునే ముందు పుస్తక పఠనం',
      category: 'sleep',
      icon: 'Moon',
      targetDaysPerWeek: 7,
      reminderTime: '21:30',
      streak: 2,
      isActive: true,
      notes: 'No blue light 1 hour prior'
    }
  ],
  habit_logs: [
    { id: 'hlg_1', habitId: 'hbt_1', userId: 'usr_demo_1', date: new Date().toISOString().split('T')[0], completed: true },
    { id: 'hlg_2', habitId: 'hbt_2', userId: 'usr_demo_1', date: new Date().toISOString().split('T')[0], completed: true },
    { id: 'hlg_3', habitId: 'hbt_3', userId: 'usr_demo_1', date: new Date().toISOString().split('T')[0], completed: false }
  ],
  hobbies: [
    {
      id: 'hby_1',
      userId: 'usr_demo_1',
      category: 'Drawing & Art',
      name: 'Botanical Sketching',
      nameTe: 'చిత్రలేఖనం & స్కెచింగ్',
      icon: 'Palette',
      isFavorite: true,
      currentGoal: 'Create one small nature sketch (no pressure)',
      currentGoalTe: 'ఒక చిన్న ప్రకృతి స్కెచ్ వేయండి',
      weeklyMinutesTarget: 60,
      totalMinutesLogged: 180,
      recentNotes: 'Drew neem leaves on Sunday morning'
    },
    {
      id: 'hby_2',
      userId: 'usr_demo_1',
      category: 'Music & Instruments',
      name: 'Acoustic Guitar & Relaxing Melodies',
      nameTe: 'సంగీతం & గిటార్',
      icon: 'Music',
      isFavorite: true,
      currentGoal: 'Play or listen mindfully for 15 minutes',
      currentGoalTe: '15 నిమిషాలు శ్రద్ధగా సంగీతం వినండి లేదా ప్లే చేయండి',
      weeklyMinutesTarget: 45,
      totalMinutesLogged: 120,
      recentNotes: 'Gentle chords help calm evening nerves'
    },
    {
      id: 'hby_3',
      userId: 'usr_demo_1',
      category: 'Gardening & Plants',
      name: 'Balcony Herb Care',
      nameTe: 'మొక్కల సంరక్షణ & తోటపని',
      icon: 'Sprout',
      isFavorite: false,
      currentGoal: 'Water and check the tulsi and mint pots',
      currentGoalTe: 'తులసి, పుదీనా మొక్కలకు నీరు పోయండి',
      weeklyMinutesTarget: 30,
      totalMinutesLogged: 90,
      recentNotes: 'Feeling connected with soil'
    }
  ],
  hobby_activity_logs: [
    { id: 'hal_1', hobbyId: 'hby_1', userId: 'usr_demo_1', date: '2026-09-22', durationMinutes: 25, note: 'Pencil shading sketch' },
    { id: 'hal_2', hobbyId: 'hby_2', userId: 'usr_demo_1', date: '2026-09-23', durationMinutes: 20, note: 'Slow acoustic chords' }
  ],
  trusted_contacts: [
    {
      id: 'tc_1',
      userId: 'usr_demo_1',
      name: 'Kavita Rao',
      relationship: 'Mother',
      relationshipTe: 'తల్లి',
      phone: '+91 98480 12345',
      canViewStatus: true,
      canReceiveEmergencyAlerts: true,
      canReceiveLocation: true,
      notes: 'Safe to call any time'
    },
    {
      id: 'tc_2',
      userId: 'usr_demo_1',
      name: 'Arjun Rao',
      relationship: 'Brother',
      relationshipTe: 'సోదరుడు',
      phone: '+91 94400 54321',
      canViewStatus: true,
      canReceiveEmergencyAlerts: true,
      canReceiveLocation: true,
      notes: 'Available on WhatsApp and phone'
    },
    {
      id: 'tc_3',
      userId: 'usr_demo_1',
      name: 'Pooja Varma',
      relationship: 'Close Friend',
      relationshipTe: 'స్నేహితురాలు',
      phone: '+91 91234 56789',
      canViewStatus: false,
      canReceiveEmergencyAlerts: true,
      canReceiveLocation: false,
      notes: 'Trusted peer support'
    }
  ],
  emergency_sessions: [],
  professionals: [
    {
      id: 'prof_1',
      userId: 'usr_prof_1',
      name: 'Dr. Radhika Sharma',
      role: 'counselor',
      title: 'Lead Trauma-Informed Clinical Counselor',
      titleTe: 'ట్రామా-ఇన్ఫార్మ్డ్ కౌన్సెలర్',
      qualification: 'Ph.D. Clinical Psychology, Certified EMDR & Somatic Therapist',
      experienceYears: 14,
      languages: ['English', 'Telugu', 'Hindi'],
      bio: 'Specializes in supportive post-trauma recovery, survivor stabilization, and nervous system regulation with a compassionate, non-judgmental approach.',
      bioTe: 'పోస్ట్-ట్రామా రికవరీ మరియు బాధితుల స్థిరీకరణలో ప్రత్యేక నిపుణులు.',
      availableSlots: [
        'Today, 3:30 PM',
        'Today, 5:00 PM',
        'Tomorrow, 10:00 AM',
        'Tomorrow, 2:00 PM',
        'Thursday, 11:30 AM'
      ],
      rating: 4.95,
      casesCount: 18
    },
    {
      id: 'prof_2',
      userId: 'usr_prof_2',
      name: 'K. Suresh (MSW)',
      role: 'social_worker',
      title: 'Senior Social Worker & Legal Aid Liaison',
      titleTe: 'సీనియర్ సోషల్ వర్కర్ & లీగల్ ఎయిడ్ సమన్వయకర్త',
      qualification: 'Master of Social Work (MSW), Diploma in Human Rights Law',
      experienceYears: 11,
      languages: ['English', 'Telugu'],
      bio: 'Facilitates practical rehabilitation, survivor compensation schemes, protective orders, safe shelter, and rights assistance.',
      bioTe: 'పునరావాసం, ప్రభుత్వ సహాయ పథకాలు మరియు చట్టపరమైన సహకారంలో నిపుణులు.',
      availableSlots: [
        'Today, 4:00 PM',
        'Tomorrow, 11:00 AM',
        'Tomorrow, 3:00 PM',
        'Friday, 10:00 AM'
      ],
      rating: 4.9,
      casesCount: 24
    },
    {
      id: 'prof_3',
      userId: 'usr_prof_3',
      name: 'Meera Deshmukh',
      role: 'counselor',
      title: 'Trauma & Community Psychologist',
      titleTe: 'ట్రామా & కమ్యూనిటీ సైకాలజిస్ట్',
      qualification: 'M.Phil Clinical Psychology, Trauma-Informed Care Trainer',
      experienceYears: 9,
      languages: ['English', 'Telugu', 'Marathi'],
      bio: 'Focuses on grief, atrocity aftermath recovery, rebuilding community connections, and family reconciliation.',
      bioTe: 'కుటుంబ పునరేకీకరణ మరియు కమ్యూనిటీ ఆధారిత రికవరీ నిపుణులు.',
      availableSlots: [
        'Tomorrow, 1:00 PM',
        'Tomorrow, 4:30 PM',
        'Friday, 2:00 PM'
      ],
      rating: 4.88,
      casesCount: 15
    }
  ],
  appointments: [
    {
      id: 'apt_1',
      userId: 'usr_demo_1',
      professionalId: 'prof_1',
      professionalName: 'Dr. Radhika Sharma',
      dateTime: '2026-09-27T10:00:00.000Z',
      status: 'Confirmed',
      mode: 'Secure In-App Video / Voice',
      notes: 'Initial recovery baseline check-in & breathing grounding',
      isUpcoming: true,
      joinUrl: 'https://sahara.care/session/sec-8849-safe',
      createdAt: '2026-09-24T14:30:00.000Z'
    }
  ],
  cases: [
    {
      id: 'case_001',
      caseNumber: 'SAH-2026-0042',
      userId: 'usr_demo_1',
      userName: 'Ananya Rao',
      assignedProfessionalId: 'prof_1',
      assignedProfessionalName: 'Dr. Radhika Sharma',
      secondaryWorkerId: 'prof_2',
      status: 'Active Support',
      priority: 'Moderate',
      summary: 'Survivor participating in routine stabilization. Baseline established. Responsive to grounding habits.',
      lastContactDate: '2026-09-24',
      nextFollowUpDate: '2026-09-27',
      supportSignalsCount: 1,
      createdAt: '2026-09-02T10:00:00.000Z',
      updatedAt: '2026-09-24T15:00:00.000Z'
    }
  ],
  case_notes: [
    {
      id: 'cn_1',
      caseId: 'case_001',
      authorName: 'Dr. Radhika Sharma',
      authorRole: 'Counselor',
      date: '2026-09-24T15:10:00.000Z',
      noteType: 'Follow-up',
      content: 'Survivor noted sleep inconsistency over past 2 nights. Recommended gentle wind-down routine and maintaining morning walk habit. Scheduled video session for the 27th.'
    }
  ],
  resources: [
    {
      id: 'res_1',
      title: 'SC & ST Prevention of Atrocities Legal Relief & Compensation',
      titleTe: 'ఎస్సీ/ఎస్టీ అట్రాసిటీల నిరోధక చట్టం - చట్టపరమైన ఉపశమనం & పరిహారం',
      category: 'Legal support',
      organization: 'Department of Social Justice & Empowerment, Govt. of India',
      description: 'Official provisions for mandatory financial relief, legal aid, police protection, and rehabilitation for survivors under the POA Act (Amendments).',
      descriptionTe: 'పీవోఏ చట్టం క్రింద బాధితులకు ఆర్థిక ఉపశమనం, రక్షణ మరియు చట్టపరమైన సహాయ నిబంధనలు.',
      eligibility: 'Survivors or families protected under the SC/ST (PoA) Act',
      eligibilityTe: 'పీవోఏ చట్టం క్రింద అర్హులైన బాధితులు',
      location: 'National / All States & Union Territories',
      contact: 'Toll-Free Helpline: 1800-202-1989',
      website: 'https://socialjustice.gov.in',
      verifiedDate: '2026-09-01'
    },
    {
      id: 'res_2',
      title: 'National Legal Services Authority (NALSA) Free Legal Aid',
      titleTe: 'జాతీయ న్యాయ సేవల అథారిటీ (NALSA) ఉచిత న్యాయ సహాయం',
      category: 'Legal support',
      organization: 'NALSA & State Legal Services Authorities (SLSA)',
      description: 'Free legal counsel, court representation, and victim compensation filing for survivors of violence, women, and marginalized communities.',
      descriptionTe: 'హింసకు గురైన బాధితులకు మరియు మహిళలకు ఉచిత న్యాయవాది, కోర్టు ప్రాతినిధ్యం మరియు పరిహారం.',
      eligibility: 'All women, children, survivors of atrocities, low-income citizens',
      eligibilityTe: 'మహిళలు, పిల్లలు మరియు అట్రాసిటీ బాధితులందరికీ ఉచితం',
      location: 'District Legal Services Authority (DLSA) in every district',
      contact: 'Helpline: 15100',
      website: 'https://nalsa.gov.in',
      verifiedDate: '2026-08-20'
    },
    {
      id: 'res_3',
      title: '5-4-3-2-1 Somatic Grounding Technique for Acute Anxiety',
      titleTe: '5-4-3-2-1 ఇంద్రియాల ఆధారిత ప్రశాంతత పద్ధతి',
      category: 'Grounding',
      organization: 'SAHARA Clinical Advisory Board',
      description: 'A trauma-informed sensory exercise: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Re-anchors your nervous system in the present moment.',
      descriptionTe: 'ఆందోళన తగ్గించడానికి మీ చుట్టూ ఉన్న పరిసరాలను గమనించే శ్రద్ధాపూర్వక పద్ధతి.',
      eligibility: 'Open to all users',
      eligibilityTe: 'అందరికీ అందుబాటులో ఉంది',
      location: 'Self-help / In-app guidance',
      contact: 'In-app audio exercise',
      website: 'https://sahara.care/resources/grounding',
      verifiedDate: '2026-09-10'
    },
    {
      id: 'res_4',
      title: 'Victim Compensation Scheme (Section 357A CrPC / BNSS)',
      titleTe: 'బాధితుల పరిహార పథకం',
      category: 'Government services',
      organization: 'State Home Departments / DLSA',
      description: 'Statutory scheme for rehabilitation, emergency medical treatment expense coverage, and financial compensation awarded by DLSA/Courts.',
      descriptionTe: 'అత్యవసర వైద్య ఖర్చులు మరియు ఆర్థిక పునరావాసం కోసం రాష్ట్ర ప్రభుత్వ చట్టబద్ధ పథకం.',
      eligibility: 'Victims of physical harm, trauma, or atrocities where injury occurred',
      eligibilityTe: 'గాయపడిన లేదా హింసకు గురైన బాధితులు',
      location: 'State & District Level',
      contact: 'Apply via DLSA or Special Public Prosecutor',
      website: 'https://doj.gov.in',
      verifiedDate: '2026-08-15'
    },
    {
      id: 'res_5',
      title: 'Safe Sleep Hygiene & Nighttime Wind-Down Ritual',
      titleTe: 'ప్రశాంతమైన నిద్ర కోసం సులభమైన పద్ధతులు',
      category: 'Sleep',
      organization: 'SAHARA Wellness Team',
      description: 'Step-by-step nighttime pacing: dimming harsh overhead lights 45 minutes prior, temperature control, gentle stretching, and white noise cues.',
      descriptionTe: 'రాత్రి వేళ ప్రశాంతమైన నిద్ర కోసం క్రమబద్ధమైన అలవాట్లు.',
      eligibility: 'Open to all users',
      eligibilityTe: 'అందరికీ అందుబాటులో ఉంది',
      location: 'Self-help',
      contact: 'Self-guided',
      website: 'https://sahara.care/resources/sleep',
      verifiedDate: '2026-09-12'
    },
    {
      id: 'res_6',
      title: 'Community Shelter & Emergency Crisis Accommodation',
      titleTe: 'కమ్యూనిటీ షెల్టర్ & సురక్షిత ఆశ్రయం',
      category: 'Community support',
      organization: 'Hope Rehabilitation & Women Protection Centers',
      description: 'Immediate safe housing, food, trauma-counseling, and child-support facilities for individuals escaping dangerous domestic or community hostility.',
      descriptionTe: 'అత్యవసర సురక్షిత నివాసం, ఆహారం మరియు భద్రత.',
      eligibility: 'Immediate survivors seeking safety',
      eligibilityTe: 'తక్షణ భద్రత కోరే బాధితులు',
      location: 'Hyderabad, Warangal, Vijayawada, Visakhapatnam & Multi-city',
      contact: 'Emergency Shelter Desk: 1800-425-2900',
      website: 'https://sahara.care/shelters',
      verifiedDate: '2026-09-15'
    }
  ],
  helplines: [
    {
      id: 'hlp_1',
      name: 'Tele-MANAS (Govt. of India 24/7 Mental Health)',
      nameTe: 'టెలి-మానస్ (ప్రభుత్వ 24/7 మానసిక ఆరోగ్య హెల్ప్‌లైన్)',
      number: '14416',
      hours: '24/7 Free & Confidential',
      description: 'National tele-mental health assistance in English, Telugu, Hindi, and 17 other languages by trained counselors.',
      descriptionTe: 'తెలుగు మరియు ఆంగ్లంలో 24 గంటల ఉచిత కౌన్సెలింగ్ సేవలు.',
      isEmergency: true
    },
    {
      id: 'hlp_2',
      name: 'KIRAN National Mental Health Helpline',
      nameTe: 'కిరణ్ జాతీయ మానసిక ఆరోగ్య హెల్ప్‌లైన్',
      number: '1800-599-0019',
      hours: '24/7 Toll Free',
      description: 'Ministry of Social Justice support for distress, crisis intervention, anxiety and post-trauma stabilization.',
      descriptionTe: 'మానసిక ప్రశాంతత మరియు సహాయం కోసం కేంద్ర ప్రభుత్వ టోల్ ఫ్రీ నెంబర్.',
      isEmergency: true
    },
    {
      id: 'hlp_3',
      name: 'National Commission for Women (NCW) Violence Helpline',
      nameTe: 'జాతీయ మహిళా కమిషన్ హెల్ప్‌లైన్',
      number: '7827170170',
      hours: '24/7 Dedicated Support',
      description: 'Emergency round-the-clock support for women facing violence, atrocities, harassment, or threats.',
      descriptionTe: 'హింస మరియు వేధింపులకు గురైన మహిళల కోసం ప్రత్యేక అత్యవసర నెంబర్.',
      isEmergency: true
    },
    {
      id: 'hlp_4',
      name: 'Vandrevala Foundation Mental Health Support',
      nameTe: 'వాండ్రెవాలా ఫౌండేషన్ ఉచిత సేవలు',
      number: '+91 9999 666 555',
      hours: '24/7 Free Counselor Support',
      description: 'Empathetic listening and guidance for individuals recovering from trauma or distress.',
      descriptionTe: 'మానసిక సాంత్వన మరియు సహానుభూతితో మాట్లాడే కౌన్సెలర్లు.',
      isEmergency: false
    },
    {
      id: 'hlp_5',
      name: 'National Emergency Response System (Police / Ambulance)',
      nameTe: 'జాతీయ అత్యవసర స్పందన విభాగం (పోలీస్ / అంబులెన్స్)',
      number: '112',
      hours: '24/7 Immediate Emergency Dispatch',
      description: 'All-in-one emergency helpline for police assistance, medical ambulances, and fire safety.',
      descriptionTe: 'పోలీస్ మరియు అత్యవసర వైద్య రక్షణ కోసం.',
      isEmergency: true
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_demo_1',
      type: 'habit_reminder',
      title: 'Daily routine reminder',
      titleTe: 'రోజువారీ అలవాటు రిమైండర్',
      message: 'Take a gentle breath and enjoy a sip of water.',
      messageTe: 'ఒకసారి ప్రశాంతంగా శ్వాస తీసుకుని కొద్దిగా నీరు త్రాగండి.',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif_2',
      userId: 'usr_demo_1',
      type: 'appointment_update',
      title: 'Upcoming SAHARA session',
      titleTe: 'రాబోయే కౌన్సెలింగ్ సెషన్',
      message: 'You have a confirmed session with Dr. Radhika Sharma scheduled for tomorrow at 10:00 AM.',
      messageTe: 'రేపు ఉదయం 10:00 గంటలకు డాక్టర్ రాధిక శర్మతో మీ సెషన్ ఖరారైంది.',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ],
  organizations: [
    {
      id: 'org_1',
      name: 'Hope Recovery & Survivor Alliance',
      type: 'Non-Governmental Organization (NGO)',
      beneficiaryLimit: 250,
      activeBeneficiaries: 84,
      subscriptionTier: 'enterprise',
      billingCycle: 'Annual Sponsored',
      status: 'Active',
      contactEmail: 'admin@hopefoundation.org',
      city: 'Hyderabad & Regional Outreach'
    },
    {
      id: 'org_2',
      name: 'Victim Rehabilitation Trust (Telangana Outreach)',
      type: 'Social Support Institution',
      beneficiaryLimit: 100,
      activeBeneficiaries: 42,
      subscriptionTier: 'professional',
      billingCycle: 'Monthly',
      status: 'Active',
      contactEmail: 'support@victimrehab.org',
      city: 'Warangal & Nizamabad'
    }
  ],
  subscriptions: [
    {
      id: 'sub_1',
      orgId: 'org_1',
      tier: 'enterprise',
      status: 'Active',
      amount: 0,
      currency: 'INR',
      notes: 'Fully CSR Sponsored for Survivor Care - No Cost to Survivors',
      validUntil: '2027-12-31',
      invoiceUrl: '#inv-2026-csr-01'
    }
  ],
  audit_logs: [
    {
      id: 'aud_1',
      userId: 'usr_demo_1',
      action: 'LOGIN',
      entity: 'session',
      entityId: 'usr_demo_1',
      details: 'Secure session initiated with English language preference',
      timestamp: '2026-09-25T07:00:00.000Z'
    }
  ]
};

// Seed 7-day realistic progression for Ananya Rao to demonstrate baseline change detection:
// Day 1 to 3: Stable baseline
// Day 4: Stress increases
// Day 5: Sleep decreases, Social drops
// Day 6: Daily functioning decreases -> triggers AI Support Signal
const pastDates = [
  '2026-09-19',
  '2026-09-20',
  '2026-09-21',
  '2026-09-22',
  '2026-09-23',
  '2026-09-24'
];

initialData.checkins = [
  {
    id: 'chk_d1',
    userId: 'usr_demo_1',
    timestamp: '2026-09-19T08:30:00.000Z',
    date: '2026-09-19',
    overallScore: 8,
    mood: 8,
    stress: 3,
    sleep: 8,
    safety: 9,
    social: 7,
    fear: 2,
    functioning: 8,
    energy: 7,
    notes: 'Walked in the park, felt grounded.',
    wantsHumanSupport: false
  },
  {
    id: 'chk_d2',
    userId: 'usr_demo_1',
    timestamp: '2026-09-20T08:45:00.000Z',
    date: '2026-09-20',
    overallScore: 7,
    mood: 7,
    stress: 3,
    sleep: 7.5,
    safety: 9,
    social: 7,
    fear: 3,
    functioning: 8,
    energy: 7,
    notes: 'Did drawing for 20 mins.',
    wantsHumanSupport: false
  },
  {
    id: 'chk_d3',
    userId: 'usr_demo_1',
    timestamp: '2026-09-21T09:00:00.000Z',
    date: '2026-09-21',
    overallScore: 7,
    mood: 7,
    stress: 4,
    sleep: 7,
    safety: 8,
    social: 6.5,
    fear: 3,
    functioning: 7,
    energy: 6.5,
    notes: 'A bit tired, but managed all chores.',
    wantsHumanSupport: false
  },
  {
    id: 'chk_d4',
    userId: 'usr_demo_1',
    timestamp: '2026-09-22T09:15:00.000Z',
    date: '2026-09-22',
    overallScore: 5,
    mood: 5,
    stress: 6.5, // Stress increased
    sleep: 6,
    safety: 8,
    social: 5,
    fear: 5,
    functioning: 6.5,
    energy: 5,
    notes: 'Heard sudden loud noises outside, felt startled.',
    wantsHumanSupport: false
  },
  {
    id: 'chk_d5',
    userId: 'usr_demo_1',
    timestamp: '2026-09-23T08:10:00.000Z',
    date: '2026-09-23',
    overallScore: 4,
    mood: 4,
    stress: 7.5, // Stress higher
    sleep: 4.5, // Sleep decreased significantly
    safety: 7,
    social: 3.5, // Social connection decreased
    fear: 6,
    functioning: 5,
    energy: 4,
    notes: 'Could not sleep properly. Stayed inside alone all day.',
    wantsHumanSupport: false
  },
  {
    id: 'chk_d6',
    userId: 'usr_demo_1',
    timestamp: '2026-09-24T08:20:00.000Z',
    date: '2026-09-24',
    overallScore: 3,
    mood: 3,
    stress: 8.5, // High stress
    sleep: 3.5, // Very poor sleep
    safety: 7,
    social: 3.0, // Social isolation
    fear: 7,
    functioning: 3.5, // Daily activities difficult
    energy: 3,
    notes: 'Struggling to make food or get out of bed. Mind feels cloudy.',
    wantsHumanSupport: true
  }
];

// Pre-seeded AI Support Signal triggered from Day 6 meaningful change
initialData.ai_support_signals = [
  {
    id: 'sig_001',
    userId: 'usr_demo_1',
    checkinId: 'chk_d6',
    timestamp: '2026-09-24T08:21:00.000Z',
    headline: 'Your recent responses show a meaningful change from your usual pattern.',
    headlineTe: 'మీ ఇటీవలి సమాధానాలు మీ సాధారణ అలవాట్ల నుండి ముఖ్యమైన మార్పును సూచిస్తున్నాయి.',
    signalLevel: 'notable_change',
    contributingIndicators: [
      {
        factor: 'Sleep has decreased',
        factorTe: 'నిద్ర సమయం తగ్గింది',
        detail: 'Recent average 4.0 hrs vs your typical 7.5 hrs baseline'
      },
      {
        factor: 'Stress has increased',
        factorTe: 'ఒత్తిడి పెరిగింది',
        detail: 'Stress indicator 8.0 vs your typical 3.4 baseline'
      },
      {
        factor: 'Social connection has decreased',
        factorTe: 'సామాజిక సంబంధాలు తగ్గాయి',
        detail: 'Fewer interactions reported over the last 3 days'
      },
      {
        factor: 'Daily activities feel more difficult',
        factorTe: 'రోజువారీ పనులు చేయడం కష్టంగా మారింది',
        detail: 'Functioning reported at 3.5 vs your typical 7.6 baseline'
      }
    ],
    suggestedSteps: [
      { id: 'step_counselor', label: 'Talk to Counselor', labelTe: 'కౌన్సెలర్‌తో మాట్లాడండి', action: 'book_counselor' },
      { id: 'step_social', label: 'Talk to Social Worker', labelTe: 'సోషల్ వర్కర్‌తో మాట్లాడండి', action: 'book_social_worker' },
      { id: 'step_trusted', label: 'Contact Trusted Person', labelTe: 'నమ్మకమైన వ్యక్తిని సంప్రదించండి', action: 'contact_trusted' },
      { id: 'step_resources', label: 'View Self-help Resources', labelTe: 'స్వయం సహాయక వనరులను చూడండి', action: 'view_resources' }
    ],
    acknowledged: false,
    status: 'Active'
  }
];

// In-Memory Database Store with Disk Persistence
class SaharaDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Ensure all required collections exist
        for (const key of Object.keys(initialData)) {
          if (!this.data[key]) {
            this.data[key] = initialData[key];
          }
        }
      } else {
        this.data = JSON.parse(JSON.stringify(initialData));
        this.save();
      }
    } catch (err) {
      console.warn('Database init error, falling back to seed data:', err.message);
      this.data = JSON.parse(JSON.stringify(initialData));
      this.save();
    }
  }

  save() {
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  resetToDemo() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }

  // Generic Query Helpers
  find(collectionName, predicate = () => true) {
    if (!this.data[collectionName]) return [];
    return this.data[collectionName].filter(predicate);
  }

  findOne(collectionName, predicate) {
    if (!this.data[collectionName]) return null;
    return this.data[collectionName].find(predicate) || null;
  }

  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    const record = {
      id: item.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      ...item
    };
    this.data[collectionName].push(record);
    this.logAudit(item.userId || 'system', 'INSERT', collectionName, record.id, 'Record created');
    this.save();
    return record;
  }

  update(collectionName, predicate, updates) {
    if (!this.data[collectionName]) return null;
    const index = this.data[collectionName].findIndex(predicate);
    if (index === -1) return null;

    const updated = {
      ...this.data[collectionName][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data[collectionName][index] = updated;
    this.logAudit(updated.userId || 'system', 'UPDATE', collectionName, updated.id, 'Record updated');
    this.save();
    return updated;
  }

  delete(collectionName, predicate) {
    if (!this.data[collectionName]) return false;
    const initialLen = this.data[collectionName].length;
    this.data[collectionName] = this.data[collectionName].filter(item => !predicate(item));
    const deleted = this.data[collectionName].length < initialLen;
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  logAudit(userId, action, entity, entityId, details) {
    if (!this.data.audit_logs) this.data.audit_logs = [];
    this.data.audit_logs.push({
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

export const db = new SaharaDatabase();
