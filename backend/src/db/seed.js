import Complaint from '../models/Complaint.js';
import Officer from '../models/Officer.js';

export const seedInitialData = async () => {
  try {
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount > 0) {
      console.log('Database already initialized with demo complaints.');
      return;
    }

    console.log('Seeding initial demo complaints and officers into database...');

    const now = new Date();

    const sampleComplaints = [
      {
        complaintId: 'KK-2026-48321',
        citizenName: 'P. Arumugam',
        citizenPhone: '+91 98421 11234',
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
        slaDeadline: new Date(now.getTime() + 18 * 3600 * 1000),
        slaHoursRemaining: 18,
        timeline: [
          { status: 'Submitted', title: 'Complaint Submitted', description: 'Citizen submitted grievance via voice recording.', timestamp: new Date(now.getTime() - 24 * 3600 * 1000), updatedBy: 'Citizen' },
          { status: 'AI Verified', title: 'AI Verification Complete', description: 'Speech translated, category "Water Supply" and priority "High" automatically detected.', timestamp: new Date(now.getTime() - 23 * 3600 * 1000), updatedBy: 'Kural AI' },
          { status: 'Department Assigned', title: 'Assigned to Water Dept', description: 'Complaint routed to Sivakasi Municipal Water Division.', timestamp: new Date(now.getTime() - 20 * 3600 * 1000), updatedBy: 'System Engine' },
          { status: 'Officer Assigned', title: 'Officer Assigned', description: 'Er. R. Sundaram assigned to inspect main pipeline valve.', timestamp: new Date(now.getTime() - 12 * 3600 * 1000), updatedBy: 'Superintendent Engineer' },
          { status: 'Action Started', title: 'On-Site Repair In Progress', description: 'Technicians dispatched with water tanker supply and pipeline welding kit.', timestamp: new Date(now.getTime() - 2 * 3600 * 1000), updatedBy: 'Er. R. Sundaram' }
        ]
      },
      {
        complaintId: 'KK-2026-27418',
        citizenName: 'M. Kasthuri',
        citizenPhone: '+91 97890 55432',
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
        slaDeadline: new Date(now.getTime() + 6 * 3600 * 1000),
        slaHoursRemaining: 6,
        timeline: [
          { status: 'Submitted', title: 'Complaint Submitted', description: 'Live emergency grievance captured via Tamil Voice UI.', timestamp: new Date(now.getTime() - 30 * 60 * 1000), updatedBy: 'Citizen' },
          { status: 'AI Verified', title: 'AI Verified - Emergency Flagged', description: 'Automated hazard detection flagged power wire snap hazard.', timestamp: new Date(now.getTime() - 28 * 60 * 1000), updatedBy: 'Kural AI' }
        ]
      },
      {
        complaintId: 'KK-2026-71942',
        citizenName: 'S. Ramanathan',
        citizenPhone: '+91 96211 44890',
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
        slaDeadline: new Date(now.getTime() + 30 * 3600 * 1000),
        slaHoursRemaining: 30,
        timeline: [
          { status: 'Submitted', title: 'Complaint Submitted', description: 'Voice complaint submitted in English.', timestamp: new Date(now.getTime() - 14 * 3600 * 1000), updatedBy: 'Citizen' },
          { status: 'AI Verified', title: 'AI Verified', description: 'Category: Roads & Bridges, Priority: High.', timestamp: new Date(now.getTime() - 13 * 3600 * 1000), updatedBy: 'Kural AI' },
          { status: 'Department Assigned', title: 'Routed to Highways Dept', description: 'Dispatched to Rajapalayam Highways Division.', timestamp: new Date(now.getTime() - 10 * 3600 * 1000), updatedBy: 'System Engine' }
        ]
      },
      {
        complaintId: 'KK-2026-10567',
        citizenName: 'G. Lakshmi',
        citizenPhone: '+91 94435 22109',
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
        slaDeadline: new Date(now.getTime() - 48 * 3600 * 1000),
        slaHoursRemaining: 0,
        resolutionDetails: {
          remarks: 'Garbage cleared completely using municipal compactor truck. Bleaching powder sprinkled.',
          beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60',
          afterImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&auto=format&fit=crop&q=60',
          resolvedAt: new Date(now.getTime() - 6 * 3600 * 1000)
        },
        feedback: {
          rating: 5,
          solved: true,
          comment: 'மிகவும் நன்றி! குப்பைகளை உடனடியாக அள்ளி சுத்தம் செய்துவிட்டனர்.',
          submittedAt: new Date(now.getTime() - 4 * 3600 * 1000)
        },
        timeline: [
          { status: 'Submitted', title: 'Complaint Submitted', description: 'Voice complaint registered.', timestamp: new Date(now.getTime() - 72 * 3600 * 1000), updatedBy: 'Citizen' },
          { status: 'AI Verified', title: 'AI Verified', description: 'Assigned category Waste Management.', timestamp: new Date(now.getTime() - 71 * 3600 * 1000), updatedBy: 'Kural AI' },
          { status: 'Department Assigned', title: 'Assigned to Sanitation Dept', description: 'Forwarded to Inspector Chelladurai.', timestamp: new Date(now.getTime() - 60 * 3600 * 1000), updatedBy: 'System Engine' },
          { status: 'Officer Assigned', title: 'Sanitation Crew Mobilized', description: 'Sanitation inspector acknowledged ticket.', timestamp: new Date(now.getTime() - 40 * 3600 * 1000), updatedBy: 'S. Chelladurai' },
          { status: 'Action Started', title: 'Waste Pickup Initiated', description: 'Truck dispatched to Bazaar street.', timestamp: new Date(now.getTime() - 20 * 3600 * 1000), updatedBy: 'S. Chelladurai' },
          { status: 'Resolved', title: 'Grievance Resolved', description: 'Area cleaned and verified by citizen.', timestamp: new Date(now.getTime() - 6 * 3600 * 1000), updatedBy: 'S. Chelladurai' }
        ]
      },
      {
        complaintId: 'KK-2026-39126',
        citizenName: 'K. Balakrishnan',
        citizenPhone: '+91 98433 77123',
        transcription: 'சாத்தூர் தாலுகா அலுவலகம் அருகில் பிரதான சாக்கடை அடைப்பினால் சாக்கடை நீர் தெருவில் வழிகிறது.',
        language: 'Tamil',
        category: 'Drainage & Sewage',
        priority: 'Emergency',
        department: 'Public Health & Drainage Department',
        location: 'Sattur',
        district: 'Virudhunagar',
        taluk: 'Sattur',
        village: 'Taluk Office Road',
        gps: { lat: 9.3562, lng: 77.9256 },
        status: 'Escalated',
        isEscalated: true,
        escalationLevel: 'District',
        assignedOfficer: {
          id: 'OFF-DR-501',
          name: 'District Collector Office / Executive Officer',
          phone: '+91 94450 11000',
          department: 'District Administration'
        },
        slaDeadline: new Date(now.getTime() - 12 * 3600 * 1000),
        slaHoursRemaining: 0,
        timeline: [
          { status: 'Submitted', title: 'Complaint Submitted', description: 'Emergency drainage overflow reported.', timestamp: new Date(now.getTime() - 90 * 3600 * 1000), updatedBy: 'Citizen' },
          { status: 'AI Verified', title: 'AI Verified', description: 'Category: Drainage, Priority: Emergency.', timestamp: new Date(now.getTime() - 89 * 3600 * 1000), updatedBy: 'Kural AI' },
          { status: 'Escalated', title: 'SLA Breached - Escalated to District Officer', description: 'SLA response deadline of 48 hours exceeded without action. Auto-escalated to District Collector Office.', timestamp: new Date(now.getTime() - 12 * 3600 * 1000), updatedBy: 'SLA Escalation Engine' }
        ]
      }
    ];

    await Complaint.insertMany(sampleComplaints);

    // Seed Officers
    const sampleOfficers = [
      {
        employeeId: 'GOV-1001',
        name: 'Er. R. Sundaram',
        password: 'password123',
        department: 'Water Supply Department',
        role: 'Assistant Executive Engineer',
        district: 'Virudhunagar',
        taluk: 'Sivakasi'
      },
      {
        employeeId: 'GOV-1002',
        name: 'Dr. V. Kavitha IAS',
        password: 'password123',
        department: 'District Administration',
        role: 'District Collector',
        district: 'Virudhunagar',
        taluk: 'Virudhunagar'
      }
    ];

    await Officer.insertMany(sampleOfficers);
    console.log('Demo complaints and officers seeded successfully!');
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
};
