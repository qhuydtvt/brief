/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { SlideItem } from "~/entities/slide/model/types";
import {
  ChevronRight,
  ChevronLeft,
  Brain,
  X,
  ArrowUpRight,
  HelpCircle,
  Trophy,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Award
} from "lucide-react";

interface Quiz {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  theme: "indigo" | "amber" | "emerald" | "rose";
}

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    question: "What keeps mobile readers engaged?",
    options: [
      { id: "a", text: "Long paragraphs that explain everything in detail.", isCorrect: false },
      { id: "b", text: "Brevity and chunking ideas into bite-sized text.", isCorrect: true },
      { id: "c", text: "Sophisticated vocabulary to impress the reader.", isCorrect: false },
      { id: "d", text: "Miniature fonts to pack more facts onto the screen.", isCorrect: false },
    ],
    explanation: "Keep it brief to match short mobile attention spans.",
    theme: "indigo",
  },
  {
    id: "q2",
    question: "Where do high-impact words belong?",
    options: [
      { id: "a", text: "Buried in the middle of sentences.", isCorrect: false },
      { id: "b", text: "Placed at the very end to build anticipation.", isCorrect: false },
      { id: "c", text: "Front-loaded at the start of each line or bullet.", isCorrect: true },
      { id: "d", text: "Scattered randomly to add visual variety.", isCorrect: false },
    ],
    explanation: "Start strong because mobile readers scan left-to-right quickly.",
    theme: "amber",
  },
  {
    id: "q3",
    question: "What should visuals and audio do?",
    options: [
      { id: "a", text: "Repeat the exact same text read out loud.", isCorrect: false },
      { id: "b", text: "Look visually stunning even if they distract from the message.", isCorrect: false },
      { id: "c", text: "Complement the text to build double memory pathways.", isCorrect: true },
      { id: "d", text: "Play automatically with loud background sounds.", isCorrect: false },
    ],
    explanation: "Show concepts visually to save screen space and reading time.",
    theme: "emerald",
  },
  {
    id: "q4",
    question: "Why personalize your content?",
    options: [
      { id: "a", text: "It establishes a highly formal and professional tone.", isCorrect: false },
      { id: "b", text: "It keeps the message generic so it applies to everyone.", isCorrect: false },
      { id: "c", text: "It allows you to collect and track more user data.", isCorrect: false },
      { id: "d", text: "It makes the reader feel directly spoken to.", isCorrect: true },
    ],
    explanation: "Use 'you' to instantly grab the user's focus.",
    theme: "rose",
  },
];

const THEMES: Record<"indigo" | "amber" | "emerald" | "rose", {
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
  progressDot: string;
  btnHoverBorder: string;
  headerIcon: string;
  rgb: string;
}> = {
  indigo: {
    badgeText: "text-indigo-300",
    badgeBg: "bg-indigo-500/20",
    badgeBorder: "border-indigo-400/30",
    progressDot: "bg-indigo-500",
    btnHoverBorder: "hover:border-indigo-500/30",
    headerIcon: "text-indigo-400",
    rgb: "99, 102, 241",
  },
  amber: {
    badgeText: "text-amber-300",
    badgeBg: "bg-amber-500/20",
    badgeBorder: "border-amber-400/30",
    progressDot: "bg-amber-500",
    btnHoverBorder: "hover:border-amber-500/30",
    headerIcon: "text-amber-400",
    rgb: "245, 158, 11",
  },
  emerald: {
    badgeText: "text-emerald-300",
    badgeBg: "bg-emerald-500/20",
    badgeBorder: "border-emerald-400/30",
    progressDot: "bg-emerald-500",
    btnHoverBorder: "hover:border-emerald-500/30",
    headerIcon: "text-emerald-400",
    rgb: "16, 185, 129",
  },
  rose: {
    badgeText: "text-rose-300",
    badgeBg: "bg-rose-500/20",
    badgeBorder: "border-rose-400/30",
    progressDot: "bg-rose-500",
    btnHoverBorder: "hover:border-rose-500/30",
    headerIcon: "text-rose-400",
    rgb: "244, 63, 94",
  },
};

export function SlideTestToRemember({ slide: _slide }: { slide: SlideItem }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [hasCompleted, setHasCompleted] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);

  const [autoAdvanceActive, setAutoAdvanceActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5000);
  const [isPaused, setIsPaused] = useState(false);


  const isResultsScreen = currentIndex === QUIZZES.length;

  const score = QUIZZES.reduce((acc, quiz) => {
    const selectedId = userAnswers[quiz.id];
    const option = quiz.options.find((opt) => opt.id === selectedId);
    return option?.isCorrect ? acc + 1 : acc;
  }, 0);

  const activeQuiz = isResultsScreen ? null : QUIZZES[currentIndex];
  const selectedOptionId = activeQuiz ? (userAnswers[activeQuiz.id] || null) : null;
  const isAnswered = selectedOptionId !== null;

  const resultsTheme = score === 4 ? "amber" : score === 3 ? "emerald" : score === 2 ? "indigo" : "rose";
  const themeConfig = isResultsScreen ? THEMES[resultsTheme] : THEMES[activeQuiz!.theme];

  const handleSelect = (optionId: string) => {
    if (activeQuiz) {
      setUserAnswers((prev) => ({
        ...prev,
        [activeQuiz.id]: optionId,
      }));
      setAutoAdvanceActive(true);
      setTimeLeft(5000);
      setIsPaused(false);
    }
  };

  const handleNext = () => {
    setAutoAdvanceActive(false);
    setTimeLeft(5000);
    setIsPaused(false);
    if (currentIndex === QUIZZES.length - 1) {
      setCurrentIndex(QUIZZES.length);
      setHasCompleted(true);
    } else if (currentIndex < QUIZZES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setAutoAdvanceActive(false);
    setTimeLeft(5000);
    setIsPaused(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    setIsPaused(true);
  };

  const handlePointerUp = () => {
    setIsPaused(false);
  };

  const handlePointerLeave = () => {
    setIsPaused(false);
  };

  const handlePointerCancel = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    if (!autoAdvanceActive || isPaused || !isAnswered || isResultsScreen || hasCompleted) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoAdvanceActive, isPaused, isAnswered, isResultsScreen, hasCompleted]);

  useEffect(() => {
    if (timeLeft === 0 && autoAdvanceActive && isAnswered && !isResultsScreen && !hasCompleted) {
      const timer = setTimeout(() => {
        handleNext();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, autoAdvanceActive, isAnswered, isResultsScreen, hasCompleted]);

  useEffect(() => {
    if (!isDrawerOpen) {
      const timer = setTimeout(() => {
        setAutoAdvanceActive(false);
        setTimeLeft(5000);
        setIsPaused(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen]);

  return (
    <div className="relative h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3.5 select-none min-h-0">
      {/* Base Slide View Header (Standardized sizing) */}
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Test to Remember</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Don't just re-read notes. Force active recall using quick, low-stakes micro-quizzes.
        </p>
      </div>

      {/* Standardized Minimalist CTA Card */}
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="group relative w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 active:scale-[0.98] text-white p-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer outline-none text-left overflow-hidden shadow-lg backdrop-blur-md"
        >
          {/* Icon Badge */}
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors duration-200">
            <Brain className="w-4.5 h-4.5 text-white/90 group-hover:scale-110 transition-transform duration-200" />
          </div>

          {/* Typography */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-semibold text-white tracking-tight leading-snug">
                Test Your Recall
              </h4>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors duration-200" />
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 font-normal">
              Interactive micro-quizzes testing active recall
            </p>
          </div>
        </button>
      </div>

      {/* Drawer Overlay (Portaled to document.body like SlideDesignForPortrait) */}
      {isDrawerOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end p-0 overflow-hidden animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setIsDrawerOpen(false)} />

            {/* Drawer container */}
            <div
              className={`relative w-full h-dvh max-w-xl mx-auto bg-black border-x border-white/10 flex flex-col pt-[max(0.5rem,env(safe-area-inset-top))] ${
                isResultsScreen
                  ? "pb-2"
                  : "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
              } px-2.5 sm:px-4 gap-2 animate-in slide-in-from-bottom duration-300 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Handle Bar */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto shrink-0 mb-0.5" />

              {/* Drawer Header Row */}
              <div className="flex items-center justify-between shrink-0 pb-1.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {isResultsScreen ? (
                    <Trophy className="w-4 h-4 text-amber-400" />
                  ) : (
                    <HelpCircle className={`w-4 h-4 transition-colors duration-500 ${themeConfig.headerIcon}`} />
                  )}
                  <h4 className="text-xs font-semibold text-white tracking-tight">
                    {isResultsScreen ? "Quiz Results" : "Active Recall Micro-Quiz"}
                  </h4>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Quiz Area inside Drawer */}
              <div className="relative flex-1 min-h-0 w-full bg-black rounded-3xl flex flex-col overflow-hidden border border-white/10">


                {/* Smooth transition gradient backdrop */}
                <div 
                  className="absolute inset-0 transition-all duration-500 ease-in-out pointer-events-none" 
                  style={{
                    background: `linear-gradient(to bottom, rgba(${themeConfig.rgb}, 0.15) 0%, rgba(9, 9, 11, 0.8) 60%, rgba(0, 0, 0, 1))`
                  }}
                />

                {/* Main Content (Scrollable wrapper inside) */}
                <div 
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerLeave}
                  onPointerCancel={handlePointerCancel}
                  className={`relative z-10 flex-1 min-h-0 w-full p-3 sm:p-4 ${
                    isResultsScreen ? "pb-1" : ""
                  } flex flex-col justify-between overflow-y-auto no-scrollbar`}
                >
                  
                  {isResultsScreen ? (
                    /* Results view */
                    <div className="flex flex-col items-center justify-between w-full h-full flex-1 pt-3 pb-0 animate-in fade-in zoom-in-95 duration-500">
                      
                      {/* Top Section (Trophy badge, Title, Subtitle celebration) */}
                      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center w-full min-h-0 pt-2">
                        {/* Icon Badge */}
                        <div className={`w-18 h-18 rounded-3xl bg-white/5 border ${themeConfig.badgeBorder} flex items-center justify-center relative overflow-hidden shadow-lg`}>
                          {/* Glow backdrop */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                          {score === 4 ? (
                            <Trophy className="w-9 h-9 text-amber-400 animate-pulse" />
                          ) : score === 3 ? (
                            <Award className="w-9 h-9 text-emerald-400 animate-pulse" />
                          ) : (
                            <Brain className={`w-9 h-9 ${themeConfig.headerIcon} animate-pulse`} />
                          )}
                        </div>

                        {/* Status celebration text */}
                        <div className="flex flex-col gap-2.5 items-center">
                          <h3 className="text-3xl font-black text-white tracking-tight leading-none">
                            {score === 4 
                              ? "Perfect Score" 
                              : score === 3 
                                ? "Strong Score" 
                                : score === 2 
                                  ? "Halfway There" 
                                  : score === 1
                                    ? "Room to Grow"
                                    : "Keep Practicing"
                            }
                          </h3>
                          <p className="text-sm text-zinc-300 max-w-xs px-4 leading-relaxed font-medium">
                            {score === 4 
                              ? "These principles are now wired in." 
                              : score === 3 
                                ? "Repeat tomorrow to lock these concepts in." 
                                : score === 2 
                                  ? "Space your next review to build connections."
                                  : score === 1
                                    ? "Correcting mistakes triggers learning—try again."
                                    : "Recall errors prime your brain, so try again."
                            }
                          </p>
                        </div>
                      </div>

                      {/* Middle Section (Review questions) - Centered in bottom half of vertically centered area */}
                      <div className="w-full max-w-sm flex-1 flex flex-col justify-center my-auto min-h-0 pt-4 pb-2">
                        {/* Review breakdown Box */}
                        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-2.5">
                          <div className="flex items-center px-1">
                            {/* Score Pill folded here */}
                            <span className={`text-[9px] font-mono font-semibold tracking-wider uppercase px-2 py-0.25 rounded-full border ${themeConfig.badgeText} ${themeConfig.badgeBg} ${themeConfig.badgeBorder}`}>
                              Recall: {score}/{QUIZZES.length}
                            </span>
                          </div>

                          {/* Interactive circles row */}
                          <div className="flex justify-center gap-3 py-1">
                            {QUIZZES.map((quiz, idx) => {
                              const selectedId = userAnswers[quiz.id];
                              const option = quiz.options.find(opt => opt.id === selectedId);
                              const isCorrect = option?.isCorrect ?? false;
                              const isSelected = idx === selectedReviewIndex;

                              return (
                                <button
                                  key={quiz.id}
                                  onClick={() => setSelectedReviewIndex(idx)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer relative ${
                                    isCorrect 
                                      ? isSelected
                                        ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/80 ring-2 ring-emerald-500/30'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                      : isSelected
                                        ? 'bg-rose-500/25 text-rose-300 border-rose-400/80 ring-2 ring-rose-500/30'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                                  }`}
                                >
                                  {idx + 1}
                                  {isSelected && (
                                    <span className={`absolute -bottom-1 w-1 h-1 rounded-full ${isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Details container */}
                          {(() => {
                            const selectedQuiz = QUIZZES[selectedReviewIndex];
                            const selectedId = userAnswers[selectedQuiz.id];
                            const option = selectedQuiz.options.find(opt => opt.id === selectedId);
                            const isCorrect = option?.isCorrect ?? false;

                            return (
                              <button
                                onClick={() => setCurrentIndex(selectedReviewIndex)}
                                className="w-full flex flex-col p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all text-left cursor-pointer group gap-2 min-h-[92px]"
                              >
                                <div className="flex items-start justify-between gap-2.5 w-full min-w-0">
                                  <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                                    {selectedQuiz.question}
                                  </span>
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                  )}
                                </div>

                                <div className="text-[11px] text-zinc-400 leading-normal flex flex-col gap-1 w-full">
                                  <div className="truncate">
                                    <span className="text-zinc-500 font-medium">Your answer: </span>
                                    <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                                      {option ? option.text : "No answer"}
                                    </span>
                                  </div>
                                  {!isCorrect && (
                                    <div className="truncate">
                                      <span className="text-zinc-500 font-medium">Correct: </span>
                                      <span className="text-emerald-400 font-medium">
                                        {selectedQuiz.options.find(opt => opt.isCorrect)?.text}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Bottom Section (Retake Quiz Button) */}
                      <div className="w-full shrink-0 pt-2 flex flex-col items-center max-w-sm mt-auto mb-0">
                        <button
                          onClick={() => {
                            setUserAnswers({});
                            setCurrentIndex(0);
                            setHasCompleted(false);
                            setSelectedReviewIndex(0);
                          }}
                          className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-lg"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retake Quiz
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Question View */
                    <>
                      {/* Top Badge Row */}
                      <div className="w-full flex items-center justify-between shrink-0 mb-1">
                        <span className={`text-[10px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded border inline-block transition-all duration-500 ${themeConfig.badgeText} ${themeConfig.badgeBg} ${themeConfig.badgeBorder}`}>
                          Question {currentIndex + 1} of {QUIZZES.length}
                        </span>
                        <div 
                          className={`flex items-center select-none transition-all duration-500 ${
                            (autoAdvanceActive && isAnswered)
                              ? "opacity-100 visible"
                              : "opacity-0 invisible pointer-events-none"
                          }`}
                        >
                          {isPaused ? (
                            <span className="text-[10px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded border inline-flex items-center justify-center gap-1.5 bg-zinc-500/10 text-zinc-400 border-zinc-500/20 w-[115px]">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-500 animate-none" />
                              PAUSED
                            </span>
                          ) : (
                            <span className={`text-[10px] font-mono font-medium tracking-wider uppercase px-2 py-0.5 rounded border inline-flex items-center justify-center gap-1.5 transition-all duration-500 ${themeConfig.badgeText} ${themeConfig.badgeBg} ${themeConfig.badgeBorder} w-[115px]`}>
                              <span className="relative flex h-1.5 w-1.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themeConfig.progressDot}`} />
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${themeConfig.progressDot}`} />
                              </span>
                              NEXT IN {Math.ceil(timeLeft / 1000)}S
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Central Space: Question & Options */}
                      <div className="flex flex-col gap-3.5 w-full flex-1 justify-center my-auto">
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug text-center mb-6 px-1">
                          {activeQuiz!.question}
                        </h3>

                        <div className="flex flex-col gap-3.5 w-full">
                          {activeQuiz!.options.map((option, index) => {
                            const isSelected = selectedOptionId === option.id;
                            const letter = ["A", "B", "C", "D"][index];
                            let btnStyle = `bg-white/5 border-white/10 text-white ${themeConfig.btnHoverBorder}`;
                            let badgeStyle = "bg-white/10 text-white/85";

                            if (isAnswered) {
                              if (option.isCorrect) {
                                btnStyle = "bg-emerald-500/20 border-emerald-400/60 text-emerald-100 font-semibold";
                                badgeStyle = "bg-emerald-500/30 text-emerald-300";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500/20 border-rose-400/60 text-rose-100 font-semibold animate-shake";
                                badgeStyle = "bg-rose-500/30 text-rose-300";
                              } else {
                                btnStyle = "bg-white/5 border-white/5 text-white/50";
                                badgeStyle = "bg-white/5 text-white/30";
                              }
                            }

                            return (
                              <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                disabled={isAnswered}
                                className={`w-full py-2.5 px-3 rounded-xl border transition-all active:scale-[0.99] cursor-pointer flex items-center gap-3 ${btnStyle}`}
                              >
                                <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}>
                                  {letter}
                                </span>
                                <span className="flex-1 text-left text-sm leading-snug">{option.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Micro-Explanation Box */}
                      <div className="w-full flex items-center justify-center pt-2">
                        <div 
                          className={`w-full transition-all duration-500 transform ${
                            isAnswered 
                              ? "opacity-100 visible translate-y-0" 
                              : "opacity-0 invisible -translate-y-1 pointer-events-none"
                          }`}
                        >
                          <div className="px-3 py-2 bg-emerald-500/10 rounded-xl w-full text-center border border-emerald-500/20">
                            <p className="text-xs text-emerald-300 font-medium leading-normal">
                              {activeQuiz!.explanation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Static Bottom Controls (Progress Bar & Centered Dots) */}
                      <div className="w-full shrink-0 pt-2 flex flex-col items-center gap-3 mt-2">
                        {/* Progress Bar (countdown) - placed inline above the pagination controls */}
                        {!isResultsScreen && (
                          <div 
                            className={`w-full h-[3px] rounded-full overflow-hidden shrink-0 transition-all duration-500 ${
                              (autoAdvanceActive && isAnswered && !hasCompleted)
                                ? "bg-white/10 opacity-100"
                                : "bg-transparent opacity-0 pointer-events-none"
                            }`}
                          >
                            <div 
                              className="h-full transition-all duration-100 ease-linear"
                              style={{
                                width: `${(timeLeft / 5000) * 100}%`,
                                backgroundColor: isPaused ? '#71717a' : `rgb(${themeConfig.rgb})`,
                                boxShadow: isPaused ? 'none' : `0 0 8px rgba(${themeConfig.rgb}, 0.8)`
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between w-full">
                          <button
                            onClick={handlePrev}
                            disabled={!hasCompleted || currentIndex === 0}
                            className="p-2 rounded-full text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                            aria-label="Previous question"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="flex gap-1.5">
                            {QUIZZES.map((_, idx) => (
                              <div 
                                key={idx} 
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  idx === currentIndex 
                                    ? `${themeConfig.progressDot} scale-125` 
                                    : 'bg-white/20'
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={handleNext}
                            disabled={!hasCompleted && !isAnswered}
                            className="p-2 rounded-full text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
                            aria-label="Next question"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}