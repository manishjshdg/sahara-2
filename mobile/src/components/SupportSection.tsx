// SAHARA Mobile Support Section (React Native TypeScript)
// Counselors, Social Workers, 24/7 Helplines with native phone dialing,
// Trusted Circle, and Rights & Victim Relief Schemes.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { mobileApi } from '../services/api';
import { TrustedContact, ResourceItem, HelplineItem } from '../types';

interface Props {
  onOpenAppointment: () => void;
}

export function SupportSection({ onOpenAppointment }: Props) {
  const { lang, t, setIsEmergencyOpen, user, highContrast } = useApp();
  const colors = highContrast ? theme.highContrast : theme.colors;

  const [subSection, setSubSection] = useState<'hub' | 'circle' | 'resources'>('hub');
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [helplines, setHelplines] = useState<HelplineItem[]>([]);

  // Add Contact State
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRel, setContactRel] = useState('Friend');

  const isTe = lang === 'te';

  useEffect(() => {
    mobileApi.getTrustedContacts().then(setTrustedContacts);
    mobileApi.getResources().then(setResources);
    mobileApi.getHelplines().then(setHelplines);
  }, []);

  const handleDial = (number: string) => {
    Linking.openURL(`tel:${number}`).catch((e: unknown) => console.warn('Dial error:', e));
  };

  const handleAddContact = () => {
    if (!contactName || !contactPhone) return;
    const newContact: TrustedContact = {
      id: `tc_${Date.now()}`,
      userId: user.id,
      name: contactName,
      relationship: contactRel,
      phone: contactPhone,
      canViewStatus: true,
      canReceiveEmergencyAlerts: true,
      canReceiveLocation: true
    };
    setTrustedContacts(prev => [...prev, newContact]);
    setContactName('');
    setContactPhone('');
    setIsAddingContact(false);
  };

  const handleDeleteContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={{ marginBottom: 14 }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('supportTitle')}
        </Text>
        <Text style={[styles.subtext, { color: colors.textMuted }]}>
          {t('supportSubtext')}
        </Text>
      </View>

      {/* Sub Tabs */}
      <View style={[styles.subTabsRow, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
        <TouchableOpacity
          onPress={() => setSubSection('hub')}
          style={[styles.subTabBtn, subSection === 'hub' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subSection === 'hub' ? colors.accentTeal : colors.textMuted }]}>
            🤝 Support Hub
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubSection('circle')}
          style={[styles.subTabBtn, subSection === 'circle' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subSection === 'circle' ? colors.accentSage : colors.textMuted }]}>
            👥 Trusted Circle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSubSection('resources')}
          style={[styles.subTabBtn, subSection === 'resources' && { backgroundColor: colors.bgCard }]}
        >
          <Text style={[styles.subTabBtnText, { color: subSection === 'resources' ? colors.accentBlue : colors.textMuted }]}>
            📚 Rights & Schemes
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUB-SECTION 1: HUB */}
      {subSection === 'hub' && (
        <View style={{ gap: 12 }}>
          {/* Counselor Card */}
          <View style={[styles.supportCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <View style={[styles.iconBox, { backgroundColor: colors.accentTealSoft }]}>
                <Text style={{ fontSize: 22 }}>🩺</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('secCounselor')}</Text>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{t('secCounselorDesc')}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onOpenAppointment} style={[styles.actionBtn, { backgroundColor: colors.accentTeal }]}>
              <Text style={styles.actionBtnText}>📅 {t('btnBookAppointment')} (Counselor)</Text>
            </TouchableOpacity>
          </View>

          {/* Social Worker Card */}
          <View style={[styles.supportCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Text style={{ fontSize: 22 }}>🤝</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('secSocialWorker')}</Text>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{t('secSocialWorkerDesc')}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onOpenAppointment} style={[styles.actionBtn, { backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.borderSubtle }]}>
              <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>Connect with Social Worker</Text>
            </TouchableOpacity>
          </View>

          {/* 24/7 Helplines Preview */}
          <View style={[styles.supportCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle, borderLeftColor: colors.accentRose, borderLeftWidth: 4 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{t('secHelplines')}</Text>
                <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{t('secHelplinesDesc')}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsEmergencyOpen(true)}>
                <Text style={{ color: colors.accentRose, fontWeight: '700', fontSize: 13 }}>View 🆘</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 8 }}>
              {helplines.map((hl) => (
                <TouchableOpacity
                  key={hl.id}
                  onPress={() => handleDial(hl.number)}
                  style={[styles.helplineRow, { backgroundColor: 'rgba(255,255,255,0.03)' }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPrimary }}>{hl.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted }}>{hl.hours}</Text>
                  </View>
                  <View style={[styles.dialBadge, { backgroundColor: colors.accentRoseSoft }]}>
                    <Text style={{ color: colors.accentRose, fontWeight: '800', fontSize: 13 }}>📞 {hl.number}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* SUB-SECTION 2: TRUSTED CIRCLE */}
      {subSection === 'circle' && (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.sectionHeading, { color: colors.textLight }]}>{t('secTrustedCircle')}</Text>
            <TouchableOpacity onPress={() => setIsAddingContact(!isAddingContact)}>
              <Text style={{ color: colors.accentSage, fontWeight: '700', fontSize: 13 }}>+ Add Person</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.privacyNotice, { backgroundColor: colors.accentTealSoft, borderColor: colors.accentTeal }]}>
            <Text style={{ fontSize: 12, color: colors.textLight, lineHeight: 17 }}>
              🔒 <Text style={{ fontWeight: '700' }}>Consent Guarantee:</Text> SAHARA will never automatically message or call your trusted contacts without your explicit action.
            </Text>
          </View>

          {isAddingContact && (
            <View style={[styles.addForm, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <TextInput
                placeholder="Contact Name (e.g. Kavita Rao)"
                placeholderTextColor={colors.textMuted}
                value={contactName}
                onChangeText={setContactName}
                style={[styles.formInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
              />
              <TextInput
                placeholder="Phone Number (+91 ...)"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={contactPhone}
                onChangeText={setContactPhone}
                style={[styles.formInput, { color: colors.textPrimary, borderColor: colors.borderSubtle }]}
              />
              <TouchableOpacity onPress={handleAddContact} style={[styles.actionBtn, { backgroundColor: colors.accentSage }]}>
                <Text style={styles.actionBtnText}>Save Contact</Text>
              </TouchableOpacity>
            </View>
          )}

          {trustedContacts.map((contact) => (
            <View key={contact.id} style={[styles.contactCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <View style={[styles.relBadge, { backgroundColor: colors.accentSageSoft }]}>
                    <Text style={{ color: colors.accentSage, fontSize: 10, fontWeight: '700' }}>{contact.relationship}</Text>
                  </View>
                  <Text style={[styles.contactName, { color: colors.textPrimary }]}>{contact.name}</Text>
                  <TouchableOpacity onPress={() => handleDial(contact.phone)}>
                    <Text style={{ color: colors.accentTeal, fontSize: 13, marginTop: 2 }}>📞 {contact.phone}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => handleDeleteContact(contact.id)} style={{ padding: 4 }}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>Remove</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                {contact.canReceiveLocation && (
                  <Text style={{ fontSize: 10, color: colors.textMuted, backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    📍 Live Location
                  </Text>
                )}
                {contact.canReceiveEmergencyAlerts && (
                  <Text style={{ fontSize: 10, color: colors.textMuted, backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    🚨 Emergency Alerts
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* SUB-SECTION 3: RIGHTS & SCHEMES */}
      {subSection === 'resources' && (
        <View style={{ gap: 12 }}>
          <Text style={[styles.sectionHeading, { color: colors.textLight }]}>Victim Relief & Statutory Rights</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>
            Official government compensation, legal aid, and recovery provisions
          </Text>

          {resources.map((res) => (
            <View key={res.id} style={[styles.resourceCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: colors.accentBlue, fontWeight: '700' }}>{res.category}</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted }}>Verified: {res.verifiedDate}</Text>
              </View>

              <Text style={[styles.resTitle, { color: colors.textPrimary }]}>
                {isTe && res.titleTe ? res.titleTe : res.title}
              </Text>
              <Text style={{ fontSize: 11, color: colors.accentTeal, marginBottom: 6 }}>🏛️ {res.organization}</Text>
              <Text style={[styles.resDesc, { color: colors.textSecondary }]}>
                {isTe && res.descriptionTe ? res.descriptionTe : res.description}
              </Text>

              {res.contact && (
                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: colors.accentAmber, fontWeight: '700' }}>📞 {res.contact}</Text>
                  {res.website && (
                    <TouchableOpacity onPress={() => Linking.openURL(res.website!)}>
                      <Text style={{ fontSize: 12, color: colors.accentBlue, textDecorationLine: 'underline' }}>Official Site</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
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
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
  },
  supportCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  actionBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
  },
  dialBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  privacyNotice: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
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
  contactCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  relBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
  },
  resourceCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  resTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  resDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
});
