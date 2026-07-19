import { useState, useEffect } from "react";
import type { SlideItem } from "../../model/types";

export function SlideTestToRemember({ slide: _slide }: { slide: SlideItem }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAnswer === "incorrect") {
      const timer = setTimeout(() => setSelectedAnswer(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer]);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Test to Remember</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Don't just re-read notes. Force active recall using quick, low-stakes micro-quizzes.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="flex flex-col items-center justify-center w-full space-y-2">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Quick Quiz</h3>
        <p className="text-sm text-white/70">What is the capital of France?</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[240px]">
        <button
          onClick={() => setSelectedAnswer("incorrect")}
          className={`w-full py-1.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            selectedAnswer === "incorrect" 
              ? "bg-red-500/80 text-white animate-shake" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Berlin
        </button>
        <button
          onClick={() => setSelectedAnswer("correct")}
          className={`w-full py-1.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            selectedAnswer === "correct" 
              ? "bg-green-500/80 text-white" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Paris
        </button>
      </div>
    </div>
      </div>
    </div>
  );
}