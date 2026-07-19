import { useState, useEffect } from "react";
import type { SlideItem } from "../../model/types";

export function SlideHookThemFast({ slide: _slide }: { slide: SlideItem }) {
  const [isHooked, setIsHooked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHooked(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Hook Them Fast</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Interrupt the scroll feed in the first 3 seconds with sudden visual changes.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="relative w-full h-[130px] flex items-center justify-center overflow-hidden">
      <div className={`
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        flex flex-col items-center justify-center text-center
        ${isHooked 
          ? "scale-110 -rotate-3 bg-white text-black p-8 rounded-3xl" 
          : "scale-100 rotate-0 text-white"
        }
      `}>
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          {isHooked ? "Boom!" : "Wait for it..."}
        </h2>
        {isHooked && (
          <p className="text-sm mt-2 font-bold opacity-70">
            You have 2 seconds to hook them.
          </p>
        )}
      </div>
    </div>
      </div>
    </div>
  );
}