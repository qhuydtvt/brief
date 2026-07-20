import { useState, useRef, useEffect } from "react";
import type { SlideItem } from "../../model/types";
import { Heart, MessageCircle, RotateCw, Sparkles } from "lucide-react";

type Mode = "double-tap" | "drawer" | "loop";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

export function SlideSwipeAndRepeat({ slide: _slide }: { slide: SlideItem }) {
  const [activeMode, setActiveMode] = useState<Mode>("double-tap");

  // Mode 1: Double-Tap State
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mode 2: Bottom Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mode 3: Seamless Loop State
  const [loopCount, setLoopCount] = useState(1);
  const [progress, setProgress] = useState(0);

  // Auto-play progress for Seamless Loop mode
  useEffect(() => {
    if (activeMode !== "loop") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setLoopCount((lc) => lc + 1);
          return 0;
        }
        return prev + 2.5; // ~2 sec loop cycle
      });
    }, 50);
    return () => clearInterval(interval);
  }, [activeMode]);

  // Double-tap handler
  const handlePointerDown = (e: React.PointerEvent) => {
    clickCount.current += 1;
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotation = Math.random() * 30 - 15;
      const newHeart: FloatingHeart = { id: Date.now() + Math.random(), x, y, rotation };

      setHearts((prev) => [...prev.slice(-5), newHeart]);
      setLikeCount((prev) => prev + 1);
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
    }
  };

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      {/* Title & Description */}
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Frictionless Micro-Flows</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Select an engagement element below to experience it separately.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="w-full max-w-xs flex bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-xl text-xs font-semibold text-white/70 gap-1">
        <button
          onClick={() => setActiveMode("double-tap")}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeMode === "double-tap"
              ? "bg-white/20 text-white shadow-sm border border-white/20"
              : "hover:text-white"
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> Double Tap
        </button>
        <button
          onClick={() => setActiveMode("drawer")}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeMode === "drawer"
              ? "bg-white/20 text-white shadow-sm border border-white/20"
              : "hover:text-white"
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Drawer
        </button>
        <button
          onClick={() => setActiveMode("loop")}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            activeMode === "loop"
              ? "bg-white/20 text-white shadow-sm border border-white/20"
              : "hover:text-white"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Loop
        </button>
      </div>

      {/* Interactive Main Viewport Container */}
      <div className="relative w-full max-w-xs h-[190px] bg-black/30 rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between">
        
        {/* MODE 1: DOUBLE TAP */}
        {activeMode === "double-tap" && (
          <div
            className="relative w-full h-full flex flex-col items-center justify-center touch-none cursor-pointer p-4"
            onPointerDown={handlePointerDown}
          >
            <div className="absolute top-2 right-2 bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-red-400" /> {likeCount} Likes
            </div>
            <Sparkles className="w-6 h-6 text-white/40 mb-1 animate-pulse" />
            <p className="text-white/80 text-xs font-bold text-center">
              Double-tap rapidly anywhere<br />to spawn hearts!
            </p>
            {hearts.map((h) => (
              <div
                key={h.id}
                className="absolute pointer-events-none animate-fade-up text-red-500 flex flex-col items-center"
                style={{
                  left: h.x,
                  top: h.y,
                  transform: `translate(-50%, -50%) rotate(${h.rotation}deg)`
                }}
              >
                <Heart className="w-10 h-10 fill-red-500 animate-pop-in drop-shadow-md" />
              </div>
            ))}
          </div>
        )}

        {/* MODE 2: BOTTOM DRAWER */}
        {activeMode === "drawer" && (
          <div className="relative w-full h-full flex flex-col justify-between">
            <div className="p-3 text-left">
              <p className="text-xs text-white/50 font-semibold">Feed Preview</p>
              <p className="text-sm font-bold text-white mt-1">Interactive Bottom Sheet Drawer</p>
            </div>
            <div
              className="h-10 bg-white/10 backdrop-blur-md border-t border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <div className="w-8 h-1 bg-white/40 rounded-full" />
                Tap to view comments
              </div>
            </div>

            {/* Bottom Drawer Sheet */}
            <div
              className={`absolute inset-x-0 bottom-0 h-[160px] bg-white text-black p-3 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isDrawerOpen ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-xs flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-blue-500" /> Comments (1.2k)
                </h4>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[100px]">
                <div className="text-left text-xs bg-gray-50 p-2 rounded-lg">
                  <span className="font-bold text-gray-700">user123:</span> Great feature! Non-blocking overlay!
                </div>
                <div className="text-left text-xs bg-gray-50 p-2 rounded-lg">
                  <span className="font-bold text-gray-700">ux_lead:</span> Keeps feed looping in background.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: SEAMLESS LOOP */}
        {activeMode === "loop" && (
          <div className="relative w-full h-full flex flex-col justify-between p-3">
            {/* Progress bar at top */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-emerald-400 h-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Loop indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                Auto Replay
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <RotateCw
                  className="w-3.5 h-3.5 text-emerald-400 animate-spin"
                  style={{ animationDuration: '4s' }}
                />
                Loop #{loopCount}
              </span>
            </div>
            {/* Kinetic Ticker Marquee */}
            <div className="w-full overflow-hidden py-2 bg-emerald-950/40 border border-emerald-500/20 rounded-lg">
              <div className="inline-block whitespace-nowrap animate-marquee text-xs font-bold text-emerald-300 tracking-wider">
                NEVER STOP LEARNING • REPEAT TO REMEMBER • INSTANT FEEDBACK • NEVER STOP LEARNING • REPEAT TO REMEMBER • INSTANT FEEDBACK • 
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}