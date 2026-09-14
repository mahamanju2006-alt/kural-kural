import { supabase } from '../supabaseClient';

export const INITIAL_COMPLAINTS = [
  {
    complaintId: 'KK-2026-48321',
    citizenName: 'P. Arumugam',
    citizenPhone: '9842111234',
    transcription: '?????? ????????? ?????? ???????? ???????? ????????. ??????????? ??????? ????????? ?????????? ?????????????.',
    language: 'Tamil',
    category: 'Water Supply',
    priority: 'High',
    department: 'Water Supply & Sanitation Department',
    location: 'Sivakasi',
    district: 'Virudhunagar',
    taluk: 'Sivakasi',
    village: 'Thiruthangal',
    gps: { lat: 9.4533, lng: 77.7981 },
    status: 'Action Started',
    assignedOfficer: {
      id: 'OFF-WS-102',
      name: 'Er. R. Sundaram (Assistant Engineer)',
      phone: '+91 94431 88200',
      department: 'Water Supply Department'
    },
    slaDeadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    slaHoursRemaining: 18,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Citizen submitted grievance via voice recording.', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verification Complete', description: 'Speech translated, category  Water Supply and priority High automatically detected.', timestamp: new Date(Date.now() - 23 * 3600 * 1000).toISOString(), updatedBy: 'Kural AI' },
      { status: 'Department Assigned', title: 'Assigned to Water Dept', description: 'Complaint routed to Sivakasi Municipal Water Division.', timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), updatedBy: 'System Engine' },
      { status: 'Officer Assigned', title: 'Officer Assigned', description: 'Er. R. Sundaram assigned to inspect main pipeline valve.', timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), updatedBy: 'Superintendent Engineer' },
      { status: 'Action Started', title: 'On-Site Repair In Progress', description: 'Technicians dispatched with water tanker supply and pipeline welding kit.', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), updatedBy: 'Er. R. Sundaram' }
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    complaintId: 'KK-2026-27418',
    citizenName: 'M. Kasthuri',
    citizenPhone: '9789055432',
    transcription: '?????????? ?????? ???????? ????????????????? ??????? ??????? ???? ??????? ?????????????. ??????? ??????? ??????.',
    language: 'Tamil',
    category: 'Electricity & Power',
    priority: 'Emergency',
    department: 'Tamil Nadu Electricity Board (TNEB)',
    location: 'Virudhunagar',
    district: 'Virudhunagar',
    taluk: 'Virudhunagar',
    village: 'Collectorate Junction',
    gps: { lat: 9.5872, lng: 77.9566 },
    status: 'Submitted',
    assignedOfficer: {
      id: 'OFF-TNEB-201',
      name: 'Er. K. Manikandan (Executive Engineer)',
      phone: '+91 94422 99110',
      department: 'TNEB Electricity Board'
    },
    slaDeadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    slaHoursRemaining: 6,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Live emergency grievance captured via Tamil Voice UI.', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verified - Emergency Flagged', description: 'Automated hazard detection flagged power wire snap hazard.', timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(), updatedBy: 'Kural AI' }
    ],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    complaintId: 'KK-2026-71942',
    citizenName: 'S. Ramanathan',
    citizenPhone: '9621144890',
    transcription: 'Rajapalayam bus stand road has severe potholes causing frequent two-wheeler accidents during rainy days.',
    language: 'English',
    category: 'Roads & Bridges',
    priority: 'High',
    department: 'Highways & Rural Roads Department',
    location: 'Rajapalayam',
    district: 'Virudhunagar',
    taluk: 'Rajapalayam',
    village: 'Town Bus Stand Ward 4',
    gps: { lat: 9.4532, lng: 77.5539 },
    status: 'Department Assigned',
    assignedOfficer: {
      id: 'OFF-HW-305',
      name: 'Er. V. Selvam (Divisional Engineer)',
      phone: '+91 98940 33211',
      department: 'Highways Dept'
    },
    slaDeadline: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
    slaHoursRemaining: 30,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Voice complaint submitted in English.', timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verified', description: 'Category: Roads & Bridges, Priority: High.', timestamp: new Date(Date.now() - 13 * 3600 * 1000).toISOString(), updatedBy: 'Kural AI' },
      { status: 'Department Assigned', title: 'Routed to Highways Dept', description: 'Dispatched to Rajapalayam Highways Division.', timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), updatedBy: 'System Engine' }
    ],
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
  },
  {
    complaintId: 'KK-2026-10567',
    citizenName: 'G. Lakshmi',
    citizenPhone: '9443522109',
    transcription: '??????????????? ????? ????????? ????????? ???????????? 4 ???????? ?????????????.',
    language: 'Tamil',
    category: 'Waste Management',
    priority: 'Medium',
    department: 'Municipal Solid Waste Management',
    location: 'Aruppukkottai',
    district: 'Virudhunagar',
    taluk: 'Aruppukkottai',
    village: 'Bazaar Street',
    gps: { lat: 9.5100, lng: 78.0963 },
    status: 'Resolved',
    assignedOfficer: {
      id: 'OFF-SAN-404',
      name: 'S. Chelladurai (Sanitation Inspector)',
      phone: '+91 94441 77654',
      department: 'Municipal Sanitation Dept'
    },
    slaDeadline: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    slaHoursRemaining: 0,
    resolutionDetails: {
      remarks: 'Garbage cleared completely using municipal compactor truck. Bleaching powder sprinkled.',
      beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60',
      afterImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=60',
      resolvedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    },
    feedback: {
      rating: 5,
      solved: true,
      comment: '??????? ?????! ????????? ???????? ????? ??????? ??????????????.',
      submittedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Voice complaint registered.', timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verified', description: 'Assigned category Waste Management.', timestamp: new Date(Date.now() - 71 * 3600 * 1000).toISOString(), updatedBy: 'Kural AI' },
      { status: 'Department Assigned', title: 'Assigned to Sanitation Dept', description: 'Forwarded to Inspector Chelladurai.', timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString(), updatedBy: 'System Engine' },
      { status: 'Officer Assigned', title: 'Sanitation Crew Mobilized', description: 'Sanitation inspector acknowledged ticket.', timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(), updatedBy: 'S. Chelladurai' },
      { status: 'Action Started', title: 'Waste Pickup Initiated', description: 'Truck dispatched to Bazaar street.', timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), updatedBy: 'S. Chelladurai' },
      { status: 'Resolved', title: 'Grievance Resolved', description: 'Area cleaned and verified by citizen.', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), updatedBy: 'S. Chelladurai' }
    ],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  }
];

// Helper to get local stored complaints
export function getLocalComplaints() {
  try {
    const raw = localStorage.getItem('kural_local_complaints');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Helper to save local complaint
export function saveLocalComplaint(comp) {
  try {
    const list = getLocalComplaints();
    const existingIdx = list.findIndex(c => c.complaintId === comp.complaintId);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...comp };
    } else {
      list.unshift(comp);
    }
    localStorage.setItem('kural_local_complaints', JSON.stringify(list));
  } catch (e) {}
}

// Map Supabase snake_case columns to camelCase object
function formatSupabaseComplaint(item) {
  return {
    complaintId: item.complaint_id || item.complaintId,
    citizenName: item.citizen_name || item.citizenName || 'Anonymous Citizen',
    citizenPhone: item.citizen_phone || item.citizenPhone || 'Not Provided',
    transcription: item.transcription || '',
    language: item.language || 'Tamil',
    category: item.category || 'General',
    priority: item.priority || 'Medium',
    department: item.department || 'District Administrative Office',
    location: item.location || 'Sivakasi',
    district: item.district || 'Virudhunagar',
    taluk: item.taluk || 'Sivakasi',
    village: item.village || 'Gram Panchayat',
    gps: item.gps || { lat: 9.4533, lng: 77.7981 },
    status: item.status || 'Submitted',
    assignedOfficer: item.assigned_officer || item.assignedOfficer || {
      id: 'OFF-WS-102',
      name: 'Er. R. Sundaram (Assistant Engineer)',
      phone: '+91 94431 88200',
      department: item.department || 'Water Supply Department'
    },
    slaDeadline: item.sla_deadline || item.slaDeadline,
    slaHoursRemaining: item.sla_hours_remaining || item.slaHoursRemaining || 48,
    timeline: item.timeline && item.timeline.length ? item.timeline : [
      { status: item.status || 'Submitted', title: 'Grievance Registered', description: 'Complaint recorded.', timestamp: item.created_at || new Date().toISOString(), updatedBy: 'System' }
    ],
    resolutionDetails: item.resolution_details || item.resolutionDetails || {},
    feedback: item.feedback || {},
    createdAt: item.created_at || item.createdAt || new Date().toISOString()
  };
}

export async function fetchAllComplaints() {
  let combined = [...getLocalComplaints(), ...INITIAL_COMPLAINTS];

  // 1. Try Supabase
  try {
    const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const supaList = data.map(formatSupabaseComplaint);
      const idMap = new Map();
      supaList.forEach(c => idMap.set(c.complaintId, c));
      combined.forEach(c => {
        if (!idMap.has(c.complaintId)) {
          idMap.set(c.complaintId, c);
        }
      });
      return Array.from(idMap.values());
    }
  } catch (e) {
    console.warn('Supabase fetch note:', e);
  }

  // 2. Try Backend API
  try {
    const res = await fetch('/api/complaints');
    const apiData = await res.json();
    if (apiData.success && apiData.data && apiData.data.length > 0) {
      return apiData.data;
    }
  } catch (e) {}

  // Deduplicate
  const idMap = new Map();
  combined.forEach(c => idMap.set(c.complaintId, c));
  return Array.from(idMap.values());
}

export async function searchComplaint(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, '');

  const all = await fetchAllComplaints();
  const match = all.find(c => {
    const idStr = (c.complaintId || '').toLowerCase();
    const idDigits = (c.complaintId || '').replace(/\D/g, '');
    const phoneDigits = (c.citizenPhone || '').replace(/\D/g, '');
    const nameStr = (c.citizenName || '').toLowerCase();

    return (
      idStr === q ||
      (digits.length >= 4 && idDigits.includes(digits)) ||
      (digits.length >= 4 && phoneDigits.includes(digits)) ||
      (q.length >= 2 && nameStr.includes(q))
    );
  });

  return match || null;
}

export async function submitNewComplaint(complaintData) {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const newId = complaintData.complaintId || ('KK-2026-' + randomNum);
  const now = new Date().toISOString();


  const compObj = {
    complaintId: newId,
    citizenName: complaintData.citizenName?.trim() || 'Anonymous Citizen',
    citizenPhone: complaintData.citizenPhone?.trim() || 'Not Provided',
    transcription: complaintData.transcription?.trim() || '',
    language: complaintData.language || 'Tamil',
    category: complaintData.category || 'General',
    priority: complaintData.priority || 'Medium',
    department: complaintData.department || 'District Administration',
    location: complaintData.location || 'Sivakasi',
    district: 'Virudhunagar',
    taluk: complaintData.location || 'Sivakasi',
    village: 'Gram Panchayat',
    gps: { lat: 9.4533, lng: 77.7981 },
    status: 'Submitted',
    assignedOfficer: {
      id: 'OFF-WS-102',
      name: 'Er. R. Sundaram (Assistant Engineer)',
      phone: '+91 94431 88200',
      department: complaintData.department || 'Water Supply Department'
    },
    slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    slaHoursRemaining: 48,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Grievance submitted via voice interface.', timestamp: now, updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verification Completed', description: 'Identified Category: ' + (complaintData.category || 'General') + ' | Priority: ' + (complaintData.priority || 'Medium'), timestamp: now, updatedBy: 'Kural AI System' }

    ],
    createdAt: now
  };

  // 1. Save locally
  saveLocalComplaint(compObj);

  // 2. Save in Supabase
  try {
    await supabase.from('complaints').insert([{
      complaint_id: compObj.complaintId,
      citizen_name: compObj.citizenName,
      citizen_phone: compObj.citizenPhone,
      transcription: compObj.transcription,
      language: compObj.language,
      category: compObj.category,
      priority: compObj.priority,
      department: compObj.department,
      location: compObj.location,
      status: compObj.status,
      timeline: compObj.timeline
    }]);
  } catch (e) {
    console.warn('Supabase insert note:', e);
  }

  // 3. Try backend API
  try {
    await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compObj)
    });
  } catch (e) {}

  return compObj;
}
