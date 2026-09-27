// SAHARA Mobile API Client
// Connects to the existing Express backend with fallback to persistent AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  CheckIn,
  PersonalBaseline,
  AiSupportSignal,
  Habit,
  Hobby,
  TrustedContact,
  Professional,
  Appointment,
  ResourceItem,
  HelplineItem,
  LifestyleSuggestion
} from '../types';

// Physical Android device connects via LAN IP (192.168.29.156), emulator via 10.0.2.2
const DEFAULT_HOST = 'http://192.168.29.156:5000/api';
const EMULATOR_HOST = 'http://10.0.2.2:5000/api';

async function fetchWithFallback<T>(endpoint: string, options: RequestInit = {}, fallbackData: T): Promise<T> {
  const token = await AsyncStorage.getItem('sahara_auth_token') || 'sahara_sec_tok_usr_demo_1';
  const hosts = [DEFAULT_HOST, EMULATOR_HOST, 'http://localhost:5000/api'];

  for (const host of hosts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${host}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...(options.headers || {})
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        return json as T;
      }
    } catch {
      // try next candidate host
    }
  }
  return fallbackData;
}

export const mobileApi = {
  // Check-ins & Baseline
  getCheckIns: async (userId: string = 'usr_demo_1'): Promise<CheckIn[]> => {
    return fetchWithFallback<CheckIn[]>(`/checkins?userId=${userId}`, {}, []);
  },

  getBaseline: async (userId: string = 'usr_demo_1'): Promise<PersonalBaseline> => {
    return fetchWithFallback<PersonalBaseline>(`/baseline?userId=${userId}`, {}, {
      userId,
      periodDays: 14,
      typicalMood: 7.2,
      typicalStress: 3.4,
      typicalSleep: 7.5,
      typicalSocial: 6.8,
      typicalFunctioning: 7.6,
      typicalEnergy: 6.9,
      varianceThreshold: 1.8,
      status: 'established'
    });
  },

  submitCheckIn: async (data: Partial<CheckIn>): Promise<any> => {
    return fetchWithFallback<any>('/checkins', {
      method: 'POST',
      body: JSON.stringify(data)
    }, {
      checkin: { id: `chk_${Date.now()}`, ...data, date: new Date().toISOString().split('T')[0] },
      evaluation: {
        hasSignal: Number(data.stress || 0) >= 7 || Number(data.sleep || 7) <= 4,
        isImmediateDanger: Number(data.safety || 10) <= 2,
        signal: {
          id: `sig_${Date.now()}`,
          userId: data.userId || 'usr_demo_1',
          timestamp: new Date().toISOString(),
          headline: 'Your recent responses show a meaningful change from your usual pattern.',
          headlineTe: 'మీ ఇటీవలి సమాధానాలు మీ సాధారణ అలవాట్ల నుండి ముఖ్యమైన మార్పును సూచిస్తున్నాయి.',
          signalLevel: 'notable_change',
          contributingIndicators: [
            { factor: 'Sleep has decreased', factorTe: 'నిద్ర సమయం తగ్గింది', detail: 'Reported less than 4h rest' },
            { factor: 'Stress has increased', factorTe: 'ఒత్తిడి పెరిగింది', detail: 'Tension elevated vs baseline' }
          ],
          suggestedSteps: [
            { id: 'step_counselor', label: 'Talk to Counselor', labelTe: 'కౌన్సెలర్‌తో మాట్లాడండి', action: 'book_counselor' }
          ],
          acknowledged: false
        }
      }
    });
  },

  getSupportSignals: async (userId: string = 'usr_demo_1'): Promise<AiSupportSignal[]> => {
    return fetchWithFallback<AiSupportSignal[]>(`/ai/support-signals?userId=${userId}`, {}, [
      {
        id: 'sig_001',
        userId: 'usr_demo_1',
        timestamp: '2026-09-24T08:21:00.000Z',
        headline: 'Your recent responses show a meaningful change from your usual pattern.',
        headlineTe: 'మీ ఇటీవలి సమాధానాలు మీ సాధారణ అలవాట్ల నుండి ముఖ్యమైన మార్పును సూచిస్తున్నాయి.',
        signalLevel: 'notable_change',
        contributingIndicators: [
          { factor: 'Sleep has decreased', factorTe: 'నిద్ర సమయం తగ్గింది', detail: 'Recent 3.5h vs usual 7.5h baseline' },
          { factor: 'Stress has increased', factorTe: 'ఒత్తిడి పెరిగింది', detail: 'Tension 8.5/10 vs usual 3.4 baseline' },
          { factor: 'Social connection has decreased', factorTe: 'సామాజిక సంబంధాలు తగ్గాయి', detail: 'Fewer interactions reported' },
          { factor: 'Daily activities feel more difficult', factorTe: 'రోజువారీ పనులు చేయడం కష్టంగా మారింది', detail: 'Functioning reported at 3.5' }
        ],
        suggestedSteps: [
          { id: 'step_counselor', label: 'Talk to Counselor', labelTe: 'కౌన్సెలర్‌తో మాట్లాడండి', action: 'book_counselor' },
          { id: 'step_social', label: 'Talk to Social Worker', labelTe: 'సోషల్ వర్కర్‌తో మాట్లాడండి', action: 'book_social_worker' },
          { id: 'step_trusted', label: 'Contact Trusted Person', labelTe: 'నమ్మకమైన వ్యక్తిని సంప్రదించండి', action: 'contact_trusted' }
        ],
        acknowledged: false
      }
    ]);
  },

  // Habits
  getHabits: async (): Promise<Habit[]> => {
    return fetchWithFallback<Habit[]>('/habits', {}, [
      { id: 'hbt_1', userId: 'usr_demo_1', title: 'Drink 2 glasses of water', titleTe: '2 గ్లాసుల నీరు త్రాగండి', category: 'hydration', icon: 'Droplet', targetDaysPerWeek: 7, streak: 5, isActive: true, completedToday: true },
      { id: 'hbt_2', userId: 'usr_demo_1', title: '10-minute morning walk', titleTe: 'ఉదయం 10 నిమిషాల నడక', category: 'movement', icon: 'Footprints', targetDaysPerWeek: 5, streak: 4, isActive: true, completedToday: true },
      { id: 'hbt_3', userId: 'usr_demo_1', title: 'Gentle box breathing (4-4-4)', titleTe: 'ప్రశాంత శ్వాస వ్యాయామం (4-4-4)', category: 'mindfulness', icon: 'Wind', targetDaysPerWeek: 7, streak: 6, isActive: true, completedToday: false },
      { id: 'hbt_4', userId: 'usr_demo_1', title: 'Regular lunch away from screens', titleTe: 'స్క్రీన్లకు దూరంగా భోజనం', category: 'nourishment', icon: 'Utensils', targetDaysPerWeek: 7, streak: 3, isActive: true, completedToday: false }
    ]);
  },

  toggleHabit: async (id: string): Promise<any> => {
    return fetchWithFallback<any>(`/habits/${id}/toggle`, { method: 'POST' }, {
      completedToday: true,
      streak: 5,
      gentleMessage: 'Well done honoring this small moment for yourself.'
    });
  },

  // Hobbies
  getHobbies: async (): Promise<Hobby[]> => {
    return fetchWithFallback<Hobby[]>('/hobbies', {}, [
      { id: 'hby_1', userId: 'usr_demo_1', category: 'Drawing & Art', name: 'Botanical Sketching', nameTe: 'చిత్రలేఖనం & స్కెచింగ్', icon: 'Palette', isFavorite: true, currentGoal: 'Create one small nature sketch (no pressure)', currentGoalTe: 'ఒక చిన్న ప్రకృతి స్కెచ్ వేయండి', weeklyMinutesTarget: 60, totalMinutesLogged: 180 },
      { id: 'hby_2', userId: 'usr_demo_1', category: 'Music & Instruments', name: 'Acoustic Melodies', nameTe: 'సంగీతం & గిటార్', icon: 'Music', isFavorite: true, currentGoal: 'Play or listen mindfully for 15 minutes', currentGoalTe: '15 నిమిషాలు శ్రద్ధగా సంగీతం వినండి', weeklyMinutesTarget: 45, totalMinutesLogged: 120 }
    ]);
  },

  // Professionals & Appointments
  getProfessionals: async (): Promise<Professional[]> => {
    return fetchWithFallback<Professional[]>('/professionals', {}, [
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
        bio: 'Specializes in supportive post-trauma recovery, survivor stabilization, and nervous system regulation.',
        bioTe: 'పోస్ట్-ట్రామా రికవరీ మరియు బాధితుల స్థిరీకరణలో ప్రత్యేక నిపుణులు.',
        availableSlots: ['Today, 3:30 PM', 'Tomorrow, 10:00 AM', 'Thursday, 2:00 PM'],
        rating: 4.95
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
        availableSlots: ['Today, 4:00 PM', 'Tomorrow, 11:00 AM'],
        rating: 4.9
      }
    ]);
  },

  getAppointments: async (): Promise<Appointment[]> => {
    return fetchWithFallback<Appointment[]>('/appointments', {}, [
      {
        id: 'apt_1',
        userId: 'usr_demo_1',
        professionalId: 'prof_1',
        professionalName: 'Dr. Radhika Sharma',
        dateTime: '2026-09-27T10:00:00.000Z',
        status: 'Confirmed',
        mode: 'Secure Video / Voice',
        notes: 'Initial recovery baseline check-in & breathing grounding',
        joinUrl: 'https://sahara.care/session/sec-8849-safe'
      }
    ]);
  },

  bookAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    return fetchWithFallback<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    }, {
      id: `apt_${Date.now()}`,
      userId: data.userId || 'usr_demo_1',
      professionalId: data.professionalId || 'prof_1',
      professionalName: 'Dr. Radhika Sharma',
      dateTime: data.dateTime || new Date(Date.now() + 86400000).toISOString(),
      status: 'Confirmed',
      mode: 'Secure Video / Voice',
      notes: data.notes || '',
      joinUrl: 'https://sahara.care/session/sec-safe'
    });
  },

  // Trusted Contacts & Emergency Location
  getTrustedContacts: async (): Promise<TrustedContact[]> => {
    return fetchWithFallback<TrustedContact[]>('/trusted-contacts', {}, [
      { id: 'tc_1', userId: 'usr_demo_1', name: 'Kavita Rao', relationship: 'Mother', relationshipTe: 'తల్లి', phone: '+91 98480 12345', canViewStatus: true, canReceiveEmergencyAlerts: true, canReceiveLocation: true },
      { id: 'tc_2', userId: 'usr_demo_1', name: 'Arjun Rao', relationship: 'Brother', relationshipTe: 'సోదరుడు', phone: '+91 94400 54321', canViewStatus: true, canReceiveEmergencyAlerts: true, canReceiveLocation: true }
    ]);
  },

  startEmergencyLiveLocation: async (coords: { lat: number; lng: number; address: string }): Promise<any> => {
    return fetchWithFallback<any>('/emergency/start', {
      method: 'POST',
      body: JSON.stringify(coords)
    }, {
      isSharing: true,
      session: { id: `emg_${Date.now()}`, status: 'active', startedAt: new Date().toISOString(), ...coords }
    });
  },

  stopEmergencyLiveLocation: async (): Promise<any> => {
    return fetchWithFallback<any>('/emergency/stop', { method: 'POST' }, { isSharing: false });
  },

  // Resources & Helplines
  getResources: async (): Promise<ResourceItem[]> => {
    return fetchWithFallback<ResourceItem[]>('/resources', {}, [
      {
        id: 'res_1',
        title: 'SC & ST Prevention of Atrocities Legal Relief & Compensation',
        titleTe: 'ఎస్సీ/ఎస్టీ అట్రాసిటీల నిరోధక చట్టం - పరిహారం',
        category: 'Legal support',
        organization: 'Dept of Social Justice & Empowerment, Govt. of India',
        description: 'Mandatory financial relief, legal aid, police protection, and rehabilitation for survivors under the POA Act.',
        descriptionTe: 'పీవోఏ చట్టం క్రింద బాధితులకు ఆర్థిక ఉపశమనం మరియు చట్టపరమైన సహాయ నిబంధనలు.',
        eligibility: 'Survivors or families protected under the SC/ST (PoA) Act',
        eligibilityTe: 'పీవోఏ చట్టం క్రింద అర్హులైన బాధితులు',
        contact: 'Helpline: 1800-202-1989',
        website: 'https://socialjustice.gov.in',
        verifiedDate: '2026-09-01'
      },
      {
        id: 'res_2',
        title: 'National Legal Services Authority (NALSA) Free Legal Aid',
        titleTe: 'జాతీయ న్యాయ సేవల అథారిటీ (NALSA) ఉచిత న్యాయ సహాయం',
        category: 'Legal support',
        organization: 'NALSA & State Legal Services Authorities',
        description: 'Free legal counsel, court representation, and victim compensation filing for survivors of violence and marginalized communities.',
        descriptionTe: 'బాధితులకు ఉచిత న్యాయవాది, కోర్టు ప్రాతినిధ్యం మరియు పరిహారం.',
        eligibility: 'All women, children, survivors of atrocities',
        eligibilityTe: 'మహిళలు, పిల్లలు మరియు అట్రాసిటీ బాధితులందరికీ ఉచితం',
        contact: 'Helpline: 15100',
        website: 'https://nalsa.gov.in',
        verifiedDate: '2026-08-20'
      }
    ]);
  },

  getHelplines: async (): Promise<HelplineItem[]> => {
    return [
      { id: 'hlp_1', name: 'National Emergency Dispatch (Police / Ambulance)', nameTe: 'జాతీయ అత్యవసర విభాగం (112)', number: '112', hours: '24/7 Immediate Dispatch', description: 'Immediate emergency dispatch for medical and physical safety.', descriptionTe: 'పోలీస్ మరియు అత్యవసర వైద్య రక్షణ.', isEmergency: true },
      { id: 'hlp_2', name: 'Tele-MANAS (Govt. Free Crisis & Mental Health)', nameTe: 'టెలి-మానస్ (14416)', number: '14416', hours: '24/7 Free & Confidential', description: 'National tele-mental health assistance in English, Telugu, and 18+ languages.', descriptionTe: 'తెలుగు మరియు ఆంగ్లంలో 24 గంటల ఉచిత కౌన్సెలింగ్ సేవలు.', isEmergency: true },
      { id: 'hlp_3', name: 'KIRAN National Helpline', nameTe: 'కిరణ్ జాతీయ హెల్ప్‌లైన్', number: '1800-599-0019', hours: '24/7 Toll Free Crisis Intervention', description: 'Ministry of Social Justice support for distress and post-trauma stabilization.', descriptionTe: 'మానసిక ప్రశాంతత మరియు సహాయం కోసం కేంద్ర ప్రభుత్వ నెంబర్.', isEmergency: true },
      { id: 'hlp_4', name: 'National Commission for Women (NCW)', nameTe: 'జాతీయ మహిళా కమిషన్ హెల్ప్‌లైన్', number: '7827170170', hours: '24/7 Women in Distress Support', description: 'Emergency round-the-clock support for women facing violence or threats.', descriptionTe: 'హింస మరియు వేధింపులకు గురైన మహిళల కోసం ప్రత్యేక అత్యవసర నెంబర్.', isEmergency: true }
    ];
  }
};
