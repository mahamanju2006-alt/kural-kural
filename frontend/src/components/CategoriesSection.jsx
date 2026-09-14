import React from 'react';
import { Droplet, Construction, Zap, Trash2, Wind, Lightbulb, ShieldAlert, HelpCircle, Mic, Leaf } from 'lucide-react';

const CATEGORIES = [
  { id: 'water', nameTa: 'குடிநீர் வழங்கல்', nameEn: 'Water Supply', icon: Droplet, count: '24 Active', iconBg: '#dbeafe', iconColor: '#1d4ed8' },
  { id: 'roads', nameTa: 'சாலை மற்றும் பாலங்கள்', nameEn: 'Roads & Bridges', icon: Construction, count: '18 Active', iconBg: '#fef3c7', iconColor: '#d97706' },
  { id: 'electricity', nameTa: 'மின்சாரம் & டிரான்ஸ்பார்மர்', nameEn: 'Electricity & Power', icon: Zap, count: '12 Active', iconBg: '#fef9c3', iconColor: '#ca8a04' },
  { id: 'drainage', nameTa: 'சாக்கடை & கழிவுநீர்', nameEn: 'Drainage & Sewage', icon: Wind, count: '15 Active', iconBg: '#cffafe', iconColor: '#0e7490' },
  { id: 'waste', nameTa: 'குப்பை மேலாண்மை', nameEn: 'Waste Management', icon: Trash2, count: '9 Active', iconBg: '#dcfce7', iconColor: '#16a34a' },
  { id: 'streetlights', nameTa: 'தெருவிளக்குகள்', nameEn: 'Street Lighting', icon: Lightbulb, count: '11 Active', iconBg: '#ede9fe', iconColor: '#7c3aed' },
  { id: 'health', nameTa: 'பொதுச்சுகாதாரம்', nameEn: 'Public Health & Safety', icon: ShieldAlert, count: '7 Active', iconBg: '#fee2e2', iconColor: '#dc2626' },
  { id: 'other', nameTa: 'இதர அரசு புகார்கள்', nameEn: 'Other Civic Grievances', icon: HelpCircle, count: '5 Active', iconBg: '#f3e8ff', iconColor: '#9333ea' },
];

export default function CategoriesSection({ lang, onSelectCategory }) {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--bg-page)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="section-badge" style={{ marginBottom: '0.875rem' }}>
              <Leaf style={{ width: '13px', height: '13px' }} />
              Categorized Grievance Directory
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--primary-deep)', fontFamily: 'var(--font-serif)', margin: 0 }}>
              {lang === 'ta' ? 'அடிக்கடி கேட்கப்படும் புகார் பிரிவுகள்' : 'Common Complaint Categories'}
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, maxWidth: '400px', lineHeight: 1.6 }}>
            {lang === 'ta'
              ? 'குரல் மூலம் பேசும்போது AI தானாகவே சரியான துறையை தேர்ந்தெடுக்கும்.'
              : 'AI automatically identifies the right department from your voice complaint.'}
          </p>
        </div>

        {/* Category Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.nameEn)}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  padding: '1.5rem', background: 'white', border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                  minHeight: '160px', transition: 'all 0.25s ease',
                  boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--primary-forest)';
                  e.currentTarget.style.background = 'var(--secondary-pale)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'white';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '0.875rem', background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: '24px', height: '24px', color: cat.iconColor }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#f3f4f6', color: '#6b7280', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                    {cat.count}
                  </span>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary-deep)', margin: '0 0 0.3rem' }}>
                    {lang === 'ta' ? cat.nameTa : cat.nameEn}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mic style={{ width: '11px', height: '11px', color: 'var(--primary-forest)' }} />
                    {lang === 'ta' ? 'குரலில் புகாரளிக்க கிளிக் செய்க' : 'Click to speak complaint'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
