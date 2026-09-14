import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, AlertTriangle, Eye, Star, MapPin, Plus, Leaf, RefreshCw } from 'lucide-react';
import { fetchAllComplaints } from '../services/complaintService';


const STATUS_COLORS = {
  'Submitted': { bg: '#dbeafe', color: '#1e40af' },
  'AI Verified': { bg: '#ede9fe', color: '#5b21b6' },
  'Department Assigned': { bg: '#fef3c7', color: '#92400e' },
  'Officer Assigned': { bg: '#ffedd5', color: '#9a3412' },
  'Action Started': { bg: '#fed7aa', color: '#7c2d12' },
  'Resolved': { bg: '#dcfce7', color: '#14532d' },
  'Escalated': { bg: '#fee2e2', color: '#991b1b' },
};

const PRIORITY_COLORS = {
  'Emergency': { bg: '#fee2e2', color: '#991b1b' },
  'High': { bg: '#fef3c7', color: '#92400e' },
  'Medium': { bg: '#dbeafe', color: '#1e40af' },
  'Low': { bg: '#f3f4f6', color: '#374151' },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ background: c.bg, color: c.color, padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS['Low'];
  return (
    <span style={{ background: c.bg, color: c.color, padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
      {priority}
    </span>
  );
}

export default function CitizenDashboard({ lang, onOpenVoiceModal, onTrackSelect, onOpenFeedbackModal }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitizenComplaints();
  }, []);

  const fetchCitizenComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching citizen complaints:', err);
    } finally {
      setLoading(false);
    }
  };


  const total = complaints.length;
  const pending = complaints.filter(c => ['Submitted', 'AI Verified', 'Department Assigned', 'Officer Assigned'].includes(c.status)).length;
  const urgent = complaints.filter(c => ['Emergency', 'High'].includes(c.priority) && c.status !== 'Resolved').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <section style={{ padding: '2.5rem 0', minHeight: '80vh', background: 'var(--bg-page)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="section-badge" style={{ marginBottom: '0.5rem' }}>
              <Leaf style={{ width: '12px', height: '12px' }} />
              Public Grievance Portal
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--primary-deep)', margin: 0 }}>
              {lang === 'ta' ? 'என் புகார்கள் மேலாண்மை' : 'My Complaints Dashboard'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>
              {lang === 'ta' ? 'நீங்கள் பதிவு செய்த அனைத்து குரல் புகார்களின் பட்டியல்' : 'Track and manage your submitted civic grievances in real-time.'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={fetchCitizenComplaints}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.55rem 0.9rem', background: 'white', border: '1.5px solid var(--border-sage)',
                borderRadius: '9999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                color: 'var(--primary-deep)', fontFamily: 'inherit'
              }}
            >
              <RefreshCw style={{ width: '13px', height: '13px' }} />
              Refresh
            </button>
            <button
              onClick={onOpenVoiceModal}
              className="btn btn-primary btn-sm flex-1 sm:flex-initial"
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              {lang === 'ta' ? 'புதிய புகார்' : 'New Complaint'}
            </button>
          </div>
        </div>

        {/* Stats Row (2 columns on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Filed', value: total, icon: '📋', color: 'var(--primary-deep)', bg: 'var(--secondary-pale)', border: 'var(--border-sage)' },
            { label: 'In Progress', value: pending, icon: '⏳', color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
            { label: 'Urgent', value: urgent, icon: '🚨', color: '#991b1b', bg: '#fee2e2', border: '#fecaca' },
            { label: 'Resolved', value: resolved, icon: '✅', color: '#14532d', bg: '#dcfce7', border: '#bbf7d0' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.bg, border: `1px solid ${stat.border}`,
              borderRadius: 'var(--radius-md)', padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: '0.2rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: stat.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            </div>
          ))}
        </div>


        {/* Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-sage)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          
          {/* Table Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary-deep)', margin: 0 }}>All Grievances</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{total} Records</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1rem', color: 'var(--text-muted)' }}>
              <RefreshCw style={{ width: '32px', height: '32px', color: 'var(--primary-forest)', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Loading grievances from database...</span>
            </div>
          ) : complaints.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-deep)', marginBottom: '0.5rem' }}>No Complaints Filed Yet</h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Submit your first voice grievance and it will appear here.</p>
              <button onClick={onOpenVoiceModal} className="btn btn-primary btn-sm">
                <Plus style={{ width: '16px', height: '16px' }} />
                Submit First Grievance
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--secondary-pale)', borderBottom: '1px solid var(--border-sage)' }}>
                    {['Complaint ID', 'Citizen / Phone', 'Category', 'Location', 'Priority', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-deep)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr
                      key={c.complaintId || idx}
                      className="complaint-row"
                      style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'white' : '#fafafa' }}
                    >
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-deep)' }}>
                          {c.complaintId}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{c.citizenName || 'Anonymous'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.citizenPhone || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{c.category}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: '#ea580c', whiteSpace: 'nowrap' }}>
                          <MapPin style={{ width: '12px', height: '12px' }} />
                          {c.location}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <StatusBadge status={c.status} />
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => onTrackSelect && onTrackSelect(c.complaintId)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem',
                              background: 'var(--secondary-pale)', border: '1px solid var(--border-sage)',
                              borderRadius: '9999px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                              color: 'var(--primary-deep)', fontFamily: 'inherit', whiteSpace: 'nowrap'
                            }}
                          >
                            <Eye style={{ width: '12px', height: '12px' }} />
                            Track
                          </button>
                          {c.status === 'Resolved' && !c.feedback?.submittedAt && (
                            <button
                              onClick={() => onOpenFeedbackModal && onOpenFeedbackModal(c)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem',
                                background: '#fef3c7', border: '1px solid #fde68a',
                                borderRadius: '9999px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
                                color: '#92400e', fontFamily: 'inherit', whiteSpace: 'nowrap'
                              }}
                            >
                              <Star style={{ width: '12px', height: '12px' }} />
                              Rate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
