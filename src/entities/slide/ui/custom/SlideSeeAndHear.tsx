import { useState } from "react";
import type { SlideItem } from "../../model/types";
import { Image as ImageIcon } from "lucide-react";

export function SlideSeeAndHear({ slide: _slide }: { slide: SlideItem }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">See and Hear</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Combine visuals and words. Dual coding builds double the memory pathways in the brain.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div 
      className="relative w-full max-w-[200px] aspect-[4/3] cursor-pointer group"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="w-full h-auto transition-transform duration-700 relative"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 backface-hidden bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-4xl font-black text-white text-center">
            Apple
          </span>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center justify-center p-8"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
        >
          <ImageIcon className="w-24 h-24 text-red-400 mb-4" />
          <span className="text-2xl font-bold text-white">Apple</span>
        </div>
      </div>
      
      <p className="text-white/60 text-xs text-center mt-4">
        Tap to flip
      </p>
    </div>
      </div>
    </div>
  );
}