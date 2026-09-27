// SAHARA Appointment & Professional Booking System
// Direct scheduling with trauma counselors & social workers,
// status management (Requested, Confirmed, Completed, Cancelled), and secure in-app session access.

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  UserCheck,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  X,
  Filter,
  Star,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function AppointmentModal({ isOpen, onClose }) {
  const { lang, t, user, refreshUserData } = useApp();
  const [professionals, setProfessionals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'counselor' | 'social_worker'
  const [selectedProf, setSelectedProf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getProfessionals(roleFilter === 'all' ? null : roleFilter)
        .then(setProfessionals)
        .catch(console.warn);
      api.getAppointments()
        .then(setAppointments)
        .catch(console.warn);
    }
  }, [isOpen, roleFilter]);

  if (!isOpen) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedProf || !selectedSlot) return;

    setSubmitting(true);
    try {
      const created = await api.bookAppointment({
        userId: user.id,
        professionalId: selectedProf.id,
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        notes: sessionNotes || 'Initial check-in & grounding discussion'
      });
      setBookingSuccess(created);
      refreshUserData();
      // Reload appointments
      const updatedList = await api.getAppointments();
      setAppointments(updatedList);
      setTimeout(() => {
        setBookingSuccess(null);
        setSelectedProf(null);
        setSelectedSlot('');
        setSessionNotes('');
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (aptId) => {
    try {
      await api.updateAppointment(aptId, { status: 'Cancelled' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: 'Cancelled' } : a))
      );
      refreshUserData();
    } catch (e) {
      console.error(e);
    }
  };

  const isTe = lang === 'te';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="sheet-handle" />

        {/* Modal Header */}
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
              <UserCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                {t('appointmentTitle')}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Licensed clinical counselors & certified social workers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {bookingSuccess && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              textAlign: 'center',
              marginBottom: '16px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <CheckCircle2 size={28} color="var(--accent-sage)" style={{ margin: '0 auto 6px auto' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
              Appointment Confirmed
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '2px' }}>
              Your session with {bookingSuccess.professionalName} is scheduled. A private reminder has been queued.
            </p>
          </div>
        )}

        {/* Active Upcoming Appointments */}
        {appointments.filter((a) => a.status === 'Confirmed').length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Confirmed Sessions:
            </div>
            {appointments
              .filter((a) => a.status === 'Confirmed')
              .map((apt) => (
                <div
                  key={apt.id}
                  className="glass-card"
                  style={{
                    margin: 0,
                    marginBottom: '8px',
                    padding: '12px 14px',
                    borderLeft: '4px solid var(--accent-sage)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                        {apt.professionalName}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-teal)', marginTop: '2px' }}>
                        📅 {new Date(apt.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {apt.mode || 'Secure Video / Voice'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <span className="badge badge-safe" style={{ fontSize: '0.64rem' }}>
                        Confirmed
                      </span>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="btn-ghost"
                        style={{ fontSize: '0.7rem', color: '#fda4af', padding: '4px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <a
                    href={apt.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      justifyContent: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    <Video size={14} />
                    <span>{t('btnJoinSession')}</span>
                  </a>
                </div>
              ))}
          </div>
        )}

        {/* Role Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <button
            onClick={() => setRoleFilter('all')}
            className={roleFilter === 'all' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
          >
            All Professionals
          </button>
          <button
            onClick={() => setRoleFilter('counselor')}
            className={roleFilter === 'counselor' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
          >
            Counselors
          </button>
          <button
            onClick={() => setRoleFilter('social_worker')}
            className={roleFilter === 'social_worker' ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem' }}
          >
            Social Workers
          </button>
        </div>

        {/* Professional Selection or Details Form */}
        {selectedProf ? (
          <form onSubmit={handleBook} style={{ animation: 'fadeIn 0.2s ease' }}>
            <div
              className="glass-card"
              style={{
                margin: 0,
                marginBottom: '14px',
                padding: '14px',
                border: '1px solid rgba(20, 184, 166, 0.35)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    {selectedProf.name}
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: 'var(--accent-teal)' }}>
                    {isTe && selectedProf.titleTe ? selectedProf.titleTe : selectedProf.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProf(null)}
                  className="btn-ghost"
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                >
                  Change
                </button>
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                🎓 {selectedProf.qualification}
              </div>
            </div>

            {/* Select Slot */}
            <div className="form-group">
              <label className="form-label">Choose an available consultation slot:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedProf.availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedSlot === slot ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.04)',
                      border: selectedSlot === slot ? '1.5px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="var(--accent-teal)" />
                      <span>{slot}</span>
                    </div>
                    {selectedSlot === slot && <CheckCircle2 size={16} color="var(--accent-teal)" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Context Notes */}
            <div className="form-group">
              <label className="form-label">Optional note for the professional:</label>
              <textarea
                placeholder="Anything you would like them to know in advance..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="form-textarea"
                style={{ minHeight: '65px', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {submitting ? t('loading') : 'Confirm Confidential Session'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedProf(null)}
                className="btn-secondary"
              >
                {t('btnCancel')}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {professionals.map((prof) => (
              <div
                key={prof.id}
                className="glass-card"
                style={{
                  margin: 0,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-ai" style={{ fontSize: '0.64rem', marginBottom: '4px' }}>
                      {prof.role === 'counselor' ? 'Trauma Counselor' : 'Social Worker & Legal Aid'}
                    </span>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                      {prof.name}
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--accent-teal)' }}>
                      {isTe && prof.titleTe ? prof.titleTe : prof.title}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--accent-amber)' }}>
                    <Star size={14} fill="var(--accent-amber)" />
                    <span>{prof.rating}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {isTe && prof.bioTe ? prof.bioTe : prof.bio}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Languages: {prof.languages.join(', ')}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProf(prof);
                      setSelectedSlot(prof.availableSlots[0] || '');
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.75rem', width: 'auto' }}
                  >
                    Select & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
