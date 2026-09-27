// SAHARA Permission Center Modal (React Native TypeScript)
// Granular inspection and testing of native permissions: Camera, Mic, Notifications, Location

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { NativePermissionService } from '../services/nativePermissions';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function PermissionCenterModal({ visible, onClose }: Props) {
  const { t, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const [notifState, setNotifState] = useState<boolean>(false);
  const [micState, setMicState] = useState<boolean>(false);
  const [camState, setCamState] = useState<boolean>(false);
  const [locState, setLocState] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      // test states
      NativePermissionService.requestNotificationPermission().then(setNotifState);
    }
  }, [visible]);

  if (!visible) return null;

  const handleTestNotif = async () => {
    const res = await NativePermissionService.requestNotificationPermission();
    setNotifState(res);
    if (res) {
      NativePermissionService.sendSupportiveNotification(
        'SAHARA Notification Check',
        'Discreet privacy-safe notification test confirmed.'
      );
    }
  };

  const handleTestMic = async () => {
    const res = await NativePermissionService.requestMicrophonePermission();
    setMicState(res);
  };

  const handleTestCam = async () => {
    const res = await NativePermissionService.requestCameraPermission();
    setCamState(res);
  };

  const handleTestLoc = async () => {
    const res = await NativePermissionService.requestLocationPermission();
    setLocState(res);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[styles.modalSheet, { backgroundColor: colors.bgSecondary }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('settingPrivacyCenter')}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>Granular native device permissions</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: colors.textMuted, fontSize: 18, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            <View style={[styles.privacyBox, { backgroundColor: colors.accentTealSoft, borderColor: colors.accentTeal }]}>
              <Text style={{ fontSize: 12, color: colors.textLight, lineHeight: 17 }}>
                🔒 <Text style={{ fontWeight: '700' }}>Privacy Guarantee:</Text> SAHARA operates fully even if optional permissions are denied. Permissions are never requested without a direct user action.
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              {/* Notifications */}
              <View style={[styles.permCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.permTitle, { color: colors.textPrimary }]}>🔔 Supportive Notifications</Text>
                  <Text style={{ color: notifState ? colors.accentSage : colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                    {notifState ? '✓ Allowed' : 'Prompt'}
                  </Text>
                </View>
                <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
                  Discreet habit reminders and confirmed counselor appointment alerts. Never shows sensitive phrases on lock screen.
                </Text>
                <TouchableOpacity onPress={handleTestNotif} style={[styles.enableBtn, { backgroundColor: notifState ? colors.accentSageSoft : colors.bgSecondary, borderColor: colors.borderSubtle }]}>
                  <Text style={{ color: notifState ? colors.accentSage : colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
                    {notifState ? 'Test Notification Dispatch' : 'Enable Notifications'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Microphone */}
              <View style={[styles.permCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.permTitle, { color: colors.textPrimary }]}>🎤 Microphone (Voice Notes)</Text>
                  <Text style={{ color: micState ? colors.accentSage : colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                    {micState ? '✓ Allowed' : 'Prompt'}
                  </Text>
                </View>
                <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
                  Used strictly when you tap the microphone button during check-ins. Never records in the background.
                </Text>
                <TouchableOpacity onPress={handleTestMic} style={[styles.enableBtn, { backgroundColor: micState ? colors.accentSageSoft : colors.bgSecondary, borderColor: colors.borderSubtle }]}>
                  <Text style={{ color: micState ? colors.accentSage : colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
                    {micState ? 'Microphone Verified' : 'Check Microphone Access'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location */}
              <View style={[styles.permCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.permTitle, { color: colors.textPrimary }]}>📍 Temporary Live Location</Text>
                  <Text style={{ color: locState ? colors.accentSage : colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                    {locState ? '✓ Allowed' : 'Prompt'}
                  </Text>
                </View>
                <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
                  Activated ONLY when you tap 🆘 Emergency Live Location. You can turn this off at any time.
                </Text>
                <TouchableOpacity onPress={handleTestLoc} style={[styles.enableBtn, { backgroundColor: locState ? colors.accentSageSoft : colors.bgSecondary, borderColor: colors.borderSubtle }]}>
                  <Text style={{ color: locState ? colors.accentSage : colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
                    {locState ? 'Location Verified' : 'Verify Location Permissions'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Camera */}
              <View style={[styles.permCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={[styles.permTitle, { color: colors.textPrimary }]}>📹 Tele-Counseling Video</Text>
                  <Text style={{ color: camState ? colors.accentSage : colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                    {camState ? '✓ Allowed' : 'Prompt'}
                  </Text>
                </View>
                <Text style={[styles.permDesc, { color: colors.textSecondary }]}>
                  Used only when you join an encrypted tele-counseling video call with your assigned counselor.
                </Text>
                <TouchableOpacity onPress={handleTestCam} style={[styles.enableBtn, { backgroundColor: camState ? colors.accentSageSoft : colors.bgSecondary, borderColor: colors.borderSubtle }]}>
                  <Text style={{ color: camState ? colors.accentSage : colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
                    {camState ? 'Camera Verified' : 'Check Camera Access'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={[styles.closeModalBtn, { backgroundColor: colors.accentTeal }]}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{t('close')}</Text>
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
  privacyBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  permCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  permTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  permDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  enableBtn: {
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
});
