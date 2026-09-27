// SAHARA Quick Check-in Modal
// Adaptive trauma-informed daily check-in with speech recognition in English & Telugu,
// accessible 1-10 scales, non-diagnostic framing, and human support routing.

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import {
  Brain,
  Mic,
  MicOff,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Volume2
} from 'lucide-react';

export function QuickCheckInModal({ isOpen, onClose }) {
  const { lang, voiceLang, t, user, refreshUserData, setIsEmergencyOpen, setActiveTab } = useApp();

  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [safety, setSafety] = useState(8);
  const [social, setSocial] = useState(6);
  const [fear, setFear] = useState(2);
  const [functioning, setFunctioning] = useState(7);
  const [energy, setEnergy] = useState(6);

  const [notes, setNotes] = useState('');
  const [wantsHumanSupport, setWantsHumanSupport] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    error: speechError,
    permissionDenied,
    startListening,
    stopListening,
    resetTranscript,
    updateTranscript
  } = useSpeechRecognition({
    voiceLang,
    onResult: (text) => {
      setNotes((prev) => (prev ? `${prev} ${text}` : text));
    }
  });

  const [isEditingSpeech, setIsEditingSpeech] = useState(false);

  // Keep notes synchronized with voice transcript
  useEffect(() => {
    if (transcript && !notes) {
      setNotes(transcript);
    }
  }, [transcript, notes]);

  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        userId: user.id,
        mood,
        stress,
        sleep,
        safety,
        social,
        fear,
        functioning,
        energy,
        notes,
        wantsHumanSupport
      };

      const res = await api.submitCheckIn(payload);
      setSuccessResult(res);

      await refreshUserData();

      // If immediate danger safety triggered, route straight to emergency safety flow
      if (res.evaluation?.isImmediateDanger) {
        setTimeout(() => {
          onClose();
          setIsEmergencyOpen(true);
        }, 1200);
      } else {
        setTimeout(() => {
          onClose();
          if (res.evaluation?.hasSignal) {
            setActiveTab('home'); // To show AI Support Signal
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit check-in:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const domains = [
    {
      key: 'mood',
      val: mood,
      setVal: setMood,
      label: t('qMood'),
      minLabel: lang === 'te' ? 'చాలా తక్కువ' : 'Very Low (1)',
      maxLabel: lang === 'te' ? 'ప్రశాంతం' : 'Calm & Grounded (10)'
    },
    {
      key: 'stress',
      val: stress,
      setVal: setStress,
      label: t('qStress'),
      minLabel: lang === 'te' ? 'ప్రశాంతం' : 'Relaxed (1)',
      maxLabel: lang === 'te' ? 'తీవ్ర ఒత్తిడి' : 'Very Tense (10)'
    },
    {
      key: 'sleep',
      val: sleep,
      setVal: setSleep,
      label: t('qSleep'),
      minLabel: lang === 'te' ? 'అశాంతిగా' : 'Restless (1)',
      maxLabel: lang === 'te' ? 'మంచి నిద్ర' : 'Restful (10)'
    },
    {
      key: 'safety',
      val: safety,
      setVal: setSafety,
      label: t('qSafety'),
      minLabel: lang === 'te' ? 'భద్రత లేదు' : 'On Edge (1)',
      maxLabel: lang === 'te' ? 'పూర్తి సురక్షితం' : 'Completely Safe (10)'
    },
    {
      key: 'social',
      val: social,
      setVal: setSocial,
      label: t('qSocial'),
      minLabel: lang === 'te' ? 'ఒంటరిగా' : 'Isolated (1)',
      maxLabel: lang === 'te' ? 'ఆప్తుల తోడు' : 'Connected (10)'
    },
    {
      key: 'functioning',
      val: functioning,
      setVal: setFunctioning,
      label: t('qFunctioning'),
      minLabel: lang === 'te' ? 'చాలా కష్టం' : 'Difficult (1)',
      maxLabel: lang === 'te' ? 'సులభం' : 'Smooth (10)'
    },
    {
      key: 'energy',
      val: energy,
      setVal: setEnergy,
      label: t('qEnergy'),
      minLabel: lang === 'te' ? 'అలసట' : 'Low / Exhausted (1)',
      maxLabel: lang === 'te' ? 'ఉత్సాహం' : 'Vibrant (10)'
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
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-teal), #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Brain size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('checkInTitle')}</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('checkInSubtitle')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {successResult ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', animation: 'fadeIn 0.3s ease' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-sage)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={34} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              Thank You for Checking In
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
              Your check-in has been privately saved to your personal baseline.
            </p>
            {successResult.evaluation?.hasSignal && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: '#fbbf24'
                }}
              >
                A gentle AI Support Signal was noted based on your baseline. Human support options are ready for you.
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Domain Sliders with 1-10 Accessible Pill Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '22px' }}>
              {domains.map((dom) => (
                <div
                  key={dom.key}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                      {dom.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--accent-teal)',
                        background: 'rgba(20, 184, 166, 0.12)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {dom.val} / 10
                    </span>
                  </div>

                  {/* 1-10 Pill Click Selector */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '4px',
                      marginBottom: '6px'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => dom.setVal(num)}
                        style={{
                          flex: 1,
                          height: '32px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: dom.val === num ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.06)',
                          color: dom.val === num ? '#fff' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: dom.val === num ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>{dom.minLabel}</span>
                    <span>{dom.maxLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Reflection with Speech Recognition */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  {t('optionalNotes')}
                </label>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className="btn-secondary"
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.74rem',
                    backgroundColor: isListening ? 'rgba(244, 63, 94, 0.2)' : 'rgba(20, 184, 166, 0.12)',
                    borderColor: isListening ? 'var(--accent-rose)' : 'var(--accent-teal)',
                    color: isListening ? '#fda4af' : 'var(--accent-teal)'
                  }}
                  title={voiceLang === 'te' ? 'తెలుగులో మాట్లాడండి' : 'Speak in English'}
                >
                  {isListening ? (
                    <>
                      <MicOff size={14} /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={14} /> 🎤 {voiceLang === 'te' ? 'తెలుగు వాయిస్' : 'Speak Notes'}
                    </>
                  )}
                </button>
              </div>

              {isListening && (
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.76rem',
                    color: '#fda4af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    animation: 'pulseGlow 2s infinite'
                  }}
                >
                  <Volume2 size={16} />
                  <span>{t('voiceInputListening')}</span>
                </div>
              )}

              {speechError && (
                <div
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    color: '#fbbf24',
                    marginBottom: '8px'
                  }}
                >
                  {speechError}
                </div>
              )}

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                className="form-textarea"
                style={{ fontSize: '0.86rem' }}
              />

              {notes && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setNotes(''); resetTranscript(); }}
                    className="btn-ghost"
                    style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => startListening()}
                    className="btn-ghost"
                    style={{ fontSize: '0.72rem', color: 'var(--accent-teal)' }}
                  >
                    <RefreshCw size={13} /> {t('btnRecordAgain')}
                  </button>
                </div>
              )}
            </div>

            {/* Human Support Request Checkbox */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setWantsHumanSupport(!wantsHumanSupport)}
            >
              <input
                type="checkbox"
                checked={wantsHumanSupport}
                onChange={(e) => setWantsHumanSupport(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.82rem', color: '#fff', lineHeight: '1.4' }}>
                {t('wantsHumanSupportQuestion')}
              </span>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1 }}>
                {submitting ? t('loading') : t('btnSubmitCheckIn')}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                {t('btnCancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
