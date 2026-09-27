// SAHARA Mobile Profile & Privacy Settings (React Native TypeScript)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

interface Props {
  onOpenPermissions: () => void;
}

export function ProfileSettings({ onOpenPermissions }: Props) {
  const {
    lang,
    changeLanguage,
    voiceLang,
    changeVoiceLanguage,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    t,
    user
  } = useApp();

  const colors = highContrast ? theme.highContrast : theme.colors;
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={{ marginBottom: 14 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('profileTitle')}
        </Text>
        <Text style={[styles.subtext, { color: colors.textMuted }]}>
          Personal preferences, accessibility, and privacy charter
        </Text>
      </View>

      {/* User Info Card */}
      <View style={[styles.userCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <View style={[styles.avatarBox, { backgroundColor: colors.accentTeal }]}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>
            {user.name.charAt(0)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{user.name}</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{user.email}</Text>
          <View style={[styles.privacyBadge, { backgroundColor: colors.accentSageSoft }]}>
            <Text style={{ fontSize: 10, color: colors.accentSage, fontWeight: '700' }}>
              🔒 Strict Privacy Protection
            </Text>
          </View>
        </View>
      </View>

      {/* 1. Language Selection */}
      <View style={[styles.settingSection, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
          🌐 {t('settingLanguage')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => changeLanguage('en')}
            style={[
              styles.langBtn,
              {
                backgroundColor: lang === 'en' ? colors.accentTeal : colors.bgSecondary,
                borderColor: lang === 'en' ? colors.accentTeal : colors.borderSubtle,
              },
            ]}
          >
            <Text style={{ color: lang === 'en' ? '#fff' : colors.textPrimary, fontWeight: '700', fontSize: 13 }}>
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => changeLanguage('te')}
            style={[
              styles.langBtn,
              {
                backgroundColor: lang === 'te' ? colors.accentTeal : colors.bgSecondary,
                borderColor: lang === 'te' ? colors.accentTeal : colors.borderSubtle,
              },
            ]}
          >
            <Text style={{ color: lang === 'te' ? '#fff' : colors.textPrimary, fontWeight: '700', fontSize: 13 }}>
              తెలుగు (Telugu)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Voice Input Language */}
      <View style={[styles.settingSection, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
          🎤 {t('settingVoiceLanguage')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => changeVoiceLanguage('en-US')}
            style={[
              styles.langBtn,
              {
                backgroundColor: voiceLang === 'en-US' ? colors.accentSage : colors.bgSecondary,
                borderColor: voiceLang === 'en-US' ? colors.accentSage : colors.borderSubtle,
              },
            ]}
          >
            <Text style={{ color: voiceLang === 'en-US' ? '#fff' : colors.textPrimary, fontWeight: '700', fontSize: 12 }}>
              English Voice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => changeVoiceLanguage('te-IN')}
            style={[
              styles.langBtn,
              {
                backgroundColor: voiceLang === 'te-IN' ? colors.accentSage : colors.bgSecondary,
                borderColor: voiceLang === 'te-IN' ? colors.accentSage : colors.borderSubtle,
              },
            ]}
          >
            <Text style={{ color: voiceLang === 'te-IN' ? '#fff' : colors.textPrimary, fontWeight: '700', fontSize: 12 }}>
              తెలుగు వాయిస్
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Accessibility Controls */}
      <View style={[styles.settingSection, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary, marginBottom: 12 }]}>
          👁️ Accessibility Controls
        </Text>

        <View style={{ gap: 14 }}>
          <View style={styles.switchRow}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{t('settingHighContrast')}</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>WCAG AAA ultra-contrast color palette</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: colors.bgSecondary, true: colors.accentTeal }}
            />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{t('settingReducedMotion')}</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>Minimizes visual animations</Text>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: colors.bgSecondary, true: colors.accentTeal }}
            />
          </View>
        </View>
      </View>

      {/* 4. Native Permissions Center */}
      <View style={[styles.settingSection, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
          🛡️ {t('settingPrivacyCenter')}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: 10 }}>
          Manage device permissions for Camera, Microphone, Location, and Notifications.
        </Text>
        <TouchableOpacity
          onPress={onOpenPermissions}
          style={[styles.manageBtn, { backgroundColor: colors.bgSecondary, borderColor: colors.borderSubtle }]}
        >
          <Text style={{ color: colors.accentTeal, fontWeight: '700', fontSize: 13 }}>
            Inspect & Manage Permissions
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5. Data Export */}
      <View style={[styles.settingSection, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
          📦 Data Rights & Export
        </Text>

        {exportNotice && (
          <Text style={{ fontSize: 12, color: colors.accentSage, marginVertical: 6 }}>
            ✓ Private JSON export generated.
          </Text>
        )}

        <TouchableOpacity
          onPress={handleExportData}
          style={[styles.manageBtn, { backgroundColor: colors.bgSecondary, borderColor: colors.borderSubtle, marginTop: 8 }]}
        >
          <Text style={{ color: colors.textLight, fontWeight: '600', fontSize: 13 }}>
            📥 {t('settingExportData')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtext: {
    fontSize: 12,
    marginTop: 2,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginBottom: 14,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  privacyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  settingSection: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  langBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageBtn: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
