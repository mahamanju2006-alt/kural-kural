import React, { useState } from 'react';
import { Globe, Shield, Menu, X, PhoneCall, Leaf } from 'lucide-react';

const NAV_ITEMS = (lang) => [
  { id: 'home', label: lang === 'ta' ? 'முகப்பு' : 'Home' },
  { id: 'how-it-works', label: lang === 'ta' ? 'செயல்முறை' : 'How It Works' },
  { id: 'track', label: lang === 'ta' ? 'புகார் கண்காணிப்பு' : 'Track Grievance' },
  { id: 'citizen-db', label: lang === 'ta' ? 'என் புகார்கள்' : 'My Complaints' },
  { id: 'impact', label: lang === 'ta' ? 'புள்ளிவிவரம்' : 'Impact Metrics' },
];

export default function Navbar({ activeTab, setActiveTab, lang, setLang, onOpenVoiceModal, officerUser, onLogoutOfficer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = NAV_ITEMS(lang);

  return (
    <header style={{ width: '100%', background: '#1e381b', color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* Top Utility Bar */}
      <div style={{ background: '#152612', borderBottom: '1px solid rgba(116,198,157,0.15)', padding: '0.4rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.7rem', fontWeight: 700, color: '#b5d095' }}>
            <Leaf style={{ width: '13px', height: '13px', flexShrink: 0 }} />
            <span style={{ letterSpacing: '0.03em' }}>GOVERNMENT OF TAMIL NADU • MUNICIPAL ADMINISTRATION & WATER SUPPLY DEPT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.7rem', color: '#b5d095', fontWeight: 600, display: 'none' }}>
              <PhoneCall style={{ width: '11px', height: '11px', display: 'inline', marginRight: '0.3rem' }} />
              1800-425-2026
            </span>
            <button
              onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                background: 'rgba(181,208,149,0.1)', border: '1px solid rgba(181,208,149,0.25)',
                borderRadius: '9999px', padding: '0.25rem 0.75rem',
                fontSize: '0.7rem', fontWeight: 800, color: '#b5d095',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(181,208,149,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(181,208,149,0.1)'}
            >
              <Globe style={{ width: '11px', height: '11px' }} />
              {lang === 'ta' ? 'தமிழ் | English' : 'English | தமிழ்'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#36682f', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(181,208,149,0.35)', flexShrink: 0 }}>
            <Leaf style={{ width: '22px', height: '22px', color: 'white' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em', lineHeight: 1 }}>
                KURAL KURAL
              </span>
              <span style={{ background: 'rgba(181,208,149,0.15)', color: '#b5d095', border: '1px solid rgba(181,208,149,0.3)', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '9999px', letterSpacing: '0.05em' }}>
                PUBLIC GRIEVANCE
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#b5d095', fontWeight: 600, margin: '0.1rem 0 0', letterSpacing: '0.02em' }}>
              {lang === 'ta' ? 'உங்கள் குரல் — உங்கள் உரிமை' : 'Your Voice. Your Complaint. Your Right.'}
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(21,38,18,0.7)', padding: '0.3rem', borderRadius: '9999px', border: '1px solid rgba(116,198,157,0.2)' }}
          className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 700,
                borderRadius: '9999px', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeTab === item.id ? '#36682f' : 'transparent',
                color: activeTab === item.id ? 'white' : '#d8f3dc',
                boxShadow: activeTab === item.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                fontFamily: 'inherit', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(116,198,157,0.15)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="desktop-controls">
          
          {officerUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('officer-dashboard')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.45rem 0.875rem', background: '#b5d095',
                  color: '#152612', border: 'none', borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'inherit', maxWidth: '200px', overflow: 'hidden'
                }}
              >
                <Shield style={{ width: '13px', height: '13px' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {officerUser.name || 'Officer'}
                </span>
              </button>
              <button
                onClick={onLogoutOfficer}
                style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('officer-login')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.45rem 0.875rem', border: '1px solid rgba(181,208,149,0.35)',
                background: 'rgba(181,208,149,0.08)', borderRadius: '9999px',
                fontSize: '0.75rem', fontWeight: 700, color: '#d8f3dc',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(181,208,149,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(181,208,149,0.08)'}
            >
              <Shield style={{ width: '13px', height: '13px', color: '#b5d095' }} />
              <span>{lang === 'ta' ? 'அதிகாரி உள்நுழைவு' : 'Officer Login'}</span>
            </button>
          )}


        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '0.25rem' }}
          className="mobile-hamburger"
        >
          {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ background: '#152612', borderTop: '1px solid rgba(116,198,157,0.15)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              style={{
                textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 700,
                borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: activeTab === item.id ? '#36682f' : 'transparent',
                color: activeTab === item.id ? 'white' : '#d8f3dc',
                transition: 'all 0.15s'
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid rgba(116,198,157,0.15)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => { setActiveTab(officerUser ? 'officer-dashboard' : 'officer-login'); setMobileMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#36682f', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Shield style={{ width: '16px', height: '16px', color: '#b5d095' }} />
              {officerUser ? 'Officer Dashboard' : 'Officer Login'}
            </button>

          </div>
        </div>
      )}

      {/* Mobile/Desktop Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .desktop-controls { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
        @media (min-width: 1025px) {
          .mobile-hamburger { display: none !important; }
          .desktop-nav { display: flex !important; }
          .desktop-controls { display: flex !important; }
        }
        @media (min-width: 768px) {
          header div[style*="1800-425"] { display: flex !important; }
        }
      `}</style>

    </header>
  );
}
