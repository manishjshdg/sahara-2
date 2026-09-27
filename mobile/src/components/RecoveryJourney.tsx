// SAHARA Recovery Journey (React Native TypeScript)
// Longitudinal trends, gentle habit tracker, hobby reconnection, and adaptive lifestyle support

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { mobileApi } from '../services/api';
import { NativePermissionService } from '../services/nativePermissions';

export function RecoveryJourney() {
  const { lang, t, habits, setHabits, hobbies, setHobbies, baseline, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const [subTab, setSubTab] = useState<'wellbeing' | 'habits' | 'hobbies' | 'lifestyle'>('wellbeing');
  const [trendDays, setTrendDays] = useState<7 | 30>(7);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Habit Modal State
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  // New Hobby Modal State
  const [newHobbyName, setNewHobbyName] = useState('');
  const [isAddingHobby, setIsAddingHobby] = useState(false);

  const isTe = lang === 'te';

  const handleToggleHabit = async (habitId: string) => {
    try {
      const res = await mobileApi.toggleHabit(habitId);
      setHabits(prev =>
        prev.map(h => (h.id === habitId ? { ...h, completedToday: !h.completedToday } : h))
      );
      setToastMessage(res.gentleMessage || 'Well done honoring this small moment for yourself.');
      NativePermissionService.speakAffirmation(
        isTe ? 'ఈ చిన్న అలవాటును పూర్తి చేసినందుకు అభినందనలు' : 'Gentle habit completed.',
        lang
      );
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCreateHabit = () => {
    if (!newHabitTitle) return;
    const newHabit = {
      id: `hbt_${Date.now()}`,
      userId: 'usr_demo_1',
      title: newHabitTitle,
      category: 'general',
      icon: 'Check',
      targetDaysPerWeek: 7,
      streak: 1,
      isActive: true,
      completedToday: true
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitTitle('');
    setIsAddingHabit(false);
    setToastMessage('Small habit added to your routine.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateHobby = () => {
    if (!newHobbyName) return;
    const newHobby = {
      id: `hby_${Date.now()}`,
      userId: 'usr_demo_1',
      category: 'Creative',
      name: newHobbyName,
      icon: 'Palette',
      isFavorite: true,
      currentGoal: 'Engage for 15 mins without pressure',
      weeklyMinutesTarget: 45,
      totalMinutesLogged: 15
    };
    setHobbies(prev => [...prev, newHobby]);
    setNewHobbyName('');
    setIsAddingHobby(false);
    setToastMessage('Hobby added for gentle reconnection.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={{ marginBottom: 14 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('recoveryTitle')}
        </Text>
        <Text style={[styles.subtext, { color: colors.textMuted }]}>
          {t('recoverySubtext')}
        </Text>
      </View>

      {/* Sub Tabs */}
      <View style={[styles.subTabsRow, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
        <TouchableOpacity
          onPress={() => setSubTab('wellbeing')}
          style={[styles.subTabBtn, subTab === 'wellbeing' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subTab === 'wellbeing' ? colors.accentTeal : colors.textMuted }]}>
            📈 Well-being
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubTab('habits')}
          style={[styles.subTabBtn, subTab === 'habits' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subTab === 'habits' ? colors.accentSage : colors.textMuted }]}>
            🗓️ Habits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubTab('hobbies')}
          style={[styles.subTabBtn, subTab === 'hobbies' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subTab === 'hobbies' ? colors.accentAmber : colors.textMuted }]}>
            🎨 Hobbies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubTab('lifestyle')}
          style={[styles.subTabBtn, subTab === 'lifestyle' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subTab === 'lifestyle' ? colors.accentBlue : colors.textMuted }]}>
            💡 Lifestyle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast Feedback */}
      {toastMessage && (
        <View style={[styles.toastBox, { backgroundColor: colors.accentTealSoft, borderColor: colors.accentTeal }]}>
          <Text style={[styles.toastText, { color: colors.textPrimary }]}>✨ {toastMessage}</Text>
        </View>
      )}

      {/* SUB-TAB 1: WELL-BEING */}
      {subTab === 'wellbeing' && (
        <View style={{ gap: 14 }}>
          {/* Period Toggle */}
          <View style={styles.periodRow}>
            <Text style={[styles.sectionHeading, { color: colors.textLight }]}>{t('trendInsights')}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => setTrendDays(7)}
                style={[styles.periodBtn, trendDays === 7 && { backgroundColor: colors.accentTealSoft }]}
              >
                <Text style={{ fontSize: 11, color: trendDays === 7 ? colors.accentTeal : colors.textMuted }}>7 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTrendDays(30)}
                style={[styles.periodBtn, trendDays === 30 && { backgroundColor: colors.accentTealSoft }]}
              >
                <Text style={{ fontSize: 11, color: trendDays === 30 ? colors.accentTeal : colors.textMuted }}>30 Days</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Qualitative Rhythm Observation */}
          <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderLeftColor: colors.accentTeal }]}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Rhythm Observation</Text>
            <Text style={[styles.summaryContent, { color: colors.textPrimary }]}>
              {isTe
                ? 'మీ సమాధానాలు మీ సాధారణ వ్యక్తిగత అలవాట్లకు సమీపంలో ఉన్నాయి.'
                : 'Your check-ins are hovering near your established personal baseline.'}
            </Text>
          </View>

          {/* Baseline Reference Metrics */}
          {baseline && (
            <View style={[styles.metricsGrid, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Typical Sleep</Text>
                <Text style={[styles.metricVal, { color: colors.accentBlue }]}>{baseline.typicalSleep}h</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Typical Stress</Text>
                <Text style={[styles.metricVal, { color: colors.accentRose }]}>{baseline.typicalStress}/10</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Typical Energy</Text>
                <Text style={[styles.metricVal, { color: colors.accentSage }]}>{baseline.typicalEnergy}/10</Text>
              </View>
            </View>
          )}

          {/* Non-Diagnostic Disclaimer */}
          <View style={[styles.noticeCard, { backgroundColor: 'rgba(255,255,255,0.03)' }]}>
            <Text style={[styles.noticeText, { color: colors.textMuted }]}>
              ℹ️ {t('nonDiagnosticNotice')}
            </Text>
          </View>
        </View>
      )}

      {/* SUB-TAB 2: HABITS */}
      {subTab === 'habits' && (
        <View style={{ gap: 12 }}>
          <View style={styles.periodRow}>
            <Text style={[styles.sectionHeading, { color: colors.textLight }]}>{t('habitsTitle')}</Text>
            <TouchableOpacity onPress={() => setIsAddingHabit(!isAddingHabit)} style={styles.addBtn}>
              <Text style={{ color: colors.accentSage, fontSize: 13, fontWeight: '700' }}>+ Add Habit</Text>
            </TouchableOpacity>
          </View>

          {isAddingHabit && (
            <View style={[styles.addForm, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <TextInput
                placeholder="Enter small habit (e.g. 5m daylight breathing)"
                placeholderTextColor={colors.textMuted}
                value={newHabitTitle}
                onChangeText={setNewHabitTitle}
                style={[styles.formInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
              />
              <TouchableOpacity onPress={handleCreateHabit} style={[styles.saveBtn, { backgroundColor: colors.accentSage }]}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Save Habit</Text>
              </TouchableOpacity>
            </View>
          )}

          {habits.map((habit) => (
            <View
              key={habit.id}
              style={[
                styles.habitCard,
                {
                  backgroundColor: habit.completedToday ? 'rgba(16, 185, 129, 0.08)' : colors.bgCard,
                  borderColor: habit.completedToday ? colors.accentSage : colors.borderSubtle,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleToggleHabit(habit.id)}
                style={[
                  styles.checkCircle,
                  {
                    backgroundColor: habit.completedToday ? colors.accentSage : 'transparent',
                    borderColor: habit.completedToday ? colors.accentSage : colors.textMuted,
                  },
                ]}
              >
                {habit.completedToday && <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>}
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.habitTitle,
                    {
                      color: habit.completedToday ? colors.textMuted : colors.textPrimary,
                      textDecorationLine: habit.completedToday ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {isTe && habit.titleTe ? habit.titleTe : habit.title}
                </Text>
                {habit.streak > 0 && (
                  <Text style={{ color: colors.accentAmber, fontSize: 11, marginTop: 2 }}>
                    🔥 {habit.streak} {t('habitStreakLabel')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* SUB-TAB 3: HOBBIES */}
      {subTab === 'hobbies' && (
        <View style={{ gap: 12 }}>
          <View style={styles.periodRow}>
            <Text style={[styles.sectionHeading, { color: colors.textLight }]}>{t('hobbiesTitle')}</Text>
            <TouchableOpacity onPress={() => setIsAddingHobby(!isAddingHobby)} style={styles.addBtn}>
              <Text style={{ color: colors.accentAmber, fontSize: 13, fontWeight: '700' }}>+ Add Hobby</Text>
            </TouchableOpacity>
          </View>

          {isAddingHobby && (
            <View style={[styles.addForm, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <TextInput
                placeholder="Enter hobby name (e.g. Balcony flower sketching)"
                placeholderTextColor={colors.textMuted}
                value={newHobbyName}
                onChangeText={setNewHobbyName}
                style={[styles.formInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
              />
              <TouchableOpacity onPress={handleCreateHobby} style={[styles.saveBtn, { backgroundColor: colors.accentAmber }]}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Save Hobby</Text>
              </TouchableOpacity>
            </View>
          )}

          {hobbies.map((hobby) => (
            <View key={hobby.id} style={[styles.hobbyCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: colors.accentTeal, fontWeight: '700' }}>{hobby.category}</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>{hobby.totalMinutesLogged} {t('hobbyTimeLogged')}</Text>
              </View>

              <Text style={[styles.hobbyName, { color: colors.textPrimary }]}>
                {isTe && hobby.nameTe ? hobby.nameTe : hobby.name}
              </Text>

              <View style={[styles.goalBox, { backgroundColor: 'rgba(255,255,255,0.03)' }]}>
                <Text style={{ fontSize: 12, color: colors.textLight }}>
                  🎯 <Text style={{ fontWeight: '700', color: colors.accentAmber }}>Goal: </Text>
                  {isTe && hobby.currentGoalTe ? hobby.currentGoalTe : hobby.currentGoal}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* SUB-TAB 4: LIFESTYLE */}
      {subTab === 'lifestyle' && (
        <View style={{ gap: 12 }}>
          <Text style={[styles.sectionHeading, { color: colors.textLight }]}>{t('lifestyleTitle')}</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>{t('lifestyleSubtitle')}</Text>

          <View style={[styles.lifestyleCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>🚶</Text>
            <Text style={[styles.lsTitle, { color: colors.textPrimary }]}>5-Minute Daylight Walk</Text>
            <Text style={[styles.lsDesc, { color: colors.textSecondary }]}>
              Step outside or stand near an open window for natural sunlight. No rush, just breathing fresh air.
            </Text>
            <Text style={{ fontSize: 11, color: colors.accentTeal, fontWeight: '700', marginTop: 8 }}>⏱️ 5 mins · Gentle</Text>
          </View>

          <View style={[styles.lifestyleCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>🎧</Text>
            <Text style={[styles.lsTitle, { color: colors.textPrimary }]}>Calming Acoustic Sounds</Text>
            <Text style={[styles.lsDesc, { color: colors.textSecondary }]}>
              Rest your eyes and play an acoustic or nature soundscape without having to do anything else.
            </Text>
            <Text style={{ fontSize: 11, color: colors.accentTeal, fontWeight: '700', marginTop: 8 }}>⏱️ 10 mins · Restful</Text>
          </View>
        </View>
      )}
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
  subTabsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  subTabBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toastBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
  },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summaryCard: {
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryContent: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  noticeCard: {
    padding: 12,
    borderRadius: 10,
  },
  noticeText: {
    fontSize: 11,
    lineHeight: 16,
  },
  addBtn: {
    padding: 4,
  },
  addForm: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
  },
  saveBtn: {
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  hobbyCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  hobbyName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  goalBox: {
    padding: 10,
    borderRadius: 8,
  },
  lifestyleCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  lsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  lsDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
});
