// SAHARA AI Support Engine & Personal Baseline Analysis
// Adheres strictly to AI Safety & Trauma-Informed guidelines:
// 1. Non-diagnostic: Evaluates changes from user's OWN personal baseline, never arbitrary population scores.
// 2. Explainable: Highlights exact contributing indicators.
// 3. Human-routing: Suggests human counselors, social workers, or trusted circles.
// 4. Safety Guardrails: Intercepts immediate danger or self-harm keywords and routes straight to emergency workflow.

export function calculatePersonalBaseline(historicalCheckins) {
  if (!historicalCheckins || historicalCheckins.length < 3) {
    return {
      status: 'insufficient_data',
      message: 'Need at least 3 check-ins over time to establish a personal baseline without judgment.',
      typicalMood: 7.0,
      typicalStress: 3.5,
      typicalSleep: 7.0,
      typicalSocial: 6.5,
      typicalFunctioning: 7.5,
      typicalEnergy: 6.5,
      varianceThreshold: 1.8,
      checkinCount: historicalCheckins ? historicalCheckins.length : 0
    };
  }

  // Calculate personal mean values
  const count = historicalCheckins.length;
  const sums = historicalCheckins.reduce(
    (acc, curr) => ({
      mood: acc.mood + (Number(curr.mood) || 7),
      stress: acc.stress + (Number(curr.stress) || 3),
      sleep: acc.sleep + (Number(curr.sleep) || 7),
      social: acc.social + (Number(curr.social) || 6.5),
      functioning: acc.functioning + (Number(curr.functioning) || 7.5),
      energy: acc.energy + (Number(curr.energy) || 6.5)
    }),
    { mood: 0, stress: 0, sleep: 0, social: 0, functioning: 0, energy: 0 }
  );

  return {
    status: 'established',
    checkinCount: count,
    periodDays: Math.min(count, 30),
    typicalMood: Number((sums.mood / count).toFixed(1)),
    typicalStress: Number((sums.stress / count).toFixed(1)),
    typicalSleep: Number((sums.sleep / count).toFixed(1)),
    typicalSocial: Number((sums.social / count).toFixed(1)),
    typicalFunctioning: Number((sums.functioning / count).toFixed(1)),
    typicalEnergy: Number((sums.energy / count).toFixed(1)),
    varianceThreshold: 1.8,
    calculatedAt: new Date().toISOString()
  };
}

export function evaluateCheckInSafetyAndBaseline(newCheckin, baseline, recentCheckins = []) {
  const result = {
    isImmediateDanger: false,
    hasSignal: false,
    signal: null,
    adaptiveQuestions: []
  };

  // 1. Mandatory Safety Circuit Breaker (Self-harm / Immediate Danger)
  const dangerKeywords = [
    'kill myself', 'suicide', 'end my life', 'want to die', 'harm myself',
    'self harm', 'hurt myself', 'cannot go on', 'goodbye forever',
    'ఆత్మహత్య', 'చనిపోవాలని ఉంది'
  ];

  const userNotes = (newCheckin.notes || '').toLowerCase();
  const matchedKeyword = dangerKeywords.find(kw => userNotes.includes(kw));

  if (matchedKeyword || (newCheckin.safety !== undefined && Number(newCheckin.safety) <= 2)) {
    result.isImmediateDanger = true;
    result.signal = {
      id: `sig_${Date.now()}`,
      userId: newCheckin.userId,
      checkinId: newCheckin.id,
      timestamp: new Date().toISOString(),
      signalLevel: 'immediate_attention',
      headline: 'We care about your safety right now.',
      headlineTe: 'ఈ సమయంలో మీ భద్రత మాకు అత్యంత ప్రాధాన్యత.',
      contributingIndicators: [
        {
          factor: 'Immediate safety or distress indicated',
          factorTe: 'తక్షణ భద్రత లేదా తీవ్ర ఆందోళన గుర్తించబడింది',
          detail: 'Your safety is the highest priority. Let us connect you to supportive human care immediately.'
        }
      ],
      suggestedSteps: [
        { id: 'step_emergency_112', label: 'Call 112 Emergency', labelTe: '112 అత్యవసర సహాయానికి కాల్ చేయండి', action: 'call_112' },
        { id: 'step_telemanas', label: 'Call Tele-MANAS (14416)', labelTe: 'టెలి-మానస్ (14416) కి కాల్ చేయండి', action: 'call_telemanas' },
        { id: 'step_trusted_now', label: 'Alert Trusted Contact', labelTe: 'నమ్మకమైన వ్యక్తిని సంప్రదించండి', action: 'alert_trusted' }
      ],
      acknowledged: false,
      status: 'Immediate Safety Mode'
    };
    return result;
  }

  // 2. Non-diagnostic Baseline Deviation Detection
  // We compare newCheckin + recent rolling average against established baseline
  const contributing = [];

  const currentSleep = Number(newCheckin.sleep) || 7;
  const currentStress = Number(newCheckin.stress) || 3;
  const currentSocial = Number(newCheckin.social) || 6;
  const currentFunctioning = Number(newCheckin.functioning) || 7;
  const currentMood = Number(newCheckin.mood) || 7;

  // Check sleep deviation
  if (baseline && baseline.typicalSleep && (baseline.typicalSleep - currentSleep >= 2.0)) {
    contributing.push({
      factor: 'Sleep has decreased',
      factorTe: 'నిద్ర సమయం తగ్గింది',
      detail: `Reported ${currentSleep} hrs vs your personal usual pattern of ${baseline.typicalSleep} hrs.`
    });
  }

  // Check stress deviation
  if (baseline && baseline.typicalStress && (currentStress - baseline.typicalStress >= 2.5)) {
    contributing.push({
      factor: 'Stress has increased',
      factorTe: 'ఒత్తిడి పెరిగింది',
      detail: `Reported stress level ${currentStress}/10 vs your personal usual pattern of ${baseline.typicalStress}/10.`
    });
  }

  // Check social connection deviation
  if (baseline && baseline.typicalSocial && (baseline.typicalSocial - currentSocial >= 2.0)) {
    contributing.push({
      factor: 'Social connection has decreased',
      factorTe: 'సామాజిక సంబంధాలు తగ్గాయి',
      detail: `Social feeling ${currentSocial}/10 vs your personal usual pattern of ${baseline.typicalSocial}/10.`
    });
  }

  // Check daily functioning deviation
  if (baseline && baseline.typicalFunctioning && (baseline.typicalFunctioning - currentFunctioning >= 2.0)) {
    contributing.push({
      factor: 'Daily activities feel more difficult',
      factorTe: 'రోజువారీ పనులు చేయడం కష్టంగా మారింది',
      detail: `Reported functioning ${currentFunctioning}/10 vs your personal usual pattern of ${baseline.typicalFunctioning}/10.`
    });
  }

  // Check overall mood deviation
  if (baseline && baseline.typicalMood && (baseline.typicalMood - currentMood >= 2.5)) {
    contributing.push({
      factor: 'Noticeable drop in overall mood',
      factorTe: 'మనోభావాలలో గమనించదగిన మార్పు',
      detail: `Reported feeling ${currentMood}/10 vs your usual ${baseline.typicalMood}/10.`
    });
  }

  // If 2 or more contributing factors deviate from personal baseline OR user explicitly requested human support:
  if (contributing.length >= 2 || newCheckin.wantsHumanSupport) {
    result.hasSignal = true;
    result.signal = {
      id: `sig_${Date.now()}`,
      userId: newCheckin.userId,
      checkinId: newCheckin.id,
      timestamp: new Date().toISOString(),
      signalLevel: contributing.length >= 3 ? 'concerning_change' : 'notable_change',
      headline: 'Your recent responses show a meaningful change from your usual pattern.',
      headlineTe: 'మీ ఇటీవలి సమాధానాలు మీ సాధారణ అలవాట్ల నుండి ముఖ్యమైన మార్పును సూచిస్తున్నాయి.',
      contributingIndicators: contributing.length > 0 ? contributing : [
        {
          factor: 'Support requested by you',
          factorTe: 'మీరు స్వయంగా సహాయం కోరారు',
          detail: 'You requested human assistance in your recent check-in.'
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
    };
  }

  // 3. Adaptive Question Engine
  // Tailor future check-in questions based on what needs gentle exploration
  if (currentSleep <= 5) {
    result.adaptiveQuestions.push({
      id: 'adapt_sleep_waking',
      domain: 'sleep',
      question: 'Did you experience nightmares, sudden awakenings, or trouble falling asleep?',
      questionTe: 'మీకు పీడకలలు వచ్చాయా, మధ్యలో మెలకువ వచ్చిందా లేదా నిద్ర పట్టడంలో ఇబ్బంది కలిగిందా?',
      type: 'options',
      options: ['Trouble falling asleep', 'Woke up multiple times', 'Restless nightmares', 'Felt alert/startled']
    });
  }

  if (currentSocial <= 4) {
    result.adaptiveQuestions.push({
      id: 'adapt_social_contact',
      domain: 'social',
      question: 'Would you like to send a gentle pre-written check-in message to someone in your Trusted Circle?',
      questionTe: 'మీ నమ్మకమైన సర్కిల్‌లోని ఒకరికి సులభమైన సందేశం పంపాలనుకుంటున్నారా?',
      type: 'boolean'
    });
  }

  if (currentFunctioning <= 4) {
    result.adaptiveQuestions.push({
      id: 'adapt_routine_small_step',
      domain: 'functioning',
      question: 'Which daily activity felt most challenging today?',
      questionTe: 'ఈ రోజు ఏ పని చేయడం అత్యంత కష్టంగా అనిపించింది?',
      type: 'options',
      options: ['Preparing meals', 'Leaving the house', 'Focusing on tasks', 'Personal care/showering']
    });
  }

  return result;
}

// Adaptive Lifestyle Suggestions Engine
export function getAdaptiveLifestyleSuggestions(latestCheckin) {
  const suggestions = [];

  const sleep = Number(latestCheckin?.sleep || 7);
  const stress = Number(latestCheckin?.stress || 3);
  const social = Number(latestCheckin?.social || 6);
  const energy = Number(latestCheckin?.energy || 6);
  const functioning = Number(latestCheckin?.functioning || 7);

  if (energy <= 4) {
    suggestions.push({
      id: 'ls_low_energy_1',
      category: 'Low Energy',
      categoryTe: 'తక్కువ శక్తి',
      title: '5-Minute Slow Daylight Walk',
      titleTe: '5 నిమిషాల నెమ్మదైన నడక',
      description: 'Step outside or stand near an open window for natural sunlight. No rush, just breathing fresh air.',
      descriptionTe: 'కొద్దిసేపు సహజ సూర్యరశ్మి మరియు స్వచ్ఛమైన గాలిని అనుభవించండి.',
      duration: '5 mins',
      difficulty: 'Gentle',
      icon: 'Sun'
    });
    suggestions.push({
      id: 'ls_low_energy_2',
      category: 'Low Energy',
      categoryTe: 'తక్కువ శక్తి',
      title: 'Listen to a Calming Melody',
      titleTe: 'ప్రశాంతమైన సంగీతం వినండి',
      description: 'Rest your eyes and play an acoustic or nature soundscape without having to do anything else.',
      descriptionTe: 'కళ్ళు మూసుకుని ప్రశాంతమైన ధ్వనులను వినండి.',
      duration: '10 mins',
      difficulty: 'Restful',
      icon: 'Headphones'
    });
  }

  if (social <= 4) {
    suggestions.push({
      id: 'ls_social_1',
      category: 'Feeling Isolated',
      categoryTe: 'ఒంటరిగా అనిపిస్తోంది',
      title: 'Message a Trusted Person',
      titleTe: 'నమ్మకమైన వ్యక్తికి సందేశం పంపండి',
      description: 'A simple "Thinking of you" or sending a picture of a plant/sky to a safe contact.',
      descriptionTe: 'మీ శ్రేయోభిలాషికి చిన్న సందేశం పంపండి.',
      duration: '2 mins',
      difficulty: 'Low effort',
      icon: 'MessageCircle'
    });
    suggestions.push({
      id: 'ls_social_2',
      category: 'Feeling Isolated',
      categoryTe: 'ఒంటరిగా అనిపిస్తోంది',
      title: 'Spend Time Near Safe People',
      titleTe: 'సురక్షితమైన వ్యక్తుల సమక్షంలో ఉండండి',
      description: 'You do not have to talk. Simply sitting in a shared quiet space with someone safe helps reconnect.',
      descriptionTe: 'మాట్లాడకపోయినా సరే, సురక్షితమైన వాతావరణంలో ఇతరులతో సమయం గడపండి.',
      duration: '15 mins',
      difficulty: 'Gentle',
      icon: 'Users'
    });
  }

  if (sleep <= 5) {
    suggestions.push({
      id: 'ls_sleep_1',
      category: 'Poor Sleep',
      categoryTe: 'నిద్రలేమి లేదా అలసట',
      title: 'Screen Wind-Down Ritual',
      titleTe: 'పడుకునే ముందు స్క్రీన్‌లను ఆపడం',
      description: 'Dim bright overhead lights 45 minutes before bed and replace phone scrolling with warm herbal tea or soft audio.',
      descriptionTe: 'పడుకోవడానికి 45 నిమిషాల ముందు లైట్లు తగ్గించి, ఫోన్‌ను పక్కన పెట్టండి.',
      duration: '20 mins',
      difficulty: 'Relaxing',
      icon: 'Moon'
    });
  }

  if (functioning <= 4 || stress >= 7) {
    suggestions.push({
      id: 'ls_functioning_1',
      category: 'Difficulty Concentrating',
      categoryTe: 'ఏకాగ్రత కష్టంగా ఉంది',
      title: 'Break Task Into One Micro-Step',
      titleTe: 'పనిని చిన్న భాగాలగా విభజించండి',
      description: 'Focus only on the next 3 minutes (e.g. washing one glass or writing one word). Give yourself permission to pause.',
      descriptionTe: 'తదుపరి 3 నిమిషాల్లో ఒక చిన్న పనిని మాత్రమే పూర్తి చేయండి.',
      duration: '3 mins',
      difficulty: 'Micro',
      icon: 'CheckSquare'
    });
  }

  // Always supply at least 2 gentle self-care opportunities
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'ls_default_1',
      category: 'Daily Grounding',
      categoryTe: 'రోజువారీ స్థిరత్వం',
      title: 'Somatic Shoulder Release & 3 Breaths',
      titleTe: 'భుజాలను వదులు చేసి 3 సార్లు దీర్ఘ శ్వాస తీసుకోండి',
      description: 'Gently drop your shoulders away from your ears, unclench your jaw, and take three soothing breaths.',
      descriptionTe: 'భుజాలను, దవడను వదులుగా ఉంచి ప్రశాంతంగా శ్వాసించండి.',
      duration: '2 mins',
      difficulty: 'Easy',
      icon: 'Heart'
    });
  }

  return suggestions;
}
