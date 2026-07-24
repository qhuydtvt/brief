import { useState } from "react";
import { createPortal } from "react-dom";
import type { SlideItem } from "../../model/types";
import { ChevronRight, ChevronLeft, Brain, X, ArrowUpRight, HelpCircle } from "lucide-react";

interface Quiz {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
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
  },
];

export function SlideTestToRemember({ slide: _slide }: { slide: SlideItem }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const activeQuiz = QUIZZES[currentIndex];
  const isAnswered = selectedOptionId !== null;

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setCurrentIndex((prev) => (prev + 1) % QUIZZES.length);
  };

  const handlePrev = () => {
    setSelectedOptionId(null);
    setCurrentIndex((prev) => (prev - 1 + QUIZZES.length) % QUIZZES.length);
  };

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
              className="relative w-full h-dvh max-w-xl mx-auto bg-black border-x border-white/10 flex flex-col pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] px-2.5 sm:px-4 gap-2 animate-in slide-in-from-bottom duration-300 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Handle Bar */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto shrink-0 mb-0.5" />

              {/* Drawer Header Row */}
              <div className="flex items-center justify-between shrink-0 pb-1.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-300" />
                  <h4 className="text-xs font-semibold text-white tracking-tight">Active Recall Micro-Quiz</h4>
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
              <div className="flex-1 min-h-0 w-full bg-zinc-950 rounded-3xl p-3 sm:p-4 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-2xl">
                
                {/* Top Badge Row */}
                <div className="w-full text-left shrink-0 mb-1">
                  <span className="text-[10px] font-mono font-medium tracking-wider text-indigo-300 uppercase px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30 inline-block">
                    Question {currentIndex + 1} of {QUIZZES.length}
                  </span>
                </div>

                {/* Central Space: Question & Options */}
                <div className="flex flex-col gap-3.5 w-full flex-1 justify-center my-auto">
                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug text-center mb-1.5 px-1">
                    {activeQuiz.question}
                  </h3>

                  <div className="flex flex-col gap-3.5 w-full">
                    {activeQuiz.options.map((option, index) => {
                      const isSelected = selectedOptionId === option.id;
                      const letter = ["A", "B", "C", "D"][index];
                      let btnStyle = "bg-white/5 hover:bg-white/15 border-white/10 text-white";
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

                {/* Micro-Explanation & Bottom Navigation */}
                <div className="w-full shrink-0 pt-2 flex flex-col items-center gap-3 mt-2">
                  <div className="min-h-[36px] w-full flex items-center justify-center">
                    {isAnswered && (
                      <div className="px-3 py-2 bg-emerald-500/10 rounded-xl w-full text-center border border-emerald-500/20 animate-fadeIn">
                        <p className="text-xs text-emerald-300 font-medium leading-normal">
                          {activeQuiz.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Previous question"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-1.5">
                      {QUIZZES.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${idx === currentIndex ? 'bg-white scale-110' : 'bg-white/20'}`} 
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Next question"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
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