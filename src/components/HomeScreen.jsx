// SAHARA Home Screen
// Warm, calm, supportive greeting, 1-10 feeling scale, primary Quick Check-in CTA,
// AI Support Signal notice (when deviation detected), secondary navigation cards, and privacy badge.

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AiSupportSignalCard } from './AiSupportSignalCard';
import {
  Brain,
  Activity,
  CalendarCheck,
  Palette,
  UserCheck,
  ShieldAlert,
  Lock,
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';

export function HomeScreen({ onOpenCheckIn, onOpenAppointmentModal }) {
  const {
    t,
    user,
    profile,
    latestSignal,
    dismissSignal,
    habits,
    hobbies,
    setActiveTab,
    setIsEmergencyOpen
  } = useApp();

  const [instantFeeling, setInstantFeeling] = useState(7);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingMorning');
    if (hour < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  const displayName = profile?.displayName || user?.name?.split(' ')[0] || 'Friend';

  // Habits completed today
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completedToday).length;

  const handleSignalAction = (action) => {
    if (action === 'book_counselor' || action === 'book_social_worker') {
      if (onOpenAppointmentModal) {
        onOpenAppointmentModal();
      } else {
        setActiveTab('support');
      }
    } else if (action === 'contact_trusted') {
      setActiveTab('support');
    } else if (action === 'view_resources') {
      setActiveTab('support');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Top Greeting */}
      <div style={{ marginBottom: '18px' }}>
        <span
          style={{
            fontSize: '0.82rem',
            color: 'var(--accent-teal)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
        >
          {getGreeting()},
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginTop: '2px'
          }}
        >
          {displayName}
        </h1>
      </div>

      {/* AI Support Signal Banner (If Active) */}
      {latestSignal && (
        <AiSupportSignalCard
          signal={latestSignal}
          onAction={handleSignalAction}
          onDismiss={dismissSignal}
        />
      )}

      {/* "How are you feeling today?" 1-10 Accessible Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(19, 28, 38, 0.8) 100%)',
          borderColor: 'rgba(20, 184, 166, 0.25)',
          padding: '18px 16px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Heart size={18} color="var(--accent-teal)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
            {t('howAreYouFeeling')}
          </h2>
        </div>

        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {t('feelingScaleSubtext')}
        </p>

        {/* 1-10 Pill Selector */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setInstantFeeling(num)}
              style={{
                flex: 1,
                height: '34px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: instantFeeling === num ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.06)',
                color: instantFeeling === num ? '#fff' : 'var(--text-muted)',
                fontWeight: instantFeeling === num ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              aria-label={`Feeling rating ${num} out of 10`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Primary CTA: Quick Check-in */}
        <button onClick={onOpenCheckIn} className="btn-primary" style={{ padding: '14px 20px' }}>
          <Brain size={18} />
          <span>{t('btnQuickCheckIn')}</span>
        </button>
      </div>

      {/* Secondary Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
        {/* 1. My Well-being */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('recovery')}
          style={{ margin: 0, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
                📈 {t('cardWellbeingTitle')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('cardWellbeingSub')}
              </p>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* 2. My Habits */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('recovery')}
          style={{ margin: 0, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
                🗓️ {t('cardHabitsTitle')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {completedHabits} / {totalHabits} {t('completedLabel')}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-sage)',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {completedHabits}/{totalHabits}
            </span>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        </div>

        {/* 3. My Hobbies */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('recovery')}
          style={{ margin: 0, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
                🎨 {t('cardHobbiesTitle')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {hobbies.length} creative activities active
              </p>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* 4. Talk to Someone */}
        <div
          className="glass-card"
          onClick={() => setActiveTab('support')}
          style={{ margin: 0, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
                🤝 {t('cardSupportTitle')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {t('cardSupportSub')}
              </p>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* 5. Immediate Help Button */}
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="btn-emergency pulse-emergency"
          style={{ marginTop: '4px' }}
        >
          <ShieldAlert size={20} />
          <span>{t('cardEmergencyTitle')}</span>
        </button>
      </div>

      {/* Privacy Guarantee Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.74rem',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-full)',
          width: 'fit-content',
          margin: '0 auto'
        }}
      >
        <Lock size={13} color="var(--accent-teal)" />
        <span>{t('privacyBadge')}</span>
      </div>
    </div>
  );
}
