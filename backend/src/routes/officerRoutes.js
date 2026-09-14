import express from 'express';
import Officer from '../models/Officer.js';

const router = express.Router();

// Demo officer accounts (always available as fallback)
const DEMO_OFFICERS = [
  {
    employeeId: 'GOV-1001',
    name: 'Er. R. Sundaram',
    department: 'Water Supply & Sanitation Department',
    role: 'Assistant Executive Engineer',
    district: 'Virudhunagar',
    taluk: 'Sivakasi'
  },
  {
    employeeId: 'GOV-1002',
    name: 'Dr. V. Kavitha IAS',
    department: 'District Administration',
    role: 'District Collector',
    district: 'Virudhunagar',
    taluk: 'Virudhunagar'
  },
  {
    employeeId: 'GOV-1003',
    name: 'Er. S. Murugesan',
    department: 'Highways & Rural Roads Department',
    role: 'Executive Engineer',
    district: 'Virudhunagar',
    taluk: 'Rajapalayam'
  }
];

// POST /api/officer/login
router.post('/login', async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId) {
    return res.status(400).json({ success: false, message: 'Employee ID is required' });
  }

  // 1. Try MongoDB first (with timeout protection)
  let officerFromDB = null;
  try {
    officerFromDB = await Promise.race([
      Officer.findOne({ employeeId }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB timeout')), 2000))
    ]);
  } catch (e) {
    // DB not available or timed out — fall through to demo mode
  }

  if (officerFromDB && officerFromDB.password === password) {
    return res.json({
      success: true,
      message: 'Officer authenticated',
      officer: {
        employeeId: officerFromDB.employeeId,
        name: officerFromDB.name,
        department: officerFromDB.department,
        role: officerFromDB.role,
        district: officerFromDB.district,
        taluk: officerFromDB.taluk
      }
    });
  }

  // 2. Demo officer fallback (always works for presentation)
  const demoOfficer = DEMO_OFFICERS.find(o => o.employeeId === employeeId.trim());

  if (demoOfficer) {
    // Accept any password for demo officers
    return res.json({
      success: true,
      message: 'Officer authenticated (demo mode)',
      officer: demoOfficer
    });
  }

  // 3. Generic fallback — any GOV-XXXX ID logs in as first demo officer
  if (/^GOV-/i.test(employeeId.trim())) {
    return res.json({
      success: true,
      message: 'Officer authenticated (generic demo)',
      officer: { ...DEMO_OFFICERS[0], employeeId: employeeId.trim() }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials. Use GOV-1001, GOV-1002, or GOV-1003 with any password.' });
});

export default router;
