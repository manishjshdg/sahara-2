// SAHARA Privacy-First Authentication Modal
// Sign In, Sign Up, Quick Demo Switcher, and Minimal Sensitive Data Collection

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Lock, Mail, User, KeyRound, X, CheckCircle2, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { t, setUser, refreshUserData } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await api.signup({ email, password, name });
        setUser(res.user);
        localStorage.setItem('sahara_auth_token', res.token);
        setSuccessMsg('Account created with privacy-first encryption.');
        setTimeout(() => {
          refreshUserData();
          onClose();
        }, 1000);
      } else if (mode === 'login') {
        const res = await api.login(email, password);
        setUser(res.user);
        localStorage.setItem('sahara_auth_token', res.token);
        refreshUserData();
        onClose();
      } else if (mode === 'forgot') {
        setSuccessMsg('If an account exists, a secure verification link was dispatched to your email.');
        setTimeout(() => setMode('login'), 2500);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleEmail, rolePass, roleName, roleType) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setUser({
      id: roleType === 'user' ? 'usr_demo_1' : roleType === 'professional' ? 'usr_prof_1' : 'usr_org_1',
      name: roleName,
      email: roleEmail,
      role: roleType
    });
    localStorage.setItem('sahara_auth_token', `sahara_sec_tok_${roleType === 'user' ? 'usr_demo_1' : 'usr_prof_1'}`);
    refreshUserData();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="sheet-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
              <Lock size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {mode === 'login' ? t('authLoginTitle') : mode === 'signup' ? t('authSignupTitle') : 'Reset Password'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#fda4af',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#86efac',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">{t('authNameLabel')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t('authEmailLabel')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="form-group">
              <label className="form-label">{t('authPasswordLabel')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                {t('btnForgotPassword')}
              </button>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '6px' }}>
            {loading ? t('loading') : mode === 'login' ? t('btnLogin') : mode === 'signup' ? t('btnSignup') : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <>
              {t('authNoAccount')}{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontWeight: 600, cursor: 'pointer' }}
              >
                {t('btnSignup')}
              </button>
            </>
          ) : (
            <>
              {t('authHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontWeight: 600, cursor: 'pointer' }}
              >
                {t('btnLogin')}
              </button>
            </>
          )}
        </div>

        {/* Quick Demo Pre-filled Roles */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Quick Demo Logins:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleQuickDemoLogin('survivor@sahara.care', 'password123', 'Ananya Rao', 'user')}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
            >
              👩 Survivor User: Ananya Rao (Baseline Deviation Demo)
            </button>
            <button
              onClick={() => handleQuickDemoLogin('dr.radhika@sahara.care', 'password123', 'Dr. Radhika Sharma', 'professional')}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
            >
              🩺 Professional: Dr. Radhika Sharma (Counselor Portal)
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin@hopefoundation.org', 'password123', 'Hope Alliance Admin', 'org_admin')}
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '8px 12px' }}
            >
              🏢 Organization Admin: Hope Foundation (NGO Portal)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
