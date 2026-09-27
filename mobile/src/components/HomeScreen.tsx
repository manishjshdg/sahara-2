// SAHARA Mobile Home Screen (React Native TypeScript)
// Calm greeting, 1-10 accessible feeling scale, AI Support Signal card, Quick Check-in CTA, secondary cards

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { AiSupportSignalCard } from './AiSupportSignalCard';

interface Props {
  onOpenCheckIn: () => void;
  onOpenAppointment: () => void;
}

export function HomeScreen({ onOpenCheckIn, onOpenAppointment }: Props) {
  const {
    t,
    user,
    profile,
    latestSignal,
    dismissSignal,
    habits,
    hobbies,
    setActiveTab,
    setIsEmergencyOpen,
    highContrast
  } = useApp();

  const colors = highContrast ? theme.highContrast : theme.colors;
  const [instantFeeling, setInstantFeeling] = useState(7);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return t('greetingMorning');
    if (hr < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  const displayName = profile?.displayName || user?.name?.split(' ')[0] || 'Friend';
  const completedHabits = habits.filter(h => h.completedToday).length;

  const handleSignalAction = (action: string) => {
    if (action === 'book_counselor' || action === 'book_social_worker') {
      onOpenAppointment();
    } else {
      setActiveTab('support');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting Header */}
      <View style={styles.headerBox}>
        <Text style={[styles.greetingSubtitle, { color: colors.accentTeal }]}>
          {getGreeting()},
        </Text>
        <Text style={[styles.greetingName, { color: colors.textPrimary }]}>
          {displayName}
        </Text>
      </View>

      {/* AI Support Signal Notice (If deviation detected) */}
      {latestSignal && (
        <AiSupportSignalCard
          signal={latestSignal}
          onAction={handleSignalAction}
          onDismiss={dismissSignal}
        />
      )}

      {/* "How are you feeling today?" 1-10 Accessible Card */}
      <View style={[styles.feelingCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <Text style={[styles.feelingTitle, { color: colors.textPrimary }]}>
          {t('howAreYouFeeling')}
        </Text>
        <Text style={[styles.feelingSub, { color: colors.textMuted }]}>
          {t('feelingScaleSubtext')}
        </Text>

        {/* 1-10 Pill Selector */}
        <View style={styles.pillsRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => setInstantFeeling(num)}
              style={[
                styles.pill,
                {
                  backgroundColor: instantFeeling === num ? colors.accentTeal : 'rgba(255,255,255,0.06)',
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: instantFeeling === num ? '#ffffff' : colors.textMuted,
                    fontWeight: instantFeeling === num ? '800' : '500',
                  },
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Primary CTA: Quick Check-in */}
        <TouchableOpacity
          onPress={onOpenCheckIn}
          style={[styles.primaryCTA, { backgroundColor: colors.accentTeal }]}
        >
          <Text style={styles.primaryCTAText}>🧠 {t('btnQuickCheckIn')}</Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Action Cards */}
      <View style={styles.cardsCol}>
        {/* 1. My Well-being */}
        <TouchableOpacity
          onPress={() => setActiveTab('recovery')}
          style={[styles.actionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Text style={{ fontSize: 20 }}>📈</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('cardWellbeingTitle')}</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>{t('cardWellbeingSub')}</Text>
            </View>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
        </TouchableOpacity>

        {/* 2. My Habits */}
        <TouchableOpacity
          onPress={() => setActiveTab('recovery')}
          style={[styles.actionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.cardIconBox, { backgroundColor: colors.accentSageSoft }]}>
              <Text style={{ fontSize: 20 }}>🗓️</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('cardHabitsTitle')}</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>
                {completedHabits} / {habits.length} {t('completedLabel')}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={[styles.countBadge, { backgroundColor: colors.accentSageSoft }]}>
              <Text style={{ color: colors.accentSage, fontSize: 11, fontWeight: '700' }}>
                {completedHabits}/{habits.length}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
          </View>
        </TouchableOpacity>

        {/* 3. My Hobbies */}
        <TouchableOpacity
          onPress={() => setActiveTab('recovery')}
          style={[styles.actionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.cardIconBox, { backgroundColor: colors.accentAmberSoft }]}>
              <Text style={{ fontSize: 20 }}>🎨</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('cardHobbiesTitle')}</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>{hobbies.length} creative activities active</Text>
            </View>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
        </TouchableOpacity>

        {/* 4. Talk to Someone */}
        <TouchableOpacity
          onPress={() => setActiveTab('support')}
          style={[styles.actionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Text style={{ fontSize: 20 }}>🤝</Text>
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('cardSupportTitle')}</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>{t('cardSupportSub')}</Text>
            </View>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
        </TouchableOpacity>

        {/* 5. Immediate Help Button */}
        <TouchableOpacity
          onPress={() => setIsEmergencyOpen(true)}
          style={[styles.emergencyBtn, { backgroundColor: colors.accentRose }]}
        >
          <Text style={styles.emergencyBtnText}>🆘 {t('cardEmergencyTitle')}</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Guarantee Indicator */}
      <View style={styles.privacyBox}>
        <Text style={[styles.privacyText, { color: colors.textMuted }]}>
          🔒 {t('privacyBadge')}
        </Text>
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
  headerBox: {
    marginBottom: 16,
  },
  greetingSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  greetingName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  feelingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
  },
  feelingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  feelingSub: {
    fontSize: 12,
    marginBottom: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 14,
  },
  pill: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
  },
  primaryCTA: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCTAText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cardsCol: {
    gap: 10,
    marginBottom: 18,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  emergencyBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  emergencyBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  privacyBox: {
    alignItems: 'center',
    marginTop: 4,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
