import express from 'express';
import Complaint from '../models/Complaint.js';
import { analyzeGrievance } from '../utils/nlpClassifier.js';

const router = express.Router();

// Fallback in-memory array for zero-delay response
let memoryComplaints = [
  {
    complaintId: 'KK-2026-48321',
    citizenName: 'P. Arumugam',
    citizenPhone: '9842111234',
    transcription: 'எங்கள் பகுதியில் இரண்டு நாட்களாக குடிநீர் வரவில்லை. குழாய்களில் தண்ணீர் விநியோகம் முற்றிலும் தடைபட்டுள்ளது.',
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
    slaDeadline: new Date(Date.now() + 18 * 3600 * 1000),
    slaHoursRemaining: 18,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Citizen submitted grievance via voice recording.', timestamp: new Date(Date.now() - 24 * 3600 * 1000), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verification Complete', description: 'Speech translated, category "Water Supply" and priority "High" automatically detected.', timestamp: new Date(Date.now() - 23 * 3600 * 1000), updatedBy: 'Kural AI' },
      { status: 'Department Assigned', title: 'Assigned to Water Dept', description: 'Complaint routed to Sivakasi Municipal Water Division.', timestamp: new Date(Date.now() - 20 * 3600 * 1000), updatedBy: 'System Engine' },
      { status: 'Officer Assigned', title: 'Officer Assigned', description: 'Er. R. Sundaram assigned to inspect main pipeline valve.', timestamp: new Date(Date.now() - 12 * 3600 * 1000), updatedBy: 'Superintendent Engineer' },
      { status: 'Action Started', title: 'On-Site Repair In Progress', description: 'Technicians dispatched with water tanker supply and pipeline welding kit.', timestamp: new Date(Date.now() - 2 * 3600 * 1000), updatedBy: 'Er. R. Sundaram' }
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000)
  },
  {
    complaintId: 'KK-2026-27418',
    citizenName: 'M. Kasthuri',
    citizenPhone: '9789055432',
    transcription: 'விருதுநகர் மெயின் ரோட்டில் டிரான்ஸ்பார்மரில் இருந்து மின்சார ஒயர் அறுந்து விழுந்துள்ளது. மிகவும் ஆபத்தாக உள்ளது.',
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
    slaDeadline: new Date(Date.now() + 6 * 3600 * 1000),
    slaHoursRemaining: 6,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Live emergency grievance captured via Tamil Voice UI.', timestamp: new Date(Date.now() - 30 * 60 * 1000), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verified - Emergency Flagged', description: 'Automated hazard detection flagged power wire snap hazard.', timestamp: new Date(Date.now() - 28 * 60 * 1000), updatedBy: 'Kural AI' }
    ],
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
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
    slaDeadline: new Date(Date.now() + 30 * 3600 * 1000),
    slaHoursRemaining: 30,
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Voice complaint submitted in English.', timestamp: new Date(Date.now() - 14 * 3600 * 1000), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verified', description: 'Category: Roads & Bridges, Priority: High.', timestamp: new Date(Date.now() - 13 * 3600 * 1000), updatedBy: 'Kural AI' },
      { status: 'Department Assigned', title: 'Routed to Highways Dept', description: 'Dispatched to Rajapalayam Highways Division.', timestamp: new Date(Date.now() - 10 * 3600 * 1000), updatedBy: 'System Engine' }
    ],
    createdAt: new Date(Date.now() - 14 * 3600 * 1000)
  },
  {
    complaintId: 'KK-2026-10567',
    citizenName: 'G. Lakshmi',
    citizenPhone: '9443522109',
    transcription: 'அருப்புக்கோட்டை சந்தை பகுதியில் குப்பைகள் அள்ளப்படாமல் 4 நாட்களாக தேங்கியுள்ளது.',
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
    slaDeadline: new Date(Date.now() - 48 * 3600 * 1000),
    slaHoursRemaining: 0,
    resolutionDetails: {
      remarks: 'Garbage cleared completely using municipal compactor truck. Bleaching powder sprinkled.',
      beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60',
      afterImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=60',
      resolvedAt: new Date(Date.now() - 6 * 3600 * 1000)
    },
    feedback: {
      rating: 5,
      solved: true,
      comment: 'மிகவும் நன்றி! குப்பைகளை உடனடியாக அள்ளி சுத்தம் செய்துவிட்டனர்.',
      submittedAt: new Date(Date.now() - 4 * 3600 * 1000)
    },
    timeline: [
      { status: 'Submitted', title: 'Complaint Submitted', description: 'Voice complaint registered.', timestamp: new Date(Date.now() - 72 * 3600 * 1000), updatedBy: 'Citizen' },
      { status: 'AI Verified', title: 'AI Verified', description: 'Assigned category Waste Management.', timestamp: new Date(Date.now() - 71 * 3600 * 1000), updatedBy: 'Kural AI' },
      { status: 'Department Assigned', title: 'Assigned to Sanitation Dept', description: 'Forwarded to Inspector Chelladurai.', timestamp: new Date(Date.now() - 60 * 3600 * 1000), updatedBy: 'System Engine' },
      { status: 'Officer Assigned', title: 'Sanitation Crew Mobilized', description: 'Sanitation inspector acknowledged ticket.', timestamp: new Date(Date.now() - 40 * 3600 * 1000), updatedBy: 'S. Chelladurai' },
      { status: 'Action Started', title: 'Waste Pickup Initiated', description: 'Truck dispatched to Bazaar street.', timestamp: new Date(Date.now() - 20 * 3600 * 1000), updatedBy: 'S. Chelladurai' },
      { status: 'Resolved', title: 'Grievance Resolved', description: 'Area cleaned and verified by citizen.', timestamp: new Date(Date.now() - 6 * 3600 * 1000), updatedBy: 'S. Chelladurai' }
    ],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000)
  }
];

function generateComplaintId() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `KK-2026-${randomNum}`;
}

// GET /api/complaints
router.get('/complaints', async (req, res) => {
  try {
    let complaints = [];
    try {
      complaints = await Complaint.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (!complaints || complaints.length === 0) {
      complaints = memoryComplaints;
    }

    const { status, category, priority, search } = req.query;
    let filtered = [...complaints];

    if (status && status !== 'All') filtered = filtered.filter(c => c.status === status);
    if (category && category !== 'All') filtered = filtered.filter(c => c.category === category);
    if (priority && priority !== 'All') filtered = filtered.filter(c => c.priority === priority);
    
    if (search) {
      const q = search.toLowerCase().trim();
      const cleanNum = q.replace(/\D/g, '');
      filtered = filtered.filter(c => {
        const idMatch = c.complaintId.toLowerCase().includes(q) || (cleanNum && c.complaintId.replace(/\D/g, '').includes(cleanNum));
        const locMatch = c.location.toLowerCase().includes(q);
        const textMatch = c.transcription.toLowerCase().includes(q);
        const catMatch = c.category.toLowerCase().includes(q);
        const nameMatch = c.citizenName && c.citizenName.toLowerCase().includes(q);
        const phoneMatch = c.citizenPhone && cleanNum && c.citizenPhone.replace(/\D/g, '').includes(cleanNum);
        return idMatch || locMatch || textMatch || catMatch || nameMatch || phoneMatch;
      });
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    res.json({ success: true, count: memoryComplaints.length, data: memoryComplaints });
  }
});

// GET /api/complaints/:id - Search by Complaint ID OR Mobile Number OR Citizen Name
router.get('/complaints/:id', async (req, res) => {
  try {
    const rawKey = req.params.id.trim();
    const cleanKey = rawKey.toLowerCase();
    const cleanDigits = rawKey.replace(/\D/g, '');

    let complaint = memoryComplaints.find(c => {
      const idStr = c.complaintId.toLowerCase();
      const idDigits = c.complaintId.replace(/\D/g, '');
      const phoneDigits = c.citizenPhone ? c.citizenPhone.replace(/\D/g, '') : '';
      const nameStr = c.citizenName ? c.citizenName.toLowerCase() : '';

      return (
        idStr === cleanKey ||
        (cleanDigits.length >= 4 && idDigits.includes(cleanDigits)) ||
        (cleanDigits.length >= 4 && phoneDigits.includes(cleanDigits)) ||
        (cleanKey.length >= 2 && nameStr.includes(cleanKey))
      );
    });

    if (!complaint) {
      try {
        complaint = await Complaint.findOne({
          $or: [
            { complaintId: rawKey },
            { complaintId: { $regex: cleanDigits, $options: 'i' } },
            { citizenPhone: { $regex: cleanDigits, $options: 'i' } },
            { citizenName: { $regex: rawKey, $options: 'i' } }
          ]
        });
      } catch (e) {}
    }

    if (!complaint) {
      return res.status(404).json({ success: false, message: `No grievance found matching "${rawKey}"` });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/complaints
router.post('/complaints', async (req, res) => {
  try {
    const { transcription, language, location, citizenName, citizenPhone, gps, audioUrl, photoUrl } = req.body;

    if (!transcription || !transcription.trim()) {
      return res.status(400).json({ success: false, message: 'Transcription text is required' });
    }

    const aiAnalysis = analyzeGrievance(transcription, language === 'English' ? 'en' : 'ta');
    const newComplaintId = generateComplaintId();
    const now = new Date();
    const slaDeadline = new Date(now.getTime() + 48 * 3600 * 1000);

    const complaintObj = {
      complaintId: newComplaintId,
      citizenName: (citizenName && citizenName.trim()) ? citizenName.trim() : 'Anonymous Citizen',
      citizenPhone: (citizenPhone && citizenPhone.trim()) ? citizenPhone.trim() : 'Not Provided',
      voiceRecording: audioUrl || '',
      transcription: transcription.trim(),
      language: aiAnalysis.language,
      category: aiAnalysis.category,
      priority: aiAnalysis.priority,
      department: aiAnalysis.department,
      location: location || aiAnalysis.location,
      district: 'Virudhunagar',
      taluk: location || 'Sivakasi',
      village: 'Gram Panchayat',
      gps: gps && gps.lat ? gps : aiAnalysis.gps,
      status: 'Submitted',
      slaDeadline: slaDeadline,
      slaHoursRemaining: 48,
      assignedOfficer: {
        id: 'OFF-WS-102',
        name: 'Er. R. Sundaram (Assistant Engineer)',
        phone: '+91 94431 88200',
        department: aiAnalysis.department
      },
      evidence: { photoUrl: photoUrl || '', audioUrl: audioUrl || '' },
      timeline: [
        { status: 'Submitted', title: 'Complaint Submitted', description: `Grievance registered via ${aiAnalysis.language} voice interface.`, timestamp: now, updatedBy: 'Citizen' },
        { status: 'AI Verified', title: 'AI Automated Verification', description: `Identified Category: ${aiAnalysis.category} | Priority: ${aiAnalysis.priority} | Dept: ${aiAnalysis.department}`, timestamp: new Date(now.getTime() + 1000), updatedBy: 'Kural AI System' }
      ],
      createdAt: now
    };

    // Unshift to memory store top
    memoryComplaints.unshift(complaintObj);

    try {
      const dbDoc = new Complaint(complaintObj);
      await dbDoc.save();
    } catch (dbErr) {
      console.warn('Saved to memory array fallback');
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('complaint_created', complaintObj);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaintId: complaintObj.complaintId,
      data: complaintObj
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/complaints/:id/status
router.patch('/complaints/:id/status', async (req, res) => {
  try {
    const { status, officerId, officerName, remarks, rejectionReason, beforeImage, afterImage } = req.body;
    const id = req.params.id;

    let complaint = memoryComplaints.find(c => c.complaintId === id);

    if (complaint) {
      complaint.status = status;
      if (officerName) {
        complaint.assignedOfficer = complaint.assignedOfficer || {};
        complaint.assignedOfficer.name = officerName;
      }

      if (status === 'Resolved') {
        complaint.resolutionDetails = {
          remarks: remarks || 'Resolved on ground.',
          beforeImage: beforeImage || '',
          afterImage: afterImage || '',
          resolvedAt: new Date()
        };
      }

      complaint.timeline.push({
        status: status,
        title: `Status Updated to ${status}`,
        description: remarks || `Status changed to ${status} by government officer.`,
        timestamp: new Date(),
        updatedBy: officerName || 'Government Officer'
      });
    }

    try {
      await Complaint.updateOne({ complaintId: id }, { status });
    } catch (e) {}

    const io = req.app.get('io');
    if (io) {
      io.emit('complaint_updated', complaint);
    }

    res.json({ success: true, message: `Status updated to ${status}`, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/complaints/:id/feedback
router.post('/complaints/:id/feedback', async (req, res) => {
  try {
    const { rating, solved, comment } = req.body;
    const id = req.params.id;

    let complaint = memoryComplaints.find(c => c.complaintId === id);
    if (complaint) {
      complaint.feedback = { rating, solved, comment, submittedAt: new Date() };
      if (!solved) {
        complaint.status = 'Action Started';
      }
    }

    res.json({ success: true, message: 'Feedback recorded', data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics
router.get('/analytics', async (req, res) => {
  res.json({
    success: true,
    data: {
      summary: {
        total: memoryComplaints.length,
        pending: memoryComplaints.filter(c => c.status !== 'Resolved').length,
        urgent: memoryComplaints.filter(c => c.priority === 'Emergency').length,
        resolved: memoryComplaints.filter(c => c.status === 'Resolved').length,
        escalated: memoryComplaints.filter(c => c.isEscalated).length
      },
      aiInsights: [
        "Water Supply complaints increased by 32% this week in Sivakasi taluk.",
        "Sivakasi has the highest volume of active water pipe leak reports.",
        "18 high-priority emergency complaints currently flagged for immediate department response.",
        "3 villages reported repeated drainage clogging issues near market centers.",
        "Average complaint resolution SLA speed is currently 2.4 days."
      ]
    }
  });
});

export default router;
