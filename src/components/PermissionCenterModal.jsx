// SAHARA Privacy & Permission Center Modal
// Contextual inspection, explanation, testing, and toggling of device permissions

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PermissionManager, PERMISSION_TYPES } from '../services/permissionManager';
import {
  Shield,
  Bell,
  Mic,
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X
} from 'lucide-react';

export function PermissionCenterModal({ isOpen, onClose }) {
  const { t } = useApp();
  const [permissions, setPermissions] = useState(() => PermissionManager.getPermissions());
  const [activeTesting, setActiveTesting] = useState(null);

  if (!isOpen) return null;

  const handleRequest = async (type) => {
    setActiveTesting(type);
    await PermissionManager.request(type);
    setPermissions(PermissionManager.getPermissions());
    setActiveTesting(null);
  };

  const items = [
    {
      type: PERMISSION_TYPES.NOTIFICATIONS,
      title: 'Supportive Notifications',
      titleTe: 'మనోధైర్యం అందించే నోటిఫికేషన్లు',
      icon: Bell,
      desc: 'Gentle routine reminders, counselor session alerts, and safety check-ins.',
      whyNeeded: 'Keeps you gently anchored to your chosen routines without loud or triggering alerts.'
    },
    {
      type: PERMISSION_TYPES.MICROPHONE,
      title: 'Voice Check-in & Speech',
      titleTe: 'వాయిస్ చెకిన్ & స్పీచ్',
      icon: Mic,
      desc: 'Allows speaking your reflections instead of typing. Works in English & Telugu.',
      whyNeeded: 'Only activated when you tap the microphone button. Never listens in the background.'
    },
    {
      type: PERMISSION_TYPES.LOCATION,
      title: 'Temporary Live Location Sharing',
      titleTe: 'తాత్కాలిక లైవ్ లొకేషన్ షేరింగ్',
      icon: MapPin,
      desc: 'Only used when you explicitly activate emergency mode to notify your Trusted Circle.',
      whyNeeded: 'Purpose-specific emergency safety. You can stop sharing with a single tap at any time.'
    },
    {
      type: PERMISSION_TYPES.CAMERA,
      title: 'Secure Tele-Counseling Video',
      titleTe: 'టెలి-కౌన్సెలింగ్ వీడియో',
      icon: Camera,
      desc: 'Required only when joining a face-to-face video session with your assigned counselor.',
      whyNeeded: 'Enables confidential visual interaction with licensed professionals.'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="sheet-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(20, 184, 166, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-teal)'
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Permission & Privacy Center</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Granular control over device features
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {items.map((item) => {
            const Icon = item.icon;
            const status = permissions[item.type]?.status || 'prompt';
            const isGranted = status === 'granted';
            const isDenied = status === 'denied';

            return (
              <div
                key={item.type}
                className="glass-card"
                style={{
                  margin: 0,
                  padding: '14px',
                  border: isGranted
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : isDenied
                    ? '1px solid rgba(244, 63, 94, 0.25)'
                    : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isGranted ? 'var(--accent-sage)' : 'var(--text-light)',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                          {item.title}
                        </span>
                        {isGranted && <CheckCircle2 size={15} color="var(--accent-sage)" />}
                        {isDenied && <XCircle size={15} color="var(--accent-rose)" />}
                      </div>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                        {item.desc}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', marginTop: '4px' }}>
                        🔒 {item.whyNeeded}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isGranted ? (
                      <span className="badge badge-safe" style={{ fontSize: '0.68rem' }}>Allowed</span>
                    ) : (
                      <button
                        onClick={() => handleRequest(item.type)}
                        disabled={activeTesting === item.type}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      >
                        {isDenied ? 'Try Again' : 'Enable'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: 'rgba(20, 184, 166, 0.08)',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-light)',
            lineHeight: '1.4',
            marginBottom: '16px'
          }}
        >
          <strong>Privacy Rule:</strong> SAHARA operates gracefully even if all optional permissions are denied. Voice, camera, and location are never triggered in the background.
        </div>

        <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
          {t('close')}
        </button>
      </div>
    </div>
  );
}
