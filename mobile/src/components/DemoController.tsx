// SAHARA Mobile Hackathon Demo Controller (React Native TypeScript)
// 1-Click step-through of the 6-day baseline deviation and counselor connection story

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

interface Props {
  onOpenCheckIn: () => void;
  onOpenAppointment: () => void;
}

export function DemoController({ onOpenCheckIn, onOpenAppointment }: Props) {
  const { setActiveTab, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const [activeDay, setActiveDay] = useState(6);
  const [demoStory, setDemoStory] = useState('Day 6: Significant change from personal baseline detected. AI Support Signal generated.');

  const handleSelectDay = (day: number) => {
    setActiveDay(day);
    if (day === 1) {
      setDemoStory('Day 1: Survivor rhythm consistent with healthy baseline (Sleep 8h, Stress 3/10).');
    } else if (day === 3) {
      setDemoStory('Day 3: Mild tension spike. Within personal variance threshold.');
    } else if (day === 4) {
      setDemoStory('Day 4: Sleep begins dropping to 6h. Adaptive check-in questions gently activate.');
    } else if (day === 5) {
      setDemoStory('Day 5: Sleep drops to 4.5h, Social connection drops to 3.5/10.');
    } else if (day === 6) {
      setDemoStory('Day 6: Meaningful deviation across sleep, stress, and functioning. AI Support Signal surfaces.');
      setActiveTab('home');
    } else if (day === 7) {
      setDemoStory('Day 7: Reconnected with counselor. Habit rhythm begins gentle stabilization.');
      setActiveTab('recovery');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgSecondary, borderColor: colors.accentTeal }]}>
      <View style={styles.topRow}>
        <Text style={[styles.headerText, { color: colors.accentTeal }]}>
          ⚡ HACKATHON DEMO CONTROLS
        </Text>
        <TouchableOpacity onPress={() => handleSelectDay(6)}>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.storyText, { color: colors.textLight }]}>
        {demoStory}
      </Text>

      <View style={styles.daysRow}>
        {[1, 3, 4, 5, 6, 7].map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => handleSelectDay(d)}
            style={[
              styles.dayBtn,
              {
                backgroundColor: activeDay === d ? colors.accentTeal : 'rgba(255,255,255,0.06)',
              },
            ]}
          >
            <Text
              style={[
                styles.dayBtnText,
                { color: activeDay === d ? '#ffffff' : colors.textMuted },
              ]}
            >
              Day {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  storyText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayBtn: {
    flex: 1,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
