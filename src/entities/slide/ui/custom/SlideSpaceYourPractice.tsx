import { useState } from "react";
import type { SlideItem } from "../../model/types";
import { RotateCw, CheckCircle, AlertOctagon, Star, Sparkles, RefreshCw } from "lucide-react";

function SlideHeader() {
  return (
    <div className="space-y-1 max-w-xs shrink-0">
      <h3 className="text-xl font-bold text-white tracking-tight">Space Your Practice</h3>
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

const SAMPLE_CARDS: Flashcard[] = [
  { 
    id: "1", 
    front: "Spaced Repetition", 
    back: "Reviewing key ideas with increasing intervals to build durable memory pathways.", 
    hint: "Think intervals" 
  },
  { 
    id: "2", 
    front: "Active Recall", 
    back: "Forcing the brain to retrieve information rather than passively re-reading notes.", 
    hint: "Retrieval practice" 
  },
  { 
    id: "3", 
    front: "Decay Rate", 
    back: "The speed at which memories fade, which slows down after successful review sessions.", 
    hint: "Memory half-life" 
  }
];

export function SlideSpaceYourPractice({ slide: _slide }: { slide: SlideItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const activeCard = SAMPLE_CARDS[currentIndex];

  const handleRate = (_rating: "again" | "good" | "easy") => {
    setIsFlipped(false);
    setShowHint(false);
    
    if (currentIndex < SAMPLE_CARDS.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setCompleted(true);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setCompleted(false);
  };

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <SlideHeader />
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto max-w-xs">
        {completed ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-white">Review Complete!</h4>
              <p className="text-[10px] text-zinc-400 mt-1">You reviewed all {SAMPLE_CARDS.length} terms.</p>
            </div>
            <button
              onClick={handleRestart}
              className="mt-2 w-full py-1.5 rounded-xl bg-white text-black text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Review Again
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-3.5">
            {/* Cards Counter */}
            <div className="w-full flex justify-between items-center px-1">
              <span className="text-[10px] text-zinc-400 font-medium">Card {currentIndex + 1} of {SAMPLE_CARDS.length}</span>
              {activeCard.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  {showHint ? "Hide Hint" : "Need Hint?"}
                </button>
              )}
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

            {/* Hint Area */}
            {showHint && (
              <div className="w-full text-center py-1.5 px-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] text-indigo-300 font-medium italic">Hint: {activeCard.hint}</p>
              </div>
            )}

            {/* Self-Rating Row */}
            <div 
              className={`w-full grid grid-cols-3 gap-2 transition-all duration-300 ${
                isFlipped ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <button
                onClick={() => handleRate("again")}
                className="py-1.5 text-[10px] font-bold rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all flex flex-col items-center gap-0.5 cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Again
              </button>
              <button
                onClick={() => handleRate("good")}
                className="py-1.5 text-[10px] font-bold rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center gap-0.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Good
              </button>
              <button
                onClick={() => handleRate("easy")}
                className="py-1.5 text-[10px] font-bold rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 active:scale-95 transition-all flex flex-col items-center gap-0.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5" />
                Easy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}