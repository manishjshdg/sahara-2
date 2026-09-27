// SAHARA Support Ecosystem Section
// Complete portal for Counselors, Social Workers, 24/7 Helplines,
// Rights & Victim Compensation Schemes, My Trusted Circle, and Nearby Shelter Centers.

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  UserCheck,
  PhoneCall,
  BookOpen,
  Users,
  MapPin,
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';

export function SupportSection({ onOpenAppointmentModal }) {
  const { lang, t, setIsEmergencyOpen, user } = useApp();
  const [subSection, setSubSection] = useState('hub'); // 'hub' | 'circle' | 'resources' | 'nearby'
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourceCategory, setResourceCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Contact Form State
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('Friend');
  const [contactRelTe, setContactRelTe] = useState('స్నేహితుడు');
  const [contactPhone, setContactPhone] = useState('');

  // Fetch trusted contacts
  useEffect(() => {
    api.getTrustedContacts()
      .then(setTrustedContacts)
      .catch(console.warn);
  }, []);

  // Fetch resources with filters
  useEffect(() => {
    api.getResources(resourceCategory === 'All' ? null : resourceCategory, searchQuery)
      .then(setResources)
      .catch(console.warn);
  }, [resourceCategory, searchQuery]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    try {
      const created = await api.addTrustedContact({
        userId: user.id,
        name: contactName,
        relationship: contactRel,
        relationshipTe: contactRelTe || contactRel,
        phone: contactPhone,
        canViewStatus: true,
        canReceiveEmergencyAlerts: true,
        canReceiveLocation: true
      });
      setTrustedContacts((prev) => [...prev, created]);
      setIsAddContactOpen(false);
      setContactName('');
      setContactPhone('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await api.deleteTrustedContact(id);
      setTrustedContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const isTe = lang === 'te';

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800 }}>
          {t('supportTitle')}
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {t('supportSubtext')}
        </p>
      </div>

      {/* Sub-Section Navigation Tabs */}
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
          onClick={() => setSubSection('hub')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subSection === 'hub' ? 'var(--bg-card)' : 'transparent',
            color: subSection === 'hub' ? 'var(--accent-teal)' : 'var(--text-muted)',
            fontSize: '0.76rem',
            fontWeight: subSection === 'hub' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          🤝 Support Hub
        </button>

        <button
          onClick={() => setSubSection('circle')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subSection === 'circle' ? 'var(--bg-card)' : 'transparent',
            color: subSection === 'circle' ? 'var(--accent-sage)' : 'var(--text-muted)',
            fontSize: '0.76rem',
            fontWeight: subSection === 'circle' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          👥 Trusted Circle
        </button>

        <button
          onClick={() => setSubSection('resources')}
          style={{
            flex: 1,
            padding: '8px 6px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: subSection === 'resources' ? 'var(--bg-card)' : 'transparent',
            color: subSection === 'resources' ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontSize: '0.76rem',
            fontWeight: subSection === 'resources' ? 700 : 500,
            cursor: 'pointer'
          }}
        >
          📚 Rights & Schemes
        </button>
      </div>

      {/* ========================================================
          SUB-SECTION 1: SUPPORT HUB OVERVIEW
         ======================================================== */}
      {subSection === 'hub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 1. Counselor Booking Card */}
          <div className="glass-card" style={{ margin: 0, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UserCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                  {t('secCounselor')}
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {t('secCounselorDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAppointmentModal}
              className="btn-primary"
              style={{ fontSize: '0.84rem', padding: '10px' }}
            >
              <Calendar size={16} />
              <span>{t('btnBookAppointment')} (Counselor)</span>
            </button>
          </div>

          {/* 2. Social Worker & Legal Aid */}
          <div className="glass-card" style={{ margin: 0, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UserCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                  {t('secSocialWorker')}
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {t('secSocialWorkerDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAppointmentModal}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.84rem', padding: '10px' }}
            >
              <span>Connect with Social Worker</span>
            </button>
          </div>

          {/* 3. Helplines Shortcut */}
          <div
            className="glass-card"
            onClick={() => setIsEmergencyOpen(true)}
            style={{ margin: 0, padding: '16px', cursor: 'pointer', borderLeft: '4px solid var(--accent-rose)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(244, 63, 94, 0.15)',
                    color: 'var(--accent-rose)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                    {t('secHelplines')}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Tele-MANAS (14416), KIRAN (1800-599-0019), 112
                  </p>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </div>

          {/* 4. Trusted Circle Quick Card */}
          <div
            className="glass-card"
            onClick={() => setSubSection('circle')}
            style={{ margin: 0, padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--accent-sage)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>
                    {t('secTrustedCircle')}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {trustedContacts.length} people in your private circle
                  </p>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-SECTION 2: MY TRUSTED CIRCLE
         ======================================================== */}
      {subSection === 'circle' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
              {t('secTrustedCircle')}
            </span>
            <button
              onClick={() => setIsAddContactOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <Plus size={14} />
              <span>{t('btnAddTrustedContact')}</span>
            </button>
          </div>

          <div
            style={{
              background: 'rgba(20, 184, 166, 0.08)',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontSize: '0.76rem',
              color: 'var(--text-light)',
              marginBottom: '16px'
            }}
          >
            🔒 <strong>Consent Rule:</strong> SAHARA will NEVER automatically contact your trusted people merely because an AI Support Signal was detected. Alerts are dispatched only with your explicit confirmation or manual emergency trigger.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trustedContacts.map((contact) => (
              <div key={contact.id} className="glass-card" style={{ margin: 0, padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-safe" style={{ fontSize: '0.66rem', marginBottom: '4px' }}>
                      {isTe && contact.relationshipTe ? contact.relationshipTe : contact.relationship}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      {contact.name}
                    </h4>
                    <a
                      href={`tel:${contact.phone}`}
                      style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                    >
                      <PhoneCall size={12} /> {contact.phone}
                    </a>
                  </div>

                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="btn-ghost"
                    style={{ padding: '6px', color: 'var(--text-muted)' }}
                    title="Remove contact"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {contact.canReceiveLocation && (
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)' }}>
                      📍 Receives Live Location (On Emergency)
                    </span>
                  )}
                  {contact.canReceiveEmergencyAlerts && (
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)' }}>
                      🚨 Receives Emergency Alerts
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Trusted Person Modal Sheet */}
          {isAddContactOpen && (
            <div className="modal-overlay" onClick={() => setIsAddContactOpen(false)}>
              <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="sheet-handle" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                  {t('btnAddTrustedContact')}
                </h3>

                <form onSubmit={handleAddContact}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kavita Rao"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <select
                      value={contactRel}
                      onChange={(e) => setContactRel(e.target.value)}
                      className="form-select"
                    >
                      <option value="Mother">Mother (తల్లి)</option>
                      <option value="Father">Father (తండ్రి)</option>
                      <option value="Brother">Brother (సోదరుడు)</option>
                      <option value="Sister">Sister (సోదరి)</option>
                      <option value="Friend">Friend (స్నేహితుడు)</option>
                      <option value="Counselor">Counselor (కౌన్సెలర్)</option>
                      <option value="Support Worker">Support Worker (సహాయకుడు)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      {t('save')}
                    </button>
                    <button type="button" onClick={() => setIsAddContactOpen(false)} className="btn-secondary">
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
          SUB-SECTION 3: RIGHTS, RELIEF & SCHEMES
         ======================================================== */}
      {subSection === 'resources' && (
        <div>
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
              {t('resourcesTitle')}
            </span>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Verified government relief, victim compensation, and trauma-grounding guides
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Search legal aid, compensation, grounding..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', fontSize: '0.82rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
          </div>

          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '14px' }}>
            {['All', 'Legal support', 'Government services', 'Grounding', 'Sleep', 'Community support'].map((cat) => (
              <button
                key={cat}
                onClick={() => setResourceCategory(cat)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: resourceCategory === cat ? 'var(--accent-teal)' : 'rgba(255,255,255,0.06)',
                  color: resourceCategory === cat ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: resourceCategory === cat ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resource Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resources.map((res) => (
              <div key={res.id} className="glass-card" style={{ margin: 0, padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span className="badge badge-ai" style={{ fontSize: '0.64rem' }}>
                    {res.category}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {t('resourcesVerifiedDate')}: {res.verifiedDate}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                  {isTe && res.titleTe ? res.titleTe : res.title}
                </h4>

                <div style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', marginBottom: '8px' }}>
                  🏛️ {res.organization}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '10px' }}>
                  {isTe && res.descriptionTe ? res.descriptionTe : res.description}
                </p>

                {res.eligibility && (
                  <div style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--text-light)' }}>{t('resourcesEligibility')}: </strong>
                    <span style={{ color: 'var(--text-muted)' }}>{isTe && res.eligibilityTe ? res.eligibilityTe : res.eligibility}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                    📞 {res.contact}
                  </span>
                  <a
                    href={res.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
