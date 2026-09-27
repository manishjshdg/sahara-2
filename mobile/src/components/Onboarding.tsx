// SAHARA Mobile 5-Step Onboarding (React Native TypeScript)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { NativePermissionService } from '../services/nativePermissions';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { lang, changeLanguage, t, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const [step, setStep] = useState(1);
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleNotificationRequest = async () => {
    await NativePermissionService.requestNotificationPermission();
    onComplete();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Top Bar with Step Dots */}
      <View style={styles.topBar}>
        {step > 1 ? (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navBtn}>
            <Text style={[styles.navBtnText, { color: colors.textSecondary }]}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}

        <View style={styles.dotsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View
              key={s}
              style={[
                styles.dot,
                {
                  backgroundColor: s === step ? colors.accentTeal : 'rgba(255,255,255,0.18)',
                  width: s === step ? 22 : 6,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={onComplete} style={styles.navBtn}>
          <Text style={[styles.navBtnText, { color: colors.textMuted }]}>{t('btnSkip')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Step 1: Welcome */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentTealSoft }]}>
              <Text style={{ fontSize: 32 }}>🌱</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('onboardingStep1Title')}
            </Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              {t('onboardingStep1Desc')}
            </Text>

            <View style={[styles.calloutCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <Text style={[styles.calloutText, { color: colors.accentTeal }]}>
                {t('corePrinciple')}
              </Text>
            </View>
          </View>
        )}

        {/* Step 2: Pillars */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentSageSoft }]}>
              <Text style={{ fontSize: 32 }}>🤝</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('onboardingStep2Title')}
            </Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              {t('onboardingStep2Desc')}
            </Text>

            <View style={{ gap: 10, width: '100%', marginTop: 14 }}>
              <View style={[styles.featureCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>📈 Personal Baseline</Text>
                <Text style={[styles.featureDesc, { color: colors.textMuted }]}>
                  Understands your rhythm from your own history, never population scores.
                </Text>
              </View>

              <View style={[styles.featureCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>🎨 Joy & Reconnection</Text>
                <Text style={[styles.featureDesc, { color: colors.textMuted }]}>
                  Gentle habits and creative hobbies with zero guilt or shame.
                </Text>
              </View>

              <View style={[styles.featureCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>🩺 Licensed Support</Text>
                <Text style={[styles.featureDesc, { color: colors.textMuted }]}>
                  Connect directly with counselors, social workers, and verified schemes.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Privacy */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Text style={{ fontSize: 32 }}>🔒</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('onboardingStep3Title')}
            </Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              {t('onboardingStep3Desc')}
            </Text>

            <View style={[styles.calloutCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle, gap: 8 }]}>
              <Text style={{ fontSize: 13, color: colors.textLight }}>✓ No automated psychiatric diagnoses or labels.</Text>
              <Text style={{ fontSize: 13, color: colors.textLight }}>✓ No background location tracking (only temporary opt-in emergency).</Text>
              <Text style={{ fontSize: 13, color: colors.textLight }}>✓ Complete data ownership & export rights.</Text>
            </View>

            <TouchableOpacity onPress={() => setShowPrivacyDetail(!showPrivacyDetail)} style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 13, color: colors.accentTeal, textDecorationLine: 'underline' }}>
                {t('privacyDetailsLink')}
              </Text>
            </TouchableOpacity>

            {showPrivacyDetail && (
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8, textAlign: 'center' }}>
                All records use local encrypted keys. Professionals only gain case access when you explicitly book a session or raise a support request.
              </Text>
            )}
          </View>
        )}

        {/* Step 4: Language Selection */}
        {step === 4 && (
          <View style={styles.stepBox}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentAmberSoft }]}>
              <Text style={{ fontSize: 32 }}>🌐</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('onboardingStep4Title')}
            </Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              {t('onboardingStep4Desc')}
            </Text>

            <View style={{ width: '100%', gap: 12, marginTop: 14 }}>
              <TouchableOpacity
                onPress={() => changeLanguage('en')}
                style={[
                  styles.langOption,
                  {
                    backgroundColor: lang === 'en' ? colors.accentTealSoft : colors.bgCard,
                    borderColor: lang === 'en' ? colors.accentTeal : colors.borderSubtle,
                  },
                ]}
              >
                <View>
                  <Text style={[styles.langTitle, { color: colors.textPrimary }]}>English</Text>
                  <Text style={[styles.langSub, { color: colors.textMuted }]}>Default Application Language</Text>
                </View>
                {lang === 'en' && <Text style={{ color: colors.accentTeal, fontSize: 18 }}>✓</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => changeLanguage('te')}
                style={[
                  styles.langOption,
                  {
                    backgroundColor: lang === 'te' ? colors.accentTealSoft : colors.bgCard,
                    borderColor: lang === 'te' ? colors.accentTeal : colors.borderSubtle,
                  },
                ]}
              >
                <View>
                  <Text style={[styles.langTitle, { color: colors.textPrimary }]}>తెలుగు (Telugu)</Text>
                  <Text style={[styles.langSub, { color: colors.textMuted }]}>పూర్తి తెలుగు సహకారం</Text>
                </View>
                {lang === 'te' && <Text style={{ color: colors.accentTeal, fontSize: 18 }}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 5: Notifications */}
        {step === 5 && (
          <View style={styles.stepBox}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Text style={{ fontSize: 32 }}>🔔</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
              {t('onboardingStep5Title')}
            </Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
              {t('onboardingStep5Desc')}
            </Text>

            <View style={[styles.calloutCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 18 }}>
                🔒 <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Lock-Screen Privacy Guarantee:</Text>
                {'\n'}Alerts never display sensitive distress phrases. Only discreet reminders like "You have a new SAHARA update".
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button Bar */}
      <View style={styles.bottomBar}>
        {step < 5 ? (
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.primaryBtn, { backgroundColor: colors.accentTeal }]}
          >
            <Text style={styles.primaryBtnText}>
              {step === 1 ? t('btnGetStarted') : t('btnContinue')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ gap: 10, width: '100%' }}>
            <TouchableOpacity
              onPress={handleNotificationRequest}
              style={[styles.primaryBtn, { backgroundColor: colors.accentTeal }]}
            >
              <Text style={styles.primaryBtnText}>{t('btnAllowNotifications')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onComplete} style={styles.secondaryBtn}>
              <Text style={[styles.secondaryBtnText, { color: colors.textLight }]}>{t('btnMaybeLater')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navBtn: {
    padding: 6,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  stepBox: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  stepDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 320,
    marginBottom: 14,
  },
  calloutCard: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
  },
  calloutText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  featureCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  langTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  langSub: {
    fontSize: 12,
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
