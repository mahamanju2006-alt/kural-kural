import React from 'react';
import { Mic, BrainCircuit, Route, CheckCircle, ArrowRight, Leaf } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Mic,
    titleTa: 'குரலில் கூறுங்கள்',
    titleEn: 'Speak Your Complaint',
    descTa: 'தமிழ் அல்லது ஆங்கிலத்தில் உங்கள் குறையை குரல் பதிவாக கூறுங்கள்.',
    descEn: 'Tell us your civic problem in Tamil or English — no typing needed.',
    iconBg: '#e8f5e9', iconColor: '#2d6a4f', accent: '#2d6a4f'
  },
  {
    num: '02',
    icon: BrainCircuit,
    titleTa: 'AI புரிந்து கொள்ளும்',
    titleEn: 'AI Understands',
    descTa: 'பேச்சு உரையாக மாற்றப்பட்டு, துறை மற்றும் முன்னுரிமை தானாகவே கண்டறியப்படும்.',
    descEn: 'Speech converts to text. Category, priority & department auto-detected in seconds.',
    iconBg: '#ede9fe', iconColor: '#7c3aed', accent: '#7c3aed'
  },
  {
    num: '03',
    icon: Route,
    titleTa: 'அரசுத் துறை இணைப்பு',
    titleEn: 'Routes to Department',
    descTa: 'புகார் உடனடியாக உரிய உள்ளாட்சி அதிகாரிக்கு அனுப்பப்படும்.',
    descEn: 'Your complaint is routed directly to the correct government officer.',
    iconBg: '#dbeafe', iconColor: '#1d4ed8', accent: '#1d4ed8'
  },
  {
    num: '04',
    icon: CheckCircle,
    titleTa: 'தீர்வு & கண்காணிப்பு',
    titleEn: 'Resolve & Track',
    descTa: 'நடவடிக்கை எடுக்கப்பட்டு, நீங்கள் நிலையை நேரலையில் கண்காணிக்கலாம்.',
    descEn: 'Action is taken and you can track resolution progress in real-time.',
    iconBg: '#dcfce7', iconColor: '#16a34a', accent: '#16a34a'
  },
];

export default function HowItWorks({ lang, onOpenVoiceModal }) {
  return (
    <section style={{ padding: '5rem 0', background: 'white' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-badge" style={{ marginBottom: '1rem' }}>
            <Leaf style={{ width: '13px', height: '13px' }} />
            {lang === 'ta' ? 'எப்படி செயல்படுகிறது' : 'How It Works'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: 'var(--primary-deep)', fontFamily: 'var(--font-serif)', margin: 0 }}>
            {lang === 'ta' ? 'நான்கு எளிய படிகளில்' : '4 Simple Steps to Resolution'}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.75rem', maxWidth: '520px', margin: '0.75rem auto 0' }}>
            {lang === 'ta'
              ? 'குரல் மூலம் புகார் பதிவு செய்வது இப்போது மிகவும் எளிதானது.'
              : 'From voice to government action in under 2 minutes. No paperwork required.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{
                background: 'white', border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '1.75rem',
                position: 'relative', transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = step.accent; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                {/* Step Number */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2.5rem', fontWeight: 900, color: `${step.accent}15`, lineHeight: 1, fontFamily: 'var(--font-serif)' }}>
                  {step.num}
                </div>

                {/* Icon */}
                <div style={{ width: '52px', height: '52px', borderRadius: '0.875rem', background: step.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon style={{ width: '26px', height: '26px', color: step.iconColor }} />
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-deep)', marginBottom: '0.5rem' }}>
                  {lang === 'ta' ? step.titleTa : step.titleEn}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                  {lang === 'ta' ? step.descTa : step.descEn}
                </p>

                {/* Connector Arrow (not last) */}
                {idx < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', right: '-0.85rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2, display: 'none' }}>
                    <ArrowRight style={{ width: '20px', height: '20px', color: '#d1d5db' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-forest) 100%)',
          borderRadius: 'var(--radius-lg)', padding: '2.5rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 900, color: 'white', margin: 0, fontFamily: 'var(--font-serif)' }}>
              {lang === 'ta' ? 'இப்போதே குரல் மூலம் புகார் பதிவு செய்யுங்கள்' : 'Ready to file your grievance?'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#d8f3dc', fontWeight: 500, margin: '0.4rem 0 0' }}>
              {lang === 'ta' ? 'தமிழ் அல்லது ஆங்கிலத்தில் பேசுக — AI மொழிபெயர்க்கும்.' : 'Speak in Tamil or English — our AI will handle the rest.'}
            </p>
          </div>
          <button
            onClick={onOpenVoiceModal}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
              padding: '1rem 2rem', borderRadius: '9999px',
              background: '#b5d095', color: '#152612',
              fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer',
              border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease', fontFamily: 'inherit', flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#a1c27c'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#b5d095'; e.currentTarget.style.transform = 'none'; }}
          >
            <Mic style={{ width: '18px', height: '18px' }} />
            <span>{lang === 'ta' ? 'புகார் பேசுக' : 'Speak Your Grievance Now'}</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

      </div>
    </section>
  );
}
