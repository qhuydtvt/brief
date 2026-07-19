import { useState, useEffect } from "react";
import type { SlideItem } from "../../model/types";
import { BatteryCharging } from "lucide-react";

export function SlideSpaceYourPractice({ slide: _slide }: { slide: SlideItem }) {
  const [memoryLevel, setMemoryLevel] = useState(100);
  const [decayRate, setDecayRate] = useState(10); // How much to lose every second

  useEffect(() => {
    if (memoryLevel <= 0) return;
    
    const interval = setInterval(() => {
      setMemoryLevel((prev) => Math.max(0, prev - decayRate));
    }, 1000);
    return () => clearInterval(interval);
  }, [memoryLevel, decayRate]);

  const handleReview = () => {
    setMemoryLevel(100);
    setDecayRate((prev) => Math.max(1, prev * 0.6)); // Slow down decay with each review
  };

  const getBatteryColor = () => {
    if (memoryLevel > 50) return "bg-green-400";
    if (memoryLevel > 20) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Space Your Practice</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Review key ideas right before they fade to cement durable neural pathways.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="flex flex-col items-center justify-center space-y-3 w-full">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">Memory Meter</h3>
        <p className="text-xs text-white/70">Review to strengthen retention!</p>
      </div>

      <div className="w-full max-w-[200px] h-10 bg-white/10 border-2 border-white/30 rounded-lg p-1 relative overflow-hidden flex">
        <div 
          className={`h-auto rounded-sm transition-all duration-1000 ease-linear ${getBatteryColor()}`}
          style={{ width: `${memoryLevel}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold drop-shadow-md">
          {Math.round(memoryLevel)}%
        </div>
      </div>

      <button 
        onClick={handleReview}
        className="px-4 py-1.5 text-sm rounded-full bg-white text-black font-black active:scale-95 transition-transform flex items-center gap-2"
      >
        <BatteryCharging className="w-5 h-5" />
        Review Now
      </button>
    </div>
      </div>
    </div>
  );
}