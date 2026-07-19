import { useState } from "react";
import type { SlideItem } from "../../model/types";
import { Hand } from "lucide-react";

export function SlideKeepWithinReach({ slide: _slide }: { slide: SlideItem }) {
  const [isFixed, setIsFixed] = useState(false);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Keep Within Reach</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Put action buttons in the bottom third thumb zone for effortless, one-handed taps.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="relative w-full h-[130px] bg-white/5 rounded-2xl overflow-hidden border border-white/10">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <p className="text-white/60 text-sm text-center mb-4">
          Key interactions should be in the bottom-right "thumb zone".
        </p>
        <button 
          onClick={() => setIsFixed(true)}
          className="text-xs bg-white/20 px-4 py-2 rounded-full text-white font-bold active:scale-95"
        >
          Fix Layout
        </button>
      </div>

      <button
        className={`
          absolute w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg
          transition-all duration-700 ease-in-out
          ${isFixed ? "bottom-4 right-4" : "top-4 left-4"}
        `}
        style={{ zIndex: 20 }}
      >
        <Hand className="w-6 h-6" />
      </button>
    </div>
      </div>
    </div>
  );
}