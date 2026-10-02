/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Say It Out Loud — His Voice in the Birth Room
 * A quiet, self-contained speaking-practice instrument for birth partners
 * learning the language patterns of Mark Harris, male midwife.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Download, 
  Upload, 
  Trash2, 
  FileDown, 
  BookOpen, 
  Check, 
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react';

interface Exercise {
  id: number;
  title: string;
  situation: string;
  herLine: string;
  attend: string;
  workedExample: string;
  isHonestLimit?: boolean;
  honestLimitText?: string;
  reflectChecks: string[];
}

interface ExerciseState {
  done: boolean;
  notes: string;
  spokenText: string;
  checks: Record<number, boolean>;
  audioUrl?: string;
}

interface AppState {
  currentIndex: number;
  dictationEnabled: boolean;
  exercises: Record<number, ExerciseState>;
}

const CONTENT: Exercise[] = [
  {
    id: 1,
    title: "Three then one",
    situation: "It is 1am. She is walking and breathing well. She asks: \"Is this actually working?\"",
    herLine: "Is this actually working?",
    attend: "Three true things she can check right now with her senses, then one gentle suggestion. Never suggest before you have said what is true.",
    workedExample: "You can feel the cushion underneath you… hear my voice… notice my hand on your back — and your shoulders can soften.",
    isHonestLimit: false,
    reflectChecks: [
      "Did I say three things she could verify with her own senses before suggesting anything?",
      "Did my suggestion come last?",
      "Did my voice fall at the end rather than asking a question?"
    ]
  },
  {
    id: 2,
    title: "The lexical shift",
    situation: "A midwife has just told her she is 6cm and \"not progressing\". She says: \"So nothing's happening.\"",
    herLine: "So nothing's happening.",
    attend: "Swap the cold clinical words for the truer ones: replace 'failure to progress' with 'taking its time', 'contraction' with 'surge', and 'just relax' with 'let it come'.",
    workedExample: "This is taking its time, and taking its time is the work. Let the surge come, and as it passes, soften into the pillows.",
    isHonestLimit: false,
    reflectChecks: [
      "Which cold words did I take from her, and what truer words did I offer instead?",
      "Did I validate where she is without adopting the clinical label?",
      "Did my tone remain steady and unhurried?"
    ]
  },
  {
    id: 3,
    title: "Permissive, not commanding",
    situation: "She has been told to relax. Her shoulders are up in her jaw. She says: \"I am trying to relax.\"",
    herLine: "I am trying to relax.",
    attend: "An order invites resistance. Use permissive language: 'you can', 'you might notice', 'allow'. Avoid 'you must' or 'calm down'.",
    workedExample: "You might notice where you are holding it… and allow your jaw to be a little heavy.",
    isHonestLimit: false,
    reflectChecks: [
      "Did I tell her what to do, or offer something she might notice and allow?",
      "Did I avoid words like 'must', 'try', or 'calm down'?",
      "Did I leave space between phrases for her to respond in her body?"
    ]
  },
  {
    id: 4,
    title: "The gentle choice",
    situation: "She cannot decide how to position. She says: \"I don't know what to do.\"",
    herLine: "I don't know what to do.",
    attend: "Offer a gentle choice where either answer helps. She chooses, and either option moves her in the same supportive direction.",
    workedExample: "Would you rather lean forward on the ball, or lie on your left side?",
    isHonestLimit: false,
    reflectChecks: [
      "Did I give her a genuine choice, or a disguised instruction?",
      "Does either choice support her movement and rest?",
      "Was my tone calm and unpressured?"
    ]
  },
  {
    id: 5,
    title: "The crisis sequence",
    situation: "She is at transition or the hardest part. She says: \"I can't do this any more.\"",
    herLine: "I can't do this any more.",
    attend: "The five steps, in order: 1. Get into her line of sight, hold her face or hands. 2. Match her. 3. Turn it. 4. Drop your voice and lead. 5. Hand her back to herself.",
    workedExample: "I can see how powerful this is… and that power is your body opening. As it fades, let your hands soften. You are so powerful. Yield to it.",
    isHonestLimit: false,
    reflectChecks: [
      "Did I get into her line of sight first and establish contact?",
      "Did I match her intensity before attempting to turn it?",
      "Did my voice drop low on the lead?",
      "Did I hand her back to her own power?"
    ]
  },
  {
    id: 6,
    title: "Tone and touch — the honest one",
    situation: "No situation. Instead: read the two sentences below aloud to yourself, once slowly and once falling at the end.",
    herLine: "\"Rise up, it is working.\" / \"You are doing beautifully.\"",
    attend: "Low, slow, falling pitch at the end. Certainty steadies her. Touch starts a beat before you speak.",
    workedExample: "Rise up, it is working. (pause, steady touch) You are doing beautifully.",
    isHonestLimit: true,
    honestLimitText: "Tone and touch cannot be practised in a browser — they need a person, a room, and a body. This is not a flaw in the app. It is the honest limit, and saying so is part of the design.",
    reflectChecks: [
      "Did my pitch fall at the end of each phrase rather than rise like a question?",
      "Did I feel the difference between speaking from anxiety versus speaking from presence?",
      "Did I pause long enough for touch to lead the words?"
    ]
  },
  {
    id: 7,
    title: "The breath reset",
    situation: "She has started hyperventilating as a surge peaks. Her grip on your wrist is white-knuckle. She gasps: \"I can't catch my breath.\"",
    herLine: "I can't catch my breath.",
    attend: "Steady touch starts a beat before words; then say three true things she can verify with her senses right now, followed by one gentle suggestion. Do not give commands like 'calm down' or 'breathe deep'.",
    workedExample: "[Place your palm broad and warm on the center of her back, pause a beat] You have my hand right here… the floor is solid under your feet… we have this breath together — and as you breathe out, your mouth can soften.",
    isHonestLimit: false,
    reflectChecks: [
      "Did my steady touch land and settle before I spoke a single word?",
      "Did I state three real, verifiable sensory facts before offering any suggestion?",
      "Did my suggestion invite a softening rather than command her breathing?"
    ]
  },
  {
    id: 8,
    title: "The environment shift",
    situation: "The room has become noisy with hospital staff changing shifts and bright overhead lighting. She closes her eyes tightly and whispers: \"There are too many people in here.\"",
    herLine: "There are too many people in here.",
    attend: "Offer a gentle choice where either option creates a calmer shelter. Protect her environment without creating panic or debate.",
    workedExample: "I hear you. Would you like me to draw the curtains and dim the lamps, or would you rather we step into the bathroom together with the lights down low?",
    isHonestLimit: false,
    reflectChecks: [
      "Did I validate her instinct immediately without debating or explaining the staff's presence?",
      "Did both options offer an immediate, real reduction in sensory overwhelm?",
      "Was my voice quiet, decisive, and protective?"
    ]
  },
  {
    id: 9,
    title: "The shift during stalled fatigue",
    situation: "It has been four hours without change in dilation. She slumps against the bed rail, exhausted and demoralised, and says: \"My body is failing at this.\"",
    herLine: "My body is failing at this.",
    attend: "The lexical shift: swap the clinical and judgmental label 'failing' for the physiological reality of gathering strength. Pair with permissive invitation to rest.",
    workedExample: "Your body is not failing; it is taking its time to gather power for what comes next. You can close your eyes between these surges, and allow your body to do the waiting.",
    isHonestLimit: false,
    reflectChecks: [
      "Did I immediately reject the word 'failing' and substitute a truer, restorative perspective?",
      "Did I use permissive phrasing ('you can close your eyes', 'allow') rather than an order to 'stay positive'?",
      "Did my pitch fall at the end of the sentence to radiate certainty?"
    ]
  },
  {
    id: 10,
    title: "The unexpected intervention",
    situation: "A clinician has just recommended an unplanned intervention. She looks at you with wide, frightened eyes, feeling rushed, and asks: \"What should we do?\"",
    herLine: "What should we do?",
    attend: "Low, slow, falling tone. Remind her of the space and time available. State what is true first before deciding.",
    workedExample: "We have time right now… we are safe in this room… your breathing is steady — and we can take two quiet minutes together before we give any answer.",
    isHonestLimit: false,
    reflectChecks: [
      "Did my voice fall in pitch to ground the room rather than rising with anxiety?",
      "Did I say three true things to steady her nervous system before addressing the decision?",
      "Did I buy her quiet time to pause and reconnect?"
    ]
  },
  {
    id: 11,
    title: "The transition tremor",
    situation: "Transition has arrived. Her legs are trembling violently and her teeth are chattering between surges. She grips her knees in distress: \"Why am I shaking so much? Make it stop.\"",
    herLine: "Why am I shaking so much? Make it stop.",
    attend: "Normalize the tremor as adrenaline release; use permissive words to allow the tremor rather than fight it. Touch firmly on her thighs.",
    workedExample: "[Rest both hands warm and firm on her thighs, pausing a beat] This shaking is your body clearing adrenaline so your baby can descend. It is completely normal. You don't have to fight it; you can just allow your legs to shake until it passes.",
    isHonestLimit: false,
    reflectChecks: [
      "Did I explain the tremor as productive and normal rather than something to fear?",
      "Did I offer permission to release ('allow your legs to shake') rather than telling her to stop shaking?",
      "Did my touch provide firm physical reassurance without holding her down?"
    ]
  }
];

const STORAGE_KEY = "say_it_out_loud_progress_v2";
const THEME_KEY = "say_it_out_loud_theme_v1";

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark'; // Dark theme default as requested
  });

  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      currentIndex: 0,
      dictationEnabled: false,
      exercises: {}
    };
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [micError, setMicError] = useState<string | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch {
      // ignore
    }
  }, [appState]);

  // Sync theme
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Check speech recognition capability
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechClass) {
      setHasSpeechSupport(true);
    }
  }, []);

  // Update playback speed when rate changes
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, audioUrl]);

  const currentExercise: Exercise | undefined = CONTENT[appState.currentIndex] || CONTENT[0];
  const currentExState: ExerciseState = (currentExercise && appState.exercises[currentExercise.id]) || {
    done: false,
    notes: "",
    spokenText: "",
    checks: {}
  };

  const handleSelectExercise = (idx: number) => {
    stopActiveRecording();
    setAudioUrl(null);
    setPlaybackSpeed(1.0);
    setAppState(prev => ({ ...prev, currentIndex: idx }));
  };

  const stopActiveRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  };

  const handleStartRecording = async () => {
    if (isRecording) {
      stopActiveRecording();
      return;
    }

    setMicError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError("Microphone access is unavailable in this environment (such as when opened directly from a file). You can practice out loud and use the text box below.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);

      // Path C: Optional dictation (off by default)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (appState.dictationEnabled && SpeechClass) {
        try {
          const rec = new SpeechClass();
          speechRecognitionRef.current = rec;
          rec.continuous = true;
          rec.interimResults = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rec.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript + ' ';
            }
            if (transcript.trim()) {
              updateSpokenText(transcript.trim());
            }
          };
          rec.onerror = () => {};
          rec.start();
        } catch {
          // Fail silently
        }
      }
    } catch {
      setMicError("Microphone access was denied or is restricted in this window. To record audio, serve over https:// or localhost (see Tips for Non-Mic Users). You can practice speaking out loud and write your words below.");
      setIsRecording(false);
    }
  };

  const updateSpokenText = (text: string) => {
    if (!currentExercise) return;
    setAppState(prev => {
      const ex = prev.exercises[currentExercise.id] || { done: false, notes: '', spokenText: '', checks: {} };
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [currentExercise.id]: {
            ...ex,
            spokenText: text
          }
        }
      };
    });
  };

  const updateNotes = (text: string) => {
    if (!currentExercise) return;
    setAppState(prev => {
      const ex = prev.exercises[currentExercise.id] || { done: false, notes: '', spokenText: '', checks: {} };
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [currentExercise.id]: {
            ...ex,
            notes: text
          }
        }
      };
    });
  };

  const toggleCheck = (idx: number) => {
    if (!currentExercise) return;
    setAppState(prev => {
      const ex = prev.exercises[currentExercise.id] || { done: false, notes: '', spokenText: '', checks: {} };
      const nextChecks = { ...ex.checks, [idx]: !ex.checks[idx] };
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [currentExercise.id]: {
            ...ex,
            checks: nextChecks
          }
        }
      };
    });
  };

  const toggleDone = () => {
    if (!currentExercise) return;
    setAppState(prev => {
      const ex = prev.exercises[currentExercise.id] || { done: false, notes: '', spokenText: '', checks: {} };
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [currentExercise.id]: {
            ...ex,
            done: !ex.done
          }
        }
      };
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Export & Import
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      appName: "Say It Out Loud",
      progress: appState
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `say-it-out-loud-progress-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotice("Progress exported as plain text.");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.progress) {
          setAppState(parsed.progress);
        } else if (parsed.exercises) {
          setAppState(parsed);
        } else {
          alert("Unrecognised file format. Please upload a valid progress export file.");
          return;
        }
        showNotice("Progress restored successfully.");
      } catch {
        alert("Failed to parse the file. Please ensure it is a valid plain text export.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your local practice notes and checklist?")) {
      localStorage.removeItem(STORAGE_KEY);
      setAppState({
        currentIndex: 0,
        dictationEnabled: false,
        exercises: {}
      });
      setAudioUrl(null);
      showNotice("Progress cleared.");
    }
  };

  const showNotice = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleDownloadStandaloneHtml = () => {
    const a = document.createElement('a');
    a.href = '/say-it-out-loud.html';
    a.download = 'say-it-out-loud.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotice("Standalone HTML downloaded.");
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`min-h-screen font-serif transition-colors duration-200 ${
        isDark ? 'bg-[#13110f] text-[#f5ece2]' : 'bg-[#fbf8f3] text-[#1c1917]'
      } py-4 sm:py-8 px-3 sm:px-6`}
    >
      <div className="max-w-[820px] mx-auto">
        {/* Header */}
        <header className={`border-b-2 ${isDark ? 'border-[#bd4863]' : 'border-[#4a1525]'} pb-4 sm:pb-6 mb-5 sm:mb-8`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <span className={`font-sans text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-[#deb054]' : 'text-[#8c6710]'}`}>
              Speaking-Practice Instrument
            </span>

            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`font-sans text-xs inline-flex items-center gap-1.5 px-3 py-2 border transition-colors cursor-pointer min-h-[40px] touch-manipulation ${
                  isDark
                    ? 'bg-[#1c1715] text-[#f5ece2] border-[#3b322a] hover:bg-[#241e1a]'
                    : 'bg-white text-[#1c1917] border-[#dcd3c4] hover:bg-[#f4ede1]'
                }`}
                title={`Switch to ${isDark ? 'Warm Paper' : 'Dim Room'} theme`}
              >
                {isDark ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#deb054]" />
                    <span>Dim Room</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#8c6710]" />
                    <span>Warm Paper</span>
                  </>
                )}
              </button>

              {/* Download standalone HTML */}
              <button
                type="button"
                onClick={handleDownloadStandaloneHtml}
                className={`font-sans text-xs inline-flex items-center gap-1.5 px-3 py-2 text-white transition-colors border cursor-pointer min-h-[40px] touch-manipulation ${
                  isDark
                    ? 'bg-[#bd4863] hover:bg-[#973248] border-[#bd4863]'
                    : 'bg-[#4a1525] hover:bg-[#320d19] border-[#4a1525]'
                }`}
                title="Download self-contained single file (runs with zero internet)"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Offline HTML</span>
                <span className="xs:hidden">Save</span>
              </button>
            </div>
          </div>
          
          <h1 className={`text-2xl sm:text-4xl font-normal leading-tight tracking-tight mb-1 sm:mb-2 ${
            isDark ? 'text-[#f5ece2]' : 'text-[#4a1525]'
          }`}>
            Say It Out Loud
          </h1>
          <p className={`text-sm sm:text-lg italic ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>
            For birth partners learning the language patterns from <em>His Voice in the Birth Room</em> by Mark Harris, male midwife.
          </p>
        </header>

        {copiedNotification && (
          <div className={`mb-5 p-3 text-xs sm:text-sm font-sans flex items-center gap-2 border ${
            isDark ? 'bg-[#271e11] border-[#59441f] text-[#f0cb7e]' : 'bg-[#fdf5ea] border-[#e2cfa2] text-[#63470d]'
          }`}>
            <Check className="w-4 h-4 text-[#deb054] shrink-0" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Collapsible reference panels */}
        <section className="mb-6 sm:mb-8 space-y-3 font-serif">
          {/* Background */}
          <details className={`border p-4 transition-all ${
            isDark ? 'bg-[#1c1715] border-[#3b322a]' : 'bg-white border-[#dcd3c4]'
          }`}>
            <summary className={`font-sans text-sm font-semibold cursor-pointer flex items-center justify-between list-none select-none min-h-[36px] ${
              isDark ? 'text-[#deb054]' : 'text-[#4a1525]'
            }`}>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />
                Why this works — briefly and honestly
              </span>
              <span className={`text-xs ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>[Read once]</span>
            </summary>
            <div className={`pt-3 mt-3 border-t text-sm leading-relaxed space-y-2 ${
              isDark ? 'border-[#3b322a] text-[#f5ece2]' : 'border-[#dcd3c4] text-[#1c1917]'
            }`}>
              <p>
                During labour, a woman's analytical thinking quiets and her more instinctive brain takes over. That brain reads the room for signs of safety.
              </p>
              <p>
                A partner's unmanaged anxiety raises adrenaline and cortisol, which narrows blood vessels and can slow things down. Steady presence and a steady voice are not decoration. They are a biological intervention.
              </p>
              <p className={`italic ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>
                Read this once as context. You do not need to memorise it or overstate it. The work is simply learning to speak steadily when it matters.
              </p>
            </div>
          </details>

          {/* The 7 Patterns */}
          <details className={`border p-4 transition-all ${
            isDark ? 'bg-[#1c1715] border-[#3b322a]' : 'bg-white border-[#dcd3c4]'
          }`}>
            <summary className={`font-sans text-sm font-semibold cursor-pointer flex items-center justify-between list-none select-none min-h-[36px] ${
              isDark ? 'text-[#deb054]' : 'text-[#4a1525]'
            }`}>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />
                The seven language patterns (Mark Harris)
              </span>
              <span className={`text-xs ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>[Reference guide]</span>
            </summary>
            <div className={`pt-3 mt-3 border-t text-sm leading-relaxed divide-y space-y-3 ${
              isDark ? 'border-[#3b322a] text-[#f5ece2] divide-[#3b322a]' : 'border-[#dcd3c4] text-[#1c1917] divide-[#ebd9b0]'
            }`}>
              <div className="pt-2">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>1. Say what's true first, then suggest — three, then one</strong>
                <p>Say three things she can check with her own senses, real and right now, and then one gentle suggestion.</p>
                <p className={`italic my-1 ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>"You can feel the cushion underneath you… hear my voice… notice my hand on your back — and your shoulders can soften."</p>
                <p className={`font-medium ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>Never suggest before you have said what is true.</p>
                <details className={`mt-1 text-xs pl-3 border-l-2 ${isDark ? 'border-[#3b322a] text-[#aba092]' : 'border-[#dcd3c4] text-[#57534e]'}`}>
                  <summary className="cursor-pointer italic">Technical name (collapsed)</summary>
                  <p className="mt-1">Pacing and leading. Establishing verifiable sensory facts grounds her brain before introducing a calm suggestion.</p>
                </details>
              </div>

              <div className="pt-3">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>2. Permissive, not commanding</strong>
                <p>Use "you can", "you might notice", "allow".</p>
                <p className={`font-medium ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>Never "you must", "relax", "calm down" — an order invites resistance.</p>
                <details className={`mt-1 text-xs pl-3 border-l-2 ${isDark ? 'border-[#3b322a] text-[#aba092]' : 'border-[#dcd3c4] text-[#57534e]'}`}>
                  <summary className="cursor-pointer italic">Technical name (collapsed)</summary>
                  <p className="mt-1">Permissive / Ericksonian phrasing. Removes the pressure of compliance and fosters bodily release.</p>
                </details>
              </div>

              <div className="pt-3">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>3. Tone over words</strong>
                <p>Low, slow, falling at the end. A rising tone asks a question; a falling tone sounds certain, and certainty is what steadies her.</p>
              </div>

              <div className="pt-3">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>4. The lexical shift — swap the cold word for the truer one</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-xs font-sans">
                  <div>contraction → <strong>surge / tightening</strong></div>
                  <div>pain → <strong>power / pressure</strong></div>
                  <div>failure to progress → <strong>taking its time</strong></div>
                  <div>just relax → <strong>let it come</strong></div>
                </div>
              </div>

              <div className="pt-3">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>5. Touch before words — a beat ahead</strong>
                <p>Steady touch starts a beat before you speak, and stays until the sentence ends.</p>
                <details className={`mt-1 text-xs pl-3 border-l-2 ${isDark ? 'border-[#3b322a] text-[#aba092]' : 'border-[#dcd3c4] text-[#57534e]'}`}>
                  <summary className="cursor-pointer italic">Technical name (collapsed)</summary>
                  <p className="mt-1">Somatosensory anchoring. Physical presence lands before language is cognitively processed.</p>
                </details>
              </div>

              <div className="pt-3">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>6. Offer a gentle choice — either way, it helps</strong>
                <p className="italic my-1">"Would you rather lean forward on the ball, or lie on your left side?"</p>
                <p>She chooses. Either answer moves her the same way.</p>
              </div>

              <div className="pt-3">
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>7. The crisis sequence — when she says "I can't do this any more"</strong>
                <ol className="list-decimal pl-5 space-y-1 text-sm mt-1">
                  <li>Get into her line of sight. Hold her face or hands.</li>
                  <li>Match her — <em>"I can see how powerful this is."</em></li>
                  <li>Turn it — <em>"and that power is your body opening."</em></li>
                  <li>Drop your voice and lead — <em>"as it fades, let your hands soften."</em></li>
                  <li>Hand her back to herself — <em>"You are so powerful. Yield to it."</em></li>
                </ol>
              </div>
            </div>
          </details>

          {/* Tips for Non-Mic Users */}
          <details className={`border p-4 transition-all ${
            isDark ? 'bg-[#1c1715] border-[#3b322a]' : 'bg-white border-[#dcd3c4]'
          }`}>
            <summary className={`font-sans text-sm font-semibold cursor-pointer flex items-center justify-between list-none select-none min-h-[36px] ${
              isDark ? 'text-[#deb054]' : 'text-[#4a1525]'
            }`}>
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />
                Tips for Non-Mic Users — Running offline &amp; text practice
              </span>
              <span className={`text-xs ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>[Setup &amp; Advice]</span>
            </summary>
            <div className={`pt-3 mt-3 border-t text-sm leading-relaxed space-y-3 ${
              isDark ? 'border-[#3b322a] text-[#f5ece2]' : 'border-[#dcd3c4] text-[#1c1917]'
            }`}>
              <div>
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>
                  1. The app is 100% complete in text-only mode
                </strong>
                <p>
                  You do not need a working microphone to master these patterns. The core of this practice is speaking out loud in the physical room with your own voice. The browser recording is merely an optional mirror. Simply speak your line aloud, write what you said into the response field, compare it against the worked example, and complete the self-check. A text session is a complete, uncompromised session.
                </p>
              </div>

              <div className={`pt-2 border-t ${isDark ? 'border-[#3b322a]' : 'border-[#ebd9b0]'}`}>
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>
                  2. Why microphone access is restricted in local files
                </strong>
                <p>
                  Modern web browsers (such as Chrome, Edge, and Safari) enforce strict security boundaries. When an HTML file is opened directly by double-clicking it on your computer (via the <code>file://</code> protocol), the browser classifies it as an untrusted origin and intentionally blocks microphone capture.
                </p>
              </div>

              <div className={`pt-2 border-t ${isDark ? 'border-[#3b322a]' : 'border-[#ebd9b0]'}`}>
                <strong className={`block mb-1 ${isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}`}>
                  3. Simple step-by-step instructions to enable microphone locally
                </strong>
                <p className="mb-2">
                  If you wish to enable audio recording on your computer without an internet connection, you can serve the file using a zero-setup local web server. Browsers treat <code>localhost</code> as a secure context:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs font-sans">
                  <li>
                    <strong>Open your terminal:</strong> Launch Terminal (macOS / Linux) or Command Prompt / PowerShell (Windows).
                  </li>
                  <li>
                    <strong>Navigate to the folder:</strong> Change directory to where <code>say-it-out-loud.html</code> is saved. For example:<br />
                    <code className={`px-1.5 py-0.5 rounded font-mono mt-0.5 inline-block ${
                      isDark ? 'bg-[#241e1a] text-[#deb054]' : 'bg-[#f4ede1] text-[#4a1525]'
                    }`}>cd ~/Downloads</code>
                  </li>
                  <li>
                    <strong>Start the local server:</strong> Run Python's built-in server command:<br />
                    <code className={`px-1.5 py-0.5 rounded font-mono mt-0.5 inline-block ${
                      isDark ? 'bg-[#241e1a] text-[#deb054]' : 'bg-[#f4ede1] text-[#4a1525]'
                    }`}>python3 -m http.server 8000</code><br />
                    <span className={isDark ? 'text-[#aba092]' : 'text-[#57534e]'}>
                      (Or <code>python -m http.server 8000</code>, or <code>npx serve .</code> if Node is installed)
                    </span>
                  </li>
                  <li>
                    <strong>Open the app in your browser:</strong> Visit:<br />
                    <code className={`px-1.5 py-0.5 rounded font-mono mt-0.5 inline-block ${
                      isDark ? 'bg-[#241e1a] text-[#deb054]' : 'bg-[#f4ede1] text-[#4a1525]'
                    }`}>http://localhost:8000/say-it-out-loud.html</code>
                  </li>
                </ol>
                <p className={`mt-2 text-xs ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>
                  Microphone recording and slow playback will now operate with full browser permissions, completely offline.
                </p>
              </div>
            </div>
          </details>
        </section>

        {/* Exercise navigation tabs */}
        <nav aria-label="Exercises" className="mb-5 sm:mb-6">
          <span className={`block font-sans text-xs uppercase tracking-wider mb-2 font-medium ${
            isDark ? 'text-[#aba092]' : 'text-[#57534e]'
          }`}>
            Exercises (All 11 patterns)
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CONTENT.map((ex, index) => {
              const isSelected = index === appState.currentIndex;
              const isDone = appState.exercises[ex.id]?.done;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(index)}
                  className={`font-sans text-xs sm:text-sm px-3.5 py-2.5 border text-left transition-colors flex items-center gap-2 cursor-pointer min-h-[44px] touch-manipulation ${
                    isSelected
                      ? isDark
                        ? 'bg-[#bd4863] text-white border-[#bd4863] font-semibold'
                        : 'bg-[#4a1525] text-white border-[#4a1525] font-semibold'
                      : isDark
                        ? 'bg-[#1c1715] text-[#f5ece2] border-[#3b322a] hover:bg-[#241e1a]'
                        : 'bg-white text-[#1c1917] border-[#dcd3c4] hover:bg-[#f4ede1]'
                  }`}
                  aria-current={isSelected ? 'step' : undefined}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full border shrink-0 ${
                      isDone
                        ? isSelected
                          ? 'bg-white border-white'
                          : isDark
                            ? 'bg-[#deb054] border-[#deb054]'
                            : 'bg-[#8c6710] border-[#8c6710]'
                        : 'border-current'
                    }`}
                  />
                  <span>
                    {index + 1}. {ex.title}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Exercise Folio */}
        <main 
          className={`border p-4 sm:p-8 mb-6 sm:mb-8 transition-colors ${
            isDark ? 'bg-[#1c1715] border-[#3b322a]' : 'bg-white border-[#dcd3c4]'
          }`} 
          tabIndex={-1}
        >
          {!currentExercise ? (
            <div className={`py-12 text-center ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>
              <p>No practice exercises available at this time.</p>
            </div>
          ) : (
            <>
              {/* Exercise Header */}
              <div className={`border-b pb-4 mb-5 sm:mb-6 ${isDark ? 'border-[#3b322a]' : 'border-[#dcd3c4]'}`}>
                <span className={`font-sans text-xs uppercase tracking-widest font-semibold block mb-1 ${
                  isDark ? 'text-[#deb054]' : 'text-[#8c6710]'
                }`}>
                  Exercise {appState.currentIndex + 1} of {CONTENT.length}
                </span>
                <h2 className={`text-xl sm:text-3xl font-normal leading-snug ${
                  isDark ? 'text-[#f5ece2]' : 'text-[#4a1525]'
                }`}>
                  {currentExercise.title}
                </h2>
              </div>

              {/* The Situation & Her Line */}
              <div className="mb-6">
                <span className={`block font-sans text-xs uppercase tracking-wider font-semibold mb-1 ${
                  isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                }`}>
                  The Situation
                </span>
                <p className={`italic text-sm sm:text-lg mb-4 leading-relaxed ${
                  isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                }`}>
                  {currentExercise.situation}
                </p>

                <div className={`border-l-4 p-4 sm:p-5 mb-5 ${
                  isDark 
                    ? 'bg-[#13110f] border-l-[#bd4863] text-[#f5ece2]' 
                    : 'bg-[#fbf8f3] border-l-[#4a1525] text-[#1c1917]'
                }`}>
                  <span className={`block font-sans text-xs uppercase tracking-wider font-semibold mb-1 ${
                    isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                  }`}>
                    She says
                  </span>
                  <div className="text-lg sm:text-2xl font-medium leading-snug">
                    {currentExercise.herLine}
                  </div>
                </div>

                <div className={`border p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isDark 
                    ? 'bg-[#261f12] border-[#4e3c1f] text-[#f5ece2]' 
                    : 'bg-[#fcf6e8] border-[#ebd9b0] text-[#1c1917]'
                }`}>
                  <strong className={isDark ? 'text-[#deb054]' : 'text-[#4a1525]'}>
                    What to attend to:
                  </strong>{' '}
                  {currentExercise.attend}
                </div>
              </div>

              {/* Honest Limit note for Exercise 6 */}
              {currentExercise.isHonestLimit && (
                <div className={`border border-l-4 p-4 mb-6 text-xs sm:text-sm leading-relaxed ${
                  isDark
                    ? 'bg-[#261f12] border-[#4e3c1f] border-l-[#deb054] text-[#f5ece2]'
                    : 'bg-[#fbf5e6] border-[#decf9a] border-l-[#8c6710] text-[#4f3d0a]'
                }`}>
                  <strong>Honest limit:</strong> {currentExercise.honestLimitText}
                </div>
              )}

              {/* Practice Section: Speaking & Recording */}
              <section className={`border p-4 sm:p-6 mb-6 ${
                isDark ? 'bg-[#241e1a] border-[#3b322a]' : 'bg-[#f4ede1] border-[#dcd3c4]'
              }`}>
                <h3 className={`font-sans text-sm sm:text-base font-semibold mb-3 ${
                  isDark ? 'text-[#f5ece2]' : 'text-[#4a1525]'
                }`}>
                  Speak your response out loud
                </h3>

                {micError && (
                  <div className={`border p-3 mb-4 text-xs flex items-start gap-2 ${
                    isDark ? 'bg-[#271e11] border-[#59441f] text-[#f0cb7e]' : 'bg-[#fdf5ea] border-[#e2cfa2] text-[#63470d]'
                  }`}>
                    <AlertCircle className="w-4 h-4 text-[#deb054] shrink-0 mt-0.5" />
                    <div>
                      <strong>Microphone note:</strong> {micError}
                    </div>
                  </div>
                )}

                {/* Record / Stop Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className={`font-sans text-sm sm:text-base px-5 py-3 w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 cursor-pointer transition-colors text-white touch-manipulation ${
                      isRecording
                        ? 'bg-red-700 hover:bg-red-800 animate-pulse'
                        : isDark
                          ? 'bg-[#bd4863] hover:bg-[#973248]'
                          : 'bg-[#4a1525] hover:bg-[#320d19]'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Record Voice</span>
                      </>
                    )}
                  </button>

                  {isRecording && (
                    <span className="font-sans font-mono text-sm text-red-500 font-semibold text-center sm:text-left">
                      Recording: {formatTimer(recordDuration)}
                    </span>
                  )}
                </div>

                {/* Playback & Speed Controls */}
                {audioUrl && (
                  <div className={`border p-3 sm:p-4 mb-4 ${
                    isDark ? 'bg-[#1c1715] border-[#3b322a]' : 'bg-white border-[#dcd3c4]'
                  }`}>
                    <span className={`block font-sans text-xs uppercase tracking-wider font-semibold mb-2 ${
                      isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                    }`}>
                      Listen back to yourself
                    </span>
                    <audio
                      ref={audioElementRef}
                      controls
                      src={audioUrl}
                      className="w-full mb-3"
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`font-sans text-xs uppercase tracking-wider font-semibold ${
                        isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                      }`}>
                        Playback speed:
                      </span>
                      <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2">
                        {[
                          { rate: 1.0, label: '1.0x Normal' },
                          { rate: 0.75, label: '0.75x Slow' },
                          { rate: 0.5, label: '0.5x Slower' },
                        ].map((speed) => (
                          <button
                            key={speed.rate}
                            type="button"
                            onClick={() => setPlaybackSpeed(speed.rate)}
                            className={`font-sans text-xs px-3 py-2 border transition-colors cursor-pointer min-h-[44px] flex items-center justify-center touch-manipulation ${
                              playbackSpeed === speed.rate
                                ? isDark
                                  ? 'bg-[#bd4863] text-white border-[#bd4863] font-semibold'
                                  : 'bg-[#4a1525] text-white border-[#4a1525] font-semibold'
                                : isDark
                                  ? 'bg-[#241e1a] text-[#f5ece2] border-[#3b322a] hover:bg-[#1c1715]'
                                  : 'bg-[#fbf8f3] text-[#1c1917] border-[#dcd3c4] hover:bg-[#f4ede1]'
                            }`}
                          >
                            {speed.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className={`font-sans text-xs mt-2 ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>
                      Hearing yourself slowed down is where the learning happens. Notice pace, pauses, and pitch.
                    </p>
                  </div>
                )}

                {/* Optional live dictation toggle */}
                {hasSpeechSupport && (
                  <div className={`pt-2 border-t border-dashed mb-3 ${isDark ? 'border-[#3b322a]' : 'border-[#dcd3c4]'}`}>
                    <label className={`font-sans text-xs inline-flex items-center gap-2 cursor-pointer select-none min-h-[38px] ${
                      isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={appState.dictationEnabled}
                        onChange={(e) => setAppState(prev => ({ ...prev, dictationEnabled: e.target.checked }))}
                        className="accent-[#bd4863] w-4 h-4 cursor-pointer"
                      />
                      <span>Optional live dictation (transcribes spoken words; off by default for privacy)</span>
                    </label>
                  </div>
                )}

                {/* Fallback / Text capture */}
                <div>
                  <label htmlFor="practice-spoken-text" className={`block font-sans text-xs mb-1.5 ${
                    isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                  }`}>
                    What you spoke out loud (or type your response here if practicing quietly):
                  </label>
                  <textarea
                    id="practice-spoken-text"
                    rows={3}
                    value={currentExState.spokenText || ''}
                    onChange={(e) => updateSpokenText(e.target.value)}
                    placeholder="Speak your response out loud, then note down your actual words here..."
                    className={`w-full p-3 border font-serif text-sm sm:text-base leading-relaxed resize-y min-h-[90px] focus:outline-2 focus:outline-[#deb054] ${
                      isDark 
                        ? 'bg-[#1c1715] border-[#3b322a] text-[#f5ece2] placeholder-[#7d7468]' 
                        : 'bg-white border-[#dcd3c4] text-[#1c1917]'
                    }`}
                  />
                </div>
              </section>

              {/* Worked Example */}
              <section className={`border border-l-4 p-4 sm:p-6 mb-6 ${
                isDark 
                  ? 'bg-[#28121a] border-[#521f2d] border-l-[#bd4863]' 
                  : 'bg-[#f7eff2] border-[#dfc7cf] border-l-[#4a1525]'
              }`}>
                <span className={`block font-sans text-xs uppercase tracking-wider font-bold mb-1 ${
                  isDark ? 'text-[#deb054]' : 'text-[#4a1525]'
                }`}>
                  Worked Example to Hold in Front of You
                </span>
                <div className={`text-base sm:text-xl leading-relaxed ${isDark ? 'text-[#f5ece2]' : 'text-[#1c1917]'}`}>
                  "{currentExercise.workedExample}"
                </div>
              </section>

              {/* Self-Reflection & Checklist */}
              <section className={`border p-4 sm:p-6 mb-6 ${
                isDark ? 'border-[#3b322a] bg-[#1c1715]' : 'border-[#dcd3c4] bg-white'
              }`}>
                <h3 className={`font-sans text-base font-semibold mb-1 ${
                  isDark ? 'text-[#deb054]' : 'text-[#4a1525]'
                }`}>
                  Self-Reflection Check
                </h3>
                <p className={`text-xs mb-3.5 ${isDark ? 'text-[#aba092]' : 'text-[#57534e]'}`}>
                  No scores. Compare what you said beside the worked example and review these questions:
                </p>

                <ul className="space-y-3 mb-4">
                  {currentExercise.reflectChecks.map((checkText, idx) => {
                    const isChecked = !!currentExState.checks[idx];
                    return (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-snug min-h-[44px] cursor-pointer">
                        <input
                          type="checkbox"
                          id={`check-${currentExercise.id}-${idx}`}
                          checked={isChecked}
                          onChange={() => toggleCheck(idx)}
                          className="mt-1 w-5 h-5 min-w-[20px] accent-[#bd4863] cursor-pointer"
                        />
                        <label
                          htmlFor={`check-${currentExercise.id}-${idx}`}
                          className={`cursor-pointer ${isDark ? 'text-[#f5ece2]' : 'text-[#1c1917]'}`}
                        >
                          {checkText}
                        </label>
                      </li>
                    );
                  })}
                </ul>

                <label htmlFor="notes-textarea" className={`block font-sans text-xs mb-1.5 ${
                  isDark ? 'text-[#aba092]' : 'text-[#57534e]'
                }`}>
                  Your reflection notes (saved automatically):
                </label>
                <textarea
                  id="notes-textarea"
                  rows={2}
                  value={currentExState.notes || ''}
                  onChange={(e) => updateNotes(e.target.value)}
                  placeholder="What did you notice about your pace, touch, or words?"
                  className={`w-full p-2.5 border font-serif text-sm sm:text-base leading-relaxed resize-y min-h-[70px] focus:outline-2 focus:outline-[#deb054] ${
                    isDark 
                      ? 'bg-[#13110f] border-[#3b322a] text-[#f5ece2] placeholder-[#7d7468]' 
                      : 'bg-[#fbf8f3] border-[#dcd3c4] text-[#1c1917]'
                  }`}
                />
              </section>

              {/* Exercise Footer Navigation - Phone Stacked */}
              <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDark ? 'border-[#3b322a]' : 'border-[#dcd3c4]'
              }`}>
                <label className="font-sans text-sm inline-flex items-center gap-2 cursor-pointer select-none min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={currentExState.done}
                    onChange={toggleDone}
                    className="w-5 h-5 accent-[#bd4863] cursor-pointer"
                  />
                  <span>Mark this exercise as practiced</span>
                </label>

                <div className="grid grid-cols-2 sm:flex gap-2.5 font-sans text-sm w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={appState.currentIndex === 0}
                    onClick={() => handleSelectExercise(appState.currentIndex - 1)}
                    className={`min-h-[48px] px-4 py-2.5 border transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center font-medium touch-manipulation ${
                      isDark
                        ? 'border-[#3b322a] text-[#f5ece2] hover:bg-[#241e1a]'
                        : 'border-[#4a1525] text-[#4a1525] hover:bg-[#f7eff2]'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (appState.currentIndex < CONTENT.length - 1) {
                        handleSelectExercise(appState.currentIndex + 1);
                      } else {
                        showNotice("You've reached the final exercise. Return to any pattern whenever needed.");
                      }
                    }}
                    className={`min-h-[48px] px-4 py-2.5 text-white transition-colors cursor-pointer flex items-center justify-center font-medium touch-manipulation ${
                      isDark
                        ? 'bg-[#bd4863] hover:bg-[#973248]'
                        : 'bg-[#4a1525] hover:bg-[#320d19]'
                    }`}
                  >
                    {appState.currentIndex === CONTENT.length - 1 ? "Finish" : "Next →"}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer: Data Management & Offline Portability */}
        <footer className={`border-t pt-5 font-sans text-xs ${
          isDark ? 'border-[#3b322a] text-[#aba092]' : 'border-[#dcd3c4] text-[#57534e]'
        }`}>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 mb-4">
            <button
              type="button"
              onClick={handleExport}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border transition-colors cursor-pointer touch-manipulation ${
                isDark 
                  ? 'bg-[#1c1715] border-[#3b322a] text-[#f5ece2] hover:bg-[#241e1a]' 
                  : 'bg-white border-[#dcd3c4] text-[#1c1917] hover:bg-[#f4ede1]'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Progress (.txt)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border transition-colors cursor-pointer touch-manipulation ${
                isDark 
                  ? 'bg-[#1c1715] border-[#3b322a] text-[#f5ece2] hover:bg-[#241e1a]' 
                  : 'bg-white border-[#dcd3c4] text-[#1c1917] hover:bg-[#f4ede1]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Progress</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json"
              onChange={handleImportFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleReset}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border transition-colors cursor-pointer touch-manipulation ${
                isDark 
                  ? 'bg-[#1c1715] border-[#3b322a] text-[#f5ece2] hover:bg-[#241e1a]' 
                  : 'bg-white border-[#dcd3c4] text-[#1c1917] hover:bg-[#f4ede1]'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-white border transition-colors cursor-pointer touch-manipulation sm:ml-auto ${
                isDark
                  ? 'bg-[#bd4863] hover:bg-[#973248] border-[#bd4863]'
                  : 'bg-[#4a1525] hover:bg-[#320d19] border-[#4a1525]'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Get say-it-out-loud.html</span>
            </button>
          </div>

          <p className="leading-relaxed">
            <strong>Completely offline &amp; private:</strong> No accounts, no servers, no analytics, no external scripts. Your voice never leaves your device. Progress is saved in local browser storage.
          </p>
        </footer>
      </div>
    </div>
  );
}
