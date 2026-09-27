// SAHARA Emergency Modal (React Native TypeScript)
// Immediate crisis reassurance, verified 1-tap emergency calling,
// and native live location sharing with Trusted Circle via Expo Location.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Linking
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function EmergencyModal({ visible, onClose }: Props) {
  const {
    t,
    lang,
    isLocationSharing,
    activeLocationCoords,
    toggleLocationSharing,
    highContrast
  } = useApp();

  const colors = highContrast ? theme.highContrast : theme.colors;
  const [confirmLocation, setConfirmLocation] = useState(false);

  if (!visible) return null;

  const helplines = [
    { name: '112 National Emergency Dispatch', number: '112', color: colors.accentRose, badge: 'Police & Medical' },
    { name: 'Tele-MANAS (Govt 24/7 Mental Health)', number: '14416', color: colors.accentTeal, badge: 'Free & Confidential' },
    { name: 'KIRAN National Helpline', number: '18005990019', color: colors.accentSage, badge: 'Toll-Free Crisis' },
    { name: 'National Commission for Women', number: '7827170170', color: colors.accentPurple, badge: 'Women Protection' }
  ];

  const handleDial = (num: string) => {
    Linking.openURL(`tel:${num}`).catch((e: unknown) => console.warn('Dial error:', e));
  };

  const handleStartLocation = async () => {
    await toggleLocationSharing();
    setConfirmLocation(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[styles.modalSheet, { backgroundColor: colors.bgSecondary, borderTopColor: colors.accentRose }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.iconBox, { backgroundColor: colors.accentRoseSoft }]}>
                <Text style={{ fontSize: 22 }}>🆘</Text>
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{t('emergencyDrawerTitle')}</Text>
                <Text style={{ fontSize: 12, color: colors.accentRose }}>Immediate safety & human care</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: colors.textMuted, fontSize: 18, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            {/* Reassurance Banner */}
            <View style={[styles.reassuranceCard, { backgroundColor: colors.accentRoseSoft, borderColor: colors.accentRose }]}>
              <Text style={[styles.reassuranceTitle, { color: colors.textPrimary }]}>
                {t('emergencyReassurance')}
              </Text>
              <Text style={[styles.reassuranceSub, { color: colors.textLight }]}>
                {t('emergencySubtitle')}
              </Text>
            </View>

            {/* Live Location Sharing Active Banner or Trigger */}
            {isLocationSharing ? (
              <View style={[styles.locationActiveCard, { backgroundColor: colors.accentRoseSoft, borderColor: colors.accentRose }]}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.accentRose, marginBottom: 4 }}>
                  📍 {t('locationSharingActiveBanner')}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textLight, marginBottom: 10 }}>
                  {t('locationSharingActiveDesc')}
                  {activeLocationCoords?.address ? `\nNear: ${activeLocationCoords.address}` : ''}
                </Text>
                <TouchableOpacity
                  onPress={toggleLocationSharing}
                  style={[styles.stopLocationBtn, { backgroundColor: colors.accentRose }]}
                >
                  <Text style={styles.stopLocationText}>{t('btnStopLocationSharing')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.locationCard, { backgroundColor: colors.bgCard, borderColor: colors.accentAmber }]}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 }}>
                  📍 {t('btnShareLiveLocation')}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>
                  Temporarily share GPS coordinates only with authorized contacts in your Trusted Circle. Can be stopped anytime.
                </Text>

                {confirmLocation ? (
                  <View style={{ gap: 8 }}>
                    <TouchableOpacity onPress={handleStartLocation} style={[styles.confirmBtn, { backgroundColor: colors.accentRose }]}>
                      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Confirm & Share Live GPS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setConfirmLocation(false)} style={{ alignItems: 'center', padding: 6 }}>
                      <Text style={{ color: colors.textMuted, fontSize: 12 }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setConfirmLocation(true)} style={[styles.startLocationBtn, { backgroundColor: colors.bgSecondary, borderColor: colors.borderSubtle }]}>
                    <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 13 }}>Activate Location Sharing</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Verified Emergency Helplines (Tap to Call) */}
            <Text style={[styles.helplineHeader, { color: colors.textMuted }]}>
              Verified Emergency Lines (Tap to Dial):
            </Text>

            <View style={{ gap: 8 }}>
              {helplines.map((hl, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleDial(hl.number)}
                  style={[styles.helplineCard, { backgroundColor: colors.bgCard, borderLeftColor: hl.color }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: hl.color, textTransform: 'uppercase' }}>
                      {hl.badge}
                    </Text>
                    <Text style={[styles.hlName, { color: colors.textPrimary }]}>{hl.name}</Text>
                  </View>
                  <View style={[styles.callBadge, { backgroundColor: colors.bgSecondary }]}>
                    <Text style={{ color: hl.color, fontWeight: '800', fontSize: 13 }}>📞 {hl.number}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={onClose} style={[styles.closeModalBtn, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <Text style={{ color: colors.textLight, fontWeight: '600' }}>{t('close')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 4,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  reassuranceCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  reassuranceTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  reassuranceSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  locationActiveCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  stopLocationBtn: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopLocationText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  locationCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  startLocationBtn: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helplineHeader: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  hlName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  callBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  closeModalBtn: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
});
