import React from 'react';
import { Mic, Search, ArrowRight, ShieldCheck, MapPin, Clock, CheckCircle2, Building2, PhoneCall, Leaf, Zap } from 'lucide-react';

export default function HeroSection({ lang, onOpenVoiceModal, onTrackClick }) {
  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(160deg, #1e381b 0%, #284d23 45%, #36682f 100%)',
      color: 'white', padding: '4.5rem 0 5rem', overflow: 'hidden'
    }}>
      
      {/* Background Glow Orbs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(116,198,157,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(181,208,149,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Left: Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: '9999px',
              background: 'rgba(181, 208, 149, 0.15)', border: '1px solid rgba(181, 208, 149, 0.3)',
              color: '#d8f3dc', fontSize: '0.7rem', fontWeight: 800,
              letterSpacing: '0.1em', textTransform: 'uppercase', alignSelf: 'flex-start'
            }}>
              <Leaf style={{ width: '13px', height: '13px', color: '#b5d095' }} />
              Voice-First Citizen Grievance Redressal
            </div>

            {/* Main Title */}
            <div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 900,
                fontFamily: 'var(--font-serif)', lineHeight: 1.15, margin: 0, color: 'white'
              }}>
                {lang === 'ta' ? (
                  <>உங்கள் குரல். <br /><span style={{ color: '#b5d095' }}>உங்கள் உரிமை.</span></>
                ) : (
                  <>Your Voice. <br /><span style={{ color: '#b5d095' }}>Your Right.</span></>
                )}
              </h1>
              <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', color: '#d8f3dc', fontWeight: 500, marginTop: '1rem', lineHeight: 1.7, maxWidth: '520px' }}>
                {lang === 'ta'
                  ? 'தமிழ் மற்றும் ஆங்கிலத்தில் குரல் மூலம் புகார் பதிவு செய்யுங்கள். AI தானாகவே வகைப்படுத்தி உரிய அரசு அதிகாரிக்கு அனுப்பும்.'
                  : 'Submit civic grievances through voice in Tamil or English. AI auto-classifies and routes to the right government officer in seconds.'}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onOpenVoiceModal}
                className="btn-mobile-full"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                  padding: '0.9rem 1.6rem', borderRadius: '9999px',
                  background: '#b5d095', color: '#152612',
                  fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer',
                  border: 'none', boxShadow: '0 8px 24px rgba(181,208,149,0.3)',
                  transition: 'all 0.22s ease', fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a1c27c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#b5d095'; e.currentTarget.style.transform = 'none'; }}
              >
                <Mic style={{ width: '18px', height: '18px' }} />
                <span>{lang === 'ta' ? 'குரல் மூலம் புகார் பேசுக' : 'Submit Voice Grievance'}</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={onTrackClick}
                className="btn-mobile-full"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                  padding: '0.9rem 1.4rem', borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer',
                  border: '1.5px solid rgba(181,208,149,0.35)', backdropFilter: 'blur(8px)',
                  transition: 'all 0.22s ease', fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                <Search style={{ width: '16px', height: '16px', color: '#b5d095' }} />
                <span>{lang === 'ta' ? 'புகார் கண்காணிப்பு' : 'Track Grievance'}</span>
              </button>
            </div>


            {/* Key indicators */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(116,198,157,0.2)', marginTop: '0.25rem' }}>
              {[
                { icon: <Zap style={{ width: '14px', height: '14px' }} />, label: 'Speech-to-Text AI' },
                { icon: <Clock style={{ width: '14px', height: '14px' }} />, label: '48-Hour SLA' },
                { icon: <Building2 style={{ width: '14px', height: '14px' }} />, label: 'Dept Routing' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#d8f3dc' }}>
                  <span style={{ color: '#b5d095' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info Panel */}
          <div>
            <div style={{
              background: 'rgba(21, 38, 18, 0.85)', borderRadius: '1.5rem',
              border: '1px solid rgba(181, 208, 149, 0.2)',
              backdropFilter: 'blur(12px)', padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(116,198,157,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#b5d095', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px' }} />
                  Connected Departments
                </div>
                <div style={{ background: 'rgba(181,208,149,0.15)', color: '#b5d095', border: '1px solid rgba(181,208,149,0.3)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 800 }}>
                  LIVE PORTAL
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1.25rem' }}>
                {[
                  { dept: 'Water Supply & Sanitation', color: '#74c69d' },
                  { dept: 'TNEB Power & Electricity', color: '#74c69d' },
                  { dept: 'Highways & Road Potholes', color: '#74c69d' },
                  { dept: 'Solid Waste Management', color: '#74c69d' },
                  { dept: 'Public Health & Drainage', color: '#74c69d' },
                  { dept: 'District Administration', color: '#74c69d' },
                ].map(item => (
                  <div key={item.dept} style={{ background: 'rgba(27, 67, 50, 0.6)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(116,198,157,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#d8f3dc', lineHeight: 1.3 }}>{item.dept}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(54, 104, 47, 0.5)', border: '1px solid rgba(181,208,149,0.2)', borderRadius: '0.875rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <PhoneCall style={{ width: '24px', height: '24px', color: '#b5d095', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'white' }}>Toll-Free Grievance Hotline</div>
                  <div style={{ fontSize: '0.75rem', color: '#b5d095', fontWeight: 600 }}>📞 1800-425-2026 (Voice Assistance)</div>
                </div>
              </div>

              <button
                onClick={onOpenVoiceModal}
                style={{
                  width: '100%', marginTop: '1rem', padding: '0.875rem',
                  background: '#b5d095', color: '#152612', border: 'none',
                  borderRadius: '9999px', fontWeight: 800, fontSize: '0.875rem',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#a1c27c'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#b5d095'; e.currentTarget.style.transform = 'none'; }}
              >
                🎤 Click to Speak Grievance (தமிழ் / English)
              </button>

            </div>
          </div>

        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1px', background: 'rgba(116,198,157,0.15)',
          borderRadius: '1rem', marginTop: '3rem', overflow: 'hidden',
          border: '1px solid rgba(116,198,157,0.2)'
        }}>
          {[
            { value: '12,841+', label: lang === 'ta' ? 'குரல் புகார்கள்' : 'Voice Complaints Filed', icon: '🎤' },
            { value: '94.2%', label: lang === 'ta' ? 'தீர்க்கப்பட்டவை' : 'Resolution Rate', icon: '✅' },
            { value: '38 Hrs', label: lang === 'ta' ? 'சராசரி நேரம்' : 'Avg. Response Time', icon: '⏱️' },
            { value: '6 Depts', label: lang === 'ta' ? 'துறைகள் இணைக்கப்பட்டன' : 'Departments Connected', icon: '🏛️' },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(21, 38, 18, 0.7)' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: '#b5d095', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#d8f3dc', fontWeight: 600, marginTop: '0.35rem', lineHeight: 1.3 }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
