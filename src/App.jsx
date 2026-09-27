// SAHARA — Main Application Component
// Assembles mobile-first trauma-informed ecosystem with role portals,
// responsive frame toggle, permission center, and emergency support.

import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { HomeScreen } from './components/HomeScreen';
import { RecoveryJourney } from './components/RecoveryJourney';
import { SupportSection } from './components/SupportSection';
import { ProfileSettings } from './components/ProfileSettings';
import { ProfessionalPortal } from './components/ProfessionalPortal';
import { OrganizationPortal } from './components/OrganizationPortal';
import { QuickCheckInModal } from './components/QuickCheckInModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AppointmentModal } from './components/AppointmentModal';
import { PermissionCenterModal } from './components/PermissionCenterModal';
import { AuthModal } from './components/AuthModal';
import { DemoController } from './components/DemoController';
import {
  Home,
  Brain,
  Activity,
  HeartHandshake,
  User,
  Shield,
  Bell,
  Smartphone,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Sparkles,
  Building2,
  Briefcase
} from 'lucide-react';

export function App() {
  const {
    t,
    lang,
    activeTab,
    setActiveTab,
    isOnboarded,
    completeOnboarding,
    isEmergencyOpen,
    setIsEmergencyOpen,
    isLocationSharing,
    activeRole,
    setActiveRole,
    unreadNotificationsCount
  } = useApp();

  // Startup splash state
  const [showSplash, setShowSplash] = useState(true);

  // Desktop simulator frame state (Mobile Frame vs Full Width)
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Modals state
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // If showing splash screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // If first-time user and not onboarded yet
  if (!isOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className={`app-viewport-wrapper ${isFullWidth ? 'full-width' : ''}`}>
      {/* Desktop Helper Bar */}
      <div className="desktop-preview-bar">
        <span>SAHARA Mobile-First Preview</span>
        <button
          onClick={() => setIsFullWidth(!isFullWidth)}
          className="btn-ghost"
          style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {isFullWidth ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span>{isFullWidth ? 'Phone Frame' : 'Full Screen'}</span>
        </button>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Quick Portal Switcher */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveRole('user')}
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeRole === 'user' ? 'var(--accent-teal)' : 'transparent',
              color: activeRole === 'user' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Survivor App
          </button>
          <button
            onClick={() => setActiveRole('professional')}
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeRole === 'professional' ? 'var(--accent-blue)' : 'transparent',
              color: activeRole === 'professional' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Counselor Portal
          </button>
          <button
            onClick={() => setActiveRole('org_admin')}
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeRole === 'org_admin' ? 'var(--accent-sage)' : 'transparent',
              color: activeRole === 'org_admin' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            NGO Admin
          </button>
        </div>
      </div>

      {/* Smartphone Device Frame */}
      <div className={`device-frame ${!isFullWidth ? 'framed' : ''}`}>
        {/* Top App Header */}
        <header className="app-header">
          <div className="header-brand">
            <div className="brand-icon-wrap">
              <HeartHandshake size={20} />
            </div>
            <div>
              <span className="brand-title">{t('appName')}</span>
            </div>
          </div>

          <div className="header-actions">
            {/* Live Location Active Indicator */}
            {isLocationSharing && (
              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="badge badge-urgent"
                style={{ cursor: 'pointer', padding: '3px 8px', fontSize: '0.64rem' }}
                title="Live location sharing is active"
              >
                📍 Live Location ON
              </button>
            )}

            {/* Permission Center Shortcut */}
            <button
              onClick={() => setIsPermissionsOpen(true)}
              className="btn-ghost"
              aria-label="Permission Center"
              title="Privacy & Permission Center"
            >
              <Shield size={18} />
            </button>

            {/* Emergency 🆘 Top Shortcut */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.2)',
                color: 'var(--accent-rose)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Emergency Immediate Help"
              title="I Need Immediate Help"
            >
              <ShieldAlert size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="app-content">
          {/* Hackathon Interactive Demo Controls (Top Banner) */}
          <DemoController
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenAppointmentModal={() => setIsAppointmentOpen(true)}
          />

          {/* Role-Based Views */}
          {activeRole === 'professional' ? (
            <ProfessionalPortal />
          ) : activeRole === 'org_admin' ? (
            <OrganizationPortal />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  onOpenCheckIn={() => setIsCheckInOpen(true)}
                  onOpenAppointmentModal={() => setIsAppointmentOpen(true)}
                />
              )}

              {activeTab === 'recovery' && <RecoveryJourney />}

              {activeTab === 'support' && (
                <SupportSection
                  onOpenAppointmentModal={() => setIsAppointmentOpen(true)}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileSettings
                  onOpenPermissions={() => setIsPermissionsOpen(true)}
                  onOpenAuth={() => setIsAuthOpen(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Tab Navigation Bar (For Survivor View) */}
        {activeRole === 'user' && (
          <nav className="bottom-nav">
            <button
              onClick={() => setActiveTab('home')}
              className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            >
              <Home size={20} className="nav-icon" />
              <span>{t('navHome')}</span>
            </button>

            <button
              onClick={() => setIsCheckInOpen(true)}
              className="nav-tab-btn"
              style={{ color: 'var(--accent-teal)' }}
            >
              <Brain size={20} className="nav-icon" />
              <span>{t('navCheckIn')}</span>
            </button>

            <button
              onClick={() => setActiveTab('recovery')}
              className={`nav-tab-btn ${activeTab === 'recovery' ? 'active' : ''}`}
            >
              <Activity size={20} className="nav-icon" />
              <span>{t('navRecovery')}</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`nav-tab-btn ${activeTab === 'support' ? 'active' : ''}`}
            >
              <HeartHandshake size={20} className="nav-icon" />
              <span>{t('navSupport')}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={20} className="nav-icon" />
              <span>{t('navProfile')}</span>
            </button>
          </nav>
        )}
      </div>

      {/* Global Interactive Modals */}
      <QuickCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      <PermissionCenterModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default App;
