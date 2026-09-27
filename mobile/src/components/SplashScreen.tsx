// SAHARA Mobile Splash Screen (React Native TypeScript)

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { t, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onFinish}
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
    >
      <View style={[styles.logoBadge, { backgroundColor: colors.accentTeal }]}>
        <Text style={styles.logoBadgeText}>S</Text>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t('appName')}
      </Text>

      <Text style={[styles.tagline, { color: colors.accentTeal }]}>
        {t('tagline')}
      </Text>

      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {t('splashSubtitle')}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.dot, { backgroundColor: colors.accentTeal }]} />
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          AI-Assisted · Human-Led Ecosystem
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoBadgeText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
