import { useState } from "react";
import { AlignJustify, List } from "lucide-react";
import type { SlideItem } from "../../model/types";

export function SlideLessIsMore({ slide: _slide }: { slide: SlideItem }) {
  const [isChunked, setIsChunked] = useState(false);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-0.5 max-w-xs shrink-0">
        <h3 className="text-lg font-black text-white tracking-tight">Less is More</h3>
        <p className="text-[11px] text-white/60 font-medium leading-normal">
          Attention is a scarce resource. Ditch text walls and chunk ideas into single takeaways.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
        {/* Scrollable Text Box */}
        <div className="w-full max-h-[160px] overflow-y-auto no-scrollbar p-0.5 flex flex-col shrink-0">
          <div 
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 py-2.5 border border-white/20 transition-all duration-500 ease-in-out w-full flex-grow flex flex-col justify-center min-h-[120px]
              ${isChunked ? "space-y-2.5" : "space-y-1"}
            `}
          >
            {isChunked ? (
              <ul className="space-y-2.5 text-left">
                <li className="text-white text-base font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                  Focus on one idea.
                </li>
                <li className="text-white text-base font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                  Keep it simple.
                </li>
                <li className="text-white text-base font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                  Use clear typography.
                </li>
              </ul>
            ) : (
              <p className="text-white/80 text-xs leading-relaxed text-left">
                When designing a slide, you should try to focus on one main idea per slide. Do not clutter it with too much text, as it will distract your audience from what you are saying. Keep your messaging simple, and use clear typography so that everyone can easily read the points you are trying to make without straining their eyes.
              </p>
            )}
          </div>
        </div>

        {/* Permanently Visible Action Button */}
        <div className="shrink-0 pb-1">
          <button 
            onClick={() => setIsChunked(!isChunked)}
            className="flex items-center gap-2 py-2 px-5 text-sm bg-white text-black font-bold rounded-full active:scale-95 transition-transform"
          >
            {isChunked ? <AlignJustify className="w-5 h-5" /> : <List className="w-5 h-5" />}
            {isChunked ? "Unchunk" : "Chunk It!"}
          </button>
        </div>
      </div>
    </div>
  );
}