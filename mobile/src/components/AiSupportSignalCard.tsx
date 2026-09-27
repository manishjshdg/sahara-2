// SAHARA AI Support Signal Card (React Native TypeScript)
// Non-diagnostic baseline change indicator with explainable contributing factors

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { AiSupportSignal } from '../types';

interface Props {
  signal: AiSupportSignal;
  onAction: (action: string) => void;
  onDismiss: (id: string) => void;
}

export function AiSupportSignalCard({ signal, onAction, onDismiss }: Props) {
  const { lang, t, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const isTe = lang === 'te';
  const headline = isTe && signal.headlineTe ? signal.headlineTe : signal.headline;
  const isImmediate = signal.signalLevel === 'immediate_attention';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isImmediate ? 'rgba(244, 63, 94, 0.12)' : colors.bgCard,
          borderColor: isImmediate ? colors.accentRose : colors.accentAmber,
        },
      ]}
    >
      {/* Badge Header */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isImmediate ? colors.accentRoseSoft : colors.accentAmberSoft },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isImmediate ? colors.accentRose : colors.accentAmber },
            ]}
          >
            {isImmediate ? '🚨 IMMEDIATE SAFETY MODE' : `✨ ${t('aiSupportSignalBadge')}`}
          </Text>
        </View>

        <Text style={[styles.dateText, { color: colors.textMuted }]}>
          {new Date(signal.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </Text>
      </View>

      {/* Headline */}
      <Text style={[styles.headline, { color: colors.textPrimary }]}>{headline}</Text>

      {/* Disclaimer */}
      <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
        {t('aiSupportSignalDisclaimer')}
      </Text>

      {/* Contributing Indicators */}
      {signal.contributingIndicators && signal.contributingIndicators.length > 0 && (
        <View style={styles.indicatorsBox}>
          <Text style={[styles.indicatorsHeader, { color: colors.textMuted }]}>
            {t('contributingIndicatorsHeader')}
          </Text>

          {signal.contributingIndicators.map((item, idx) => (
            <View key={idx} style={[styles.indicatorItem, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
              <View
                style={[
                  styles.bullet,
                  { backgroundColor: isImmediate ? colors.accentRose : colors.accentAmber },
                ]}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.factorText, { color: colors.textPrimary }]}>
                  {isTe && item.factorTe ? item.factorTe : item.factor}
                </Text>
                {item.detail ? (
                  <Text style={[styles.factorDetail, { color: colors.textMuted }]}>
                    {item.detail}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Suggested Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => onAction('book_counselor')}
          style={[styles.actionBtn, { backgroundColor: colors.accentTealSoft, borderColor: colors.accentTeal }]}
        >
          <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
            🩺 {t('btnTalkCounselor')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onAction('book_social_worker')}
          style={[styles.actionBtn, { backgroundColor: 'rgba(56, 189, 248, 0.12)', borderColor: colors.accentBlue }]}
        >
          <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
            🤝 {t('btnTalkSocialWorker')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onAction('contact_trusted')}
          style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: colors.borderSubtle }]}
        >
          <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
            👥 {t('btnContactTrusted')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onAction('view_resources')}
          style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: colors.borderSubtle }]}
        >
          <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
            📚 {t('btnViewResources')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dismiss Button */}
      <TouchableOpacity
        onPress={() => onDismiss(signal.id)}
        style={styles.dismissBtn}
      >
        <Text style={[styles.dismissText, { color: colors.textMuted }]}>
          ✓ {t('btnDismissSignal')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 11,
  },
  headline: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  indicatorsBox: {
    marginBottom: 14,
    gap: 6,
  },
  indicatorsHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  indicatorItem: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  factorText: {
    fontSize: 13,
    fontWeight: '700',
  },
  factorDetail: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dismissBtn: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  dismissText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
