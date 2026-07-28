import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { SlideItem } from "../../model/types";
import { RotateCw, CheckCircle, AlertOctagon, Star, Lightbulb, FastForward, Play, Info, X, Brain } from "lucide-react";

function SlideHeader({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  return (
    <div className="space-y-1 max-w-xs shrink-0">
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-xl font-bold text-white tracking-tight">Space Your Practice</h3>
        <button 
          onClick={onOpenDrawer}
          className="text-white/60 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-white/70 font-medium leading-relaxed">
        Review key ideas right before they fade to cement durable neural pathways.
      </p>
    </div>
  );
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

interface SM2Flashcard extends Flashcard {
  repetition: number;
  interval: number; // in minutes
  easinessFactor: number;
  dueDate: string; // ISO date string
}

const SAMPLE_CARDS: Flashcard[] = [
  {
    id: "1",
    front: "Less is More",
    back: "Avoid walls of text by chunking information into single, clear takeaways to respect limited attention spans.",
    hint: "Chunk ideas instead of displaying blocks of text."
  },
  {
    id: "2",
    front: "Front-load Keywords",
    back: "Put high-impact terms at the beginning of lines or lists because mobile readers scan vertically along the left edge.",
    hint: "Put key words where left-aligned scanning begins."
  },
  {
    id: "3",
    front: "See and Hear",
    back: "Combine complementary visuals and spoken words to create dual memory pathways (dual coding) in the brain.",
    hint: "Connect what is seen with what is heard."
  },
  {
    id: "4",
    front: "Make it Personal",
    back: "Connect facts to specific target personas or real-world use cases to make content feel immediately relevant.",
    hint: "Tailor content to the reader's role or interests."
  },
  {
    id: "5",
    front: "Test to Remember",
    back: "Force active recall using interactive micro-quizzes rather than passively re-reading information.",
    hint: "Retrieve memory actively rather than reviewing notes."
  },
  {
    id: "6",
    front: "Design for Portrait",
    back: "Place important content in the center natural eye zone, and interactive CTAs at the bottom for thumb reach.",
    hint: "Optimize layout for mobile physical reach and gaze."
  },
  {
    id: "7",
    front: "Read the Sound",
    back: "Design for muted viewing by syncing visual text overlays and captions with the underlying audio tracks.",
    hint: "Design for the default state where feeds are muted."
  },
  {
    id: "8",
    front: "Hook Them Fast",
    back: "Use sudden, high-contrast visual changes in the first 2-3 seconds to interrupt scroll feeds and capture attention.",
    hint: "Grab attention immediately before the user scrolls away."
  }
];

const LOCAL_STORAGE_KEY = "brief_srs_cards";

function getInitialCards(): SM2Flashcard[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  const now = new Date().toISOString();
  return SAMPLE_CARDS.map(c => ({
    ...c,
    repetition: 0,
    interval: 0,
    easinessFactor: 2.5,
    dueDate: now,
  }));
}

export function calculateMinuteSRSUpdate(card: Pick<SM2Flashcard, "repetition" | "interval" | "easinessFactor">, rating: "again" | "good" | "easy") {
  let q = rating === "again" ? 1 : rating === "good" ? 4 : 5;
  let ef = card.easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  let rep = card.repetition;
  let interval = card.interval;

  if (rating === "again") {
    if (rep > 1) {
      interval = Math.max(1, Math.floor(interval * 0.2));
    } else {
      interval = 1;
    }
    rep = 0;
  } else {
    if (rep === 0) {
      interval = rating === "easy" ? 8 : 3;
    } else if (rep === 1) {
      interval = rating === "easy" ? 20 : 8;
    } else {
      interval = Math.round(interval * ef);
      if (rating === "easy") {
        interval = Math.round(interval * 1.3);
      }
    }
    rep += 1;
  }

  return { interval, repetition: rep, easinessFactor: ef };
}

export function SlideSpaceYourPractice({ slide: _slide }: { slide: SlideItem }) {
  const [cards, setCards] = useState<SM2Flashcard[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [sessionQueue, setSessionQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const initial = getInitialCards();
    setCards(initial);
    
    const nowTime = Date.now();
    const due = initial.filter(c => new Date(c.dueDate).getTime() <= nowTime).map(c => c.id);
    setSessionQueue(due);
    
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && cards.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isClient]);

  const isCompleted = currentIndex >= sessionQueue.length;

  useEffect(() => {
    if (!isClient) return;
    let intervalId: ReturnType<typeof setInterval>;
    if (isCompleted) {
      intervalId = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCompleted, isClient]);

  if (!isClient) return null;
  
  const dueCards = cards.filter(c => new Date(c.dueDate).getTime() <= now);
  
  const activeCardId = sessionQueue[currentIndex];
  const activeCard = cards.find(c => c.id === activeCardId);

  const futureCards = cards.filter(c => new Date(c.dueDate).getTime() > now);
  const nextDueDate = futureCards.length > 0 ? 
    new Date(Math.min(...futureCards.map(c => new Date(c.dueDate).getTime()))) : null;

  const formatTimeUntil = (date: Date) => {
    const diffSecs = (date.getTime() - now) / 1000;
    if (diffSecs < 60) return `in ${Math.max(1, Math.round(diffSecs))}s`;
    const diffMins = Math.round(diffSecs / 60);
    if (diffMins < 60) return `in ${diffMins}m`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `in ${diffHours}h`;
    return `in ${Math.round(diffHours / 24)}d`;
  };

  const getIntervalLabel = (card: SM2Flashcard, rating: "again" | "good" | "easy") => {
    const { interval } = calculateMinuteSRSUpdate(card, rating);
    if (interval < 60) return `${interval}m`;
    const hours = Math.floor(interval / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const handleRate = (rating: "again" | "good" | "easy") => {
    if (!activeCard) return;
    
    const { interval, repetition, easinessFactor } = calculateMinuteSRSUpdate(activeCard, rating);

    const nextDate = new Date();
    nextDate.setMinutes(nextDate.getMinutes() + interval);

    setCards(prev => prev.map(c => 
      c.id === activeCard.id ? {
        ...c,
        easinessFactor,
        repetition,
        interval,
        dueDate: nextDate.toISOString(),
      } : c
    ));

    setIsFlipped(false);
    setShowHint(false);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  return (
    <div className="relative h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <SlideHeader onOpenDrawer={() => setIsDrawerOpen(true)} />
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto max-w-xs">
        {isCompleted ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${dueCards.length > 0 ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-300" : "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300"}`}>
              {dueCards.length > 0 ? (
                <Brain className="w-7 h-7 animate-pulse" />
              ) : (
                <CheckCircle className="w-7 h-7 animate-pulse" />
              )}
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-white">
                {dueCards.length > 0 ? "Time to Review!" : "All Caught Up!"}
              </h4>
              {dueCards.length === 0 && (
                nextDueDate ? (
                  <p className="text-xs text-zinc-400">Next review {formatTimeUntil(nextDueDate)}.</p>
                ) : (
                  <p className="text-xs text-zinc-400">You've mastered these cards.</p>
                )
              )}
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              <button
                disabled={dueCards.length === 0}
                onClick={() => {
                  setSessionQueue(dueCards.map(c => c.id));
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  setShowHint(false);
                }}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  dueCards.length > 0
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                    : "bg-white/5 text-zinc-500 cursor-not-allowed opacity-60 border border-white/5"
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${dueCards.length > 0 ? "fill-white" : "fill-zinc-500 text-zinc-500"}`} />
                {dueCards.length > 0 ? `Review ${dueCards.length} ${dueCards.length === 1 ? 'Card' : 'Cards'}` : "Review Due Cards (0 due)"}
              </button>
              <button
                onClick={() => {
                  setSessionQueue(cards.map(c => c.id));
                  setCurrentIndex(0);
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                Review All (Study Ahead)
              </button>

            </div>
          </div>
        ) : activeCard ? (
          <div className="w-full flex flex-col items-center gap-3.5">
            {/* Cards Counter */}
            <div className="w-full flex justify-center items-center px-1">
              <span className="text-[10px] text-zinc-400 font-medium">Card {currentIndex + 1} of {sessionQueue.length}</span>
            </div>

            {/* 3D Perspective Card Wrapper */}
            <div 
              onClick={() => !isFlipped && setIsFlipped(true)}
              className="w-full h-[180px] cursor-pointer [perspective:1000px] group"
            >
              <div 
                className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Card Front */}
                <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center [backface-visibility:hidden]">
                  {activeCard.hint && !isFlipped && (
                    <div className="absolute top-3 right-3 z-10 flex justify-end max-w-[80%]">
                      {!showHint ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer bg-transparent border-none p-1"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>
                      ) : (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(false);
                          }}
                          className="text-[9px] text-indigo-300/90 font-medium italic text-right bg-white/[0.03] border border-white/10 px-2 py-1 rounded-lg cursor-pointer hover:bg-white/10 hover:text-indigo-200 transition-all select-text animate-in fade-in duration-200"
                        >
                          {activeCard.hint}
                        </div>
                      )}
                    </div>
                  )}
                  <h4 className="text-base font-bold text-white tracking-tight w-full text-center">{activeCard.front}</h4>
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                    <RotateCw className="w-3 h-3" /> Tap to Flip
                  </div>
                </div>

                {/* Card Back */}
                <div className="absolute inset-0 bg-zinc-900 border border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="overflow-y-auto no-scrollbar w-full flex items-center justify-center">
                    <p className="text-xs text-zinc-200 text-center font-medium leading-relaxed">
                      {activeCard.back}
                    </p>
                  </div>
                  <span className="absolute bottom-4 left-0 right-0 text-center text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Answer Revealed</span>
                </div>
              </div>
            </div>

            <div 
              className={`w-full grid grid-cols-3 gap-2 transition-all duration-300 ${
                isFlipped ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <button
                onClick={() => handleRate("again")}
                className="py-2.5 text-[11px] font-bold rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Again
              </button>
              <button
                onClick={() => handleRate("good")}
                className="py-2.5 text-[11px] font-bold rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Good
              </button>
              <button
                onClick={() => handleRate("easy")}
                className="py-2.5 text-[11px] font-bold rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5" />
                Easy
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Full Bottom Drawer Overlay (isDrawerOpen state) */}
      {isDrawerOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end p-0 overflow-hidden animate-in fade-in duration-200">
            {/* Backdrop overlay click to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setIsDrawerOpen(false)} />

            {/* Drawer container: full screen layout centered on screen */}
            <div
              className="relative w-full h-dvh max-w-xl mx-auto bg-black border-x border-white/10 flex flex-col pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 gap-3 animate-in slide-in-from-bottom duration-300 overflow-y-auto no-scrollbar shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto shrink-0 mb-1" />
              <div className="flex items-center justify-between shrink-0 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-300" />
                  <span className="text-xs font-semibold text-white tracking-tight">Spaced Repetition Schedule</span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-stretch pb-12">
                <div className="flex flex-col items-start text-left gap-4 max-w-sm mx-auto w-full px-2">
                  <h4 className="text-2xl font-bold text-white tracking-tight">About Spaced Repetition</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Spaced Repetition Systems (SRS) schedule reviews at optimal intervals. When you struggle to remember, the interval shrinks. When you easily remember, the interval expands. This cements durable memory while saving you time.
                  </p>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 mt-4 w-full">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Card Next Intervals</h5>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="py-1.5 text-[10px] font-bold rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 flex flex-col items-center gap-0.5">
                        <div className="flex flex-row items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          Again
                        </div>
                        <span>({activeCard ? getIntervalLabel(activeCard, "again") : "1m"})</span>
                      </div>
                      <div className="py-1.5 text-[10px] font-bold rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 flex flex-col items-center gap-0.5">
                        <div className="flex flex-row items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Good
                        </div>
                        <span>({activeCard ? getIntervalLabel(activeCard, "good") : "3m"})</span>
                      </div>
                      <div className="py-1.5 text-[10px] font-bold rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400 flex flex-col items-center gap-0.5">
                        <div className="flex flex-row items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          Easy
                        </div>
                        <span>({activeCard ? getIntervalLabel(activeCard, "easy") : "8m"})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

    </div>
  );
}