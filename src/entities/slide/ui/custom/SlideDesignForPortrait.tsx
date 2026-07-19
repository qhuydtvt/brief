import { useState, useRef } from "react";
import type { SlideItem } from "../../model/types";

export function SlideDesignForPortrait({ slide: _slide }: { slide: SlideItem }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ y: 0 });
  const [isInZone, setIsInZone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startPos = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startPos.current = position.y;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY.current;
    
    if (containerRef.current) {
      const containerH = containerRef.current.clientHeight;
      const itemH = 64; // approx height of the draggable item
      const maxMove = containerH / 2 - itemH / 2;
      const minMove = -containerH / 2 + itemH / 2;
      
      let newY = startPos.current + deltaY;
      if (newY > maxMove) newY = maxMove;
      if (newY < minMove) newY = minMove;
      
      setPosition({ y: newY });

      // Calculate if in central 30-70% zone
      // Central 40% of container -> between -containerH*0.2 and +containerH*0.2
      const threshold = containerH * 0.2;
      setIsInZone(Math.abs(newY) < threshold);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Design for Portrait</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Place key information in the central focal zone where users naturally look first.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div 
      ref={containerRef}
      className="relative w-full h-[140px] border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center overflow-hidden touch-none"
    >
      {/* Target Zone Indicator */}
      <div className={`absolute left-0 right-0 h-[40%] top-[30%] transition-colors duration-300 ${isInZone ? "bg-green-500/20" : "bg-white/5"}`} />
      <div className="absolute right-2 top-[50%] -translate-y-1/2 text-[10px] text-white/30 uppercase tracking-widest font-bold rotate-90 origin-right">
        Thumb Zone
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ transform: `translateY(${position.y}px)` }}
        className={`
          absolute z-10 w-[80%] p-4 rounded-xl font-bold text-center cursor-grab active:cursor-grabbing select-none
          transition-all duration-200
          ${isInZone 
            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-105" 
            : "bg-white/20 text-white backdrop-blur-md"
          }
        `}
      >
        Drag me to the center!
      </div>
    </div>
      </div>
    </div>
  );
}