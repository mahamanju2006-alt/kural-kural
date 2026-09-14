import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'System' }
});

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true, index: true },
  citizenId: { type: String, default: 'CITIZEN-DEMO-99' },
  citizenName: { type: String, default: 'K. Muthu' },
  citizenPhone: { type: String, default: '+91 98765 43210' },
  voiceRecording: { type: String, default: '' },
  transcription: { type: String, required: true },
  language: { type: String, enum: ['Tamil', 'English'], default: 'Tamil' },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Emergency', 'High', 'Medium', 'Low'], default: 'Medium' },
  department: { type: String, required: true },
  location: { type: String, required: true },
  district: { type: String, default: 'Virudhunagar' },
  taluk: { type: String, default: 'Sivakasi' },
  village: { type: String, default: 'Thiruthangal' },
  gps: {
    lat: { type: Number, default: 9.4533 },
    lng: { type: Number, default: 77.7981 }
  },
  status: {
    type: String,
    enum: ['Submitted', 'AI Verified', 'Department Assigned', 'Officer Assigned', 'Action Started', 'Resolved', 'Escalated', 'Rejected'],
    default: 'Submitted'
  },
  assignedOfficer: {
    id: { type: String, default: 'OFF-WS-102' },
    name: { type: String, default: 'Er. R. Sundaram (Assistant Engineer)' },
    phone: { type: String, default: '+91 94431 88200' },
    department: { type: String, default: 'Water Supply Department' }
  },
  timeline: [timelineSchema],
  evidence: {
    photoUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' }
  },
  slaDeadline: { type: Date, required: true },
  slaHoursRemaining: { type: Number, default: 48 },
  isEscalated: { type: Boolean, default: false },
  escalationLevel: { type: String, enum: ['None', 'Village', 'Taluk', 'District'], default: 'None' },
  rejectionReason: { type: String, default: '' },
  resolutionDetails: {
    remarks: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    resolvedAt: { type: Date }
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    solved: { type: Boolean },
    comment: { type: String, default: '' },
    submittedAt: { type: Date }
  }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
