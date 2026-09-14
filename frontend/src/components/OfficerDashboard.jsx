import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, MapPin, BarChart3, AlertOctagon, Clock, ShieldCheck, 
  Search, Filter, CheckCircle2, AlertTriangle, Eye, ArrowUpRight, Play, Pause, 
  Check, X, RefreshCw, Sparkles, Building, User, Phone, Image, ArrowRight, MessageSquare, Leaf
} from 'lucide-react';
import LiveComplaintMap from './LiveComplaintMap';

export default function OfficerDashboard({ lang, officerUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [actionModal, setActionModal] = useState(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [beforeImg, setBeforeImg] = useState('');
  const [afterImg, setAfterImg] = useState('');

  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.success) {
        setComplaints(data.data);
      }
    } catch (err) {
      console.error('Error fetching officer complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          officerId: officerUser?.employeeId || 'GOV-1001',
          officerName: officerUser?.name || 'Er. R. Sundaram',
          remarks: actionRemarks,
          rejectionReason: rejectionReason,
          beforeImage: beforeImg,
          afterImage: afterImg
        })
      });

      const data = await res.json();
      if (data.success) {
        fetchComplaints();
        fetchAnalytics();
        if (selectedComplaint && selectedComplaint.complaintId === complaintId) {
          setSelectedComplaint(data.data);
        }
        setActionModal(null);
        setActionRemarks('');
        setRejectionReason('');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch = item.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStat = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCat && matchesStat;
  });

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => ['Submitted', 'AI Verified', 'Department Assigned', 'Officer Assigned'].includes(c.status)).length;
  const urgentCount = complaints.filter(c => ['Emergency', 'High'].includes(c.priority) && c.status !== 'Resolved').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-[#f8f7f2] flex flex-col">
      
      {/* Header */}
      <header className="bg-[#1e381b] text-white px-6 py-4 border-b border-[#152612] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#36682f] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight font-serif">KURAL KURAL Officer Portal</span>
              <span className="bg-[#cbe0b3]/20 text-[#cbe0b3] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#cbe0b3]/30">LIVE DB SYNC</span>
            </div>
            <p className="text-xs text-sage-200">Virudhunagar District Administration • Municipal Service Suite</p>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="font-bold text-sm text-white block">{officerUser?.name || 'Er. R. Sundaram'}</span>
            <span className="text-xs text-sage-300 font-medium">{officerUser?.department || 'Water Supply Department'}</span>
          </div>
          <button
            onClick={onLogout}
            className="btn btn-outline btn-sm border-sage-300 text-sage-200 hover:bg-[#36682f]"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-[#cbe0b3]/60 p-4 space-y-1">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition ${
              activeTab === 'overview' ? 'bg-[#36682f] text-white shadow-md' : 'text-gray-700 hover:bg-sage-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition ${
              activeTab === 'complaints' ? 'bg-[#36682f] text-white shadow-md' : 'text-gray-700 hover:bg-sage-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>All Complaints ({totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition ${
              activeTab === 'map' ? 'bg-[#36682f] text-white shadow-md' : 'text-gray-700 hover:bg-sage-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Live GIS Complaint Map</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition ${
              activeTab === 'analytics' ? 'bg-[#36682f] text-white shadow-md' : 'text-gray-700 hover:bg-sage-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>AI Insights & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('sla')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition ${
              activeTab === 'sla' ? 'bg-[#36682f] text-white shadow-md' : 'text-gray-700 hover:bg-sage-50'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <span>SLA & Escalation Engine</span>
          </button>

        </aside>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                
                <div className="card bg-white p-5 border border-sage-200 shadow-md">
                  <span className="text-xs font-bold text-gray-500 block uppercase">Total Complaints</span>
                  <span className="text-3xl font-black text-[#152612] mt-1 block">{totalCount}</span>
                  <span className="text-[11px] font-semibold text-[#36682f] mt-2 block">Across 7 Municipal Wards</span>
                </div>

                <div className="card bg-white p-5 border border-amber-200 shadow-md">
                  <span className="text-xs font-bold text-amber-800 block uppercase">Pending Action</span>
                  <span className="text-3xl font-black text-amber-950 mt-1 block">{pendingCount}</span>
                  <span className="text-[11px] font-semibold text-amber-800 mt-2 block">Action Required</span>
                </div>

                <div className="card bg-white p-5 border border-red-200 shadow-md">
                  <span className="text-xs font-bold text-red-800 block uppercase">Urgent Emergency</span>
                  <span className="text-3xl font-black text-red-950 mt-1 block">{urgentCount}</span>
                  <span className="text-[11px] font-semibold text-red-700 mt-2 block">SLA Response Window &lt; 24h</span>
                </div>

                <div className="card bg-white p-5 border border-emerald-200 shadow-md">
                  <span className="text-xs font-bold text-emerald-800 block uppercase">Resolved Grievances</span>
                  <span className="text-3xl font-black text-emerald-950 mt-1 block">{resolvedCount}</span>
                  <span className="text-[11px] font-semibold text-emerald-700 mt-2 block">Verification Completed</span>
                </div>

              </div>

              <div className="bg-gradient-to-r from-[#1e381b] via-[#284d23] to-[#36682f] rounded-3xl p-6 text-white shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sage-300/20 text-sage-300 flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6 text-sage-300" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base">AI Grievance Intelligence Alert</h4>
                    <p className="text-xs text-sage-100 mt-0.5">
                      "Water complaints increased by 32% this week in Sivakasi. 18 emergency pipe leak tickets flagged."
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="btn bg-[#b5d095] text-[#152612] font-black btn-sm whitespace-nowrap"
                >
                  View Insights
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-sage-200 shadow-xl overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f8ee]">
                  <div>
                    <h3 className="font-extrabold text-[#152612] text-base">Urgent Grievance Action Queue</h3>
                    <p className="text-xs text-gray-500">Complaints requiring immediate officer review & dispatch</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ID, Location..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100/70 text-gray-600 font-extrabold uppercase border-b border-gray-200">
                        <th className="p-4">Complaint ID</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">SLA Clock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Officer Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {filteredComplaints.map((item) => (
                        <tr key={item.complaintId} className="hover:bg-gray-50/80 transition">
                          
                          <td className="p-4 font-mono font-extrabold text-[#152612]">
                            {item.complaintId}
                          </td>

                          <td className="p-4 font-bold">{item.category}</td>

                          <td className="p-4 font-semibold text-orange-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                          </td>

                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-extrabold ${
                              item.priority === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.priority}
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              {item.slaHoursRemaining || 48}h SLA
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-[#152612] bg-sage-100 px-2.5 py-1 rounded-full border border-sage-200">
                              {item.status}
                            </span>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedComplaint(item)}
                                className="btn btn-outline btn-sm py-1 px-3 text-[#152612]"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>

                              {item.status !== 'Resolved' && (
                                <button
                                  onClick={() => {
                                    setSelectedComplaint(item);
                                    setActionModal('resolve');
                                  }}
                                  className="btn bg-[#36682f] text-white hover:bg-[#1e381b] btn-sm py-1 px-3"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Resolve</span>
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ALL COMPLAINTS */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-[#152612]">Master Complaints Register</h3>
              
              <div className="bg-white rounded-3xl border border-sage-200 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-extrabold uppercase border-b">
                      <th className="p-4">ID</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredComplaints.map((item) => (
                      <tr key={item.complaintId} className="hover:bg-gray-50">
                        <td className="p-4 font-mono font-bold text-[#152612]">{item.complaintId}</td>
                        <td className="p-4 font-semibold">{item.category}</td>
                        <td className="p-4 font-semibold text-orange-600">{item.location}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            item.priority === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold bg-sage-100 text-[#152612] px-2 py-1 rounded-full">
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedComplaint(item)}
                            className="btn btn-outline btn-sm py-1 px-3 text-[#152612]"
                          >
                            Inspect Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: LIVE GIS MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#152612]">GIS Live Grievance Map</h3>
              <LiveComplaintMap complaints={complaints} onSelectComplaint={setSelectedComplaint} />
            </div>
          )}

          {/* TAB 4: ANALYTICS & AI INSIGHTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-[#152612]">AI Insights & District Analytics</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-xl space-y-4">
                  <h4 className="font-extrabold text-base text-[#152612] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Automated AI Grievance Warnings</span>
                  </h4>
                  <ul className="space-y-3 text-xs font-semibold text-gray-700">
                    <li className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      ⚡ Water Supply complaints increased by 32% this week in Sivakasi.
                    </li>
                    <li className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      🚨 Sivakasi has the highest number of unresolved emergency water tickets.
                    </li>
                    <li className="p-3 bg-[#f4f8ee] border border-[#cbe0b3] rounded-xl">
                      📍 3 villages reported repeated drainage blockage after monsoon rains.
                    </li>
                    <li className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      ✅ Average complaint resolution SLA speed is currently 2.4 days.
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-xl space-y-4">
                  <h4 className="font-extrabold text-base text-[#152612] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#36682f]" />
                    <span>Category Breakdown Metrics</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Water Supply & Sanitation</span>
                        <span className="text-[#152612]">40%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#36682f] h-full rounded-full w-[40%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Roads & Potholes</span>
                        <span className="text-[#152612]">25%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full w-[25%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Electricity & Power</span>
                        <span className="text-[#152612]">20%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#8ba869] h-full rounded-full w-[20%]" />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 5: SLA */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-[#152612]">SLA & Escalation Tracker</h3>
              
              <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-xl space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-center">
                    <span className="text-xs font-extrabold text-gray-600 uppercase block">Level 1</span>
                    <h4 className="font-bold text-[#152612] mt-1 text-sm">Village Executive Officer</h4>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-center">
                    <span className="text-xs font-extrabold text-amber-800 uppercase block">Level 2</span>
                    <h4 className="font-bold text-amber-950 mt-1 text-sm">Taluk Tahsildar / AE</h4>
                  </div>
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-200 text-center">
                    <span className="text-xs font-extrabold text-red-800 uppercase block">Level 3</span>
                    <h4 className="font-bold text-red-950 mt-1 text-sm">District Collector Office</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DRAWER MODAL */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content max-w-3xl space-y-6">
            
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-[#152612] font-mono">
                    {selectedComplaint.complaintId}
                  </h3>
                  <span className="badge badge-submitted">{selectedComplaint.status}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Audio Voice Player */}
            <div className="bg-[#1e381b] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className="w-10 h-10 rounded-full bg-[#36682f] text-white flex items-center justify-center shadow-md"
                >
                  {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-sage-300 block uppercase">Original Citizen Voice Audio</span>
                  <span className="text-xs text-sage-100 font-mono">
                    {isAudioPlaying ? 'Playing audio stream...' : 'Click play to listen to Tamil recording'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-xs font-extrabold text-amber-900 uppercase block mb-1">
                Audio Transcription:
              </span>
              <p className="text-sm font-semibold text-gray-900 italic font-ta leading-relaxed">
                "{selectedComplaint.transcription}"
              </p>
            </div>

            <div className="bg-[#e3eed4] p-4 rounded-2xl border border-[#cbe0b3] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#152612]">Officer Action Controls:</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedComplaint.complaintId, 'Action Started')}
                  className="btn bg-amber-600 text-white hover:bg-amber-700 btn-sm"
                >
                  Start Action
                </button>

                <button
                  onClick={() => setActionModal('resolve')}
                  className="btn bg-[#36682f] text-white hover:bg-[#1e381b] btn-sm"
                >
                  Resolve Grievance
                </button>
              </div>
            </div>

            {actionModal === 'resolve' && (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <h4 className="font-bold text-emerald-950 text-sm">Submit Resolution Proof & Remarks:</h4>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Enter Action Taken Remarks (e.g. Pipeline valve replaced and water supply restored)."
                  className="w-full text-xs p-2.5 rounded-xl border border-emerald-300"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedComplaint.complaintId, 'Resolved')}
                  className="btn bg-[#36682f] text-white btn-sm w-full font-bold"
                >
                  Confirm Resolution
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
