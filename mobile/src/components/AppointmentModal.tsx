// SAHARA Mobile Appointment Booking Modal (React Native TypeScript)
// Direct scheduling with counselors and social workers, with camera permission check for tele-counseling.

import React, { useState, useEffect } from 'react';
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
import { mobileApi } from '../services/api';
import { Professional, Appointment } from '../types';
import { NativePermissionService } from '../services/nativePermissions';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AppointmentModal({ visible, onClose }: Props) {
  const { lang, t, user, refreshData, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const isTe = lang === 'te';

  useEffect(() => {
    if (visible) {
      mobileApi.getProfessionals().then(setProfessionals);
      mobileApi.getAppointments().then(setAppointments);
    }
  }, [visible]);

  if (!visible) return null;

  const handleBook = async () => {
    if (!selectedProf || !selectedSlot) return;
    try {
      await mobileApi.bookAppointment({
        userId: user.id,
        professionalId: selectedProf.id,
        professionalName: selectedProf.name,
        notes: `Consultation booked for ${selectedSlot}`
      });
      setBookingSuccess(true);
      await refreshData();
      const updated = await mobileApi.getAppointments();
      setAppointments(updated);
      NativePermissionService.sendSupportiveNotification(
        'Session Confirmed',
        `Your session with ${selectedProf.name} is confirmed.`
      );
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedProf(null);
        setSelectedSlot('');
      }, 2500);
    } catch (e) {
      console.warn('Booking error:', e);
    }
  };

  const handleJoinVideoSession = async (joinUrl: string) => {
    const hasCam = await NativePermissionService.requestCameraPermission();
    if (!hasCam) {
      alert('Camera access needed for face-to-face tele-counseling video.');
    }
    Linking.openURL(joinUrl).catch(() => {});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[styles.modalSheet, { backgroundColor: colors.bgSecondary }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{t('appointmentTitle')}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>Licensed trauma counselors & social workers</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: colors.textMuted, fontSize: 18, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            {bookingSuccess && (
              <View style={[styles.successBanner, { backgroundColor: colors.accentSageSoft, borderColor: colors.accentSage }]}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.accentSage }}>
                  ✓ Session Booked Confirmed!
                </Text>
                <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>
                  A discreet private reminder has been configured on your device.
                </Text>
              </View>
            )}

            {/* Confirmed Sessions */}
            {appointments.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>Confirmed Sessions:</Text>
                {appointments.map((apt) => (
                  <View key={apt.id} style={[styles.aptCard, { backgroundColor: colors.bgCard, borderLeftColor: colors.accentSage }]}>
                    <Text style={[styles.aptProf, { color: colors.textPrimary }]}>{apt.professionalName}</Text>
                    <Text style={{ fontSize: 12, color: colors.accentTeal, marginTop: 2 }}>
                      📅 {new Date(apt.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleJoinVideoSession(apt.joinUrl || 'https://sahara.care/session/sec-safe')}
                      style={[styles.joinBtn, { backgroundColor: colors.accentTeal }]}
                    >
                      <Text style={styles.joinBtnText}>📹 {t('btnJoinSession')}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Select Slot Form */}
            {selectedProf ? (
              <View style={[styles.bookingBox, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>{selectedProf.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedProf(null)}>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>Change</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 12, color: colors.accentTeal, marginBottom: 12 }}>
                  {isTe && selectedProf.titleTe ? selectedProf.titleTe : selectedProf.title}
                </Text>

                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textLight, marginBottom: 8 }}>
                  Choose consultation slot:
                </Text>

                <View style={{ gap: 6, marginBottom: 14 }}>
                  {selectedProf.availableSlots.map((slot, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedSlot(slot)}
                      style={[
                        styles.slotBtn,
                        {
                          backgroundColor: selectedSlot === slot ? colors.accentTealSoft : 'rgba(255,255,255,0.03)',
                          borderColor: selectedSlot === slot ? colors.accentTeal : colors.borderSubtle,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 13, color: colors.textPrimary, fontWeight: selectedSlot === slot ? '700' : '400' }}>
                        🕒 {slot}
                      </Text>
                      {selectedSlot === slot && <Text style={{ color: colors.accentTeal, fontWeight: '700' }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleBook}
                  disabled={!selectedSlot}
                  style={[styles.confirmBtn, { backgroundColor: colors.accentTeal, opacity: selectedSlot ? 1 : 0.5 }]}
                >
                  <Text style={styles.confirmBtnText}>Confirm Confidential Session</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>Available Professionals:</Text>
                {professionals.map((prof) => (
                  <View key={prof.id} style={[styles.profCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                    <Text style={{ fontSize: 11, color: colors.accentTeal, fontWeight: '700' }}>
                      {prof.role === 'counselor' ? 'Trauma Counselor' : 'Social Worker & Legal Aid'}
                    </Text>
                    <Text style={[styles.profName, { color: colors.textPrimary }]}>{prof.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>
                      {isTe && prof.titleTe ? prof.titleTe : prof.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginBottom: 10 }}>
                      {isTe && prof.bioTe ? prof.bioTe : prof.bio}
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSelectedProf(prof)}
                      style={[styles.selectProfBtn, { backgroundColor: colors.accentTeal }]}
                    >
                      <Text style={styles.selectProfBtnText}>View Availability & Book</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  successBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  aptCard: {
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  aptProf: {
    fontSize: 15,
    fontWeight: '700',
  },
  joinBtn: {
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  joinBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  bookingBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  slotBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  confirmBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  profCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  profName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  selectProfBtn: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectProfBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});
