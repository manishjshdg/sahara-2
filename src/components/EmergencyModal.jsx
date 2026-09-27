// SAHARA Emergency & Immediate Help Modal
// Accessible, high-contrast, compassionate crisis response:
// Reassurance, direct 1-tap verified helpline dispatch, and consent-based temporary live location sharing.

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  Radio
} from 'lucide-react';

export function EmergencyModal({ isOpen, onClose }) {
  const {
    t,
    lang,
    isLocationSharing,
    activeEmergencySession,
    toggleLocationSharing
  } = useApp();

  const [locationConsentGiven, setLocationConsentGiven] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  if (!isOpen) return null;

  const helplines = [
    {
      name: 'Emergency Response Support (Police / Medical)',
      number: '112',
      hours: '24/7 National Dispatch',
      badge: 'Immediate Dispatch',
      color: 'var(--accent-rose)'
    },
    {
      name: 'Tele-MANAS (Govt. Free Crisis & Mental Health)',
      number: '14416',
      hours: '24/7 Multilingual (English, Telugu & 18+ langs)',
      badge: 'Free & Confidential',
      color: 'var(--accent-teal)'
    },
    {
      name: 'KIRAN National Helpline (Ministry of Social Justice)',
      number: '1800-599-0019',
      hours: '24/7 Toll Free Crisis Intervention',
      badge: 'Govt. Toll-Free',
      color: 'var(--accent-sage)'
    },
    {
      name: 'National Commission for Women (Violence / Atrocity)',
      number: '7827170170',
      hours: '24/7 Women in Distress Support',
      badge: 'Dedicated Protection',
      color: 'var(--accent-purple)'
    }
  ];

  const handleStartLocationSharing = async () => {
    await toggleLocationSharing();
    setShowLocationDialog(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          borderTop: '3px solid var(--accent-rose)',
          background: 'linear-gradient(180deg, #181014 0%, #0d121a 100%)'
        }}
      >
        <div className="sheet-handle" style={{ background: 'rgba(244, 63, 94, 0.4)' }} />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.2)',
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                {t('emergencyDrawerTitle')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#fda4af' }}>
                Immediate safety & compassionate support
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Close emergency modal">
            <X size={20} />
          </button>
        </div>

        {/* Reassurance Banner */}
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '18px'
          }}
        >
          <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {t('emergencyReassurance')}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
            {t('emergencySubtitle')}
          </p>
        </div>

        {/* Live Location Sharing Active Banner (If active) */}
        {isLocationSharing ? (
          <div
            className="glass-card"
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              borderColor: 'var(--accent-rose)',
              padding: '14px',
              marginBottom: '18px',
              animation: 'pulseGlow 2s infinite'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Radio size={18} color="var(--accent-rose)" />
              <strong style={{ fontSize: '0.86rem', color: '#fda4af', letterSpacing: '0.04em' }}>
                {t('locationSharingActiveBanner')}
              </strong>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-light)', marginBottom: '10px' }}>
              {t('locationSharingActiveDesc')}
              {activeEmergencySession?.address && ` (${activeEmergencySession.address})`}
            </p>
            <button
              onClick={toggleLocationSharing}
              className="btn-secondary"
              style={{
                width: '100%',
                backgroundColor: 'rgba(244, 63, 94, 0.25)',
                borderColor: 'var(--accent-rose)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.84rem'
              }}
            >
              <XCircle size={16} />
              <span>{t('btnStopLocationSharing')}</span>
            </button>
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              padding: '14px',
              marginBottom: '18px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'rgba(245, 158, 11, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <MapPin size={18} color="var(--accent-amber)" />
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                {t('btnShareLiveLocation')}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Temporarily share your location with contacts in your Trusted Circle. You can turn this off at any time.
            </p>
            <button
              onClick={() => setShowLocationDialog(true)}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              <span>Activate Live Location Sharing</span>
            </button>
          </div>
        )}

        {/* Location Confirmation Dialog */}
        {showLocationDialog && (
          <div
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '18px'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              Confirm Temporary Live Location Sharing:
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              SAHARA will securely share your coordinates only with contacts marked with location access in your Trusted Circle. No location history is retained permanently.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleStartLocationSharing} className="btn-emergency" style={{ flex: 1, padding: '10px' }}>
                Confirm & Share
              </button>
              <button onClick={() => setShowLocationDialog(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Verified Helplines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Verified 24/7 Helplines (Tap to Call):
          </div>

          {helplines.map((hl, idx) => (
            <a
              key={idx}
              href={`tel:${hl.number}`}
              className="glass-card"
              style={{
                margin: 0,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                color: 'inherit',
                borderLeft: `4px solid ${hl.color}`
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: hl.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {hl.badge}
                </span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                  {hl.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {hl.hours}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                <PhoneCall size={15} color={hl.color} />
                <span>{hl.number}</span>
              </div>
            </a>
          ))}
        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%' }}>
          {t('close')}
        </button>
      </div>
    </div>
  );
}
