import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PASAPALABRA_QUESTIONS,
  QuestionItem,
  checkAnswerMatch
} from './questions.ts';
import { playSound, speakText } from './sound.ts';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Trophy,
  Languages,
  ArrowRight,
  Sparkles
} from 'lucide-react';

type LetterStatus = 'pending' | 'correct' | 'wrong' | 'passed';

export default function App() {
  // Game states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [statuses, setStatuses] = useState<Record<number, LetterStatus>>(() => {
    const init: Record<number, LetterStatus> = {};
    PASAPALABRA_QUESTIONS.forEach(q => {
      init[q.id] = 'pending';
    });
    return init;
  });

  const [currentInput, setCurrentInput] = useState<string>('');
  
  // Dedicated Separate Answer Reveal state
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Translation reveal state: per letter or global toggle
  const [revealedTranslations, setRevealedTranslations] = useState<Record<number, boolean>>({});
  const [alwaysShowArmenian, setAlwaysShowArmenian] = useState<boolean>(false);
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Feedback display after an answer
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong';
    messageEs: string;
    messageHy: string;
    correctAnswer: string;
    correctAnswerHy: string;
  } | null>(null);

  // Game over / round finished
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Input ref for auto-focus
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = PASAPALABRA_QUESTIONS[currentIndex];

  // Statistics calculation
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let pending = 0;

    PASAPALABRA_QUESTIONS.forEach(q => {
      const st = statuses[q.id];
      if (st === 'correct') correct++;
      else if (st === 'wrong') wrong++;
      else pending++;
    });

    return { correct, wrong, pending, total: PASAPALABRA_QUESTIONS.length };
  }, [statuses]);

  // Focus input when question changes
  useEffect(() => {
    setShowAnswer(false);
    if (!feedback && !showSummary) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, feedback, showSummary]);

  // Find next pending question in circular order
  const getNextPendingIndex = (fromIdx: number): number => {
    const total = PASAPALABRA_QUESTIONS.length;
    for (let i = 1; i <= total; i++) {
      const nextIdx = (fromIdx + i) % total;
      const q = PASAPALABRA_QUESTIONS[nextIdx];
      if (statuses[q.id] === 'pending' || statuses[q.id] === 'passed') {
        return nextIdx;
      }
    }
    return fromIdx;
  };

  // Submit Answer
  const handleAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;

    const isMatch = checkAnswerMatch(currentInput, currentQuestion);

    // Update status
    const newStatus: LetterStatus = isMatch ? 'correct' : 'wrong';
    setStatuses(prev => ({ ...prev, [currentQuestion.id]: newStatus }));

    if (isMatch) {
      playSound('correct', soundEnabled);
      setFeedback({
        type: 'correct',
        messageEs: '¡Correcto! Excelente respuesta.',
        messageHy: 'Ճիշտ է։ Հիանալի պատասխան։',
        correctAnswer: currentQuestion.answerEs,
        correctAnswerHy: currentQuestion.answerHy
      });
    } else {
      playSound('wrong', soundEnabled);
      // Continuous play: If wrong, still allow user to continue playing!
      setFeedback({
        type: 'wrong',
        messageEs: `Incorrecto. La respuesta correcta es "${currentQuestion.answerEs}".`,
        messageHy: `Սխալ է։ Ճիշտ պատասխանն է՝ «${currentQuestion.answerEs}» (${currentQuestion.answerHy})։`,
        correctAnswer: currentQuestion.answerEs,
        correctAnswerHy: currentQuestion.answerHy
      });
    }
  };

  // Advance after feedback dialog
  const handleContinueAfterFeedback = () => {
    setFeedback(null);
    setCurrentInput('');

    // Check if any pending remaining
    const remainingCount = PASAPALABRA_QUESTIONS.filter(
      q => q.id !== currentQuestion.id && (statuses[q.id] === 'pending' || statuses[q.id] === 'passed')
    ).length;

    if (remainingCount === 0) {
      setShowSummary(true);
      playSound('victory', soundEnabled);
    } else {
      const nextIdx = getNextPendingIndex(currentIndex);
      setCurrentIndex(nextIdx);
    }
  };

  // Pasapalabra (Pass) button
  const handlePasapalabra = () => {
    playSound('pass', soundEnabled);
    if (statuses[currentQuestion.id] === 'pending') {
      setStatuses(prev => ({ ...prev, [currentQuestion.id]: 'passed' }));
    }
    setCurrentInput('');
    setFeedback(null);

    const nextIdx = getNextPendingIndex(currentIndex);
    setCurrentIndex(nextIdx);
  };

  // Direct manual mark
  const handleManualMark = (status: LetterStatus) => {
    playSound(status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : 'click', soundEnabled);
    setStatuses(prev => ({ ...prev, [currentQuestion.id]: status }));
    setCurrentInput('');
    setFeedback(null);

    if (status === 'correct' || status === 'wrong') {
      const nextIdx = getNextPendingIndex(currentIndex);
      if (nextIdx !== currentIndex) {
        setCurrentIndex(nextIdx);
      }
    }
  };

  // Reset entire game
  const handleRestart = () => {
    playSound('click', soundEnabled);
    const init: Record<number, LetterStatus> = {};
    PASAPALABRA_QUESTIONS.forEach(q => {
      init[q.id] = 'pending';
    });
    setStatuses(init);
    setCurrentInput('');
    setCurrentIndex(0);
    setFeedback(null);
    setShowSummary(false);
    setRevealedTranslations({});
  };

  // Toggle translation for current card
  const toggleTranslation = (id: number) => {
    playSound('click', soundEnabled);
    setRevealedTranslations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Exact mathematical circle positioning for 27 letters:
  // Center is (300, 300), radius is 232.
  // Step angle is 2*PI / 27.
  // Symmetrically flanking the top: A is at +step/2 from top, Z is at -step/2 from top.
  const cx = 300;
  const cy = 300;
  const roscoRadius = 232;
  const totalCount = PASAPALABRA_QUESTIONS.length;
  const stepAngle = (2 * Math.PI) / totalCount;

  const letterCoordinates = useMemo(() => {
    return PASAPALABRA_QUESTIONS.map((q, idx) => {
      // Start from 12 o'clock (-PI/2), offset by half a step so A (index 0) and Z (index 26) are perfectly symmetric at top
      const angle = -Math.PI / 2 + (idx + 0.5) * stepAngle;
      const x = cx + roscoRadius * Math.cos(angle);
      const y = cy + roscoRadius * Math.sin(angle);
      return { q, idx, x, y };
    });
  }, [totalCount, stepAngle]);

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-900 relative pb-12">
      {/* Background studio ambient lighting effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-500 to-amber-400 flex items-center justify-center shadow-lg shadow-blue-500/20 font-black text-xl text-white tracking-wider">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                PASAPALABRA
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-medium">
                Բառախաղ
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              27 preguntas · Español &amp; Հայերեն
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Armenian hint toggle */}
          <button
            onClick={() => setAlwaysShowArmenian(!alwaysShowArmenian)}
            title={alwaysShowArmenian ? 'Թարգմանությունն ըստ սեղմման' : 'Միշտ ցույց տալ հայերենը'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              alwaysShowArmenian
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {alwaysShowArmenian ? 'Հայերենը միշտ բաց' : 'Հայերենը սեղմումով'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound('click', true);
            }}
            title={soundEnabled ? 'Ձայնը միացված է' : 'Ձայնն անջատված է'}
            className={`p-2 rounded-lg text-xs border transition-all ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar / Վերսկսել</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 pt-5 pb-8 flex-1 flex flex-col gap-6 w-full">
        {/* Score Board Cards */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>🏆 Puntuación — Միավորներ</span>
            </h2>
            <span className="text-xs font-medium text-slate-400 font-mono">
              Resultado: <strong className="text-emerald-400 text-sm">{stats.correct}</strong> / 27
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {/* Correctas */}
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center shadow-lg shadow-emerald-950/20">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 tabular-nums">
                {stats.correct}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-300 mt-0.5">
                Correctas
              </div>
              <div className="text-[11px] text-emerald-500/90 font-medium">Ճիշտ</div>
            </div>

            {/* Incorrectas */}
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center shadow-lg shadow-rose-950/20">
              <div className="text-2xl sm:text-4xl font-black text-rose-400 tabular-nums">
                {stats.wrong}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-rose-300 mt-0.5">
                Incorrectas
              </div>
              <div className="text-[11px] text-rose-500/90 font-medium">Սխալ</div>
            </div>

            {/* Pendientes */}
            <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center shadow-lg shadow-blue-950/20">
              <div className="text-2xl sm:text-4xl font-black text-blue-400 tabular-nums">
                {stats.pending}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-blue-300 mt-0.5">
                Pendientes
              </div>
              <div className="text-[11px] text-blue-500/90 font-medium">Մնացած</div>
            </div>
          </div>
        </section>

        {/* Central Game Arena: El Rosco wheel & Current Question Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left/Center Column: Iconic mathematically perfect circular SVG Rosco Wheel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[440px] sm:max-w-[500px] aspect-square flex items-center justify-center">
              
              <svg
                viewBox="0 0 600 600"
                className="w-full h-full select-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
              >
                <defs>
                  {/* Outer track gradient */}
                  <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
                  </linearGradient>

                  {/* Center hub radial gradient */}
                  <radialGradient id="centerHubGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="70%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#070d1e" />
                  </radialGradient>

                  {/* Letter Sphere Gradients */}
                  {/* Pending (electric blue) */}
                  <radialGradient id="blueSphere" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="40%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </radialGradient>

                  {/* Active (gold) */}
                  <radialGradient id="goldSphere" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="45%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </radialGradient>

                  {/* Correct (green) */}
                  <radialGradient id="greenSphere" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="40%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#15803d" />
                  </radialGradient>

                  {/* Wrong (red) */}
                  <radialGradient id="redSphere" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="40%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </radialGradient>

                  {/* Passed (amber) */}
                  <radialGradient id="amberSphere" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </radialGradient>

                  {/* Glow filter for active letter */}
                  <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Circular track rings */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={roscoRadius}
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.25)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />

                {/* Center Hub */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="145"
                  fill="url(#centerHubGrad)"
                  stroke="rgba(59, 130, 246, 0.35)"
                  strokeWidth="3"
                  className="drop-shadow-lg"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="135"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1.5"
                />

                {/* Center Hub Content */}
                <g className="select-none pointer-events-none">
                  {/* Type clue: "Empieza por A" */}
                  <text
                    x={cx}
                    y={cy - 65}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#93c5fd"
                    fontSize="13"
                    fontWeight="700"
                    letterSpacing="1.5"
                  >
                    {currentQuestion.typeEs.toUpperCase()}
                  </text>

                  {/* Huge Active Letter */}
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize="74"
                    fontWeight="900"
                    filter="drop-shadow(0 4px 14px rgba(59, 130, 246, 0.7))"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {currentQuestion.letter}
                  </text>

                  {/* Armenian type translation: "Սկսվում է A տառով" */}
                  <text
                    x={cx}
                    y={cy + 42}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fcd34d"
                    fontSize="12.5"
                    fontWeight="600"
                  >
                    {currentQuestion.typeHy}
                  </text>

                  {/* Status chip in center */}
                  <rect
                    x={cx - 65}
                    y={cy + 68}
                    width="130"
                    height="28"
                    rx="14"
                    fill={
                      statuses[currentQuestion.id] === 'correct'
                        ? 'rgba(22, 163, 74, 0.25)'
                        : statuses[currentQuestion.id] === 'wrong'
                        ? 'rgba(220, 38, 38, 0.25)'
                        : statuses[currentQuestion.id] === 'passed'
                        ? 'rgba(245, 158, 11, 0.25)'
                        : 'rgba(30, 58, 138, 0.4)'
                    }
                    stroke={
                      statuses[currentQuestion.id] === 'correct'
                        ? '#22c55e'
                        : statuses[currentQuestion.id] === 'wrong'
                        ? '#ef4444'
                        : statuses[currentQuestion.id] === 'passed'
                        ? '#f59e0b'
                        : '#3b82f6'
                    }
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx}
                    y={cy + 82}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={
                      statuses[currentQuestion.id] === 'correct'
                        ? '#86efac'
                        : statuses[currentQuestion.id] === 'wrong'
                        ? '#fca5a5'
                        : statuses[currentQuestion.id] === 'passed'
                        ? '#fde68a'
                        : '#93c5fd'
                    }
                    fontSize="11"
                    fontWeight="700"
                  >
                    {statuses[currentQuestion.id] === 'correct'
                      ? '✓ CORRECTA'
                      : statuses[currentQuestion.id] === 'wrong'
                      ? '✗ INCORRECTA'
                      : statuses[currentQuestion.id] === 'passed'
                      ? 'PASAPALABRA'
                      : 'EN JUEGO'}
                  </text>
                </g>

                {/* Exact 27 Symmetrically Positioned Letter Spheres */}
                {letterCoordinates.map(({ q, idx, x, y }) => {
                  const isActive = idx === currentIndex;
                  const status = statuses[q.id];

                  let fillGrad = 'url(#blueSphere)';
                  let strokeColor = '#93c5fd';
                  let strokeW = 1.5;

                  if (status === 'correct') {
                    fillGrad = 'url(#greenSphere)';
                    strokeColor = '#86efac';
                    strokeW = 2;
                  } else if (status === 'wrong') {
                    fillGrad = 'url(#redSphere)';
                    strokeColor = '#fca5a5';
                    strokeW = 2;
                  } else if (status === 'passed') {
                    fillGrad = 'url(#amberSphere)';
                    strokeColor = '#fde68a';
                    strokeW = 2;
                  }

                  if (isActive) {
                    fillGrad = 'url(#goldSphere)';
                    strokeColor = '#ffffff';
                    strokeW = 2.5;
                  }

                  const sphereRadius = isActive ? 22 : 19.5;

                  return (
                    <g
                      key={q.letter}
                      onClick={() => {
                        playSound('click', soundEnabled);
                        setCurrentIndex(idx);
                        setFeedback(null);
                      }}
                      className="cursor-pointer transition-all duration-150"
                      role="button"
                      tabIndex={0}
                    >
                      {/* Active pulsating beacon halo */}
                      {isActive && (
                        <>
                          <circle
                            cx={x}
                            cy={y}
                            r="28"
                            fill="none"
                            stroke="#facc15"
                            strokeWidth="3"
                            className="svg-active-ring"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="23"
                            fill="rgba(250, 204, 21, 0.2)"
                          />
                        </>
                      )}

                      {/* Letter Sphere */}
                      <circle
                        cx={x}
                        cy={y}
                        r={sphereRadius}
                        fill={fillGrad}
                        stroke={strokeColor}
                        strokeWidth={strokeW}
                        className="transition-transform duration-150 hover:opacity-90"
                      />

                      {/* Specular 3D highlight gloss */}
                      <ellipse
                        cx={x - 4}
                        cy={y - 6}
                        rx={sphereRadius * 0.4}
                        ry={sphereRadius * 0.22}
                        fill="rgba(255, 255, 255, 0.5)"
                        transform={`rotate(-25 ${x - 4} ${y - 6})`}
                        pointerEvents="none"
                      />

                      {/* Mathematically Centered Letter */}
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isActive ? '#78350f' : '#ffffff'}
                        fontWeight="800"
                        fontSize={isActive ? "17" : "15.5"}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                        className="pointer-events-none select-none"
                      >
                        {q.letter}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Instruction hint under wheel */}
            <p className="text-xs text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
              <span>💡</span>
              <span>Սեղմիր ցանկացած տառի վրա՝ նրան անցնելու կամ նշելու համար</span>
            </p>
          </div>

          {/* Right Column: Active Question Card, Spanish text, Click-to-Armenian translation, Input & Actions */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Active Question Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-md">
                    {currentQuestion.letter}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">
                      {currentQuestion.typeEs}
                    </h3>
                    <p className="text-xs text-amber-300 font-medium">
                      {currentQuestion.typeHy}
                    </p>
                  </div>
                </div>

                {/* Speech read aloud button */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => speakText(currentQuestion.clueEs, 'es')}
                    title="Լսել իսպաներենով / Escuchar en español"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">ES</span>
                  </button>
                  <button
                    onClick={() => speakText(currentQuestion.clueHy, 'hy')}
                    title="Լսել հայերենով / Escuchar en armenio"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors text-xs flex items-center gap-1"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">AM</span>
                  </button>
                </div>
              </div>

              {/* SPANISH CLUE BOX (Interactive click reveals Armenian as requested) */}
              <div className="my-5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>🇪🇸 Pregunta en español:</span>
                  <span className="text-amber-400/90 text-[11px] flex items-center gap-1 font-normal cursor-pointer" onClick={() => toggleTranslation(currentQuestion.id)}>
                    <Eye className="w-3.5 h-3.5" /> Սեղմիր իսպաներենի վրա թարգմանության համար
                  </span>
                </div>

                {/* Clickable Spanish Box */}
                <div
                  onClick={() => toggleTranslation(currentQuestion.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') toggleTranslation(currentQuestion.id);
                  }}
                  className="group relative p-4 rounded-xl bg-blue-950/30 hover:bg-blue-950/50 border border-blue-500/30 hover:border-blue-400/60 transition-all cursor-pointer select-none text-slate-100 text-base sm:text-lg leading-relaxed shadow-inner"
                >
                  <p className="font-medium text-white group-hover:text-blue-100 transition-colors">
                    {currentQuestion.clueEs}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-blue-300/80">
                    <span className="italic flex items-center gap-1 text-[11px]">
                      👆 Սեղմիր այստեղ՝ հայերեն թարգմանությունը տեսնելու համար
                    </span>
                    <span className="underline underline-offset-2 font-medium">
                      {alwaysShowArmenian || revealedTranslations[currentQuestion.id]
                        ? 'Թաքցնել / Ocultar'
                        : 'Բացել թարգմանությունը / Ver traducción'}
                    </span>
                  </div>
                </div>

                {/* ARMENIAN TRANSLATION ACCORDION / BOX */}
                {(alwaysShowArmenian || revealedTranslations[currentQuestion.id]) && (
                  <div className="mt-3 p-4 rounded-xl bg-amber-950/25 border border-amber-500/40 text-amber-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        🇦🇲 Հայերեն թարգմանություն
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTranslation(currentQuestion.id);
                        }}
                        className="text-amber-400/70 hover:text-amber-200"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-amber-50 font-normal">
                      {currentQuestion.clueHy}
                    </p>
                  </div>
                )}
              </div>

              {/* FEEDBACK BANNER (If answered) */}
              {feedback ? (
                <div
                  className={`p-4 rounded-xl border mb-5 ${
                    feedback.type === 'correct'
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {feedback.type === 'correct' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-base text-white">
                        {feedback.messageEs}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {feedback.messageHy}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm">
                          <span className="text-slate-400 text-xs block">Պատասխան / Respuesta:</span>
                          <span className="font-bold text-white text-base">
                            {feedback.correctAnswer}
                          </span>
                          <span className="text-amber-300 text-xs ml-2 font-medium">
                            ({feedback.correctAnswerHy})
                          </span>
                        </div>

                        {/* Continue Button: CRITICAL requirement "если ответ неверный всё равно продолжить играть" */}
                        <button
                          onClick={handleContinueAfterFeedback}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                        >
                          <span>Շարունակել / Continuar</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* INPUT FORM */
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="answer-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Գրիր պատասխանը իսպաներենով / Escribe la respuesta en español:
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="answer-input"
                        ref={inputRef}
                        type="text"
                        autoComplete="off"
                        value={currentInput}
                        onChange={e => setCurrentInput(e.target.value)}
                        placeholder={`Respuesta con ${currentQuestion.letter}...`}
                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-500 text-base font-semibold outline-none transition-all"
                      />
                      {currentInput && (
                        <button
                          type="button"
                          onClick={() => setCurrentInput('')}
                          className="absolute right-3 text-slate-400 hover:text-white text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!currentInput.trim()}
                      className="flex-1 min-w-[130px] py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Comprobar / Ստուգել</span>
                    </button>

                    {/* Pasapalabra (Pass) */}
                    <button
                      type="button"
                      onClick={handlePasapalabra}
                      className="py-3 px-4 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>¡Pasapalabra!</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Separate Dedicated Answer Button */}
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click', soundEnabled);
                        setShowAnswer(prev => !prev);
                      }}
                      className={`py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        showAnswer
                          ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400/50 shadow-lg shadow-purple-900/40'
                          : 'bg-purple-950/70 hover:bg-purple-900 text-purple-200 border-purple-700/70 hover:border-purple-500 shadow-md'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{showAnswer ? 'Скрыть ответ' : 'Ответ / Պատասխան'}</span>
                    </button>
                  </div>

                  {/* Dedicated Revealed Answer Card */}
                  {showAnswer && (
                    <div className="mt-3.5 p-4 rounded-xl bg-purple-950/40 border-2 border-purple-500/60 text-purple-100 shadow-xl shadow-purple-950/40 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-purple-800/60">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>Правильный ответ / Ճիշտ պատասխան:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAnswer(false)}
                          className="text-purple-400 hover:text-purple-200 text-xs px-2 py-0.5 rounded hover:bg-purple-900/50"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                            <span>{currentQuestion.answerEs}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 font-semibold border border-purple-700/50">
                              🇪🇸 Español
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-semibold text-amber-300 mt-1 flex items-center gap-2">
                            <span>{currentQuestion.answerHy}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-semibold border border-amber-700/50">
                              🇦🇲 Հայերեն
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => speakText(`${currentQuestion.answerEs}. En armenio: ${currentQuestion.answerHy}`, 'es')}
                            title="Լսել արտասանությունը / Escuchar"
                            className="p-2.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span className="text-xs font-semibold">Լսել</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCurrentInput(currentQuestion.answerEs);
                              inputRef.current?.focus();
                            }}
                            className="px-3.5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Вставить ответ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* QUICK MANUAL SCORING BUTTONS */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Ձեռքով նշում / Marcado directo:</span>
                  <span className="text-[10px] text-slate-500">Ուսուցչի / ստուգման ռեժիմ</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleManualMark('correct')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      statuses[currentQuestion.id] === 'correct'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ճիշտ (Կանաչ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleManualMark('wrong')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      statuses[currentQuestion.id] === 'wrong'
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                        : 'bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Սխալ (Կարմիր)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleManualMark('pending')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      statuses[currentQuestion.id] === 'pending'
                        ? 'bg-slate-700 text-white ring-2 ring-slate-400'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Բաց թողնել (Մոխրագույն)</span>
                  </button>
                </div>
              </div>

              {/* Navigation prev/next buttons */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = (currentIndex - 1 + PASAPALABRA_QUESTIONS.length) % PASAPALABRA_QUESTIONS.length;
                    setCurrentIndex(prevIdx);
                    setFeedback(null);
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Նախորդ տառ
                </button>
                <span className="font-mono text-slate-500">
                  {currentIndex + 1} / {PASAPALABRA_QUESTIONS.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (currentIndex + 1) % PASAPALABRA_QUESTIONS.length;
                    setCurrentIndex(nextIdx);
                    setFeedback(null);
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  Հաջորդ տառ <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* FULL 27-LETTER STRIP: 3 PERFECTLY ALIGNED ROWS OF 9 LETTERS EACH (9 × 3 = 27) */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 mt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Այբուբենի ցանկ — Todas las 27 letras (A–Z)
              </h3>
              <p className="text-xs text-slate-400">
                Բոլոր 27 տառերը հավասարաչափ տողերով (3 տող × 9 տառ)
              </p>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ճիշտ
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Սխալ
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Բաց թողնված
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Ընթացիկ
              </span>
            </div>
          </div>

          {/* 3 Completely Even, Straight Rows with 9 Columns Each */}
          <div className="space-y-2.5">
            {/* Row 1: A–I (9 letters) */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase w-12 shrink-0">
                A – I
              </span>
              <div className="grid grid-cols-9 gap-1.5 sm:gap-2 flex-1">
                {PASAPALABRA_QUESTIONS.slice(0, 9).map((q, idx) => renderLetterPill(q, idx))}
              </div>
            </div>

            {/* Row 2: J–Q (9 letters) */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase w-12 shrink-0">
                J – Q
              </span>
              <div className="grid grid-cols-9 gap-1.5 sm:gap-2 flex-1">
                {PASAPALABRA_QUESTIONS.slice(9, 18).map((q, idx) => renderLetterPill(q, 9 + idx))}
              </div>
            </div>

            {/* Row 3: R–Z (9 letters) */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase w-12 shrink-0">
                R – Z
              </span>
              <div className="grid grid-cols-9 gap-1.5 sm:gap-2 flex-1">
                {PASAPALABRA_QUESTIONS.slice(18, 27).map((q, idx) => renderLetterPill(q, 18 + idx))}
              </div>
            </div>
          </div>
        </section>

        {/* FULL QUESTIONS & ANSWERS BILINGUAL DIRECTORY / TABLE */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <details className="group">
            <summary className="cursor-pointer select-none font-bold text-sm text-slate-300 hover:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📚 27 հարցերի և պատասխանների ամբողջական ցուցակ (27 Preguntas y Respuestas)</span>
              </span>
              <span className="text-xs text-blue-400 font-normal group-open:hidden">
                Բացել ցանկը / Ver lista
              </span>
            </summary>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 max-h-[600px] overflow-y-auto pr-1">
              <p className="text-xs text-slate-400">
                Սեղմիր ցանկացած տողի իսպաներեն տեքստի վրա՝ հայերեն թարգմանությունն ու բառը տեսնելու համար։
              </p>

              {PASAPALABRA_QUESTIONS.map(item => {
                const isSelected = item.id === currentQuestion.id;
                const status = statuses[item.id];
                const isOpen = alwaysShowArmenian || revealedTranslations[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(item.id - 1);
                      toggleTranslation(item.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center">
                          {item.letter}
                        </span>
                        <span className="font-semibold text-xs text-white">
                          {item.id}. {item.typeEs}
                        </span>
                        <span className="text-[11px] text-amber-300 font-normal">
                          · {item.typeHy}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {status === 'correct' && (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ճիշտ
                          </span>
                        )}
                        {status === 'wrong' && (
                          <span className="text-rose-400 text-xs font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Սխալ
                          </span>
                        )}
                        {status === 'passed' && (
                          <span className="text-amber-400 text-xs font-semibold">
                            Բաց թողնված
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(item.answerEs, 'es');
                          }}
                          title="Լսել իսպաներեն արտասանությունը"
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Spanish text */}
                    <div className="text-xs text-slate-200 pl-9">
                      <p className="font-medium">🇪🇸 {item.clueEs}</p>
                      
                      {/* Revealed Armenian */}
                      {isOpen ? (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 text-amber-200">
                          <p>🇦🇲 {item.clueHy}</p>
                          <div className="mt-1 font-bold text-emerald-300 text-xs">
                            Respuesta: <span className="underline">{item.answerEs}</span> — 🇦🇲 {item.answerHy}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-[11px] text-blue-400 hover:underline">
                          👆 Սեղմիր թարգմանությունը տեսնելու համար (Ver traducción)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        </section>

      </main>

      {/* SUMMARY MODAL WHEN FINISHED (Resultado: X / 27) */}
      {showSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b142c] border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white">
              Խաղն ավարտվեց! ¡Fin del Juego!
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Pasapalabra 27 preguntas completadas
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Resultado final / Վերջնական արդյունք
              </div>
              <div className="text-4xl font-black text-emerald-400 mt-1 tabular-nums">
                {stats.correct} <span className="text-xl text-slate-500 font-normal">/ 27</span>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                <span className="text-emerald-400 font-semibold">
                  Ճիշտ: {stats.correct}
                </span>
                <span className="text-rose-400 font-semibold">
                  Սխալ: {stats.wrong}
                </span>
                <span className="text-blue-400 font-semibold">
                  Մնացած: {stats.pending}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleRestart}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar / Խաղալ նորից</span>
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
              >
                Դիտել պատասխանները
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper renderer for letter pills in the grid
  function renderLetterPill(q: QuestionItem, idx: number) {
    const isActive = idx === currentIndex;
    const status = statuses[q.id];

    let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500';
    if (status === 'correct') {
      colorClasses = 'bg-emerald-600 text-white border-emerald-400 shadow-sm shadow-emerald-900/50';
    } else if (status === 'wrong') {
      colorClasses = 'bg-rose-600 text-white border-rose-400 shadow-sm shadow-rose-900/50';
    } else if (status === 'passed') {
      colorClasses = 'bg-amber-600 text-white border-amber-400 shadow-sm shadow-amber-900/50';
    }

    if (isActive) {
      colorClasses += ' ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 font-black';
    }

    return (
      <button
        key={q.id}
        onClick={() => {
          playSound('click', soundEnabled);
          setCurrentIndex(idx);
          setFeedback(null);
        }}
        title={`${q.letter} — ${q.answerEs} (${q.answerHy})`}
        className={`w-full py-2 px-0.5 rounded-lg text-center font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-center ${colorClasses}`}
      >
        <span>{q.letter}</span>
      </button>
    );
  }
}
