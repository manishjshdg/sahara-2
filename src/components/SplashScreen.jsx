// SAHARA Splash Screen
// Professional, calm, trustworthy aesthetic with brand tagline

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake } from 'lucide-react';

export function SplashScreen({ onFinish }) {
  const { t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#070b10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 200,
        cursor: 'pointer'
      }}
      onClick={onFinish}
    >
      <div
        style={{
          width: '84px',
          height: '84px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(13, 148, 136, 0.4)',
          marginBottom: '20px',
          animation: 'pulseGlow 2.5s infinite'
        }}
      >
        <HeartHandshake size={46} color="#ffffff" />
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(to right, #ffffff, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '6px'
        }}
      >
        {t('appName')}
      </h1>

      <p
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--accent-teal)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}
      >
        {t('tagline')}
      </p>

      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          maxWidth: '280px',
          textAlign: 'center',
          lineHeight: '1.4'
        }}
      >
        {t('splashSubtitle')}
      </p>

      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.78rem'
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-teal)'
          }}
        />
        <span>AI-Assisted · Human-Led Ecosystem</span>
      </div>
    </div>
  );
}
