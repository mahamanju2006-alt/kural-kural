/**
 * NLP Classifier for Tamil and English Grievance Text
 * Automatically detects Language, Category, Priority, Department, and Location
 */

const CATEGORY_RULES = [
  {
    category: 'Water Supply',
    department: 'Water Supply & Sanitation Department',
    keywordsTa: ['குடிநீர்', 'நீர்', 'தண்ணீர்', 'குழாய்', 'வாட்டர்', 'டேங்க்', 'சுத்திகரிப்பு'],
    keywordsEn: ['water', 'drinking water', 'pipe', 'tap', 'tank', 'borewell', 'water supply', 'leakage']
  },
  {
    category: 'Roads & Bridges',
    department: 'Highways & Rural Roads Department',
    keywordsTa: ['சாலை', 'ரோடு', 'பள்ளம்', 'தார்', 'பாலம்', 'வீதி', 'போக்குவரத்து'],
    keywordsEn: ['road', 'pothole', 'tar road', 'bridge', 'pathway', 'street', 'traffic', 'asphalt']
  },
  {
    category: 'Electricity & Power',
    department: 'Tamil Nadu Electricity Board (TNEB)',
    keywordsTa: ['மின்சாரம்', 'கரண்ட்', 'ஒயர்', 'மின்சார', 'டிரான்ஸ்பார்மர்', 'பவர்', 'மின் கம்பம்'],
    keywordsEn: ['electricity', 'current', 'power', 'wire', 'transformer', 'pole', 'blackout', 'tneb', 'voltage']
  },
  {
    category: 'Drainage & Sewage',
    department: 'Public Health & Drainage Department',
    keywordsTa: ['சாக்கடை', 'கழிவுநீர்', 'அடைப்பு', 'கால்வாய்', 'துர்நாற்றம்'],
    keywordsEn: ['drainage', 'sewage', 'drain', 'gutter', 'clogged', 'stagnant', 'foul smell']
  },
  {
    category: 'Waste Management',
    department: 'Municipal Solid Waste Management',
    keywordsTa: ['குப்பை', 'கழிவு', 'தூய்மை', 'துப்புரவு', 'தொட்டி', 'பிளாஸ்டிக்'],
    keywordsEn: ['waste', 'garbage', 'trash', 'cleanliness', 'dustbin', 'litter', 'sanitation']
  },
  {
    category: 'Street Lighting',
    department: 'Electrical Maintenance Division',
    keywordsTa: ['தெருவிளக்கு', 'லைட்', 'வெளிச்சம்', 'இருட்டு', 'மின்விளக்கு'],
    keywordsEn: ['street light', 'light', 'darkness', 'lamp post', 'bulb', 'night light']
  },
  {
    category: 'Public Health & Safety',
    department: 'Public Health & Disease Control',
    keywordsTa: ['கொசு', 'நோய்', 'மருத்துவமனை', 'சுகாதாரம்', 'பாதுகாப்பு', 'நாய்கள்'],
    keywordsEn: ['health', 'mosquito', 'dengue', 'stray dogs', 'clinic', 'hospital', 'safety', 'fever']
  }
];

const PRIORITY_RULES = {
  emergency: ['அவசரம்', 'உயிருக்கு', 'விபத்து', 'தீ', 'வெடிப்பு', 'மின்கசிவு', 'திறந்த கிணறு', 'emergency', 'danger', 'hazard', 'fire', 'current leak', 'spark'],
  high: ['இரண்டு நாட்களாக', '3 நாட்களாக', 'பெரிய', 'அதிக', 'மிகவும்', 'மோசம்', 'high', 'severe', 'days', 'urgent', 'blocked'],
  medium: ['தேவை', 'சரி செய்ய', 'வேண்டும்', 'need', 'repair', 'issue', 'request'],
  low: ['சிறு', 'மெதுவாக', 'பரிசீலனை', 'minor', 'slow', 'suggestion', 'info']
};

const LOCATION_KEYWORDS = [
  { name: 'Sivakasi', ta: 'சிவகாசி', lat: 9.4533, lng: 77.7981 },
  { name: 'Virudhunagar', ta: 'விருதுநகர்', lat: 9.5872, lng: 77.9566 },
  { name: 'Rajapalayam', ta: 'ராஜபாளையம்', lat: 9.4532, lng: 77.5539 },
  { name: 'Aruppukkottai', ta: 'அருப்புக்கோட்டை', lat: 9.5100, lng: 78.0963 },
  { name: 'Sattur', ta: 'சாத்தூர்', lat: 9.3562, lng: 77.9256 },
  { name: 'Madurai', ta: 'மதுரை', lat: 9.9252, lng: 78.1198 },
  { name: 'Tirunelveli', ta: 'திருநெல்வேலி', lat: 8.7139, lng: 77.7567 }
];

export function analyzeGrievance(text = '', userLang = 'ta') {
  const cleanText = text.trim();
  if (!cleanText) {
    return {
      language: userLang === 'ta' ? 'Tamil' : 'English',
      category: 'General Public Grievance',
      department: 'Revenue & Public Grievance Dept',
      priority: 'Medium',
      location: 'Sivakasi',
      gps: { lat: 9.4533, lng: 77.7981 },
      keywordsDetected: []
    };
  }

  // Detect Language
  const hasTamilChars = /[\u0B80-\u0BFF]/.test(cleanText);
  const detectedLang = hasTamilChars ? 'Tamil' : 'English';

  const lowerText = cleanText.toLowerCase();

  // Find Category
  let matchedCategory = null;
  let matchedDept = null;
  const detectedKeywords = [];

  for (const rule of CATEGORY_RULES) {
    const taMatch = rule.keywordsTa.some(k => cleanText.includes(k));
    const enMatch = rule.keywordsEn.some(k => lowerText.includes(k));
    
    if (taMatch || enMatch) {
      matchedCategory = rule.category;
      matchedDept = rule.department;
      if (taMatch) {
        rule.keywordsTa.forEach(k => cleanText.includes(k) && detectedKeywords.push(k));
      }
      if (enMatch) {
        rule.keywordsEn.forEach(k => lowerText.includes(k) && detectedKeywords.push(k));
      }
      break;
    }
  }

  if (!matchedCategory) {
    matchedCategory = 'General Grievance';
    matchedDept = 'District Administrative Office';
  }

  // Find Priority
  let priority = 'Medium';
  if (PRIORITY_RULES.emergency.some(k => cleanText.includes(k) || lowerText.includes(k))) {
    priority = 'Emergency';
  } else if (PRIORITY_RULES.high.some(k => cleanText.includes(k) || lowerText.includes(k))) {
    priority = 'High';
  } else if (PRIORITY_RULES.low.some(k => cleanText.includes(k) || lowerText.includes(k))) {
    priority = 'Low';
  }

  // Find Location
  let matchedLoc = LOCATION_KEYWORDS[0]; // Default to Sivakasi
  for (const loc of LOCATION_KEYWORDS) {
    if (cleanText.includes(loc.ta) || lowerText.includes(loc.name.toLowerCase())) {
      matchedLoc = loc;
      break;
    }
  }

  return {
    language: detectedLang,
    category: matchedCategory,
    department: matchedDept,
    priority: priority,
    location: matchedLoc.name,
    gps: { lat: matchedLoc.lat, lng: matchedLoc.lng },
    keywordsDetected: detectedKeywords
  };
}
