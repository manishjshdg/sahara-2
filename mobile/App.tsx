// SAHARA — Native Android Mobile Application
// Built with React Native + Expo + TypeScript
// Trauma-informed, privacy-first, human-led post-trauma recovery ecosystem.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { theme } from './src/theme';
import { SplashScreen } from './src/components/SplashScreen';
import { Onboarding } from './src/components/Onboarding';
import { HomeScreen } from './src/components/HomeScreen';
import { RecoveryJourney } from './src/components/RecoveryJourney';
import { SupportSection } from './src/components/SupportSection';
import { ProfileSettings } from './src/components/ProfileSettings';
import { QuickCheckInModal } from './src/components/QuickCheckInModal';
import { EmergencyModal } from './src/components/EmergencyModal';
import { AppointmentModal } from './src/components/AppointmentModal';
import { PermissionCenterModal } from './src/components/PermissionCenterModal';
import { DemoController } from './src/components/DemoController';

function MainAppShell() {
  const {
    t,
    activeTab,
    setActiveTab,
    isOnboarded,
    completeOnboarding,
    isEmergencyOpen,
    setIsEmergencyOpen,
    isLocationSharing,
    highContrast
  } = useApp();

  const colors = highContrast ? theme.highContrast : theme.colors;

  const [showSplash, setShowSplash] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  // 1. Startup Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. 5-Step Onboarding
  if (!isOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgPrimary }]}>
      <StatusBar style="light" />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.bgPrimary, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: colors.accentTeal }]}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>S</Text>
          </View>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            {t('appName')}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* Live Location Sharing Badge */}
          {isLocationSharing && (
            <TouchableOpacity
              onPress={() => setIsEmergencyOpen(true)}
              style={[styles.locationBadge, { backgroundColor: colors.accentRoseSoft }]}
            >
              <Text style={{ color: colors.accentRose, fontSize: 10, fontWeight: '800' }}>
                📍 LIVE LOCATION ON
              </Text>
            </TouchableOpacity>
          )}

          {/* Permissions Shortcut */}
          <TouchableOpacity
            onPress={() => setIsPermissionsOpen(true)}
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 18 }}>🛡️</Text>
          </TouchableOpacity>

          {/* Emergency 🆘 Button */}
          <TouchableOpacity
            onPress={() => setIsEmergencyOpen(true)}
            style={[styles.emergencyBtn, { backgroundColor: colors.accentRoseSoft, borderColor: colors.accentRose }]}
          >
            <Text style={{ color: colors.accentRose, fontSize: 14, fontWeight: '800' }}>🆘</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
          {/* Hackathon Demo Stepper Controls */}
          <DemoController
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />
        </View>

        {activeTab === 'home' && (
          <HomeScreen
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />
        )}

        {activeTab === 'recovery' && <RecoveryJourney />}

        {activeTab === 'support' && (
          <SupportSection
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            onOpenPermissions={() => setIsPermissionsOpen(true)}
          />
        )}
      </View>

      {/* Bottom Tab Navigation Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.bgSecondary, borderTopColor: colors.borderSubtle }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('home')}
          style={styles.navTab}
        >
          <Text style={{ fontSize: 18 }}>🏠</Text>
          <Text style={[styles.navLabel, { color: activeTab === 'home' ? colors.accentTeal : colors.textMuted }]}>
            {t('navHome')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsCheckInOpen(true)}
          style={styles.navTab}
        >
          <Text style={{ fontSize: 18 }}>🧠</Text>
          <Text style={[styles.navLabel, { color: colors.accentTeal, fontWeight: '700' }]}>
            {t('navCheckIn')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('recovery')}
          style={styles.navTab}
        >
          <Text style={{ fontSize: 18 }}>📈</Text>
          <Text style={[styles.navLabel, { color: activeTab === 'recovery' ? colors.accentTeal : colors.textMuted }]}>
            {t('navRecovery')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('support')}
          style={styles.navTab}
        >
          <Text style={{ fontSize: 18 }}>🤝</Text>
          <Text style={[styles.navLabel, { color: activeTab === 'support' ? colors.accentTeal : colors.textMuted }]}>
            {t('navSupport')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={styles.navTab}
        >
          <Text style={{ fontSize: 18 }}>👤</Text>
          <Text style={[styles.navLabel, { color: activeTab === 'profile' ? colors.accentTeal : colors.textMuted }]}>
            {t('navProfile')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Global Modals */}
      <QuickCheckInModal
        visible={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <EmergencyModal
        visible={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <AppointmentModal
        visible={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      <PermissionCenterModal
        visible={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  iconBtn: {
    padding: 6,
  },
  emergencyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingBottom: 4,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 54,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
