// SAHARA Professional Support & Case Management Portal
// For licensed Counselors and Social Workers:
// Review assigned survivor cases, evaluate explainable AI Support Signals,
// add confidential clinical case notes, manage appointments, and update recovery status.

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Briefcase,
  Users,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

export function ProfessionalPortal() {
  const { lang, t } = useApp();
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('case_001');
  const [caseDetails, setCaseDetails] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('Follow-up Note');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  // Load cases
  useEffect(() => {
    api.getCases('prof_1')
      .then(setCases)
      .catch(console.warn);
  }, []);

  // Load selected case details
  useEffect(() => {
    if (selectedCaseId) {
      api.getCaseDetails(selectedCaseId)
        .then(setCaseDetails)
        .catch(console.warn);
    }
  }, [selectedCaseId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote || !selectedCaseId) return;
    setIsSubmittingNote(true);
    try {
      const added = await api.addCaseNote(selectedCaseId, {
        authorName: 'Dr. Radhika Sharma',
        authorRole: 'Counselor',
        noteType,
        content: newNote
      });
      setCaseDetails((prev) => ({
        ...prev,
        notes: [added, ...(prev.notes || [])]
      }));
      setNewNote('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.updateCaseStatus(selectedCaseId, newStatus, 'Moderate');
      setCaseDetails((prev) => ({
        ...prev,
        case: { ...prev.case, status: newStatus }
      }));
      setCases((prev) =>
        prev.map((c) => (c.id === selectedCaseId ? { ...c, status: newStatus } : c))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-ai">Professional Workspace</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dr. Radhika Sharma (Lead Counselor)</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, marginTop: '4px' }}>
          Case Management & Signals
        </h2>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          Review longitudinal survivor changes, support signals, and confidential session logs.
        </p>
      </div>

      {/* Professional Responsibility Notice */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          fontSize: '0.78rem',
          color: 'var(--text-light)',
          lineHeight: '1.4',
          marginBottom: '16px'
        }}
      >
        <strong>Clinical Supervision Notice:</strong> AI signals are strictly indicators of change from individual baselines, not diagnostic evaluations. Clinical and support decisions remain under professional judgment.
      </div>

      {/* Cases List */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Assigned Recovery Cases ({cases.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cases.map((cs) => (
            <div
              key={cs.id}
              onClick={() => setSelectedCaseId(cs.id)}
              className="glass-card"
              style={{
                margin: 0,
                padding: '14px',
                cursor: 'pointer',
                border: selectedCaseId === cs.id ? '1.5px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                background: selectedCaseId === cs.id ? 'rgba(20, 184, 166, 0.08)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
                      {cs.userName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ({cs.caseNumber})
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {cs.summary}
                  </p>
                </div>

                <span
                  className={cs.status === 'Active Support' ? 'badge badge-warning' : 'badge badge-safe'}
                  style={{ fontSize: '0.64rem' }}
                >
                  {cs.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Details View */}
      {caseDetails && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {/* Active AI Support Signals for this Survivor */}
          {caseDetails.signals && caseDetails.signals.length > 0 && (
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="var(--accent-amber)" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  AI Support Signal on Record
                </h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#fbbf24', lineHeight: '1.4' }}>
                {caseDetails.signals[caseDetails.signals.length - 1].headline}
              </p>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {caseDetails.signals[caseDetails.signals.length - 1].contributingIndicators?.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>
                    • <strong>{f.factor}:</strong> {f.detail}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Changer */}
          <div className="glass-card" style={{ padding: '14px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Update Case Stage:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {['New', 'Under Review', 'Active Support', 'Follow-up', 'Resolved', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={caseDetails.case.status === st ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '4px 10px', fontSize: '0.72rem', width: 'auto' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Add Confidential Case Note */}
          <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Add Confidential Case / Session Note
            </h4>

            <form onSubmit={handleAddNote}>
              <div className="form-group">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                  className="form-select"
                  style={{ marginBottom: '8px' }}
                >
                  <option value="Follow-up Note">Follow-up Note</option>
                  <option value="Session Summary">Session Summary</option>
                  <option value="Legal & Scheme Referral">Legal & Scheme Referral</option>
                  <option value="Safety Assessment">Safety Assessment</option>
                </select>

                <textarea
                  required
                  placeholder="Record observations, grounding progress, referrals, and next steps..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '80px', fontSize: '0.82rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingNote}
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '10px' }}
              >
                {isSubmittingNote ? 'Saving Note...' : 'Save Case Note'}
              </button>
            </form>
          </div>

          {/* Existing Case Notes History */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Case History Logs ({caseDetails.notes?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {caseDetails.notes?.map((n) => (
                <div key={n.id} className="glass-card" style={{ margin: 0, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)' }}>
                      {n.noteType}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(n.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.45' }}>
                    {n.content}
                  </p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Signed by: {n.authorName} ({n.authorRole})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
