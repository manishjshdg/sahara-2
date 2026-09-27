// SAHARA Global Application Context
// Centralized state for trauma-informed recovery ecosystem:
// Localization (EN/TE), Voice Recognition, Role Portals, Real-time Signals,
// Live Location Sharing, Notification Center, and Demo Mode simulation.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, getTranslation } from '../locales/i18n.js';
import { api } from '../services/api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. Language & Accessibility
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('sahara_lang') || 'en';
  });

  const [voiceLang, setVoiceLang] = useState(() => {
    return localStorage.getItem('sahara_voice_lang') || 'en-US';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('sahara_high_contrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('sahara_reduced_motion') === 'true';
  });

  // Apply visual accessibility classes to document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('sahara_high_contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    localStorage.setItem('sahara_reduced_motion', reducedMotion);
  }, [reducedMotion]);

  // Persist language selection
  const changeLanguage = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('sahara_lang', newLang);
    // sync voice language default
    const matchingVoice = newLang === 'te' ? 'te-IN' : 'en-US';
    setVoiceLang(matchingVoice);
    localStorage.setItem('sahara_voice_lang', matchingVoice);

    api.updateProfile({ language: newLang, voiceLanguage: matchingVoice }).catch(() => {});
  }, []);

  const changeVoiceLanguage = useCallback((newVoiceLang) => {
    setVoiceLang(newVoiceLang);
    localStorage.setItem('sahara_voice_lang', newVoiceLang);
  }, []);

  // Translation helper
  const t = useCallback((key, fallback) => {
    return getTranslation(lang, key, fallback);
  }, [lang]);

  // 2. Navigation & User Session
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState({
    id: 'usr_demo_1',
    name: 'Ananya Rao',
    email: 'survivor@sahara.care',
    role: 'user'
  });
  const [profile, setProfile] = useState(null);
  const [activeRole, setActiveRole] = useState('user'); // 'user' | 'professional' | 'org_admin'
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('sahara_onboarded') === 'true';
  });

  // 3. AI Support Signals & Check-ins
  const [signals, setSignals] = useState([]);
  const [latestSignal, setLatestSignal] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [lifestyleSuggestions, setLifestyleSuggestions] = useState([]);

  // 4. Habits & Hobbies
  const [habits, setHabits] = useState([]);
  const [hobbies, setHobbies] = useState([]);

  // 5. Emergency & Live Location
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [activeEmergencySession, setActiveEmergencySession] = useState(null);

  // 6. Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // 7. Load Data on Mount or User Change
  const refreshUserData = useCallback(async () => {
    try {
      const [
        profileRes,
        signalsRes,
        checkinsRes,
        baselineRes,
        habitsRes,
        hobbiesRes,
        emergRes,
        notifRes,
        lifestyleRes
      ] = await Promise.allSettled([
        api.getProfile(user.id),
        api.getSupportSignals(user.id),
        api.getCheckIns(user.id),
        api.getBaseline(user.id),
        api.getHabits(),
        api.getHobbies(),
        api.getEmergencyStatus(),
        api.getNotifications(),
        api.getLifestyleSuggestions()
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        setProfile(profileRes.value.profile);
      }

      if (signalsRes.status === 'fulfilled' && Array.isArray(signalsRes.value)) {
        setSignals(signalsRes.value);
        // Find latest unacknowledged signal
        const unack = signalsRes.value.filter(s => !s.acknowledged);
        setLatestSignal(unack.length > 0 ? unack[unack.length - 1] : null);
      }

      if (checkinsRes.status === 'fulfilled' && Array.isArray(checkinsRes.value)) {
        setCheckins(checkinsRes.value);
      }

      if (baselineRes.status === 'fulfilled') {
        setBaseline(baselineRes.value);
      }

      if (habitsRes.status === 'fulfilled' && Array.isArray(habitsRes.value)) {
        setHabits(habitsRes.value);
      }

      if (hobbiesRes.status === 'fulfilled' && Array.isArray(hobbiesRes.value)) {
        setHobbies(hobbiesRes.value);
      }

      if (emergRes.status === 'fulfilled' && emergRes.value) {
        setIsLocationSharing(Boolean(emergRes.value.isSharing));
        setActiveEmergencySession(emergRes.value.session);
      }

      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value)) {
        setNotifications(notifRes.value);
        setUnreadNotificationsCount(notifRes.value.filter(n => !n.isRead).length);
      }

      if (lifestyleRes.status === 'fulfilled' && Array.isArray(lifestyleRes.value)) {
        setLifestyleSuggestions(lifestyleRes.value);
      }
    } catch (err) {
      console.warn('Initial data load warning:', err.message);
    }
  }, [user.id]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Complete Onboarding
  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    localStorage.setItem('sahara_onboarded', 'true');
  }, []);

  // Toggle Live Location Sharing
  const toggleLocationSharing = useCallback(async () => {
    try {
      if (isLocationSharing) {
        await api.stopEmergencyLiveLocation();
        setIsLocationSharing(false);
        setActiveEmergencySession(null);
      } else {
        const res = await api.startEmergencyLiveLocation({
          lat: 17.385044,
          lng: 78.486671,
          address: 'Banjara Hills, Hyderabad, Telangana'
        });
        setIsLocationSharing(true);
        setActiveEmergencySession(res.session);
      }
      refreshUserData();
    } catch (e) {
      console.error('Failed to toggle location sharing:', e);
    }
  }, [isLocationSharing, refreshUserData]);

  // Dismiss AI Support Signal
  const dismissSignal = useCallback(async (signalId) => {
    try {
      await api.acknowledgeSignal(signalId);
      setLatestSignal(null);
      refreshUserData();
    } catch (e) {
      console.error('Failed to dismiss signal:', e);
    }
  }, [refreshUserData]);

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
        setUser,
        profile,
        activeRole,
        setActiveRole,
        isOnboarded,
        completeOnboarding,
        signals,
        latestSignal,
        setLatestSignal,
        dismissSignal,
        checkins,
        baseline,
        lifestyleSuggestions,
        habits,
        setHabits,
        hobbies,
        setHobbies,
        isEmergencyOpen,
        setIsEmergencyOpen,
        isLocationSharing,
        activeEmergencySession,
        toggleLocationSharing,
        notifications,
        unreadNotificationsCount,
        refreshUserData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
