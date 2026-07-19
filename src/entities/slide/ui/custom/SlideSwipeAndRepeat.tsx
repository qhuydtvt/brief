import { useState, useRef } from "react";
import type { SlideItem } from "../../model/types";
import { Heart, MessageCircle } from "lucide-react";

export function SlideSwipeAndRepeat({ slide: _slide }: { slide: SlideItem }) {
  const [heartPos, setHeartPos] = useState<{ x: number, y: number, id: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    clickCount.current += 1;
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      // Double tap detected
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setHeartPos({ x, y, id: Date.now() });
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
    }
  };

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Swipe and Repeat</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Keep learners hooked using double-taps, bottom drawers, and seamless loop design.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="relative w-full h-[180px] bg-black/20 rounded-2xl overflow-hidden border border-white/10 flex flex-col">
      
      {/* Background Double Tap Area */}
      <div 
        className="flex-1 relative touch-none cursor-pointer"
        onPointerDown={handlePointerDown}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <p className="text-white/60 text-sm font-bold text-center">
            Double tap anywhere<br />to like!
          </p>
        </div>

        {/* Floating Heart */}
        {heartPos && (
          <div 
            key={heartPos.id}
            className="absolute pointer-events-none animate-fade-up text-red-500 flex flex-col items-center"
            style={{ 
              left: heartPos.x, 
              top: heartPos.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Heart className="w-12 h-12 fill-red-500 animate-pop-in" />
          </div>
        )}
      </div>

      {/* Swipe up Drawer Area */}
      <div 
        className="h-12 bg-white/10 backdrop-blur-md border-t border-white/20 flex items-center justify-center cursor-pointer"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <div className="w-12 h-1.5 bg-white/30 rounded-full" />
      </div>

      {/* Drawer */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-[200px] bg-white text-black p-4 rounded-t-3xl shadow-xl
        transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isDrawerOpen ? "translate-y-0" : "translate-y-full"}
      `}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments (1.2k)
          </h3>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4 overflow-y-auto max-h-[120px] pr-2">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 shrink-0" />
            <div>
              <p className="text-xs font-bold text-black/50">user123</p>
              <p className="text-sm font-medium">This is so addictive!</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-100 shrink-0" />
            <div>
              <p className="text-xs font-bold text-black/50">design_guru</p>
              <p className="text-sm font-medium">Smooth animations 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}