import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, X, CheckCircle2, Sparkles, MapPin, Building, ArrowRight, RefreshCw, AlertCircle, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';
import { submitNewComplaint } from '../services/complaintService';


const TA_CAT_MAP = {
  'Water Supply': 'குடிநீர் விநியோகம் (Water Supply)',
  'Electricity & Power': 'மின்சாரம் & மின்வாரியம் (Electricity)',
  'Roads & Bridges': 'சாலை & பாலங்கள் (Roads)',
  'Drainage & Sewage': 'சாக்கடை & கழிவுநீர் (Drainage)',
  'Waste Management': 'குப்பை மேலாண்மை (Waste)',
  'General Public Grievance': 'பொதுமக்கள் குறைதீர்ப்பு (General)'
};

const TA_DEPT_MAP = {
  'Water Supply & Sanitation Department': 'குடிநீர் வழங்கல் & சுகாதாரத் துறை',
  'Tamil Nadu Electricity Board (TNEB)': 'தமிழ்நாடு மின்வாரியம் (TNEB)',
  'Highways & Rural Roads Department': 'நெடுஞ்சாலை & ஊரகச் சாலைத் துறை',
  'Public Health & Drainage Department': 'பொதுச்சுகாதாரம் & சாக்கடைத் துறை',
  'Municipal Solid Waste Management': 'நகராட்சி திடக்கழிவு மேலாண்மைத் துறை',
  'District Administrative Office': 'மாவட்ட ஆட்சியர் நிர்வாக அலுவலகம்'
};

const TA_PRIO_MAP = {
  'Emergency': 'அவசரம் (Emergency)',
  'High': 'அதி முக்கியம் (High)',
  'Medium': 'நடுத்தரம் (Medium)',
  'Low': 'சாதாரண (Low)'
};

export default function VoiceRecorderModal({ isOpen, onClose, lang, initialText = '', onComplaintSubmitted }) {

  const [state, setState] = useState('IDLE');
  const [selectedLang, setSelectedLang] = useState('ta-IN');
  
  const [transcription, setTranscription] = useState('');
  const [manualText, setManualText] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [locationName, setLocationName] = useState('Sivakasi');
  
  const [timer, setTimer] = useState(0);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscription(currentTranscript);
          setManualText(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setErrorMsg(`Voice recognition note: ${event.error}. You can also type text directly below.`);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialText) {
        setTranscription(initialText);
        setManualText(initialText);
        analyzeText(initialText);
        setState('PREVIEW');
      } else {
        setTranscription('');
        setManualText('');
        setCitizenName('');
        setCitizenPhone('');
        setAnalysisResult(null);
        setState('IDLE');
      }
      setErrorMsg('');
      setSubmittedComplaint(null);
    }
  }, [initialText, isOpen]);

  useEffect(() => {
    if (state === 'LISTENING') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
      setTimer(0);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [state]);

  if (!isOpen) return null;

  const startListening = () => {
    setErrorMsg('');
    setTranscription('');
    setManualText('');
    setState('LISTENING');

    if (recognitionRef.current && isSpeechSupported) {
      try {
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isSpeechSupported) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Recognition stop error:', err);
      }
    }

    const finalText = (transcription || manualText).trim();
    if (!finalText) {
      setErrorMsg('No speech detected. Please speak or type your complaint text.');
      setState('IDLE');
      return;
    }

    setState('PROCESSING');

    setTimeout(() => {
      analyzeText(finalText);
      setState('PREVIEW');
    }, 800);
  };

  const analyzeText = (text) => {
    const isTa = /[\u0B80-\u0BFF]/.test(text) || selectedLang === 'ta-IN';
    const lower = text.toLowerCase();

    let cat = 'General Public Grievance';
    let dept = 'District Administrative Office';
    let prio = 'Medium';
    let loc = locationName;

    const hasWater = lower.includes('water') || lower.includes('tap') || lower.includes('pipe') || lower.includes('supply') || lower.includes('leak') || text.includes('குடிநீர்') || text.includes('தண்ணீர்') || text.includes('வாட்டர்') || text.includes('குழாய்');
    const hasPower = lower.includes('power') || lower.includes('electricity') || lower.includes('wire') || lower.includes('current') || lower.includes('spark') || lower.includes('tneb') || lower.includes('eb') || text.includes('மின்சாரம்') || text.includes('ஒயர்') || text.includes('மின்சார') || text.includes('கரண்ட்') || text.includes('டிரான்ஸ்பார்மர்') || text.includes('கம்பி');
    const hasRoad = lower.includes('road') || lower.includes('pothole') || lower.includes('street') || lower.includes('bridge') || text.includes('சாலை') || text.includes('ரோடு') || text.includes('ரோட்') || text.includes('பள்ளம்') || text.includes('குண்டும்');
    const hasDrainage = lower.includes('drainage') || lower.includes('sewage') || lower.includes('drain') || text.includes('சாக்கடை') || text.includes('கழிவுநீர்') || text.includes('டிரைனேஜ்');
    const hasWaste = lower.includes('garbage') || lower.includes('waste') || lower.includes('trash') || lower.includes('dump') || text.includes('குப்பை') || text.includes('கழிவு');

    if (hasWater) {
      cat = 'Water Supply';
      dept = 'Water Supply & Sanitation Department';
      prio = text.includes('இரண்டு') || text.includes('2') || lower.includes('urgent') || lower.includes('days') || lower.includes('2 days') ? 'High' : 'Medium';
    } else if (hasPower) {
      cat = 'Electricity & Power';
      dept = 'Tamil Nadu Electricity Board (TNEB)';
      prio = text.includes('அறுந்து') || lower.includes('spark') || lower.includes('snap') || lower.includes('emergency') ? 'Emergency' : 'High';
    } else if (hasRoad) {
      cat = 'Roads & Bridges';
      dept = 'Highways & Rural Roads Department';
      prio = 'High';
    } else if (hasDrainage) {
      cat = 'Drainage & Sewage';
      dept = 'Public Health & Drainage Department';
      prio = 'High';
    } else if (hasWaste) {
      cat = 'Waste Management';
      dept = 'Municipal Solid Waste Management';
      prio = 'Medium';
    }

    if (text.includes('சிவகாசி') || lower.includes('sivakasi')) loc = 'Sivakasi';
    if (text.includes('விருதுநகர்') || lower.includes('virudhunagar')) loc = 'Virudhunagar';
    if (text.includes('ராஜபாளையம்') || lower.includes('rajapalayam')) loc = 'Rajapalayam';
    if (text.includes('அருப்புக்கோட்டை') || lower.includes('aruppukkottai')) loc = 'Aruppukkottai';

    setLocationName(loc);
    setAnalysisResult({
      language: isTa ? 'Tamil' : 'English',
      category: cat,
      department: dept,
      priority: prio,
      location: loc
    });
  };


  const handleSubmitComplaint = async () => {
    const finalText = (transcription || manualText).trim();
    if (!finalText) {
      setErrorMsg('Please speak or type your complaint text before submitting.');
      return;
    }

    setState('SUBMITTING');
    setErrorMsg('');

    const compObj = await submitNewComplaint({
      transcription: finalText,
      language: analysisResult?.language || 'Tamil',
      category: analysisResult?.category || 'Water Supply',
      priority: analysisResult?.priority || 'High',
      department: analysisResult?.department || 'Water Supply Department',
      location: locationName,
      citizenName: citizenName.trim() || 'Anonymous Citizen',
      citizenPhone: citizenPhone.trim() || 'Not Provided'
    });

    setSubmittedComplaint(compObj);
    setState('SUBMITTED');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    if (onComplaintSubmitted) onComplaintSubmitted(compObj);
  };



  return (
    <div className="modal-overlay">
      <div className="modal-content relative overflow-hidden max-w-2xl border border-sage-300 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#36682f] text-white flex items-center justify-center shadow-md">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#152612]">
              {lang === 'ta' ? 'குரல் மூலம் புகார் பதிவு' : 'Voice Grievance Registration'}
            </h2>
            <p className="text-xs text-gray-500 font-semibold">
              KURAL KURAL • Official Speech-to-Text Portal
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STATE 1: IDLE */}
        {state === 'IDLE' && (
          <div className="flex flex-col items-center justify-center py-6 gap-6 text-center">
            
            <div className="flex items-center gap-3 bg-sage-100 p-1.5 rounded-full border border-sage-300">
              <button
                onClick={() => setSelectedLang('ta-IN')}
                className={`px-5 py-2 text-xs font-bold rounded-full transition ${
                  selectedLang === 'ta-IN' ? 'bg-[#36682f] text-white shadow-sm' : 'text-gray-700 hover:text-[#152612]'
                }`}
              >
                தமிழ் (Tamil Speech)
              </button>
              <button
                onClick={() => setSelectedLang('en-IN')}
                className={`px-5 py-2 text-xs font-bold rounded-full transition ${
                  selectedLang === 'en-IN' ? 'bg-[#36682f] text-white shadow-sm' : 'text-gray-700 hover:text-[#152612]'
                }`}
              >
                English Speech
              </button>
            </div>

            <div className="relative my-2">
              <button
                onClick={startListening}
                className="w-28 h-28 rounded-full bg-[#36682f] text-white flex items-center justify-center shadow-xl hover:scale-105 transition transform cursor-pointer pulsing-mic"
              >
                <Mic className="w-12 h-12" />
              </button>
            </div>

            <div>
              <p className="text-base font-extrabold text-[#152612]">
                {selectedLang === 'ta-IN' ? 'பேச மைக் பொத்தானை அழுத்தவும்' : 'Click microphone to start speaking'}
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                {selectedLang === 'ta-IN' 
                  ? 'பேசத் தொடங்கியதும் உங்கள் குரல் உரையாக மாற்றப்படும்.' 
                  : 'Speak clearly into your microphone in Tamil or English.'}
              </p>
            </div>

            {/* Quick Demo Voice Grievances */}
            <div className="w-full flex flex-col gap-1.5 text-left">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">⚡ விரைவு மாதிரி புகார்கள் (Instant Samples):</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '💧 குடிநீர் விநியோகம் தடை (Sivakasi)', text: 'சிவகாசியில் கடந்த 2 நாட்களாக குடிநீர் வரவில்லை. உடனடியாக சரிசெய்யவும்.' },
                  { label: '⚡ மின்கம்பி அறுந்து விழுந்தது (Emergency)', text: 'விருதுநகர் மெயின் ரோட்டில் டிரான்ஸ்பார்மர் ஒயர் அறுந்து கிடக்கிறது. ஆபத்தாக உள்ளது.' },
                  { label: '🛣️ சாலை சேதம் (Potholes)', text: 'ராஜபாளையம் பஸ் ஸ்டாண்ட் அருகில் சாலையில் பெரிய பள்ளங்கள் உள்ளன.' }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setManualText(chip.text);
                      setTranscription(chip.text);
                      analyzeText(chip.text);
                      setState('PREVIEW');
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition text-left"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full pt-4 border-t border-gray-200">
              <label className="block text-left text-xs font-bold text-gray-700 mb-1">
                அல்லது உரையாக தட்டச்சு செய்க (Or Type Text Directly):
              </label>

              <textarea
                rows={3}
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setTranscription(e.target.value);
                }}
                placeholder="உங்கள் புகாரை இங்கு தட்டச்சு செய்யலாம்..."
                className="w-full p-3 text-sm rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36682f] font-ta font-medium text-gray-900"
              />
              <button
                onClick={() => {
                  const finalText = manualText.trim();
                  if (!finalText) {
                    setErrorMsg('Please speak or type text first.');
                    return;
                  }
                  setTranscription(finalText);
                  analyzeText(finalText);
                  setState('PREVIEW');
                }}
                className="btn bg-[#36682f] text-white hover:bg-[#1e381b] btn-md mt-3 w-full font-bold shadow-md"
              >
                <span>உரையை பகுப்பாய்வு செய்க (Proceed)</span>
                <ArrowRight className="w-4 h-4 text-sage-300" />
              </button>
            </div>

          </div>
        )}

        {/* STATE 2: LISTENING */}
        {state === 'LISTENING' && (
          <div className="flex flex-col items-center justify-center py-8 gap-6 text-center">
            
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#36682f] flex items-center justify-center shadow-2xl pulsing-mic">
                <Mic className="w-14 h-14 text-white animate-pulse" />
              </div>
            </div>

            <div className="waveform-container my-2">
              <div className="waveform-bar" />
              <div className="waveform-bar" />
              <div className="waveform-bar" />
              <div className="waveform-bar" />
              <div className="waveform-bar" />
              <div className="waveform-bar" />
              <div className="waveform-bar" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full mb-2 animate-pulse">
                • LISTENING LIVE ({timer}s)
              </span>
              <p className="text-base font-semibold text-gray-800">
                {selectedLang === 'ta-IN' ? 'உங்கள் புகாரை பேசுங்கள்...' : 'Speaking your complaint now...'}
              </p>
            </div>

            <div className="w-full bg-[#f4f8ee] p-4 rounded-2xl border border-[#cbe0b3] text-left min-h-[90px]">
              <p className="text-xs font-bold text-[#152612] mb-1">Live Voice Transcription:</p>
              <p className="text-sm text-gray-900 font-ta font-semibold">
                {transcription || 'Listening for speech input...'}
              </p>
            </div>

            <button
              onClick={stopListening}
              className="btn bg-red-600 text-white hover:bg-red-700 px-8 py-3 rounded-full flex items-center gap-2 font-bold shadow-md"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>{lang === 'ta' ? 'பேச்சை முடித்து சமர்ப்பி' : 'Done Speaking'}</span>
            </button>

          </div>
        )}

        {/* STATE 3: PROCESSING */}
        {state === 'PROCESSING' && (
          <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
            <RefreshCw className="w-12 h-12 text-[#36682f] animate-spin" />
            <h3 className="text-lg font-bold text-[#152612]">AI Categorization Engine Processing...</h3>
            <p className="text-xs text-gray-500">Extracting Category • Priority • Department • Location</p>
          </div>
        )}
        {/* STATE 4: PREVIEW */}

        {state === 'PREVIEW' && analysisResult && (
          <div className="flex flex-col gap-5 py-2">
            
            <div className="bg-[#f4f8ee] p-4 rounded-2xl border border-[#cbe0b3]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-[#152612] uppercase tracking-wide">
                  {lang === 'ta' ? 'பதிவு செய்யப்பட்ட குரல் உரை' : 'CAPTURED VOICE TRANSCRIPTION'}
                </span>
                <span className="text-xs font-bold bg-[#cbe0b3] text-[#152612] px-2.5 py-0.5 rounded-full">
                  {analysisResult.language === 'Tamil' && lang === 'ta' ? 'தமிழ்' : analysisResult.language}
                </span>
              </div>
              <textarea
                rows={3}
                value={transcription || manualText}
                onChange={(e) => {
                  setTranscription(e.target.value);
                  setManualText(e.target.value);
                  analyzeText(e.target.value);
                }}
                className="w-full bg-white p-3 text-sm font-semibold text-gray-900 rounded-xl border border-sage-300 focus:outline-none font-ta"
                placeholder={lang === 'ta' ? 'குரல் உரை இங்கே தோன்றும்...' : 'Captured voice transcription...'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-900 block uppercase">
                  {lang === 'ta' ? 'கண்டறியப்பட்ட புகார் பிரிவு' : 'CATEGORY IDENTIFIED'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#152612] flex items-center gap-1.5 mt-1">
                  <Sparkles className="w-4 h-4 text-[#36682f] flex-shrink-0" />
                  {lang === 'ta' ? (TA_CAT_MAP[analysisResult.category] || analysisResult.category) : analysisResult.category}
                </span>
              </div>

              <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-100">
                <span className="text-[11px] font-bold text-purple-900 block uppercase">
                  {lang === 'ta' ? 'முன்னுரிமை நிலை' : 'PRIORITY TAG'}
                </span>
                <span className={`inline-block text-xs font-black px-3 py-1 rounded-full mt-1 ${
                  analysisResult.priority === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {lang === 'ta' ? (TA_PRIO_MAP[analysisResult.priority] || analysisResult.priority) : analysisResult.priority}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-600 block uppercase">
                  {lang === 'ta' ? 'ஒதுக்கப்பட்ட அரசுத் துறை' : 'ASSIGNED DEPARTMENT'}
                </span>
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5 mt-1">
                  <Building className="w-4 h-4 text-[#36682f] flex-shrink-0" />
                  {lang === 'ta' ? (TA_DEPT_MAP[analysisResult.department] || analysisResult.department) : analysisResult.department}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-600 block uppercase">
                  {lang === 'ta' ? 'கண்டறியப்பட்ட பகுதி' : 'DETECTED LOCATION'}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <select
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="text-xs font-bold bg-white border border-gray-300 rounded-lg p-1"
                  >
                    <option value="Sivakasi">சிவகாசி (Sivakasi)</option>
                    <option value="Virudhunagar">விருதுநகர் (Virudhunagar)</option>
                    <option value="Rajapalayam">ராஜபாளையம் (Rajapalayam)</option>
                    <option value="Aruppukkottai">அருப்புக்கோட்டை (Aruppukkottai)</option>
                    <option value="Sattur">சாத்தூர் (Sattur)</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  {lang === 'ta' ? 'குடிமகன் பெயர்' : 'Citizen Name'} <span className="text-gray-400 font-normal">({lang === 'ta' ? 'விருப்பம்' : 'Optional'})</span>:
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={lang === 'ta' ? 'எ.கா. முத்து' : 'e.g. K. Muthu'}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  {lang === 'ta' ? 'கைபேசி எண்' : 'Mobile Phone'} <span className="text-gray-400 font-normal">({lang === 'ta' ? 'விருப்பம்' : 'Optional'})</span>:
                </label>
                <input
                  type="text"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder={lang === 'ta' ? 'எ.கா. 9876543210' : 'e.g. 9876543210'}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setTranscription('');
                  setManualText('');
                  setState('IDLE');
                }}
                className="btn btn-outline flex-1 py-3 text-xs font-bold"
              >
                {lang === 'ta' ? 'அழித்து மீண்டும் பேசுக' : 'Clear & Re-record'}
              </button>

              <button
                onClick={handleSubmitComplaint}
                className="btn bg-[#36682f] text-white hover:bg-[#1e381b] flex-[2] py-3 text-sm font-bold shadow-md"
              >
                <span>{lang === 'ta' ? 'புகாரை சமர்ப்பி' : 'Submit Complaint'}</span>
                <ArrowRight className="w-5 h-5 text-sage-300" />
              </button>
            </div>


          </div>
        )}

        {/* STATE 5: SUBMITTING */}
        {state === 'SUBMITTING' && (
          <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
            <RefreshCw className="w-12 h-12 text-[#36682f] animate-spin" />
            <h3 className="text-lg font-bold text-[#152612]">Submitting Grievance to Government Portal...</h3>
            <p className="text-xs text-gray-500">Generating Unique Complaint ID & Dispatched to Database</p>
          </div>
        )}

        {/* STATE 6: SUBMITTED */}
        {state === 'SUBMITTED' && submittedComplaint && (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Grievance Registered Successfully
              </span>
              <h3 className="text-2xl font-black text-[#152612] mt-2 font-mono">
                ID: {submittedComplaint.complaintId}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Keep this ID or Mobile Number to track grievance status.
              </p>
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2 my-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-bold text-[#152612]">{submittedComplaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department:</span>
                <span className="font-bold text-gray-800">{submittedComplaint.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-bold text-orange-600">{submittedComplaint.location}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn bg-[#36682f] text-white hover:bg-[#1e381b] w-full py-3 text-sm font-bold shadow-md"
            >
              Done & View Tracking Timeline
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
