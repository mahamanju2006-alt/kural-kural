import React, { useState } from 'react';
import { Shield, Lock, User, Building, ArrowRight, CheckCircle2, Leaf } from 'lucide-react';

const OFFICERS = [
  {
    employeeId: 'GOV-1001',
    name: 'Er. R. Sundaram',
    department: 'Water Supply & Sanitation Dept',
    role: 'Assistant Executive Engineer',
    district: 'Virudhunagar',
    taluk: 'Sivakasi',
    emoji: '🌿'
  },
  {
    employeeId: 'GOV-1002',
    name: 'Dr. V. Kavitha IAS',
    department: 'District Administration',
    role: 'District Collector',
    district: 'Virudhunagar',
    taluk: 'Virudhunagar',
    emoji: '🏛️'
  },
  {
    employeeId: 'GOV-1003',
    name: 'Er. S. Murugesan',
    department: 'Highways & Rural Roads Dept',
    role: 'Executive Engineer',
    district: 'Virudhunagar',
    taluk: 'Rajapalayam',
    emoji: '🛣️'
  }
];

export default function OfficerLogin({ lang, onOfficerLoginSuccess }) {
  const [employeeId, setEmployeeId] = useState('GOV-1001');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const doLogin = (officerData) => {
    onOfficerLoginSuccess(officerData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Try backend first, fallback gracefully
    try {
      const res = await fetch('/api/officer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password })
      });
      const data = await res.json();
      if (data.success && data.officer) {
        doLogin(data.officer);
        return;
      }
    } catch (err) {
      // Backend not available - use demo login
    }

    // Fallback: match from local demo officers list
    const match = OFFICERS.find(o => o.employeeId === employeeId.trim());
    if (match) {
      doLogin(match);
    } else {
      doLogin(OFFICERS[0]);
    }
    setLoading(false);
  };

  return (
    <section style={{ padding: '3rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
      <div className="container" style={{ maxWidth: '480px' }}>

        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '1.25rem',
              background: 'var(--primary-deep)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-green)'
            }}>
              <Shield style={{ width: '32px', height: '32px', color: '#74c69d' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-deep)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                Government Officer Portal
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>
                Official Administration Suite • Virudhunagar District
              </p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-sage)', boxShadow: 'var(--shadow-md)', padding: '2rem' }}>

          {/* Quick 1-Click Login */}
          <div style={{
            background: 'var(--secondary-pale)', border: '1.5px solid var(--border-sage)',
            borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--primary-forest)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-deep)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quick Demo Login
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {OFFICERS.map((officer) => (
                <button
                  key={officer.employeeId}
                  type="button"
                  onClick={() => doLogin(officer)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%', padding: '0.625rem 0.875rem',
                    background: 'white', border: '1px solid var(--border-sage)',
                    borderRadius: '0.625rem', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s ease', fontFamily: 'inherit'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--secondary-badge-bg)'; e.currentTarget.style.borderColor = 'var(--primary-forest)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-sage)'; }}
                >
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-deep)', display: 'block' }}>
                      {officer.emoji} {officer.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {officer.role} • {officer.department}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, background: 'var(--secondary-badge-bg)', color: 'var(--primary-deep)', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', flexShrink: 0 }}>
                    {officer.employeeId}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Or Sign In Manually</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          {errorMsg && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--error-light)', border: '1px solid #fecaca', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.8125rem', color: '#991b1b', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                Employee ID:
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ width: '16px', height: '16px', color: '#9ca3af', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. GOV-1001"
                  style={{
                    width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.65rem', paddingBottom: '0.65rem',
                    borderRadius: '0.75rem', border: '1.5px solid var(--border-color)', fontFamily: 'monospace',
                    fontSize: '0.9rem', outline: 'none', color: 'var(--text-main)',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-forest)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                Password:
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ width: '16px', height: '16px', color: '#9ca3af', position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.65rem', paddingBottom: '0.65rem',
                    borderRadius: '0.75rem', border: '1.5px solid var(--border-color)',
                    fontSize: '1rem', outline: 'none', color: 'var(--text-main)',
                    transition: 'border-color 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-forest)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>
                Demo password: <code style={{ fontFamily: 'monospace' }}>password123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.9375rem', marginTop: '0.5rem' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Officer Dashboard'}</span>
              <ArrowRight style={{ width: '16px', height: '16px', color: '#74c69d' }} />
            </button>

          </form>

        </div>

        {/* Info Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
            <Leaf style={{ width: '12px', height: '12px', color: 'var(--primary-forest)' }} />
            KURAL KURAL • Government of Tamil Nadu • Official Digital Service
          </div>
        </div>

      </div>
    </section>
  );
}
