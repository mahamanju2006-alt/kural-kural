import mongoose from 'mongoose';

const officerSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: 'Executive Officer' },
  district: { type: String, default: 'Virudhunagar' },
  taluk: { type: String, default: 'Sivakasi' },
  phone: { type: String, default: '+91 94431 88200' },
  email: { type: String, default: 'officer.sivakasi@tn.gov.in' }
}, { timestamps: true });

export default mongoose.model('Officer', officerSchema);
