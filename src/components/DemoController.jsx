// SAHARA Interactive Hackathon Demo Controller
// Realistic step-through of the 6-Day Survivor Baseline Deviation story:
// Stable -> Stress Rises -> Sleep Drops -> Isolation -> Functioning Impaired ->
// AI Support Signal Triggered -> Counselor Assigned -> Appointment Confirmed -> Recovery Stabilization.

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Sparkles,
  Play,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Brain,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';

export function DemoController({ onOpenCheckIn, onOpenAppointmentModal }) {
  const { refreshUserData, setActiveTab, setLatestSignal } = useApp();
  const [currentDayIndex, setCurrentDayIndex] = useState(6); // Default at Day 6 with active signal
  const [isResetting, setIsResetting] = useState(false);
  const [storyNote, setStoryNote] = useState('Day 6: Significant change from personal baseline detected. AI Support Signal generated.');

  const demoSteps = [
    {
      day: 1,
      title: 'Day 1: Stable Baseline Established',
      note: 'Survivor reports typical rest and grounding (Sleep 8h, Stress 3/10, Mood 8/10). No deviation.',
      action: async () => {
        setLatestSignal(null);
        setStoryNote('Day 1: Check-in records consistent rhythm close to personal baseline.');
      }
    },
    {
      day: 3,
      title: 'Day 3: Mild Tension Spike',
      note: 'Stress increases from 3 to 4. Sleep remains good. Within personal variance threshold.',
      action: async () => {
        setLatestSignal(null);
        setStoryNote('Day 3: Mild fluctuation observed, no support signal needed.');
      }
    },
    {
      day: 4,
      title: 'Day 4: Sleep Begins to Drop',
      note: 'Stress reaches 6.5/10, Sleep drops to 6h. Adaptive sleep question triggered.',
      action: async () => {
        setLatestSignal(null);
        setStoryNote('Day 4: Adaptive questions gently inquire about nighttime rest.');
      }
    },
    {
      day: 5,
      title: 'Day 5: Social Isolation Noticeable',
      note: 'Sleep drops to 4.5h, Social connection drops to 3.5/10. Longitudinal trend shifts.',
      action: async () => {
        setLatestSignal(null);
        setStoryNote('Day 5: Multi-day deviation forming across sleep and social domains.');
      }
    },
    {
      day: 6,
      title: 'Day 6: AI Support Signal Triggered',
      note: 'Daily functioning drops to 3.5, Stress 8.5. Explainable AI Support Signal surfaces non-diagnostically.',
      action: async () => {
        const signals = await api.getSupportSignals();
        if (signals.length > 0) {
          setLatestSignal(signals[0]);
        }
        setActiveTab('home');
        setStoryNote('Day 6: Significant change from personal baseline detected. AI Support Signal generated.');
      }
    },
    {
      day: 7,
      title: 'Day 7: Human Counselor Session & Recovery',
      note: 'Survivor connects with Dr. Radhika Sharma. Session confirmed. Routine grounding begins recovery.',
      action: async () => {
        setActiveTab('recovery');
        setStoryNote('Day 7: Reconnected with counselor. Habit rhythm begins gentle stabilization.');
      }
    }
  ];

  const handleAdvanceStep = async () => {
    const nextIdx = (currentDayIndex % demoSteps.length) + 1;
    const stepObj = demoSteps.find(s => s.day === nextIdx) || demoSteps[0];
    setCurrentDayIndex(stepObj.day);
    await stepObj.action();
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await api.resetDemo();
      await refreshUserData();
      setCurrentDayIndex(6);
      setStoryNote('Reset to Day 6 Survivor Baseline Deviation with active AI Support Signal.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(11, 20, 30, 0.95)',
        border: '1px solid rgba(20, 184, 166, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        marginBottom: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="var(--accent-teal)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
            HACKATHON DEMO CONTROLS
          </span>
        </div>

        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="btn-ghost"
          style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '2px 6px' }}
          title="Reset to pre-seeded 6-day baseline deviation"
        >
          <RotateCcw size={13} />
          <span>Reset Story</span>
        </button>
      </div>

      <p style={{ fontSize: '0.76rem', color: 'var(--text-light)', lineHeight: '1.4', marginBottom: '10px' }}>
        <strong>Current Demo Stage:</strong> {storyNote}
      </p>

      {/* Stepper Buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {demoSteps.map((st) => (
          <button
            key={st.day}
            onClick={() => {
              setCurrentDayIndex(st.day);
              st.action();
            }}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: currentDayIndex === st.day ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.06)',
              color: currentDayIndex === st.day ? '#fff' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: currentDayIndex === st.day ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            Day {st.day}
          </button>
        ))}
      </div>
    </div>
  );
}
