// SAHARA Recovery Journey
// Unified module containing:
// 1. My Well-being Trends (7d, 30d, non-diagnostic longitudinal comparison vs baseline)
// 2. My Habits (compassionate routine tracker, no shaming)
// 3. My Hobbies (17+ categories, gentle micro-goals)
// 4. Adaptive Lifestyle Suggestions (Low energy, isolation, focus, sleep)

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Activity,
  CalendarCheck,
  Palette,
  Sparkles,
  Plus,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Trash2,
  Info,
  Sun,
  Headphones,
  Users,
  Moon,
  CheckSquare,
  Heart,
  Droplet,
  Footprints,
  Wind,
  Utensils
} from 'lucide-react';

export function RecoveryJourney() {
  const { lang, t, habits, setHabits, hobbies, setHobbies, lifestyleSuggestions, baseline, refreshUserData } = useApp();
  const [subTab, setSubTab] = useState('wellbeing'); // 'wellbeing' | 'habits' | 'hobbies' | 'lifestyle'
  const [trendDays, setTrendDays] = useState(7);
  const [wellbeingData, setWellbeingData] = useState(null);
  const [gentleToast, setGentleToast] = useState(null);

  // New Habit Modal State
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitTitleTe, setNewHabitTitleTe] = useState('');
  const [newHabitCat, setNewHabitCat] = useState('movement');

  // New Hobby Modal State
  const [isAddHobbyOpen, setIsAddHobbyOpen] = useState(false);
  const [newHobbyName, setNewHobbyName] = useState('');
  const [newHobbyCategory, setNewHobbyCategory] = useState('Drawing & Art');
  const [newHobbyGoal, setNewHobbyGoal] = useState('15 minutes without pressure');

  // Log Hobby Time State
  const [loggingHobbyId, setLoggingHobbyId] = useState(null);
  const [logMinutes, setLogMinutes] = useState(15);
  const [logNote, setLogNote] = useState('');

  // Fetch well-being trends
  useEffect(() => {
    api.getWellbeingTrends(trendDays)
      .then((data) => setWellbeingData(data))
      .catch((err) => console.warn('Wellbeing fetch error:', err));
  }, [trendDays]);

  // Toggle habit completion
  const handleToggleHabit = async (habitId) => {
    try {
      const res = await api.toggleHabit(habitId);
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, completedToday: res.completedToday, streak: res.streak } : h))
      );
      setGentleToast(res.gentleMessage);
      setTimeout(() => setGentleToast(null), 3500);
    } catch (e) {
      console.error('Failed to toggle habit:', e);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabitTitle) return;
    try {
      const created = await api.createHabit({
        title: newHabitTitle,
        titleTe: newHabitTitleTe || newHabitTitle,
        category: newHabitCat,
        icon: newHabitCat === 'hydration' ? 'Droplet' : newHabitCat === 'movement' ? 'Footprints' : 'CheckCircle'
      });
      setHabits((prev) => [...prev, { ...created, completedToday: false }]);
      setIsAddHabitOpen(false);
      setNewHabitTitle('');
      setNewHabitTitleTe('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await api.deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateHobby = async (e) => {
    e.preventDefault();
    if (!newHobbyName) return;
    try {
      const created = await api.createHobby({
        name: newHobbyName,
        category: newHobbyCategory,
        currentGoal: newHobbyGoal
      });
      setHobbies((prev) => [...prev, created]);
      setIsAddHobbyOpen(false);
      setNewHobbyName('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogHobbyTime = async (e) => {
    e.preventDefault();
    if (!loggingHobbyId) return;
    try {
      const res = await api.logHobbyTime(loggingHobbyId, logMinutes, logNote);
      setHobbies((prev) =>
        prev.map((h) => (h.id === loggingHobbyId ? res.hobby : h))
      );
      setLoggingHobbyId(null);
      setLogNote('');
      setGentleToast('Creative time logged with care.');
      setTimeout(() => setGentleToast(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const getHabitIcon = (iconName) => {
    switch (iconName) {
      case 'Droplet': return <Droplet size={18} color="var(--accent-blue)" />;
      case 'Footprints': return <Footprints size={18} color="var(--accent-sage)" />;
      case 'Wind': return <Wind size={18} color="var(--accent-teal)" />;
      case 'Utensils': return <Utensils size={18} color="var(--accent-amber)" />;
      case 'Moon': return <Moon size={18} color="var(--accent-purple)" />;
      default: return <CalendarCheck size={18} color="var(--accent-teal)" />;
    }
  };

  const getLifestyleIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun size={20} color="var(--accent-amber)" />;
      case 'Headphones': return <Headphones size={20} color="var(--accent-teal)" />;
      case 'Users': return <Users size={20} color="var(--accent-blue)" />;
      case 'Moon': return <Moon size={20} color="var(--accent-purple)" />;
      case 'CheckSquare': return <CheckSquare size={20} color="var(--accent-sage)" />;
      default: return <Heart size={20} color="var(--accent-rose)" />;
    }
  };

  const isTe = lang === 'te';

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Module Title */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800 }}>
          {t('recoveryTitle')}
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {t('recoverySubtext')}
        </p>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '18px'
        }}
      >
        <button
          onClick={() => setSubTab('wellbeing')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'wellbeing' ? 'var(--bg-card)' : 'transparent',
            color: subTab === 'wellbeing' ? 'var(--accent-teal)' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: subTab === 'wellbeing' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📈 {t('cardWellbeingTitle')}
        </button>

        <button
          onClick={() => setSubTab('habits')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'habits' ? 'var(--bg-card)' : 'transparent',
            color: subTab === 'habits' ? 'var(--accent-sage)' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: subTab === 'habits' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🗓️ {t('cardHabitsTitle')}
        </button>

        <button
          onClick={() => setSubTab('hobbies')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'hobbies' ? 'var(--bg-card)' : 'transparent',
            color: subTab === 'hobbies' ? 'var(--accent-amber)' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: subTab === 'hobbies' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🎨 {t('cardHobbiesTitle')}
        </button>

        <button
          onClick={() => setSubTab('lifestyle')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subTab === 'lifestyle' ? 'var(--bg-card)' : 'transparent',
            color: subTab === 'lifestyle' ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: subTab === 'lifestyle' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          💡 Lifestyle
        </button>
      </div>

      {/* Gentle Toast Notification */}
      {gentleToast && (
        <div
          style={{
            background: 'rgba(20, 184, 166, 0.15)',
            border: '1px solid rgba(20, 184, 166, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Sparkles size={16} color="var(--accent-teal)" />
          <span>{gentleToast}</span>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 1: MY WELL-BEING TRENDS & BASELINE
         ======================================================== */}
      {subTab === 'wellbeing' && (
        <div>
          {/* Time range selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)' }}>
              {t('trendInsights')}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setTrendDays(7)}
                className={trendDays === 7 ? 'btn-secondary' : 'btn-ghost'}
                style={{ padding: '4px 10px', fontSize: '0.72rem', background: trendDays === 7 ? 'rgba(20,184,166,0.15)' : 'none' }}
              >
                {t('tab7Days')}
              </button>
              <button
                onClick={() => setTrendDays(30)}
                className={trendDays === 30 ? 'btn-secondary' : 'btn-ghost'}
                style={{ padding: '4px 10px', fontSize: '0.72rem', background: trendDays === 30 ? 'rgba(20,184,166,0.15)' : 'none' }}
              >
                {t('tab30Days')}
              </button>
            </div>
          </div>

          {/* Qualitative Observation Card */}
          <div
            className="glass-card"
            style={{
              padding: '14px 16px',
              borderLeft: '4px solid var(--accent-teal)',
              marginBottom: '16px'
            }}
          >
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Rhythm Summary
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
              {isTe && wellbeingData?.trendSummaryTe ? wellbeingData.trendSummaryTe : wellbeingData?.trendSummary || 'Tracking gentle daily observations...'}
            </p>
          </div>

          {/* Established Personal Baseline Snapshot */}
          {baseline && baseline.status === 'established' && (
            <div className="glass-card" style={{ padding: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                  🎯 Personal Baseline Reference
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Based on your {baseline.checkinCount || 6} check-ins
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Typical Sleep</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{baseline.typicalSleep}h</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Typical Stress</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{baseline.typicalStress}/10</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Typical Energy</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{baseline.typicalEnergy}/10</div>
                </div>
              </div>
            </div>
          )}

          {/* Clean Vanilla SVG Longitudinal Trend Chart */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                Check-in Rhythm Curves
              </span>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--accent-teal)' }}>● Mood</span>
                <span style={{ color: 'var(--accent-rose)' }}>● Stress</span>
                <span style={{ color: 'var(--accent-blue)' }}>● Sleep</span>
              </div>
            </div>

            {/* SVG Visualizer */}
            {wellbeingData?.trends && wellbeingData.trends.length > 0 ? (
              <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                <svg viewBox="0 0 320 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
                  <line x1="0" y1="60" x2="320" y2="60" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
                  <line x1="0" y1="100" x2="320" y2="100" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />

                  {/* Mood Line */}
                  <polyline
                    fill="none"
                    stroke="var(--accent-teal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={wellbeingData.trends.map((pt, idx) => {
                      const x = (idx / Math.max(1, wellbeingData.trends.length - 1)) * 320;
                      const y = 120 - (pt.mood / 10) * 100 - 10;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Stress Line */}
                  <polyline
                    fill="none"
                    stroke="var(--accent-rose)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 2"
                    points={wellbeingData.trends.map((pt, idx) => {
                      const x = (idx / Math.max(1, wellbeingData.trends.length - 1)) * 320;
                      const y = 120 - (pt.stress / 10) * 100 - 10;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Sleep Line */}
                  <polyline
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={wellbeingData.trends.map((pt, idx) => {
                      const x = (idx / Math.max(1, wellbeingData.trends.length - 1)) * 320;
                      const y = 120 - (pt.sleep / 10) * 100 - 10;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Data Points */}
                  {wellbeingData.trends.map((pt, idx) => {
                    const x = (idx / Math.max(1, wellbeingData.trends.length - 1)) * 320;
                    const yMood = 120 - (pt.mood / 10) * 100 - 10;
                    return (
                      <circle key={idx} cx={x} cy={yMood} r="4" fill="var(--bg-primary)" stroke="var(--accent-teal)" strokeWidth="2" />
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Complete check-ins over a few days to view longitudinal rhythm curves.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span>Day 1 (Past)</span>
              <span>Today</span>
            </div>
          </div>

          {/* Non-Diagnostic Trauma-Informed Disclaimer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}
          >
            <Info size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-teal)' }} />
            <span>{t('nonDiagnosticNotice')}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: MY HABITS & GENTLE ROUTINES
         ======================================================== */}
      {subTab === 'habits' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
              {t('habitsTitle')}
            </span>
            <button
              onClick={() => setIsAddHabitOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <Plus size={14} />
              <span>{t('btnCreateHabit')}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            {t('habitsSubtext')}
          </p>

          {/* Habits List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="glass-card"
                style={{
                  margin: 0,
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: habit.completedToday ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
                  background: habit.completedToday ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Tap to Toggle Completion Button */}
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: habit.completedToday ? 'none' : '2px solid rgba(255,255,255,0.2)',
                      background: habit.completedToday ? 'var(--accent-sage)' : 'transparent',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    aria-label={`Toggle habit ${habit.title}`}
                  >
                    {habit.completedToday && <Check size={18} strokeWidth={3} />}
                  </button>

                  <div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: habit.completedToday ? 'var(--text-muted)' : '#fff',
                        textDecoration: habit.completedToday ? 'line-through' : 'none'
                      }}
                    >
                      {isTe && habit.titleTe ? habit.titleTe : habit.title}
                    </div>
                    {habit.notes && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {habit.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {habit.streak > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: 'var(--accent-amber)',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      <Flame size={12} />
                      <span>{habit.streak} {t('habitStreakLabel')}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="btn-ghost"
                    style={{ padding: '6px', color: 'var(--text-muted)' }}
                    title="Remove habit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Habit Modal Sheet */}
          {isAddHabitOpen && (
            <div className="modal-overlay" onClick={() => setIsAddHabitOpen(false)}>
              <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="sheet-handle" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                  {t('btnCreateHabit')}
                </h3>

                <form onSubmit={handleCreateHabit}>
                  <div className="form-group">
                    <label className="form-label">Habit Name (English)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 minutes daylight breathing"
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Habit Name in Telugu (ఐచ్ఛికం)</label>
                    <input
                      type="text"
                      placeholder="ఉదా: 5 నిమిషాల ప్రశాంత శ్వాస"
                      value={newHabitTitleTe}
                      onChange={(e) => setNewHabitTitleTe(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newHabitCat}
                      onChange={(e) => setNewHabitCat(e.target.value)}
                      className="form-select"
                    >
                      <option value="movement">Movement & Fresh Air (నడక)</option>
                      <option value="hydration">Hydration & Water (నీరు)</option>
                      <option value="mindfulness">Breathing & Relaxation (శ్వాస)</option>
                      <option value="nourishment">Regular Meals (ఆహారం)</option>
                      <option value="sleep">Wind-down & Sleep (నిద్ర)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      {t('save')}
                    </button>
                    <button type="button" onClick={() => setIsAddHabitOpen(false)} className="btn-secondary">
                      {t('btnCancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: MY HOBBIES & CREATIVE JOY
         ======================================================== */}
      {subTab === 'hobbies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
              {t('hobbiesTitle')}
            </span>
            <button
              onClick={() => setIsAddHobbyOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <Plus size={14} />
              <span>{t('btnAddHobby')}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            {t('hobbiesSubtext')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hobbies.map((hobby) => (
              <div key={hobby.id} className="glass-card" style={{ margin: 0, padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span className="badge badge-ai" style={{ fontSize: '0.66rem', marginBottom: '4px' }}>
                      {hobby.category}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      {isTe && hobby.nameTe ? hobby.nameTe : hobby.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setLoggingHobbyId(hobby.id)}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                  >
                    <Clock size={13} />
                    <span>{t('btnLogHobbyTime')}</span>
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    color: 'var(--text-light)',
                    marginBottom: '8px'
                  }}
                >
                  <strong style={{ color: 'var(--accent-teal)' }}>{t('hobbyGoalLabel')}: </strong>
                  <span>{isTe && hobby.currentGoalTe ? hobby.currentGoalTe : hobby.currentGoal}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  <span>{hobby.totalMinutesLogged || 0} {t('hobbyTimeLogged')}</span>
                  {hobby.recentNotes && <span>"{hobby.recentNotes}"</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Add Hobby Modal */}
          {isAddHobbyOpen && (
            <div className="modal-overlay" onClick={() => setIsAddHobbyOpen(false)}>
              <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="sheet-handle" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                  {t('btnAddHobby')}
                </h3>

                <form onSubmit={handleCreateHobby}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newHobbyCategory}
                      onChange={(e) => setNewHobbyCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="Drawing & Art">🎨 Drawing & Art</option>
                      <option value="Music & Instruments">🎵 Music & Instruments</option>
                      <option value="Gardening & Plants">🌱 Gardening & Nature</option>
                      <option value="Reading & Books">📚 Reading & Stories</option>
                      <option value="Cooking & Baking">🍳 Cooking & Food</option>
                      <option value="Writing & Journaling">✍️ Writing & Journaling</option>
                      <option value="Photography">📸 Photography</option>
                      <option value="Gaming & Puzzles">🎮 Gaming & Puzzles</option>
                      <option value="Animals & Pets">🐕 Animals & Pets</option>
                      <option value="Custom Hobby">✨ Custom Hobby</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hobby Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Balcony flower sketching"
                      value={newHobbyName}
                      onChange={(e) => setNewHobbyName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gentle Goal (No Pressure)</label>
                    <input
                      type="text"
                      placeholder="e.g. Draw for 15 minutes when inspired"
                      value={newHobbyGoal}
                      onChange={(e) => setNewHobbyGoal(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      {t('save')}
                    </button>
                    <button type="button" onClick={() => setIsAddHobbyOpen(false)} className="btn-secondary">
                      {t('btnCancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Log Time Modal */}
          {loggingHobbyId && (
            <div className="modal-overlay" onClick={() => setLoggingHobbyId(null)}>
              <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="sheet-handle" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                  {t('btnLogHobbyTime')}
                </h3>

                <form onSubmit={handleLogHobbyTime}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[10, 15, 20, 30, 45].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setLogMinutes(m)}
                          className={logMinutes === m ? 'btn-primary' : 'btn-secondary'}
                          style={{ flex: 1, padding: '8px 4px', fontSize: '0.78rem' }}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Optional reflection</label>
                    <input
                      type="text"
                      placeholder="e.g. Felt quiet and peaceful"
                      value={logNote}
                      onChange={(e) => setLogNote(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      {t('save')}
                    </button>
                    <button type="button" onClick={() => setLoggingHobbyId(null)} className="btn-secondary">
                      {t('btnCancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: ADAPTIVE LIFESTYLE SUGGESTIONS
         ======================================================== */}
      {subTab === 'lifestyle' && (
        <div>
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
              {t('lifestyleTitle')}
            </span>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {t('lifestyleSubtitle')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lifestyleSuggestions.map((item) => (
              <div key={item.id} className="glass-card" style={{ margin: 0, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getLifestyleIcon(item.icon)}
                  </div>
                  <div>
                    <span className="badge badge-safe" style={{ fontSize: '0.66rem' }}>
                      {isTe && item.categoryTe ? item.categoryTe : item.category}
                    </span>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                      {isTe && item.titleTe ? item.titleTe : item.title}
                    </h4>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
                  {isTe && item.descriptionTe ? item.descriptionTe : item.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ⏱️ {item.duration} · {item.difficulty}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setGentleToast('Taking this small moment for yourself.');
                        setTimeout(() => setGentleToast(null), 3000);
                      }}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', width: 'auto' }}
                    >
                      {t('btnStartAction')}
                    </button>
                    <button
                      onClick={() => {
                        setGentleToast('We will gently remind you later.');
                        setTimeout(() => setGentleToast(null), 3000);
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                    >
                      {t('btnRemindLater')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
