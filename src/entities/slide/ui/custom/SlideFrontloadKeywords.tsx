import { useState } from "react";
import type { SlideItem } from "../../model/types";
import { ScanEye } from "lucide-react";

export function SlideFrontloadKeywords({ slide: _slide }: { slide: SlideItem }) {
  const [isFrontloaded, setIsFrontloaded] = useState(false);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Front-load Keywords</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Mobile readers scan vertically along the left edge. Front-load high-impact terms to make scanning 10x faster.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
        <div className="relative w-full h-[180px] bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex">
          {/* Left scanning zone highlight */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-red-500/20 border-r-2 border-red-500/50 flex flex-col items-center justify-center gap-2">
             <div className="w-4 h-4 rounded-full bg-red-500/50 animate-pulse"></div>
          </div>
          
          <div className="flex-1 pl-12 pr-4 py-4 flex flex-col justify-center gap-3 text-left">
            <p className="text-xs text-white/80 leading-snug">
              {isFrontloaded ? (
                <><strong>Chunk text</strong> to improve scannability.</>
              ) : (
                <>You should try to <strong>chunk text</strong> to improve scannability.</>
              )}
            </p>
            <p className="text-xs text-white/80 leading-snug">
              {isFrontloaded ? (
                <><strong>Use portrait ratios</strong> to avoid letterboxing.</>
              ) : (
                <>It is best to <strong>use portrait ratios</strong> to avoid letterboxing.</>
              )}
            </p>
            <p className="text-xs text-white/80 leading-snug">
              {isFrontloaded ? (
                <><strong>Test active recall</strong> using micro-quizzes.</>
              ) : (
                <>We recommend to <strong>test active recall</strong> using micro-quizzes.</>
              )}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsFrontloaded(!isFrontloaded)}
          className="text-xs bg-white/20 px-4 py-2 rounded-full text-white font-bold active:scale-95 flex items-center gap-2"
        >
          <ScanEye className="w-4 h-4" />
          {isFrontloaded ? "Reset Text" : "Simulate Scanning"}
        </button>
      </div>
    </div>
  );
}
