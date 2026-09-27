// SAHARA Mobile Application Context
// State management with AsyncStorage persistence and native device capabilities in TypeScript

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LanguageCode,
  VoiceLanguageCode,
  User,
  Profile,
  CheckIn,
  PersonalBaseline,
  AiSupportSignal,
  Habit,
  Hobby,
  EmergencySession
} from '../types';
import { getTranslation } from '../locales/i18n';
import { mobileApi } from '../services/api';
import { NativePermissionService } from '../services/nativePermissions';

interface AppContextValue {
  lang: LanguageCode;
  changeLanguage: (code: LanguageCode) => Promise<void>;
  voiceLang: VoiceLanguageCode;
  changeVoiceLanguage: (code: VoiceLanguageCode) => Promise<void>;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  t: (key: string, fallback?: string) => string;

  activeTab: 'home' | 'recovery' | 'support' | 'profile';
  setActiveTab: (tab: 'home' | 'recovery' | 'support' | 'profile') => void;

  user: User;
  profile: Profile | null;
  isOnboarded: boolean;
  completeOnboarding: () => Promise<void>;

  signals: AiSupportSignal[];
  latestSignal: AiSupportSignal | null;
  dismissSignal: (id: string) => Promise<void>;

  checkins: CheckIn[];
  baseline: PersonalBaseline | null;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  hobbies: Hobby[];
  setHobbies: React.Dispatch<React.SetStateAction<Hobby[]>>;

  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  isLocationSharing: boolean;
  activeLocationCoords: { lat: number; lng: number; address: string } | null;
  toggleLocationSharing: () => Promise<void>;

  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [voiceLang, setVoiceLang] = useState<VoiceLanguageCode>('en-US');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'home' | 'recovery' | 'support' | 'profile'>('home');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  const [user] = useState<User>({
    id: 'usr_demo_1',
    name: 'Ananya Rao',
    email: 'survivor@sahara.care',
    role: 'user'
  });

  const [profile, setProfile] = useState<Profile | null>({
    userId: 'usr_demo_1',
    displayName: 'Ananya',
    language: 'en',
    voiceLanguage: 'en-US',
    baselineEstablished: true
  });

  const [signals, setSignals] = useState<AiSupportSignal[]>([]);
  const [latestSignal, setLatestSignal] = useState<AiSupportSignal | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [baseline, setBaseline] = useState<PersonalBaseline | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [activeLocationCoords, setActiveLocationCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Load preferences from AsyncStorage on launch
  useEffect(() => {
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem('sahara_mobile_lang');
        if (storedLang === 'en' || storedLang === 'te') {
          setLang(storedLang);
        }
        const storedOnboarded = await AsyncStorage.getItem('sahara_mobile_onboarded');
        if (storedOnboarded === 'true') {
          setIsOnboarded(true);
        }
        const storedHC = await AsyncStorage.getItem('sahara_mobile_hc');
        if (storedHC === 'true') {
          setHighContrastState(true);
        }
      } catch (e) {
        console.warn('AsyncStorage load warning:', e);
      }
    })();
  }, []);

  const changeLanguage = useCallback(async (newLang: LanguageCode) => {
    setLang(newLang);
    await AsyncStorage.setItem('sahara_mobile_lang', newLang);
    const vLang: VoiceLanguageCode = newLang === 'te' ? 'te-IN' : 'en-US';
    setVoiceLang(vLang);
  }, []);

  const changeVoiceLanguage = useCallback(async (newVoice: VoiceLanguageCode) => {
    setVoiceLang(newVoice);
    await AsyncStorage.setItem('sahara_mobile_voice', newVoice);
  }, []);

  const setHighContrast = useCallback((val: boolean) => {
    setHighContrastState(val);
    AsyncStorage.setItem('sahara_mobile_hc', val ? 'true' : 'false');
  }, []);

  const setReducedMotion = useCallback((val: boolean) => {
    setReducedMotionState(val);
    AsyncStorage.setItem('sahara_mobile_rm', val ? 'true' : 'false');
  }, []);

  const completeOnboarding = useCallback(async () => {
    setIsOnboarded(true);
    await AsyncStorage.setItem('sahara_mobile_onboarded', 'true');
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    return getTranslation(lang, key, fallback);
  }, [lang]);

  const refreshData = useCallback(async () => {
    try {
      const [bl, sigs, hList, hbyList, chks] = await Promise.all([
        mobileApi.getBaseline(user.id),
        mobileApi.getSupportSignals(user.id),
        mobileApi.getHabits(),
        mobileApi.getHobbies(),
        mobileApi.getCheckIns(user.id)
      ]);

      setBaseline(bl);
      setSignals(sigs);
      const unack = sigs.filter(s => !s.acknowledged);
      setLatestSignal(unack.length > 0 ? unack[unack.length - 1] : null);
      setHabits(hList);
      setHobbies(hbyList);
      setCheckins(chks);
    } catch (err) {
      console.warn('Failed refreshing mobile data:', err);
    }
  }, [user.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const dismissSignal = useCallback(async (id: string) => {
    setLatestSignal(null);
    setSignals(prev => prev.map(s => s.id === id ? { ...s, acknowledged: true } : s));
  }, []);

  const toggleLocationSharing = useCallback(async () => {
    if (isLocationSharing) {
      await mobileApi.stopEmergencyLiveLocation();
      setIsLocationSharing(false);
      setActiveLocationCoords(null);
      NativePermissionService.sendSupportiveNotification(
        'Location Sharing Stopped',
        'Live location sharing has been safely deactivated.'
      );
    } else {
      const coords = await NativePermissionService.getCurrentLiveCoordinates();
      if (coords) {
        await mobileApi.startEmergencyLiveLocation(coords);
        setIsLocationSharing(true);
        setActiveLocationCoords(coords);
        NativePermissionService.sendSupportiveNotification(
          'Live Location Sharing Active',
          `Sharing location with your Trusted Circle (${coords.address}).`
        );
      }
    }
  }, [isLocationSharing]);

  return (
    <AppContext.Provider
      value={{
        lang,
        changeLanguage,
        voiceLang,
        changeVoiceLanguage,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        t,
        activeTab,
        setActiveTab,
        user,
        profile,
        isOnboarded,
        completeOnboarding,
        signals,
        latestSignal,
        dismissSignal,
        checkins,
        baseline,
        habits,
        setHabits,
        hobbies,
        setHobbies,
        isEmergencyOpen,
        setIsEmergencyOpen,
        isLocationSharing,
        activeLocationCoords,
        toggleLocationSharing,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
