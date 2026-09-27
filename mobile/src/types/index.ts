// SAHARA Mobile TypeScript Types & Entity Contracts

export type LanguageCode = 'en' | 'te';
export type VoiceLanguageCode = 'en-US' | 'te-IN';
export type UserRole = 'user' | 'professional' | 'org_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Profile {
  userId: string;
  displayName: string;
  phone?: string;
  language: LanguageCode;
  voiceLanguage: VoiceLanguageCode;
  baselineEstablished: boolean;
  baselineDaysCount?: number;
  privacyLevel?: string;
  emergencyContactsConsent?: boolean;
  locationSharingConsent?: boolean;
  notificationsEnabled?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
}

export interface CheckIn {
  id: string;
  userId: string;
  timestamp: string;
  date: string;
  overallScore: number;
  mood: number;
  stress: number;
  sleep: number;
  safety: number;
  social: number;
  fear?: number;
  functioning: number;
  energy: number;
  notes?: string;
  wantsHumanSupport?: boolean;
}

export interface PersonalBaseline {
  id?: string;
  userId: string;
  periodDays: number;
  typicalMood: number;
  typicalStress: number;
  typicalSleep: number;
  typicalSocial: number;
  typicalFunctioning: number;
  typicalEnergy: number;
  varianceThreshold: number;
  status: 'insufficient_data' | 'established';
  checkinCount?: number;
}

export interface ContributingIndicator {
  factor: string;
  factorTe?: string;
  detail: string;
}

export interface SuggestedStep {
  id: string;
  label: string;
  labelTe?: string;
  action: 'book_counselor' | 'book_social_worker' | 'contact_trusted' | 'view_resources' | 'call_112' | 'call_telemanas' | 'alert_trusted';
}

export interface AiSupportSignal {
  id: string;
  userId: string;
  checkinId?: string;
  timestamp: string;
  headline: string;
  headlineTe?: string;
  signalLevel: 'notable_change' | 'concerning_change' | 'immediate_attention';
  contributingIndicators: ContributingIndicator[];
  suggestedSteps: SuggestedStep[];
  acknowledged: boolean;
  status?: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  titleTe?: string;
  category: string;
  icon: string;
  targetDaysPerWeek: number;
  reminderTime?: string;
  streak: number;
  isActive: boolean;
  notes?: string;
  completedToday?: boolean;
}

export interface Hobby {
  id: string;
  userId: string;
  category: string;
  name: string;
  nameTe?: string;
  icon: string;
  isFavorite: boolean;
  currentGoal: string;
  currentGoalTe?: string;
  weeklyMinutesTarget: number;
  totalMinutesLogged: number;
  recentNotes?: string;
}

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  relationshipTe?: string;
  phone: string;
  canViewStatus: boolean;
  canReceiveEmergencyAlerts: boolean;
  canReceiveLocation: boolean;
  notes?: string;
}

export interface EmergencySession {
  id: string;
  userId: string;
  status: 'active' | 'stopped';
  startedAt: string;
  stoppedAt?: string | null;
  lat: number;
  lng: number;
  address?: string;
  contactsNotified?: Array<{ id: string; name: string; phone: string }>;
}

export interface Professional {
  id: string;
  userId: string;
  name: string;
  role: 'counselor' | 'social_worker' | 'case_manager';
  title: string;
  titleTe?: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  bio: string;
  bioTe?: string;
  availableSlots: string[];
  rating: number;
  casesCount?: number;
}

export interface Appointment {
  id: string;
  userId: string;
  professionalId: string;
  professionalName: string;
  dateTime: string;
  status: 'Requested' | 'Confirmed' | 'Rescheduled' | 'Cancelled' | 'Completed' | 'No-show';
  mode?: string;
  notes?: string;
  isUpcoming?: boolean;
  joinUrl?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  titleTe?: string;
  category: string;
  organization: string;
  description: string;
  descriptionTe?: string;
  eligibility?: string;
  eligibilityTe?: string;
  location?: string;
  contact?: string;
  website?: string;
  verifiedDate: string;
}

export interface HelplineItem {
  id: string;
  name: string;
  nameTe?: string;
  number: string;
  hours: string;
  description: string;
  descriptionTe?: string;
  isEmergency: boolean;
}

export interface LifestyleSuggestion {
  id: string;
  category: string;
  categoryTe?: string;
  title: string;
  titleTe?: string;
  description: string;
  descriptionTe?: string;
  duration: string;
  difficulty: string;
  icon: string;
}

export interface AudioRecordingHandle {
  stopAndUnloadAsync: () => Promise<void>;
  getURI: () => string | null;
}
