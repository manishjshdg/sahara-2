// SAHARA Localization Engine (English & Telugu)
// Full i18n dictionary for all UI text, check-in flows, habit routines, hobbies,
// emergency support, rights, safety warnings, and empty/error states.

export const translations = {
  en: {
    // Brand & Mission
    appName: 'SAHARA',
    tagline: 'Support. Recovery. Connection.',
    missionStatement: 'AI-assisted, human-led post-trauma recovery and support ecosystem.',
    corePrinciple: 'SAHARA does not diagnose distress. It helps make sure meaningful changes and support needs are not missed.',

    // Navigation
    navHome: 'Home',
    navCheckIn: 'Check-in',
    navRecovery: 'Recovery',
    navSupport: 'Support',
    navProfile: 'Profile',

    // Startup & Onboarding
    splashSubtitle: 'Rebuilding everyday life after difficult experiences',
    onboardingStep1Title: 'Welcome to SAHARA',
    onboardingStep1Desc: 'A compassionate, privacy-first companion designed to help you rebuild daily routines, track gentle habits, and stay connected with safe people.',
    onboardingStep2Title: 'Holistic Life Rebuilding',
    onboardingStep2Desc: 'Track your personal rhythm, discover hobbies, receive adaptive lifestyle support, and connect with licensed counselors and social workers when you wish.',
    onboardingStep3Title: 'Your Information is Protected',
    onboardingStep3Desc: 'We do not sell data. We do not use automated psychiatry. Your personal responses are analyzed only against your own historical baseline to spot meaningful changes.',
    onboardingStep4Title: 'Select Your Language',
    onboardingStep4Desc: 'You can change this anytime from your Profile Settings.',
    onboardingStep5Title: 'Supportive Notifications',
    onboardingStep5Desc: 'Allow gentle reminders for daily habits, check-ins, and scheduled counselor appointments. We will never send alarming alert texts to your lock screen.',
    btnGetStarted: 'Get Started',
    btnContinue: 'Continue',
    btnBack: 'Back',
    btnSkip: 'Skip',
    btnFinish: 'Enter SAHARA',
    btnAllowNotifications: 'Enable Gentle Notifications',
    btnMaybeLater: 'Maybe Later',
    privacyDetailsLink: 'Read Full Privacy Charter',

    // Authentication
    authLoginTitle: 'Welcome Back',
    authSignupTitle: 'Begin Your Recovery Journey',
    authEmailLabel: 'Email Address',
    authPasswordLabel: 'Password',
    authNameLabel: 'Your Preferred Name',
    btnLogin: 'Sign In',
    btnSignup: 'Create Private Account',
    btnForgotPassword: 'Forgot Password?',
    authNoAccount: "Don't have an account yet?",
    authHaveAccount: 'Already have an account?',
    authDemoLogin: 'Quick Demo Survivor Login',

    // Home Screen
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    howAreYouFeeling: 'How are you feeling today?',
    feelingScaleSubtext: '1 = Distressed / On edge · 5 = Neutral · 10 = Calm & Grounded',
    btnQuickCheckIn: 'Quick Check-in',
    cardWellbeingTitle: 'My Well-being',
    cardWellbeingSub: 'Review your personalized rhythm trends',
    cardHabitsTitle: 'My Habits',
    cardHabitsSub: 'Gentle daily routines without pressure',
    cardHobbiesTitle: 'My Hobbies',
    cardHobbiesSub: 'Rediscover activities you enjoy',
    cardSupportTitle: 'Talk to Someone',
    cardSupportSub: 'Connect with a counselor, social worker, or peer',
    cardEmergencyTitle: 'I Need Immediate Help',
    cardEmergencySub: 'Emergency contacts & safe support pathways',
    privacyBadge: 'Your information is strictly protected & private',

    // Quick Check-in
    checkInTitle: 'Daily Check-in',
    checkInSubtitle: 'Take a gentle breath. Answer only what feels comfortable today.',
    qMood: 'Overall feeling right now',
    qStress: 'Level of tension or stress',
    qSleep: 'Restfulness of sleep last night',
    qSafety: 'Do you feel physically & emotionally safe today?',
    qSocial: 'Sense of connection with people around you',
    qFunctioning: 'Ease in completing simple daily routines',
    qEnergy: 'Physical energy level',
    optionalNotes: 'Optional reflection or notes (private)',
    notesPlaceholder: 'Anything you want to note about your day or how you felt...',
    voiceInputPrompt: 'Or speak your reflection',
    voiceInputListening: 'Listening... (Speak naturally)',
    voiceInputDone: 'Speech recognized:',
    btnRecordAgain: 'Record Again',
    btnEditVoice: 'Edit Text',
    wantsHumanSupportQuestion: 'Would you like a counselor or social worker to reach out?',
    btnSubmitCheckIn: 'Complete Check-in',
    btnCancel: 'Cancel',

    // Personal Baseline & AI Support Signal
    aiSupportSignalBadge: 'AI SUPPORT SIGNAL',
    aiSupportSignalHeadline: 'Your recent responses show a meaningful change from your usual pattern.',
    aiSupportSignalDisclaimer: 'SAHARA does not diagnose. This indicator highlights noticeable changes from your own baseline to ensure support is available.',
    contributingIndicatorsHeader: 'Contributing Indicators',
    suggestedNextStepsHeader: 'Suggested Next Steps',
    btnTalkCounselor: 'Talk to Counselor',
    btnTalkSocialWorker: 'Talk to Social Worker',
    btnContactTrusted: 'Contact Trusted Person',
    btnViewResources: 'View Self-help Resources',
    btnDismissSignal: 'Acknowledge & Dismiss',

    // Adaptive Lifestyle
    lifestyleTitle: 'Adaptive Lifestyle Suggestions',
    lifestyleSubtitle: 'Small, non-demanding steps to nourish your nervous system',
    btnStartAction: 'Start Now',
    btnRemindLater: 'Remind Me Later',
    btnNotInterested: 'Not Today',

    // Habit Tracker
    habitsTitle: "Today's Gentle Routine",
    habitsSubtext: 'Small, repeatable moments. No pressure, no guilt.',
    completedLabel: 'completed',
    btnCreateHabit: 'Add Small Habit',
    habitMissedGentle: "You missed this today. That's okay. Tomorrow is a fresh start.",
    habitDoneGentle: 'Thank you for honoring this small moment for yourself.',
    habitStreakLabel: 'day streak',
    habitDeleteConfirm: 'Remove this habit from your routine?',

    // Hobby Discovery & Goals
    hobbiesTitle: 'My Hobbies & Reconnection',
    hobbiesSubtext: 'Re-engaging with creativity, joy, and peace at your own pace.',
    btnAddHobby: 'Explore Hobbies',
    hobbyGoalLabel: 'Gentle Goal',
    btnLogHobbyTime: 'Log Time',
    hobbyTimeLogged: 'minutes logged this week',
    customHobbyName: 'Add Custom Hobby',

    // Recovery Journey & Trends
    recoveryTitle: 'My Recovery Journey',
    recoverySubtext: 'Longitudinal view of your well-being, routines, and progress',
    tab7Days: '7 Days',
    tab30Days: '30 Days',
    tabCustom: 'Custom Period',
    trendInsights: 'Personal Rhythm Observations',
    nonDiagnosticNotice: 'These trends reflect your reported experiences over time. They are not medical diagnostic evaluations.',

    // Support Section & Trusted Circle
    supportTitle: 'Support Ecosystem',
    supportSubtext: 'Human-led care, trusted connections, and emergency guidance',
    secCounselor: 'Trained Counselor',
    secCounselorDesc: 'Confidential sessions with trauma-informed clinical psychologists.',
    secSocialWorker: 'Social Worker & Legal Aid',
    secSocialWorkerDesc: 'Assistance with practical needs, survivor schemes, and protection.',
    secHelplines: '24/7 Free Helplines',
    secHelplinesDesc: 'Immediate call lines for distress, women safety, and crisis.',
    secResources: 'Rights & Practical Resources',
    secResourcesDesc: 'Government compensation, legal relief, and grounding guides.',
    secTrustedCircle: 'My Trusted Circle',
    secTrustedCircleDesc: 'Safe friends or family members chosen by you.',
    secNearbySupport: 'Nearby Support Centers',
    secNearbySupportDesc: 'Verified local clinics, shelters, and legal aid bureaus.',
    btnAddTrustedContact: 'Add Trusted Person',

    // Emergency & Live Location
    emergencyDrawerTitle: 'Immediate Help & Safety',
    emergencyReassurance: "I'm glad you reached out. You are not alone.",
    emergencySubtitle: 'Choose the safest way to connect right now:',
    btnCall112: 'Call 112 (National Emergency Dispatch)',
    btnCallTeleManas: 'Call Tele-MANAS (14416 - 24/7 Free)',
    btnShareLiveLocation: 'Share Live Location with Trusted Circle',
    locationSharingActiveBanner: 'LIVE LOCATION SHARING IS ON',
    locationSharingActiveDesc: 'Sharing with authorized contacts in your Trusted Circle.',
    btnStopLocationSharing: 'Stop Sharing Location',

    // Appointments
    appointmentTitle: 'Professional Appointments',
    btnBookAppointment: 'Book New Session',
    appointmentStatusConfirmed: 'Confirmed',
    appointmentStatusRequested: 'Requested',
    appointmentStatusCompleted: 'Completed',
    appointmentStatusCancelled: 'Cancelled',
    btnJoinSession: 'Join Secure In-App Session',
    btnCancelAppointment: 'Cancel Session',

    // Rights & Resources
    resourcesTitle: 'Rights, Relief & Support',
    resourcesFilterAll: 'All Categories',
    resourcesVerifiedDate: 'Verified on',
    resourcesOfficialSource: 'Official Authority',
    resourcesEligibility: 'Eligibility Criteria',
    resourcesHelpline: 'Direct Contact / Helpline',

    // Profile & Settings
    profileTitle: 'My Profile & Privacy',
    settingLanguage: 'Language / భాష',
    settingLanguageEn: 'English',
    settingLanguageTe: 'తెలుగు (Telugu)',
    settingVoiceLanguage: 'Voice Input Language',
    settingVoiceAuto: 'Auto-detect Speech',
    settingHighContrast: 'High Contrast Mode',
    settingReducedMotion: 'Reduced Motion',
    settingPrivacyCenter: 'Privacy & Data Rights Center',
    settingExportData: 'Export My Data (JSON)',
    settingDeleteAccount: 'Request Account Purge',
    btnLogout: 'Sign Out',

    // Roles & Demo Mode
    demoModeBanner: 'HACKATHON DEMO CONTROLS',
    btnDemoStepNext: 'Advance Demo Day',
    btnDemoReset: 'Reset 6-Day Survivor Story',
    roleSwitcher: 'Switch Portal View:',
    roleSurvivor: 'Survivor View',
    roleCounselor: 'Counselor Portal',
    roleSocialWorker: 'Social Worker Portal',
    roleOrgAdmin: 'NGO / Org Admin',

    // Common
    loading: 'Loading gently...',
    save: 'Save Changes',
    close: 'Close',
    errorGeneric: 'Something went wrong. Please try again.',
    retry: 'Try Again'
  },

  te: {
    // Brand & Mission
    appName: 'సహారా',
    tagline: 'తోడు. కోలుకోవడం. అనుబంధం.',
    missionStatement: 'బాధితులకు ఆసరాగా నిలిచే AI-సహాయక, మానవ-నేతృత్వ రికవరీ వ్యవస్థ.',
    corePrinciple: 'సహారా మానసిక సమస్యలను నిర్ధారించదు (డయాగ్నోస్ చేయదు). ముఖ్యమైన మార్పులు మరియు సహాయ అవసరాలు తప్పిపోకుండా చూస్తుంది.',

    // Navigation
    navHome: 'హోమ్',
    navCheckIn: 'చెకిన్',
    navRecovery: 'రికవరీ',
    navSupport: 'సహాయం',
    navProfile: 'ప్రొఫైల్',

    // Startup & Onboarding
    splashSubtitle: 'కష్ట సమయాల తర్వాత రోజువారీ జీవితాన్ని తిరిగి నిర్మించుకోవడానికి ఆసరా',
    onboardingStep1Title: 'సహారాకి స్వాగతం',
    onboardingStep1Desc: 'కష్టాలను ఎదుర్కొన్న తర్వాత రోజువారీ అలవాట్లను, ప్రశాంతతను మరియు ఆప్తుల తోడ్పాటును తిరిగి పొందడంలో మీకు తోడుగా ఉండే నమ్మకమైన వేదిక.',
    onboardingStep2Title: 'పూర్తి స్థాయి పునరుద్ధరణ',
    onboardingStep2Desc: 'మీ స్వంత అలవాట్లను గమనించండి, హాబీలను తిరిగి ప్రారంభించండి మరియు అవసరమైనప్పుడు కౌన్సెలర్లు, సోషల్ వర్కర్ల సహాయం పొందండి.',
    onboardingStep3Title: 'మీ సమాచారం అత్యంత సురక్షితం',
    onboardingStep3Desc: 'మేము మీ డేటాను ఎవరికీ అమ్మము. యంత్రాల ద్వారా తప్పుడు రోగనిర్ధారణ చేయము. మీ స్వంత గత అలవాట్లను మాత్రమే పరిగణనలోకి తీసుకుంటాము.',
    onboardingStep4Title: 'మీ భాషను ఎంచుకోండి',
    onboardingStep4Desc: 'మీరు దీన్ని ఎప్పుడైనా మీ ప్రొఫైల్ సెట్టింగ్స్ నుండి మార్చుకోవచ్చు.',
    onboardingStep5Title: 'మనోధైర్యం అందించే నోటిఫికేషన్లు',
    onboardingStep5Desc: 'రోజువారీ మంచి అలవాట్లు మరియు కౌన్సెలర్ అపాయింట్‌మెంట్ల కోసం నోటిఫికేషన్లను అనుమతించండి. భయం కలిగించే సందేశాలు ఎప్పుడూ రావు.',
    btnGetStarted: 'ప్రారంభించండి',
    btnContinue: 'ముందుకు సాగండి',
    btnBack: 'వెనుకకు',
    btnSkip: 'దాటవేయండి',
    btnFinish: 'సహారాలోకి ప్రవేశించండి',
    btnAllowNotifications: 'నోటిఫికేషన్లను అనుమతించండి',
    btnMaybeLater: 'తర్వాత చూద్దాం',
    privacyDetailsLink: 'గోప్యతా నిబంధనలను చదవండి',

    // Authentication
    authLoginTitle: 'తిరిగి స్వాగతం',
    authSignupTitle: 'మీ రికవరీ ప్రయాణాన్ని ప్రారంభించండి',
    authEmailLabel: 'ఈమెయిల్ చిరునామా',
    authPasswordLabel: 'పాస్‌వర్డ్',
    authNameLabel: 'మీ పేరు',
    btnLogin: 'లాగిన్ అవ్వండి',
    btnSignup: 'ఖాతా సృష్టించండి',
    btnForgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    authNoAccount: 'ఖాతా లేదా?',
    authHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    authDemoLogin: 'డెమో ఖాతాతో ప్రవేశించండి',

    // Home Screen
    greetingMorning: 'శుభోదయం',
    greetingAfternoon: 'శుభ మధ్యాహ్నం',
    greetingEvening: 'శుభ సాయంత్రం',
    howAreYouFeeling: 'ఈ రోజు మీ మనసు ఎలా ఉంది?',
    feelingScaleSubtext: '1 = చాలా ఇబ్బందిగా ఉంది · 5 = సాధారణం · 10 = ప్రశాంతంగా, ధైర్యంగా ఉంది',
    btnQuickCheckIn: 'త్వరిత చెకిన్ (Quick Check-in)',
    cardWellbeingTitle: 'నా సంక్షేమం',
    cardWellbeingSub: 'మీ శారీరక, మానసిక అలవాట్లను సమీక్షించండి',
    cardHabitsTitle: 'నా అలవాట్లు',
    cardHabitsSub: 'ఎలాంటి ఒత్తిడి లేని చిన్న రోజువారీ పనులు',
    cardHobbiesTitle: 'నా హాబీలు',
    cardHobbiesSub: 'మీకు ఇష్టమైన పనులను తిరిగి ప్రారంభించండి',
    cardSupportTitle: 'ఎవరితోనైనా మాట్లాడండి',
    cardSupportSub: 'కౌన్సెలర్, సోషల్ వర్కర్ లేదా ఆప్తులతో మాట్లాడండి',
    cardEmergencyTitle: 'నాకు తక్షణ సహాయం కావాలి',
    cardEmergencySub: 'అత్యవసర కాంటాక్టులు & రక్షణ మార్గాలు',
    privacyBadge: 'మీ సమాచారం పూర్తిగా ప్రైవేట్ మరియు సురక్షితం',

    // Quick Check-in
    checkInTitle: 'రోజువారీ చెకిన్',
    checkInSubtitle: 'ప్రశాంతంగా శ్వాస తీసుకోండి. మీకు సౌకర్యవంతంగా అనిపించిన వాటికి మాత్రమే సమాధానం ఇవ్వండి.',
    qMood: 'ప్రస్తుతం మీ మనోభావం ఎలా ఉంది?',
    qStress: 'ఒత్తిడి లేదా ఆందోళన స్థాయి',
    qSleep: 'గత రాత్రి నిద్ర ఎలా పట్టింది?',
    qSafety: 'ఈ రోజు మీరు సురక్షితంగా ఉన్నట్లు అనిపిస్తోందా?',
    qSocial: 'చుట్టూ ఉన్న వ్యక్తులతో మీ అనుబంధం',
    qFunctioning: 'రోజువారీ పనులు చేసుకోగలగడం ఎలా ఉంది?',
    qEnergy: 'శారీరక శక్తి స్థాయి',
    optionalNotes: 'మీ ఆలోచనలు లేదా గమనికలు (ఐచ్ఛికం)',
    notesPlaceholder: 'ఈ రోజు మీ మనసులో ఉన్నది లేదా మీరు ఎలా భావిస్తున్నారో ఇక్కడ రాయండి...',
    voiceInputPrompt: 'లేదా మాట్లాడి రికార్డ్ చేయండి',
    voiceInputListening: 'వింటున్నాము... (సహజంగా మాట్లాడండి)',
    voiceInputDone: 'గుర్తించబడిన మాటలు:',
    btnRecordAgain: 'మళ్ళీ రికార్డ్ చేయండి',
    btnEditVoice: 'వచనాన్ని సవరించండి',
    wantsHumanSupportQuestion: 'కౌన్సెలర్ లేదా సోషల్ వర్కర్ మిమ్మల్ని సంప్రదించాలనుకుంటున్నారా?',
    btnSubmitCheckIn: 'చెకిన్ పూర్తి చేయండి',
    btnCancel: 'రద్దు చేయండి',

    // Personal Baseline & AI Support Signal
    aiSupportSignalBadge: 'AI సపోర్ట్ సిగ్నల్',
    aiSupportSignalHeadline: 'మీ ఇటీవలి సమాధానాలు మీ సాధారణ అలవాట్ల నుండి ముఖ్యమైన మార్పును సూచిస్తున్నాయి.',
    aiSupportSignalDisclaimer: 'సహారా ఎలాంటి వ్యాధి నిర్ధారణ చేయదు. మీకు సమయానికి సహాయం అందేలా చేయడానికి మాత్రమే ఈ మార్పులను తెలియజేస్తుంది.',
    contributingIndicatorsHeader: 'మార్పుకు దోహదపడిన అంశాలు',
    suggestedNextStepsHeader: 'సూచించిన తదుపరి చర్యలు',
    btnTalkCounselor: 'కౌన్సెలర్‌తో మాట్లాడండి',
    btnTalkSocialWorker: 'సోషల్ వర్కర్‌తో మాట్లాడండి',
    btnContactTrusted: 'నమ్మకమైన వ్యక్తిని సంప్రదించండి',
    btnViewResources: 'స్వయం సహాయక వనరులను చూడండి',
    btnDismissSignal: 'సమీక్షించి తొలగించండి',

    // Adaptive Lifestyle
    lifestyleTitle: 'అనుకూల జీవనశైలి సూచనలు',
    lifestyleSubtitle: 'మీ నాడీ వ్యవస్థను శాంతింపజేసే చిన్న సులభమైన మార్గాలు',
    btnStartAction: 'ఇప్పుడే ప్రారంభించండి',
    btnRemindLater: 'తర్వాత గుర్తు చేయండి',
    btnNotInterested: 'ఈ రోజు వద్దు',

    // Habit Tracker
    habitsTitle: 'ఈనాటి ప్రశాంత దినచర్య',
    habitsSubtext: 'చిన్న చిన్న అలవాట్లు. ఎటువంటి ఒత్తిడి లేదా అపరాధ భావన లేకుండా.',
    completedLabel: 'పూర్తయ్యాయి',
    btnCreateHabit: 'కొత్త అలవాటు చేర్చండి',
    habitMissedGentle: 'ఈ రోజు మిస్ అయ్యారా? పర్వాలేదు. రేపు సరికొత్త ప్రారంభం.',
    habitDoneGentle: 'మీ కోసం ఈ చిన్న సమయాన్ని కేటాయించినందుకు అభినందనలు.',
    habitStreakLabel: 'రోజుల వరుస',
    habitDeleteConfirm: 'ఈ అలవాటును తొలగించాలనుకుంటున్నారా?',

    // Hobby Discovery & Goals
    hobbiesTitle: 'నా హాబీలు & ఆసక్తులు',
    hobbiesSubtext: 'మీకు నచ్చిన సృజనాత్మక పనులతో మళ్ళీ అనుసంధానం అవ్వండి.',
    btnAddHobby: 'హాబీలను అన్వేషించండి',
    hobbyGoalLabel: 'చిన్న లక్ష్యం',
    btnLogHobbyTime: 'సమయాన్ని నమోదు చేయండి',
    hobbyTimeLogged: 'నిమిషాలు ఈ వారం గడిపారు',
    customHobbyName: 'ఇతర హాబీని జోడించండి',

    // Recovery Journey & Trends
    recoveryTitle: 'నా రికవరీ ప్రయాణం',
    recoverySubtext: 'మీ ఆరోగ్యం, అలవాట్లు మరియు పురోగతిని వివరించే దీర్ఘకాలిక పరిశీలన',
    tab7Days: '7 రోజులు',
    tab30Days: '30 రోజులు',
    tabCustom: 'కస్టమ్ కాలపరిమితి',
    trendInsights: 'వ్యక్తిగత పరిశీలనలు',
    nonDiagnosticNotice: 'ఈ ట్రెండ్‌లు మీ స్వంత సమాధానాల ఆధారంగా చూపబడుతున్నాయి. ఇవి ఎలాంటి వైద్య నిర్ధారణలు కావు.',

    // Support Section & Trusted Circle
    supportTitle: 'సహాయక వ్యవస్థ',
    supportSubtext: 'శిక్షణ పొందిన నిపుణులు, నమ్మకమైన ఆప్తులు మరియు అత్యవసర సాయం',
    secCounselor: 'శిక్షణ పొందిన కౌన్సెలర్',
    secCounselorDesc: 'ట్రామా నిపుణులైన సైకాలజిస్టులతో ప్రైవేట్ సంభాషణలు.',
    secSocialWorker: 'సోషల్ వర్కర్ & చట్టపరమైన సాయం',
    secSocialWorkerDesc: 'పునరావాసం, ప్రభుత్వ పథకాలు మరియు రక్షణ సేవలు.',
    secHelplines: '24/7 ఉచిత హెల్ప్‌లైన్లు',
    secHelplinesDesc: 'ఆందోళన లేదా ఆపద సమయంలో వెంటనే కాల్ చేయగల నెంబర్లు.',
    secResources: 'హక్కులు & సహాయక వనరులు',
    secResourcesDesc: 'ప్రభుత్వ పరిహారం, న్యాయ సహాయం మరియు మార్గదర్శకాలు.',
    secTrustedCircle: 'నా నమ్మకమైన సర్కిల్',
    secTrustedCircleDesc: 'మీరు ఎంచుకున్న నమ్మకమైన స్నేహితులు లేదా కుటుంబ సభ్యులు.',
    secNearbySupport: 'సమీపంలోని సహాయ కేంద్రాలు',
    secNearbySupportDesc: 'ధ్రువీకరించబడిన క్లినిక్‌లు, షెల్టర్‌లు మరియు లీగల్ ఎయిడ్ బ్యూరోలు.',
    btnAddTrustedContact: 'నమ్మకమైన వ్యక్తిని జోడించండి',

    // Emergency & Live Location
    emergencyDrawerTitle: 'తక్షణ సహాయం & భద్రత',
    emergencyReassurance: 'మీరు సంప్రదించినందుకు సంతోషం. మీరు ఒంటరిగా లేరు.',
    emergencySubtitle: 'ఈ సమయంలో సురక్షితమైన మార్గాన్ని ఎంచుకోండి:',
    btnCall112: '112 అత్యవసర రక్షణకు కాల్ చేయండి',
    btnCallTeleManas: 'టెలి-మానస్ (14416) కి కాల్ చేయండి (24/7 ఉచితం)',
    btnShareLiveLocation: 'నమ్మకమైన సర్కిల్‌తో లైవ్ లొకేషన్ పంచుకోండి',
    locationSharingActiveBanner: 'లైవ్ లొకేషన్ షేరింగ్ ఆన్‌లో ఉంది',
    locationSharingActiveDesc: 'మీ నమ్మకమైన సర్కిల్‌లోని వారికి మీ స్థానం కనిపిస్తోంది.',
    btnStopLocationSharing: 'లొకేషన్ షేరింగ్ ఆపివేయండి',

    // Appointments
    appointmentTitle: 'నిపుణుల అపాయింట్‌మెంట్లు',
    btnBookAppointment: 'కొత్త సెషన్ బుక్ చేసుకోండి',
    appointmentStatusConfirmed: 'ఖరారైంది',
    appointmentStatusRequested: 'కోరబడింది',
    appointmentStatusCompleted: 'పూర్తయింది',
    appointmentStatusCancelled: 'రద్దు చేయబడింది',
    btnJoinSession: 'సెషన్‌లో పాల్గొనండి',
    btnCancelAppointment: 'అపాయింట్‌మెంట్ రద్దు చేయండి',

    // Rights & Resources
    resourcesTitle: 'హక్కులు, పరిహారం & సేవలు',
    resourcesFilterAll: 'అన్ని విభాగాలు',
    resourcesVerifiedDate: 'ధ్రువీకరించిన తేదీ',
    resourcesOfficialSource: 'అధికారిక సంస్థ',
    resourcesEligibility: 'అర్హత నిబంధనలు',
    resourcesHelpline: 'నేరుగా సంప్రదించాల్సిన నెంబర్',

    // Profile & Settings
    profileTitle: 'నా ప్రొఫైల్ & గోప్యత',
    settingLanguage: 'భాష / Language',
    settingLanguageEn: 'English',
    settingLanguageTe: 'తెలుగు (Telugu)',
    settingVoiceLanguage: 'వాయిస్ ఇన్పుట్ భాష',
    settingVoiceAuto: 'ఆటో డిటెక్ట్',
    settingHighContrast: 'హై కాంట్రాస్ట్ మోడ్',
    settingReducedMotion: 'తక్కువ కదలికలు (Reduced Motion)',
    settingPrivacyCenter: 'గోప్యతా కేంద్రం & హక్కులు',
    settingExportData: 'నా డేటాను డౌన్‌లోడ్ చేసుకోండి (JSON)',
    settingDeleteAccount: 'ఖాతాను తొలగించండి',
    btnLogout: 'లాగౌట్ అవ్వండి',

    // Roles & Demo Mode
    demoModeBanner: 'డెమో కంట్రోల్స్',
    btnDemoStepNext: 'తదుపరి రోజుకు వెళ్ళండి',
    btnDemoReset: '6-రోజుల బాధితురాలి ప్రయాణాన్ని రీసెట్ చేయండి',
    roleSwitcher: 'విభాగాన్ని మార్చండి:',
    roleSurvivor: 'బాధితురాలి వీక్షణ',
    roleCounselor: 'కౌన్సెలర్ పోర్టల్',
    roleSocialWorker: 'సోషల్ వర్కర్ పోర్టల్',
    roleOrgAdmin: 'ఎన్జీఓ / సంస్థ అడ్మిన్',

    // Common
    loading: 'దయచేసి వేచి ఉండండి...',
    save: 'మార్పులను భద్రపరచండి',
    close: 'మూసివేయండి',
    errorGeneric: 'ఏదో పొరపాటు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    retry: 'మళ్ళీ ప్రయత్నించండి'
  }
};

export function getTranslation(lang, key, fallback = '') {
  const currentLang = lang === 'te' ? 'te' : 'en';
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  if (translations.en[key]) {
    return translations.en[key];
  }
  return fallback || key;
}
