// SAHARA Profile & Privacy Settings
// Language switching (English / Telugu), Voice Language, Accessibility toggles,
// Permission Center trigger, Privacy Charter, and Data Export.

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Languages,
  Mic,
  Eye,
  Sliders,
  Shield,
  Download,
  Trash2,
  LogOut,
  CheckCircle2,
  FileText,
  Briefcase
} from 'lucide-react';

export function ProfileSettings({ onOpenPermissions, onOpenAuth }) {
  const {
    lang,
    changeLanguage,
    voiceLang,
    changeVoiceLanguage,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    t,
    user,
    profile,
    activeRole,
    setActiveRole
  } = useApp();

  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      user: { id: user.id, email: user.email, name: user.name },
      profile,
      privacyPolicy: 'SAHARA Post-Trauma Recovery Confidential Charter'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sahara_recovery_data_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800 }}>
          {t('profileTitle')}
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Manage your personal preferences, language, and privacy settings
        </p>
      </div>

      {/* User Info Card */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-teal), #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)'
          }}
        >
          {user.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
            {user.name}
          </h3>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {user.email}
          </p>
          <span className="badge badge-safe" style={{ fontSize: '0.62rem', marginTop: '4px' }}>
            🔒 Strict Privacy Mode Active
          </span>
        </div>
      </div>

      {/* 1. Language Preferences */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Languages size={18} color="var(--accent-teal)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
            {t('settingLanguage')}
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => changeLanguage('en')}
            className={lang === 'en' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px 8px', fontSize: '0.82rem' }}
          >
            {t('settingLanguageEn')}
          </button>
          <button
            onClick={() => changeLanguage('te')}
            className={lang === 'te' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px 8px', fontSize: '0.82rem' }}
          >
            {t('settingLanguageTe')}
          </button>
        </div>
      </div>

      {/* 2. Voice Input Language */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Mic size={18} color="var(--accent-sage)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
            {t('settingVoiceLanguage')}
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => changeVoiceLanguage('en-US')}
            className={voiceLang === 'en-US' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '8px 6px', fontSize: '0.78rem' }}
          >
            English Speech
          </button>
          <button
            onClick={() => changeVoiceLanguage('te-IN')}
            className={voiceLang === 'te-IN' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '8px 6px', fontSize: '0.78rem' }}
          >
            తెలుగు వాయిస్
          </button>
        </div>
      </div>

      {/* 3. Accessibility Controls */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Eye size={18} color="var(--accent-amber)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
            Accessibility Options
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.84rem', color: '#fff' }}>{t('settingHighContrast')}</span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)' }}
            />
          </label>

          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.84rem', color: '#fff' }}>{t('settingReducedMotion')}</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)' }}
            />
          </label>
        </div>
      </div>

      {/* 4. Privacy & Permissions Center */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={18} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
            {t('settingPrivacyCenter')}
          </h4>
        </div>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          View, grant, or revoke notifications, microphone, camera, and temporary location permissions.
        </p>
        <button
          onClick={onOpenPermissions}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.82rem' }}
        >
          Manage Device Permissions
        </button>
      </div>

      {/* 5. Data Export & Account */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
          Data Rights & Portability
        </h4>

        {exportNotice && (
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#86efac', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '10px' }}>
            ✓ Private JSON export generated and downloaded.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleExportData}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '10px' }}
          >
            <Download size={15} />
            <span>{t('settingExportData')}</span>
          </button>

          <button
            onClick={() => alert('Account purge request registered. In production, this permanently wipes all records after 24h grace period.')}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '10px', color: '#fda4af' }}
          >
            <Trash2 size={15} />
            <span>{t('settingDeleteAccount')}</span>
          </button>
        </div>
      </div>

      {/* Switch Account / Logout */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={onOpenAuth}
          className="btn-secondary"
          style={{ flex: 1, fontSize: '0.82rem' }}
        >
          <User size={15} />
          <span>Switch Account / Sign In</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('sahara_auth_token');
            onOpenAuth();
          }}
          className="btn-secondary"
          style={{ flex: 1, fontSize: '0.82rem', color: '#fda4af' }}
        >
          <LogOut size={15} />
          <span>{t('btnLogout')}</span>
        </button>
      </div>
    </div>
  );
}
