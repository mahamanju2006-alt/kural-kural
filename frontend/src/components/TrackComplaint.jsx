import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, MapPin, Building, Star, Leaf, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { searchComplaint } from '../services/complaintService';

const STATUS_COLORS = {
  'Submitted': { bg: '#dbeafe', color: '#1e40af', label: 'Submitted' },
  'AI Verified': { bg: '#ede9fe', color: '#5b21b6', label: 'AI Verified' },
  'Department Assigned': { bg: '#fef3c7', color: '#92400e', label: 'Dept. Assigned' },
  'Officer Assigned': { bg: '#ffedd5', color: '#9a3412', label: 'Officer Assigned' },
  'Action Started': { bg: '#fed7aa', color: '#7c2d12', label: 'Action Started' },
  'Resolved': { bg: '#dcfce7', color: '#14532d', label: 'Resolved ✓' },
  'Escalated': { bg: '#fee2e2', color: '#991b1b', label: 'Escalated ⚠' },
};

const DEMO_IDS = ['KK-2026-48321', 'KK-2026-27418', 'KK-2026-71942', 'KK-2026-10567', '9842111234'];

export default function TrackComplaint({ lang, initialSearchId = '', onOpenFeedbackModal }) {
  const [searchId, setSearchId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Only auto-search if a specific ID was passed in (from another page)
  useEffect(() => {
    if (initialSearchId && initialSearchId.trim()) {
      setSearchId(initialSearchId);
      doSearch(initialSearchId);
    }
  }, [initialSearchId]);

  const doSearch = async (query) => {
    const q = query.trim();
    if (!q) {
      setErrorMsg('Please enter a Complaint ID or Mobile Number.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setHasSearched(true);

    try {
      const match = await searchComplaint(q);
      if (match) {
        setComplaint(match);
      } else {
        setComplaint(null);
        setErrorMsg(`No grievance record found for "${q}". Try a valid Complaint ID (e.g. KK-2026-48321) or Mobile Number.`);
      }
    } catch (err) {
      setComplaint(null);
      setErrorMsg(`No grievance record found for "${q}". Try one of the demo IDs above.`);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(searchId);
  };

  const statusKeys = Object.keys(STATUS_COLORS);

  return (
    <section style={{ padding: '2.5rem 0', minHeight: '75vh', background: 'var(--bg-page)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div className="section-badge" style={{ marginBottom: '0.875rem' }}>
            <Leaf style={{ width: '13px', height: '13px' }} />
            Official Grievance Tracking System
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--primary-deep)', fontFamily: 'var(--font-serif)', margin: 0, lineHeight: 1.2 }}>
            {lang === 'ta' ? 'புகார் நிலையைத் தெரிந்துகொள்ள' : 'Track Your Grievance'}
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.625rem', maxWidth: '540px', margin: '0.625rem auto 0' }}>
            {lang === 'ta'
              ? 'புகார் எண் அல்லது மொபைல் எண்ணை உள்ளிட்டு தற்போதைய நிலையை அறியுங்கள்.'
              : 'Enter your Complaint ID, Mobile Number, or Citizen Name to view real-time action status.'}
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border-sage)', boxShadow: 'var(--shadow-md)', padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ width: '18px', height: '18px', color: '#9ca3af', position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={lang === 'ta' ? 'புகார் எண் அல்லது மொபைல் எண்...' : 'Enter Complaint ID or Mobile Number...'}
                style={{
                  width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.8rem', paddingBottom: '0.8rem',
                  border: '1.5px solid var(--border-color)', borderRadius: '0.875rem',
                  fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)',
                  outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary-forest)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-mobile-full"
              style={{ padding: '0.8rem 1.6rem', fontSize: '0.9rem', flexShrink: 0 }}
            >
              {loading ? (
                <>
                  <RefreshCw style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite' }} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search style={{ width: '15px', height: '15px' }} />
                  <span>{lang === 'ta' ? 'தேடுக' : 'Search Status'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Search */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
              Quick Demo:
            </span>

            {DEMO_IDS.map((id) => (
              <button
                key={id}
                onClick={() => { setSearchId(id); doSearch(id); }}
                style={{
                  padding: '0.3rem 0.7rem', background: 'var(--secondary-badge-bg)',
                  border: '1px solid var(--border-sage)', borderRadius: '9999px',
                  cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'monospace',
                  color: 'var(--primary-deep)', transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary-border)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--secondary-badge-bg)'}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: '#fee2e2', border: '1px solid #fecaca',
            borderRadius: '0.875rem', padding: '1rem 1.25rem',
            fontSize: '0.875rem', color: '#991b1b', fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Empty State - before search */}
        {!hasSearched && !complaint && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 800, color: 'var(--primary-deep)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Enter a Complaint ID to Search
            </h3>
            <p style={{ fontSize: '0.875rem' }}>Use the quick demo IDs above to preview a complaint.</p>
          </div>
        )}

        {/* Complaint Details Card */}
        {complaint && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-sage)', boxShadow: 'var(--shadow-lg)', padding: '2rem', animation: 'fadeIn 0.4s ease' }}>
            
            {/* Top Info Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-deep)', fontFamily: 'monospace', margin: 0 }}>
                  {complaint.complaintId}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>
                  Filed by: <strong style={{ color: 'var(--text-main)' }}>{complaint.citizenName || 'Anonymous'}</strong>
                  {complaint.citizenPhone && complaint.citizenPhone !== 'Not Provided' && (
                    <> · 📞 {complaint.citizenPhone}</>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                {(() => {
                  const s = STATUS_COLORS[complaint.status] || { bg: '#f3f4f6', color: '#374151', label: complaint.status };
                  return <span style={{ background: s.bg, color: s.color, padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800 }}>{s.label}</span>;
                })()}
                <span style={{ background: complaint.priority === 'Emergency' ? '#fee2e2' : '#fef3c7', color: complaint.priority === 'Emergency' ? '#991b1b' : '#92400e', padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800 }}>
                  ⚡ {complaint.priority}
                </span>
              </div>
            </div>

            {/* Transcription */}
            <div style={{ background: 'var(--secondary-pale)', border: '1px solid var(--border-sage)', borderRadius: '0.875rem', padding: '1.25rem', margin: '1.5rem 0' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-deep)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '0.5rem' }}>
                🎤 Citizen Voice Transcription:
              </span>
              <p style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}
                className="font-ta">
                "{complaint.transcription}"
              </p>
            </div>

            {/* Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              {[
                { label: 'Category', value: complaint.category, icon: '📁' },
                { label: 'Department', value: complaint.department, icon: '🏛️' },
                { label: 'Location', value: complaint.location, icon: '📍' },
                { label: 'Assigned Officer', value: complaint.assignedOfficer?.name || 'Er. R. Sundaram', icon: '👨‍⚖️' },
              ].map(item => (
                <div key={item.label} style={{ background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '0.875rem', padding: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Timeline */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-deep)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock style={{ width: '18px', height: '18px', color: 'var(--primary-forest)' }} />
                Department Action Timeline
              </h4>

              {complaint.timeline && complaint.timeline.length > 0 ? (
                <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
                  {/* Vertical Line */}
                  <div style={{ position: 'absolute', left: '0.55rem', top: '0.75rem', bottom: '0.75rem', width: '2px', background: 'var(--border-sage)', borderRadius: '2px' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {complaint.timeline.map((step, idx) => {
                      const isLast = idx === complaint.timeline.length - 1;
                      return (
                        <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          {/* Dot */}
                          <div style={{
                            position: 'absolute', left: '-1.75rem',
                            width: '1.1rem', height: '1.1rem', borderRadius: '50%',
                            background: isLast ? 'var(--primary-forest)' : 'white',
                            border: `2px solid ${isLast ? 'var(--primary-forest)' : '#6ee7b7'}`,
                            boxShadow: isLast ? '0 0 0 3px rgba(45,106,79,0.15)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            top: '0.2rem', flexShrink: 0
                          }}>
                            {!isLast && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6ee7b7' }} />}
                          </div>
                          
                          <div style={{ background: isLast ? 'var(--secondary-pale)' : '#f9fafb', border: `1px solid ${isLast ? 'var(--border-sage)' : 'var(--border-color)'}`, borderRadius: '0.875rem', padding: '1rem', flex: 1 }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem', gap: '0.5rem' }}>
                              <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-deep)', margin: 0 }}>{step.title}</h5>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 600 }}>
                                {new Date(step.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: '#4b5563', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{step.description}</p>
                            <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-forest)', background: 'var(--secondary-badge-bg)', padding: '0.15rem 0.6rem', borderRadius: '9999px' }}>
                              Updated by: {step.updatedBy}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Timeline initializing...</p>
              )}
            </div>

            {/* Feedback Section */}
            {complaint.status === 'Resolved' && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '0.875rem', padding: '1.5rem', textAlign: 'center', marginTop: '1.75rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#14532d', marginBottom: '0.5rem' }}>
                  {lang === 'ta' ? 'பிரச்சினை உண்மையில் தீர்க்கப்பட்டதா?' : 'Was your grievance actually resolved?'}
                </h4>
                {complaint.feedback?.submittedAt ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #bbf7d0', fontSize: '0.8125rem', fontWeight: 700, color: '#14532d' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                    Feedback Submitted: {complaint.feedback.rating}/5 ⭐
                  </div>
                ) : (
                  <button
                    onClick={() => onOpenFeedbackModal(complaint)}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Star style={{ width: '15px', height: '15px', color: '#fbbf24' }} />
                    {lang === 'ta' ? 'கருத்து / மதிப்பீடு வழங்குக' : 'Rate Resolution & Provide Feedback'}
                  </button>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
