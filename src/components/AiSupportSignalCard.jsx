// SAHARA AI Support Signal Card
// Strictly adheres to trauma-informed, non-diagnostic guidelines:
// Highlights meaningful changes from the survivor's OWN personal baseline,
// details contributing indicators, and provides direct human routing.

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  PhoneCall,
  BookOpen,
  Check,
  ShieldAlert
} from 'lucide-react';

export function AiSupportSignalCard({ signal, onAction, onDismiss }) {
  const { lang, t } = useApp();

  if (!signal) return null;

  const isTe = lang === 'te';
  const headline = isTe && signal.headlineTe ? signal.headlineTe : signal.headline;
  const isImmediate = signal.signalLevel === 'immediate_attention';

  return (
    <div
      className="glass-card"
      style={{
        border: isImmediate
          ? '1.5px solid rgba(244, 63, 94, 0.6)'
          : '1.5px solid rgba(245, 158, 11, 0.45)',
        background: isImmediate
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(17, 26, 36, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(17, 26, 36, 0.85) 100%)',
        marginBottom: '20px',
        position: 'relative'
      }}
    >
      {/* Header Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span className={isImmediate ? 'badge badge-urgent' : 'badge badge-warning'}>
          {isImmediate ? (
            <>
              <ShieldAlert size={14} /> Immediate Safety Mode
            </>
          ) : (
            <>
              <Sparkles size={14} /> {t('aiSupportSignalBadge')}
            </>
          )}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {new Date(signal.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Headline */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#fff',
          lineHeight: '1.35',
          marginBottom: '8px'
        }}
      >
        {headline}
      </h3>

      {/* Non-diagnostic rationale notice */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
        {t('aiSupportSignalDisclaimer')}
      </p>

      {/* Contributing Indicators */}
      {signal.contributingIndicators && signal.contributingIndicators.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              marginBottom: '8px'
            }}
          >
            {t('contributingIndicatorsHeader')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {signal.contributingIndicators.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem'
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isImmediate ? 'var(--accent-rose)' : 'var(--accent-amber)',
                    marginTop: '6px',
                    flexShrink: 0
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    {isTe && item.factorTe ? item.factorTe : item.factor}
                  </div>
                  {item.detail && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.detail}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Next Steps */}
      <div>
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            marginBottom: '8px'
          }}
        >
          {t('suggestedNextStepsHeader')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => onAction && onAction('book_counselor')}
            className="btn-secondary"
            style={{
              fontSize: '0.78rem',
              padding: '7px 12px',
              backgroundColor: 'rgba(20, 184, 166, 0.15)',
              borderColor: 'rgba(20, 184, 166, 0.35)',
              color: '#fff'
            }}
          >
            <UserCheck size={14} color="var(--accent-teal)" />
            <span>{t('btnTalkCounselor')}</span>
          </button>

          <button
            onClick={() => onAction && onAction('book_social_worker')}
            className="btn-secondary"
            style={{
              fontSize: '0.78rem',
              padding: '7px 12px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              color: '#fff'
            }}
          >
            <UserCheck size={14} color="var(--accent-blue)" />
            <span>{t('btnTalkSocialWorker')}</span>
          </button>

          <button
            onClick={() => onAction && onAction('contact_trusted')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '7px 12px' }}
          >
            <PhoneCall size={14} />
            <span>{t('btnContactTrusted')}</span>
          </button>

          <button
            onClick={() => onAction && onAction('view_resources')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '7px 12px' }}
          >
            <BookOpen size={14} />
            <span>{t('btnViewResources')}</span>
          </button>
        </div>
      </div>

      {/* Dismiss Action */}
      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onDismiss && onDismiss(signal.id)}
          className="btn-ghost"
          style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}
        >
          <Check size={14} />
          <span>{t('btnDismissSignal')}</span>
        </button>
      </div>
    </div>
  );
}
