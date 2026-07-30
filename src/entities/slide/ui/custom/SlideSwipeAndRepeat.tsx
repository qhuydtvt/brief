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
    if (activeMode !== "double-tap") return;

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

      setHearts((prev) => [...prev.slice(-15), newHeart]);
      setLikeCount((prev) => prev + 1);
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col justify-between items-center pt-16 pb-6 relative select-none"
      onPointerDown={handlePointerDown}
    >
      {/* Header Container */}
      <div className="w-full flex flex-col items-center gap-3 shrink-0 px-4 z-20">
        {/* Title & Description */}
        <div className="space-y-1 max-w-xs text-center pointer-events-none">
          <h3 className="text-xl font-bold text-white tracking-tight">Frictionless Micro-Flows</h3>
          <p className="text-xs text-white/70 font-medium leading-relaxed">
            Select an engagement element below to experience it separately.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div 
          className="w-full max-w-xs flex bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-xl text-xs font-semibold text-white/70 gap-1 pointer-events-auto shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
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
      </div>

      {/* MODE 1: DOUBLE TAP */}
      {activeMode === "double-tap" && (
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
          <div 
            className="absolute top-24 right-4 bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Heart className="w-3 h-3 fill-red-400" /> {likeCount} Likes
          </div>
          <Sparkles className="w-8 h-8 text-white/40 mb-2 animate-pulse" />
          <p className="text-white/80 text-sm font-bold text-center">
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
              <Heart className="w-12 h-12 fill-red-500 animate-pop-in drop-shadow-md" />
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: BOTTOM DRAWER */}
      {activeMode === "drawer" && (
        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none z-15">
          {/* Drawer trigger button */}
          <div
            className="h-12 bg-white/10 backdrop-blur-md border-t border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors pointer-events-auto z-20 pb-safe"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setIsDrawerOpen(true)}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <div className="w-8 h-1 bg-white/40 rounded-full" />
              Tap to view comments
            </div>
          </div>

          {/* Bottom Drawer Sheet */}
          <div
            className={`absolute inset-x-0 bottom-0 h-[240px] bg-white text-black p-4 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-auto z-40 ${
              isDrawerOpen ? "translate-y-0" : "translate-y-full"
            }`}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-blue-500" /> Comments (1.2k)
              </h4>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold active:scale-90 transition-transform"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[160px] pb-4">
              <div className="text-left text-xs bg-gray-50 p-2.5 rounded-lg">
                <span className="font-bold text-gray-700">user123:</span> Great feature! Non-blocking overlay!
              </div>
              <div className="text-left text-xs bg-gray-50 p-2.5 rounded-lg">
                <span className="font-bold text-gray-700">ux_lead:</span> Keeps feed looping in background.
              </div>
              <div className="text-left text-xs bg-gray-50 p-2.5 rounded-lg">
                <span className="font-bold text-gray-700">react_dev:</span> Clean separation of layout concerns!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: SEAMLESS LOOP */}
      {activeMode === "loop" && (
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-24 pb-20 z-10">
          {/* Progress bar pinned at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loop indicator */}
          <div className="w-full flex justify-between items-center px-6 mt-6">
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

          {/* Kinetic Ticker Marquee (Full Width) */}
          <div className="w-full overflow-hidden py-3 bg-emerald-950/40 border-y border-emerald-500/20 my-auto">
            <div className="inline-block whitespace-nowrap animate-marquee text-sm font-bold text-emerald-300 tracking-wider">
              NEVER STOP LEARNING • REPEAT TO REMEMBER • INSTANT FEEDBACK • NEVER STOP LEARNING • REPEAT TO REMEMBER • INSTANT FEEDBACK • 
            </div>
          </div>
        </div>
      )}
    </div>
  );
}