// SAHARA Organization & Business Tier Portal
// For NGOs, CSR Initiatives, and Government Outreach:
// Anonymized aggregated analytics, survivor capacity monitoring, and mock subscription billing.

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  FileCheck,
  CheckCircle2,
  Download,
  Receipt
} from 'lucide-react';

export function OrganizationPortal() {
  const { lang, t } = useApp();
  const [orgData, setOrgData] = useState(null);
  const [selectedTier, setSelectedTier] = useState('enterprise');
  const [mockInvoiceDownloaded, setMockInvoiceDownloaded] = useState(false);

  useEffect(() => {
    api.getOrgOverview()
      .then(setOrgData)
      .catch(console.warn);
  }, []);

  const tiers = [
    {
      id: 'pilot',
      name: 'Pilot Deployment',
      capacity: 'Up to 25 Survivors',
      price: '₹0 (Subsidized Trial)',
      desc: 'Ideal for small local outreach projects and initial trauma stabilization pilots.'
    },
    {
      id: 'professional',
      name: 'Professional NGO',
      capacity: 'Up to 100 Survivors',
      price: '₹14,999 / mo',
      desc: 'Dedicated case management, multi-counselor assignment, and localized language analytics.'
    },
    {
      id: 'enterprise',
      name: 'Enterprise / CSR Sponsored',
      capacity: '250+ Survivors (Unlimited)',
      price: 'Fully Sponsored via CSR',
      desc: 'Complete multi-district deployment, offline sync bundles, and full compliance reporting.'
    }
  ];

  const handleDownloadInvoice = () => {
    setMockInvoiceDownloaded(true);
    setTimeout(() => setMockInvoiceDownloaded(false), 3000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-safe">Institutional Portal</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Multi-Tenant Deployment</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, marginTop: '4px' }}>
          {orgData?.organization?.name || 'Hope Recovery & Survivor Alliance'}
        </h2>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          Aggregated survivor capacity, anonymized stabilization trends, and sponsorship management.
        </p>
      </div>

      {/* Survivor Protection Charter Notice */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          fontSize: '0.78rem',
          color: 'var(--text-light)',
          lineHeight: '1.4',
          marginBottom: '16px'
        }}
      >
        🔒 <strong>Beneficiary Protection Principle:</strong> Essential trauma safety, check-ins, and helplines are 100% free and never locked behind a paywall for survivors. Organizations sponsor infrastructure capacity. Individual data is strictly anonymized in population views.
      </div>

      {/* Capacity & Aggregated Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
        <div className="glass-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Beneficiaries</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-teal)', marginTop: '2px' }}>
            {orgData?.metrics?.totalBeneficiariesSupported || 84} / {orgData?.metrics?.beneficiaryCapacityLimit || 250}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            33% capacity utilized
          </div>
        </div>

        <div className="glass-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Routine Completion</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-sage)', marginTop: '2px' }}>
            {orgData?.metrics?.routineCompletionRatePct || 76}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across habits & grounding
          </div>
        </div>

        <div className="glass-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Support Cases</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '2px' }}>
            {orgData?.metrics?.activeSupportCases || 1}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Under counselor care
          </div>
        </div>

        <div className="glass-card" style={{ margin: 0, padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg. Resolution</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '2px' }}>
            {orgData?.metrics?.averageResolutionDays || 3.2} Days
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Signal to counselor session
          </div>
        </div>
      </div>

      {/* Aggregated Anonymized Trend Categories */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '18px' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
          Anonymized Recovery Focus Areas
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {orgData?.metrics?.anonymizedTrendCategories?.map((cat, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-light)', marginBottom: '3px' }}>
                <span>{cat.category}</span>
                <span style={{ fontWeight: 600 }}>{cat.percentage}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    backgroundColor: idx === 0 ? 'var(--accent-teal)' : idx === 1 ? 'var(--accent-sage)' : 'var(--accent-blue)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Tiers & Billing Simulator */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          Institutional Capacity Tier
        </h4>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Manage beneficiary capacity and generate grant/CSR compliance invoices.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              style={{
                border: selectedTier === tier.id ? '1.5px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                background: selectedTier === tier.id ? 'rgba(20, 184, 166, 0.08)' : 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>{tier.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--accent-teal)', marginTop: '2px' }}>{tier.capacity}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-amber)' }}>
                  {tier.price}
                </div>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {tier.desc}
              </p>
            </div>
          ))}
        </div>

        {mockInvoiceDownloaded && (
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#86efac', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', marginBottom: '10px' }}>
            ✓ Mock CSR Sponsorship Invoice #INV-2026-CSR-01 downloaded for grant documentation.
          </div>
        )}

        <button
          onClick={handleDownloadInvoice}
          className="btn-secondary"
          style={{ width: '100%', fontSize: '0.82rem' }}
        >
          <Receipt size={16} />
          <span>Generate Mock CSR / Grant Invoice</span>
        </button>
      </div>
    </div>
  );
}
