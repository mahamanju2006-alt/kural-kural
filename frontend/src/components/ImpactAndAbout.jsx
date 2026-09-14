import React from 'react';
import { Mic, ShieldCheck, CheckCircle2, MapPin, Leaf, ArrowRight } from 'lucide-react';

const STATS = [
  { labelTa: 'பதிவு செய்யப்பட்ட புகார்கள்', labelEn: 'Grievances Registered', value: '12,841+', icon: '🎤', bg: 'var(--secondary-pale)', border: 'var(--border-sage)', color: 'var(--primary-deep)' },
  { labelTa: 'தீர்வு பெற்ற விகிதம்', labelEn: 'Resolution Success Rate', value: '94.2%', icon: '✅', bg: '#f0fdf4', border: '#bbf7d0', color: '#14532d' },
  { labelTa: 'இணைக்கப்பட்ட கிராமங்கள்', labelEn: 'Villages Empowered', value: '120+', icon: '📍', bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
  { labelTa: 'இணைக்கப்பட்ட அரசுத் துறைகள்', labelEn: 'Connected Departments', value: '6 Depts', icon: '🏛️', bg: '#ede9fe', border: '#ddd6fe', color: '#5b21b6' },
];

const FEATURES = [
  { icon: '🎤', title: 'Voice-to-Text AI', desc: 'Tamil (ta-IN) & English (en-IN) speech recognition with 95%+ accuracy.' },
  { icon: '🧠', title: 'Smart NLP Routing', desc: 'Automatic department routing and SLA escalation deadline tracking.' },
  { icon: '🗺️', title: 'GIS Map Integration', desc: 'Interactive live map for district officers and public transparency.' },
  { icon: '📱', title: 'Real-Time Updates', desc: 'WebSocket-powered live notifications to citizens when status changes.' },
];

export default function ImpactAndAbout({ lang, onOpenVoiceModal }) {
  return (
    <div>
      
      {/* IMPACT SECTION */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <div className="section-badge" style={{ marginBottom: '1rem' }}>
              <Leaf style={{ width: '13px', height: '13px' }} />
              Rural Digital Governance Impact
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: 'var(--primary-deep)', fontFamily: 'var(--font-serif)', margin: 0, lineHeight: 1.2 }}>
              {lang === 'ta' ? 'KURAL KURAL ஏற்படுத்திய தாக்கம்' : 'Our Real-World Impact'}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.875rem', lineHeight: 1.65 }}>
              {lang === 'ta'
                ? 'கிராமப்புற மக்களின் குரல்களை தடையின்றி அரசு அதிகாரிகளிடம் கொண்டு சேர்க்கிறோம்.'
                : 'Empowering rural citizens with voice-first access to government grievance resolution.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {STATS.map((stat, idx) => (
              <div key={idx} style={{
                background: stat.bg, border: `1.5px solid ${stat.border}`,
                borderRadius: 'var(--radius-md)', padding: '2rem 1.5rem',
                textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
              }}>
                <div style={{ fontSize: '2rem', lineHeight: 1 }}>{stat.icon}</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: stat.color, lineHeight: 1.4, textAlign: 'center' }}>
                  {lang === 'ta' ? stat.labelTa : stat.labelEn}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MISSION SECTION */}
      <section style={{ background: 'linear-gradient(160deg, var(--primary-dark) 0%, var(--primary-deep) 50%, #284d23 100%)', color: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left: Mission */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(181,208,149,0.15)', border: '1px solid rgba(181,208,149,0.3)', color: '#b5d095', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                <Leaf style={{ width: '12px', height: '12px' }} />
                Mission & Vision
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'white', margin: '0 0 1.25rem', fontFamily: 'var(--font-serif)', lineHeight: 1.25 }}>
                "Make every citizen's voice visible, trackable & actionable."
              </h2>

              <p style={{ fontSize: '0.9375rem', color: '#d8f3dc', fontWeight: 500, lineHeight: 1.75, margin: '0 0 1.5rem' }}>
                {lang === 'ta'
                  ? 'KURAL KURAL என்பது தமிழ்நாட்டின் கிராமப்புற மற்றும் நகர்ப்புற மக்களுக்காக வடிவமைக்கப்பட்ட குரல் அடிப்படையிலான அரசு புகார் மேலாண்மை தளமாகும்.'
                  : 'KURAL KURAL bridges the literacy and technology gap in rural civic governance — enabling Tamil and English voice inputs, automated AI routing, and real-time officer tracking.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Voice-to-Text AI with Tamil (ta-IN) & English (en-IN) recognition.',
                  'Automatic department routing & SLA escalation deadline tracking.',
                  'Interactive GIS map for district officers and public transparency.',
                  'WebSocket real-time status updates pushed to citizens.',
                ].map((point, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: '#d8f3dc', fontWeight: 500 }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#74c69d', flexShrink: 0, marginTop: '0.1rem' }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem' }}>
                Why Voice-Based Complaints?
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#b5d095', fontWeight: 500, lineHeight: 1.65, margin: '0 0 1rem' }}>
                Traditional portals require form filling and English literacy. KURAL KURAL allows citizens to simply speak in Tamil — and our AI structures it for government action automatically.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                {FEATURES.map((f, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(181,208,149,0.2)', borderRadius: '0.875rem', padding: '1.125rem', backdropFilter: 'blur(8px)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'white', marginBottom: '0.3rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#d8f3dc', fontWeight: 500, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenVoiceModal}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                  width: '100%', padding: '1rem', marginTop: '0.5rem',
                  background: '#b5d095', color: '#152612',
                  fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer',
                  border: 'none', borderRadius: '9999px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease', fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a1c27c'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#b5d095'; e.currentTarget.style.transform = 'none'; }}
              >
                <Mic style={{ width: '18px', height: '18px' }} />
                <span>{lang === 'ta' ? 'இப்போதே குரலில் பேசுக' : 'Try Voice Recorder Demo'}</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
