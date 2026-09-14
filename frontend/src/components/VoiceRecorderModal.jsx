import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, X, CheckCircle2, Sparkles, MapPin, Building, ArrowRight, RefreshCw, AlertCircle, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitNewComplaint } from '../services/complaintService';

const TA_CAT_MAP = {
  'Water Supply': 'குடிநீர் விநியோகம்',
  'Electricity & Power': 'மின்சாரம் & மின்வாரியம்',
  'Roads & Bridges': 'சாலை & பாலங்கள்',
  'Drainage & Sewage': 'சாக்கடை & கழிவுநீர்',
  'Waste Management': 'குப்பை மேலாண்மை',
  'General Public Grievance': 'பொதுமக்கள் குறைதீர்ப்பு'
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
  'Emergency': 'அவசரம்',
  'High': 'அதி முக்கியம்',
  'Medium': 'நடுத்தரம்',
  'Low': 'சாதாரண'
};

const CATEGORY_OPTIONS = [
  { value: 'Water Supply', ta: 'குடிநீர் விநியோகம்', en: 'Water Supply' },
  { value: 'Electricity & Power', ta: 'மின்சாரம் & மின்வாரியம்', en: 'Electricity & Power' },
  { value: 'Roads & Bridges', ta: 'சாலை & பாலங்கள்', en: 'Roads & Bridges' },
  { value: 'Drainage & Sewage', ta: 'சாக்கடை & கழிவுநீர்', en: 'Drainage & Sewage' },
  { value: 'Waste Management', ta: 'குப்பை மேலாண்மை', en: 'Waste Management' },
  { value: 'General Public Grievance', ta: 'பொதுமக்கள் குறைதீர்ப்பு', en: 'General Public Grievance' }
];

const DEPARTMENT_OPTIONS = [
  { value: 'Water Supply & Sanitation Department', ta: 'குடிநீர் வழங்கல் & சுகாதாரத் துறை', en: 'Water Supply & Sanitation Department' },
  { value: 'Tamil Nadu Electricity Board (TNEB)', ta: 'தமிழ்நாடு மின்வாரியம் (TNEB)', en: 'Tamil Nadu Electricity Board (TNEB)' },
  { value: 'Highways & Rural Roads Department', ta: 'நெடுஞ்சாலை & ஊரகச் சாலைத் துறை', en: 'Highways & Rural Roads Department' },
  { value: 'Public Health & Drainage Department', ta: 'பொதுச்சுகாதாரம் & சாக்கடைத் துறை', en: 'Public Health & Drainage Department' },
  { value: 'Municipal Solid Waste Management', ta: 'நகராட்சி திடக்கழிவு மேலாண்மைத் துறை', en: 'Municipal Solid Waste Management' },
  { value: 'District Administrative Office', ta: 'மாவட்ட ஆட்சியர் நிர்வாக அலுவலகம்', en: 'District Administrative Office' }
];

const PRIORITY_OPTIONS = [
  { value: 'Emergency', ta: 'அவசரம்', en: 'Emergency' },
  { value: 'High', ta: 'அதி முக்கியம்', en: 'High' },
  { value: 'Medium', ta: 'நடுத்தரம்', en: 'Medium' },
  { value: 'Low', ta: 'சாதாரண', en: 'Low' }
];

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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setErrorMsg('Speech recognition is not supported in this browser. Please type your grievance text below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

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

      recognition.onend = () => {
        // Recognition stopped
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Recognition start error:', err);
      setErrorMsg('Microphone error. You can type your grievance text directly in the box below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
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
    const hasPower = lower.includes('power') || lower.includes('electricity') || lower.includes('wire') || lower.includes('current') || lower.includes('spark') || lower.includes('tneb') || lower.includes('eb') || lower.includes('light') || lower.includes('transformer') || text.includes('மின்சாரம்') || text.includes('ஒயர்') || text.includes('மின்சார') || text.includes('கரண்ட்') || text.includes('டிரான்ஸ்பார்மர்') || text.includes('கம்பி');
    const hasRoad = lower.includes('road') || lower.includes('pothole') || lower.includes('street') || lower.includes('bridge') || lower.includes('tar') || text.includes('சாலை') || text.includes('ரோடு') || text.includes('ரோட்') || text.includes('பள்ளம்') || text.includes('குண்டும்');
    const hasDrainage = lower.includes('drainage') || lower.includes('sewage') || lower.includes('drain') || lower.includes('overflow') || text.includes('சாக்கடை') || text.includes('கழிவுநீர்') || text.includes('டிரைனேஜ்');
    const hasWaste = lower.includes('garbage') || lower.includes('waste') || lower.includes('trash') || lower.includes('dump') || text.includes('குப்பை') || text.includes('கழிவு');

    if (hasWater) {
      cat = 'Water Supply';
      dept = 'Water Supply & Sanitation Department';
      prio = text.includes('இரண்டு') || text.includes('2') || lower.includes('urgent') || lower.includes('days') || lower.includes('2 days') || lower.includes('no water') ? 'High' : 'Medium';
    } else if (hasPower) {
      cat = 'Electricity & Power';
      dept = 'Tamil Nadu Electricity Board (TNEB)';
      prio = text.includes('அறுந்து') || lower.includes('spark') || lower.includes('snap') || lower.includes('emergency') || lower.includes('dangerous') ? 'Emergency' : 'High';
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
      language: analysisResult?.language || (lang === 'ta' ? 'Tamil' : 'English'),
      category: analysisResult?.category || 'Water Supply',
      priority: analysisResult?.priority || 'High',
      department: analysisResult?.department || 'Water Supply & Sanitation Department',
      location: locationName,
      citizenName: citizenName.trim() || (lang === 'ta' ? 'அநாமதேய குடிமகன்' : 'Anonymous Citizen'),
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
                தமிழ்
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
                  : 'Speak clearly into your microphone in English.'}
              </p>
            </div>

            {/* Quick Demo Voice Grievances */}
            <div className="w-full flex flex-col gap-1.5 text-left">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {selectedLang === 'ta-IN' ? '⚡ விரைவு மாதிரி புகார்கள்:' : '⚡ INSTANT SAMPLES (CLICK TO TEST):'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedLang === 'ta-IN' ? [
                  { label: '💧 குடிநீர் விநியோகம் தடை', text: 'சிவகாசியில் கடந்த 2 நாட்களாக குடிநீர் வரவில்லை. உடனடியாக சரிசெய்யவும்.' },
                  { label: '⚡ மின்கம்பி அறுந்து விழுந்தது', text: 'விருதுநகர் மெயின் ரோட்டில் டிரான்ஸ்பார்மர் ஒயர் அறுந்து கிடக்கிறது. ஆபத்தாக உள்ளது.' },
                  { label: '🛣️ சாலை சேதம்', text: 'ராஜபாளையம் பஸ் ஸ்டாண்ட் அருகில் சாலையில் பெரிய பள்ளங்கள் உள்ளன.' }
                ] : [
                  { label: '💧 Water Supply Interrupted', text: 'No water supply in Sivakasi for the last 2 days. Please resolve immediately.' },
                  { label: '⚡ Electricity Wire Snapped', text: 'Transformer wire snapped on Virudhunagar Main Road. Extremely dangerous.' },
                  { label: '🛣️ Road Damage', text: 'Big potholes near Rajapalayam bus stand causing heavy traffic problems.' }
                ]).map((chip) => (
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
                {selectedLang === 'ta-IN' ? 'அல்லது உரையாக தட்டச்சு செய்க:' : 'Or Type Text Directly:'}
              </label>

              <textarea
                rows={3}
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setTranscription(e.target.value);
                }}
                placeholder={selectedLang === 'ta-IN' ? 'உங்கள் புகாரை இங்கு தட்டச்சு செய்யலாம்...' : 'Type your grievance details here...'}
                className="w-full p-3 text-sm rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36682f] font-ta font-medium text-gray-900"
              />
              <button
                onClick={() => {
                  const finalText = manualText.trim();
                  if (!finalText) {
                    setErrorMsg(selectedLang === 'ta-IN' ? 'தயவுசெய்து முதலில் பேசவும் அல்லது தட்டச்சு செய்யவும்.' : 'Please speak or type text first.');
                    return;
                  }
                  setTranscription(finalText);
                  analyzeText(finalText);
                  setState('PREVIEW');
                }}
                className="btn bg-[#36682f] text-white hover:bg-[#1e381b] btn-md mt-3 w-full font-bold shadow-md"
              >
                <span>{selectedLang === 'ta-IN' ? 'உரையை பகுப்பாய்வு செய்க' : 'Analyze & Proceed'}</span>
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
              <p className="text-xs font-bold text-[#152612] mb-1">
                {selectedLang === 'ta-IN' ? 'நேரலை குரல் உரை:' : 'Live Voice Transcription:'}
              </p>
              <p className="text-sm text-gray-900 font-ta font-semibold">
                {transcription || (selectedLang === 'ta-IN' ? 'பேச்சை எதிர்பார்க்கிறது...' : 'Listening for speech input...')}
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
            <h3 className="text-lg font-bold text-[#152612]">
              {lang === 'ta' ? 'AI பகுப்பாய்வு இயங்குகிறது...' : 'AI Categorization Engine Processing...'}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === 'ta' ? 'புகார் பிரிவு • முன்னுரிமை • அரசுத் துறை • பகுதி' : 'Extracting Category • Priority • Department • Location'}
            </p>
          </div>
        )}

        {/* STATE 4: PREVIEW (Editable in both Tamil and English) */}
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

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Editable Category */}
              <div className="bg-emerald-50/90 p-3 rounded-2xl border border-emerald-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold text-emerald-900 uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#36682f]" />
                    {lang === 'ta' ? 'புகார் பிரிவு (மாற்றலாம்)' : 'Category (Editable)'}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <select
                  value={analysisResult.category}
                  onChange={(e) => setAnalysisResult({ ...analysisResult, category: e.target.value })}
                  className="w-full text-xs font-bold text-[#152612] bg-white border border-emerald-300 rounded-xl p-2 focus:outline-none cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {lang === 'ta' ? opt.ta : opt.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable Priority */}
              <div className="bg-purple-50/90 p-3 rounded-2xl border border-purple-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold text-purple-900 uppercase">
                    {lang === 'ta' ? 'முன்னுரிமை (மாற்றலாம்)' : 'Priority (Editable)'}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <select
                  value={analysisResult.priority}
                  onChange={(e) => setAnalysisResult({ ...analysisResult, priority: e.target.value })}
                  className={`w-full text-xs font-extrabold p-2 rounded-xl border focus:outline-none cursor-pointer ${
                    analysisResult.priority === 'Emergency' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {lang === 'ta' ? opt.ta : opt.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable Department */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#36682f]" />
                    {lang === 'ta' ? 'அரசுத் துறை (மாற்றலாம்)' : 'Department (Editable)'}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <select
                  value={analysisResult.department}
                  onChange={(e) => setAnalysisResult({ ...analysisResult, department: e.target.value })}
                  className="w-full text-xs font-bold text-gray-900 bg-white border border-gray-300 rounded-xl p-2 focus:outline-none cursor-pointer"
                >
                  {DEPARTMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {lang === 'ta' ? opt.ta : opt.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable Location */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    {lang === 'ta' ? 'பகுதி (மாற்றலாம்)' : 'Location (Editable)'}
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <select
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full text-xs font-bold text-gray-900 bg-white border border-gray-300 rounded-xl p-2 focus:outline-none cursor-pointer"
                >
                  <option value="Sivakasi">{lang === 'ta' ? 'சிவகாசி' : 'Sivakasi'}</option>
                  <option value="Virudhunagar">{lang === 'ta' ? 'விருதுநகர்' : 'Virudhunagar'}</option>
                  <option value="Rajapalayam">{lang === 'ta' ? 'ராஜபாளையம்' : 'Rajapalayam'}</option>
                  <option value="Aruppukkottai">{lang === 'ta' ? 'அருப்புக்கோட்டை' : 'Aruppukkottai'}</option>
                  <option value="Sattur">{lang === 'ta' ? 'சாத்தூர்' : 'Sattur'}</option>
                </select>
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
            <h3 className="text-lg font-bold text-[#152612]">
              {lang === 'ta' ? 'அரசு போர்ட்டலுக்கு புகார் அனுப்பப்படுகிறது...' : 'Submitting Grievance to Government Portal...'}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === 'ta' ? 'தனித்துவமான புகார் ஐடி உருவாக்கப்பட்டு தரவுத்தளத்தில் சேமிக்கப்படுகிறது' : 'Generating Unique Complaint ID & Dispatched to Database'}
            </p>
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
                {lang === 'ta' ? 'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது' : 'Grievance Registered Successfully'}
              </span>
              <h3 className="text-2xl font-black text-[#152612] mt-2 font-mono">
                ID: {submittedComplaint.complaintId}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'ta' ? 'புகார் நிலையைக் கண்காணிக்க இந்த ஐடி அல்லது கைபேசி எண்ணைப் பயன்படுத்தவும்.' : 'Keep this ID or Mobile Number to track grievance status.'}
              </p>
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2 my-2">
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'ta' ? 'பிரிவு:' : 'Category:'}</span>
                <span className="font-bold text-[#152612]">
                  {lang === 'ta' ? (TA_CAT_MAP[submittedComplaint.category] || submittedComplaint.category) : submittedComplaint.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'ta' ? 'துறை:' : 'Department:'}</span>
                <span className="font-bold text-gray-800">
                  {lang === 'ta' ? (TA_DEPT_MAP[submittedComplaint.department] || submittedComplaint.department) : submittedComplaint.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{lang === 'ta' ? 'பகுதி:' : 'Location:'}</span>
                <span className="font-bold text-orange-600">{submittedComplaint.location}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn bg-[#36682f] text-white hover:bg-[#1e381b] w-full py-3 text-sm font-bold shadow-md"
            >
              {lang === 'ta' ? 'முடிந்தது & நிலையைக் காண்க' : 'Done & View Tracking Timeline'}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
