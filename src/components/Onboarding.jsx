// SAHARA 5-Step Trauma-Informed Onboarding Flow
// Covers Welcome, Pillars, Privacy charter, Language selection (English default / Telugu),
// and Contextual Notification request.

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PermissionManager, PERMISSION_TYPES } from '../services/permissionManager';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Languages,
  Bell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export function Onboarding({ onComplete }) {
  const { lang, changeLanguage, t } = useApp();
  const [step, setStep] = useState(1);
  const [notifGranted, setNotifGranted] = useState(false);
  const [showPrivacyCharter, setShowPrivacyCharter] = useState(false);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRequestNotification = async () => {
    const res = await PermissionManager.request(PERMISSION_TYPES.NOTIFICATIONS);
    if (res === 'granted') {
      setNotifGranted(true);
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0a0f16',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        zIndex: 150,
        overflowY: 'auto'
      }}
    >
      {/* Top Header & Progress Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="btn-ghost"
            style={{ padding: '6px' }}
            aria-label="Previous step"
          >
            <ChevronLeft size={22} />
          </button>
        ) : (
          <div style={{ width: '34px' }} />
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                width: s === step ? '24px' : '7px',
                height: '7px',
                borderRadius: '4px',
                backgroundColor: s === step ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>

        <button
          onClick={onComplete}
          className="btn-ghost"
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          {t('btnSkip')}
        </button>
      </div>

      {/* Screen Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {step === 1 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(2, 132, 199, 0.2))',
                border: '1px solid rgba(20, 184, 166, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--accent-teal)'
              }}
            >
              <Sparkles size={40} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              {t('onboardingStep1Title')}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: '1.6',
                maxWidth: '340px',
                margin: '0 auto'
              }}
            >
              {t('onboardingStep1Desc')}
            </p>

            <div
              style={{
                marginTop: '28px',
                background: 'rgba(20, 184, 166, 0.08)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '0.82rem',
                color: 'var(--text-light)',
                lineHeight: '1.4'
              }}
            >
              <strong>{t('corePrinciple')}</strong>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(13, 148, 136, 0.2))',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--accent-sage)'
              }}
            >
              <Heart size={40} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              {t('onboardingStep2Title')}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: '1.6',
                maxWidth: '340px',
                margin: '0 auto 20px auto'
              }}
            >
              {t('onboardingStep2Desc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <div className="glass-card" style={{ padding: '12px 14px', margin: 0 }}>
                <span style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>
                  🌱 Personal Rhythm Tracking
                </span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Evaluates subtle changes from your own baseline, never standard population pressure.
                </p>
              </div>
              <div className="glass-card" style={{ padding: '12px 14px', margin: 0 }}>
                <span style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>
                  🎨 Joy & Reconnection
                </span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Hobbies and gentle habits with zero shaming or punishment.
                </p>
              </div>
              <div className="glass-card" style={{ padding: '12px 14px', margin: 0 }}>
                <span style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>
                  🤝 Human-Led Safety Net
                </span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Licensed trauma counselors, social workers, and verified legal relief schemes.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--accent-blue)'
              }}
            >
              <ShieldCheck size={40} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              {t('onboardingStep3Title')}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: '1.6',
                maxWidth: '340px',
                margin: '0 auto 20px auto'
              }}
            >
              {t('onboardingStep3Desc')}
            </p>

            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-light)',
                lineHeight: '1.5'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" />
                <span>No automated psychiatric diagnoses or labels.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" />
                <span>Consent-driven temporary live location (never background tracking).</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" />
                <span>Encrypted data store with strict survivor confidentiality.</span>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyCharter(!showPrivacyCharter)}
              className="btn-ghost"
              style={{
                marginTop: '12px',
                fontSize: '0.8rem',
                color: 'var(--accent-teal)',
                textDecoration: 'underline'
              }}
            >
              {t('privacyDetailsLink')}
            </button>

            {showPrivacyCharter && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'left'
                }}
              >
                Data is stored with pseudonymized IDs. Human professionals only receive access when you book an appointment or raise a support signal request.
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--accent-amber)'
              }}
            >
              <Languages size={40} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              {t('onboardingStep4Title')}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: '1.6',
                maxWidth: '340px',
                margin: '0 auto 24px auto'
              }}
            >
              {t('onboardingStep4Desc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => changeLanguage('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: lang === 'en' ? 'rgba(20, 184, 166, 0.15)' : 'var(--bg-card)',
                  border: lang === 'en' ? '2px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>English</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Default system language
                  </div>
                </div>
                {lang === 'en' && <CheckCircle2 size={22} color="var(--accent-teal)" />}
              </button>

              <button
                onClick={() => changeLanguage('te')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: lang === 'te' ? 'rgba(20, 184, 166, 0.15)' : 'var(--bg-card)',
                  border: lang === 'te' ? '2px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>తెలుగు (Telugu)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    పూర్తి తెలుగు భాషా సహకారం
                  </div>
                </div>
                {lang === 'te' && <CheckCircle2 size={22} color="var(--accent-teal)" />}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2))',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--accent-purple)'
              }}
            >
              <Bell size={40} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              {t('onboardingStep5Title')}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: '1.6',
                maxWidth: '340px',
                margin: '0 auto 24px auto'
              }}
            >
              {t('onboardingStep5Desc')}
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px dashed var(--border-subtle)',
                marginBottom: '24px',
                fontSize: '0.8rem',
                color: 'var(--text-light)',
                textAlign: 'left'
              }}
            >
              🔒 <strong>Lock-screen Privacy Guarantee:</strong>
              <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                Notifications will show neutral text like "You have a new SAHARA update" to protect your privacy from onlookers.
              </div>
            </div>

            {notifGranted && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent-sage)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}
              >
                <CheckCircle2 size={18} /> Notifications Configured!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ marginTop: '20px' }}>
        {step < 5 ? (
          <button onClick={handleNext} className="btn-primary">
            <span>{step === 1 ? t('btnGetStarted') : t('btnContinue')}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleRequestNotification} className="btn-primary">
              <Bell size={18} />
              <span>{t('btnAllowNotifications')}</span>
            </button>
            <button onClick={onComplete} className="btn-secondary">
              <span>{t('btnMaybeLater')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
