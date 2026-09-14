import React from 'react';
import { Mic, Shield, Leaf, PhoneCall } from 'lucide-react';

const footerLink = (onClick, children) => (
  <button
    onClick={onClick}
    style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      color: '#b5d095', fontSize: '0.8125rem', fontWeight: 600, textAlign: 'left',
      transition: 'color 0.15s', fontFamily: 'inherit'
    }}
    onMouseEnter={e => e.currentTarget.style.color = 'white'}
    onMouseLeave={e => e.currentTarget.style.color = '#b5d095'}
  >
    {children}
  </button>
);

export default function Footer({ lang, setActiveTab, onOpenVoiceModal }) {
  return (
    <footer style={{ background: '#152612', color: '#d8f3dc', borderTop: '4px solid #2d6a4f', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(116,198,157,0.15)' }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#36682f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mic style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>KURAL KURAL</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#b5d095', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
              Government Public Grievance Redressal • Voice-First Rural Empowerment Platform.
            </p>
            <div style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, color: '#d8f3dc', background: '#1e381b', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(116,198,157,0.2)', letterSpacing: '0.04em' }}>
              GOVERNMENT OF TAMIL NADU • DIGITAL SERVICE
            </div>
          </div>

          {/* Citizen Services */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem' }}>Citizen Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {footerLink(() => setActiveTab('home'), 'Home (முகப்பு)')}
              {footerLink(onOpenVoiceModal, '🎤 Submit Voice Grievance')}
              {footerLink(() => setActiveTab('track'), 'Track Grievance Status')}
              {footerLink(() => setActiveTab('citizen-db'), 'My Grievances Register')}
              {footerLink(() => setActiveTab('how-it-works'), 'How It Works')}
            </div>
          </div>

          {/* Government Access */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem' }}>Government Access</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {footerLink(() => setActiveTab('officer-login'), '🔐 Officer Portal Sign In')}
              {footerLink(() => setActiveTab('impact'), 'Grievance Statistics & Metrics')}
              {footerLink(() => setActiveTab('how-it-works'), '48-Hour SLA Redressal Policy')}
            </div>
          </div>

          {/* Helpdesk */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem' }}>Grievance Helpdesk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b5d095', fontWeight: 700 }}>
                <PhoneCall style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                <span>1800-425-2026 (Toll-Free)</span>
              </div>
              <div style={{ color: '#b5d095', fontWeight: 600 }}>
                grievance.kural@tn.gov.in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#8fbc8f', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem' }}>
                <Leaf style={{ width: '12px', height: '12px' }} />
                Tamil (ta-IN) & English (en-IN) Support
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>
            © 2026 KURAL KURAL. Tamil Nadu Public Grievance Portal Concept.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: '#8fbc8f', fontWeight: 600 }}>
            <span style={{ cursor: 'default' }}>Website Policies</span>
            <span style={{ cursor: 'default' }}>Terms & Conditions</span>
            <span style={{ cursor: 'default' }}>Help & Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
