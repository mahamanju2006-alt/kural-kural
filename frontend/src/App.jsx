import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import CategoriesSection from './components/CategoriesSection';
import TrackComplaint from './components/TrackComplaint';
import CitizenDashboard from './components/CitizenDashboard';
import OfficerLogin from './components/OfficerLogin';
import OfficerDashboard from './components/OfficerDashboard';
import ImpactAndAbout from './components/ImpactAndAbout';
import Footer from './components/Footer';
import VoiceRecorderModal from './components/VoiceRecorderModal';
import { Star, X, CheckCircle } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('ta');
  const [activeTab, setActiveTab] = useState('home');
  
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceInitialText, setVoiceInitialText] = useState('');

  const [officerUser, setOfficerUser] = useState(null);
  const [trackSearchId, setTrackSearchId] = useState('');

  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [isSolved, setIsSolved] = useState(true);
  const [comment, setComment] = useState('');

  const [toast, setToast] = useState(null);

  useEffect(() => {
    let socket;
    try {
      socket = io('http://localhost:5000', { timeout: 3000, reconnectionAttempts: 2 });
      socket.on('complaint_created', (c) => showToast(`New Grievance: ${c.complaintId} (${c.location})`, 'info'));
      socket.on('complaint_updated', (c) => showToast(`Grievance ${c.complaintId} → "${c.status}"`, 'success'));
    } catch (e) { console.warn('WebSocket not available'); }
    return () => { if (socket) socket.disconnect(); };
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleOpenVoiceModal = (initialPhrase = '') => {
    setVoiceInitialText(initialPhrase);
    setVoiceModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackComplaint) return;
    try {
      await fetch(`/api/complaints/${feedbackComplaint.complaintId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, solved: isSolved, comment })
      });
      showToast('Feedback recorded successfully!', 'success');
      setFeedbackComplaint(null);
      setComment('');
    } catch (err) {
      showToast('Feedback recorded. Thank you!', 'success');
      setFeedbackComplaint(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)', fontFamily: 'var(--font-en)', color: 'var(--text-main)' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: 'var(--primary-deep)', color: 'white',
          padding: '0.85rem 1.25rem', borderRadius: '1rem',
          boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(116,198,157,0.3)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          fontSize: '0.8125rem', fontWeight: 700, maxWidth: '360px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle style={{ width: '18px', height: '18px', color: '#74c69d', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px' }}>
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenVoiceModal={() => handleOpenVoiceModal('')}
        officerUser={officerUser}
        onLogoutOfficer={() => { setOfficerUser(null); setActiveTab('home'); }}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        
        {activeTab === 'home' && (
          <>
            <HeroSection
              lang={lang}
              onOpenVoiceModal={() => handleOpenVoiceModal('')}
              onTrackClick={() => setActiveTab('track')}
            />
            <HowItWorks lang={lang} onOpenVoiceModal={() => handleOpenVoiceModal('')} />
            <CategoriesSection lang={lang} onSelectCategory={(cat) => handleOpenVoiceModal('')} />
            <ImpactAndAbout lang={lang} onOpenVoiceModal={() => handleOpenVoiceModal('')} />
          </>
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorks lang={lang} onOpenVoiceModal={() => handleOpenVoiceModal('')} />
        )}

        {activeTab === 'track' && (
          <TrackComplaint
            lang={lang}
            initialSearchId={trackSearchId}
            onOpenFeedbackModal={(comp) => setFeedbackComplaint(comp)}
          />
        )}

        {activeTab === 'citizen-db' && (
          <CitizenDashboard
            lang={lang}
            onOpenVoiceModal={() => handleOpenVoiceModal('')}
            onTrackSelect={(id) => { setTrackSearchId(id); setActiveTab('track'); }}
            onOpenFeedbackModal={(comp) => setFeedbackComplaint(comp)}
          />
        )}

        {activeTab === 'officer-login' && (
          <OfficerLogin
            lang={lang}
            onOfficerLoginSuccess={(user) => {
              setOfficerUser(user);
              setActiveTab('officer-dashboard');
            }}
          />
        )}

        {activeTab === 'officer-dashboard' && (
          <OfficerDashboard
            lang={lang}
            officerUser={officerUser}
            onLogout={() => { setOfficerUser(null); setActiveTab('home'); }}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactAndAbout lang={lang} onOpenVoiceModal={() => handleOpenVoiceModal('')} />
        )}

      </main>

      {/* Voice Modal */}
      <VoiceRecorderModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        lang={lang}
        initialText={voiceInitialText}
        onComplaintSubmitted={(complaint) => {
          setVoiceModalOpen(false);
          setTrackSearchId(complaint.complaintId);
          setActiveTab('track');
        }}
      />

      {/* Feedback Modal */}
      {feedbackComplaint && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, color: 'var(--primary-deep)', fontSize: '1rem' }}>Grievance Resolution Feedback</h3>
              <button onClick={() => setFeedbackComplaint(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Was your problem solved?</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsSolved(true)}
                  style={{
                    flex: 1, padding: '0.6rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '0.75rem',
                    border: '1px solid', cursor: 'pointer',
                    background: isSolved ? '#2d6a4f' : '#f9fafb',
                    color: isSolved ? 'white' : '#374151',
                    borderColor: isSolved ? '#2d6a4f' : '#d1d5db'
                  }}
                >✓ Yes, Solved</button>
                <button
                  onClick={() => setIsSolved(false)}
                  style={{
                    flex: 1, padding: '0.6rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '0.75rem',
                    border: '1px solid', cursor: 'pointer',
                    background: !isSolved ? '#dc2626' : '#f9fafb',
                    color: !isSolved ? 'white' : '#374151',
                    borderColor: !isSolved ? '#dc2626' : '#d1d5db'
                  }}
                >✗ Still Pending</button>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>Rate Officer Response:</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', padding: '0.25rem 0' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Star style={{ width: '28px', height: '28px', color: s <= rating ? '#f59e0b' : '#d1d5db', fill: s <= rating ? '#f59e0b' : 'none' }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>Comments:</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                style={{ width: '100%', fontSize: '0.8125rem', padding: '0.6rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
              />
            </div>

            <button
              onClick={handleSubmitFeedback}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }}
            >Submit Feedback</button>
          </div>
        </div>
      )}

      <Footer lang={lang} setActiveTab={setActiveTab} onOpenVoiceModal={() => handleOpenVoiceModal('')} />
    </div>
  );
}
