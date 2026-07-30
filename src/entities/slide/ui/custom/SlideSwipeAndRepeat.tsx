import { useState, useRef, useEffect } from "react";
import type { SlideItem } from "~/entities/slide/model/types";
import { Heart, MessageCircle, RotateCw, ArrowUpRight, X } from "lucide-react";

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

  // Clean up double-tap click timer on unmount or mode change
  useEffect(() => {
    return () => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
      }
    };
  }, []);

  // Close drawer automatically when active mode changes
  useEffect(() => {
    setIsDrawerOpen(false);
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
      className="absolute inset-0 z-10 select-none overflow-hidden pointer-events-auto"
      onPointerDown={handlePointerDown}
    >
      {/* Background Gestures / Overlays */}

      {/* DOUBLE TAP: Spawning Hearts */}
      {activeMode === "double-tap" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {hearts.map((h) => (
            <div
              key={h.id}
              className="absolute pointer-events-none animate-fade-up text-red-500 flex flex-col items-center z-40"
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

      {/* LOOP MODE: Progress bar pinned to absolute top & marquee at absolute bottom-16 */}
      {activeMode === "loop" && (
        <>
          {/* Progress bar pinned at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Kinetic Ticker Marquee (Full Width near bottom) */}
          <div className="absolute bottom-16 left-0 right-0 py-3 bg-emerald-950/40 border-y border-emerald-500/20 pointer-events-none z-20 overflow-hidden">
            <div className="inline-block whitespace-nowrap animate-marquee text-sm font-bold text-emerald-300 tracking-wider">
              NEVER STOP LEARNING • REPEAT TO REMEMBER • INSTANT FEEDBACK • NEVER STOP LEARNING • REPEAT TO REMEMBER • INSTANT FEEDBACK • 
            </div>
          </div>
        </>
      )}

      {/* CENTERED CONTENT BLOCK */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs z-30 flex flex-col items-center justify-center text-center gap-3.5 pointer-events-none">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
          Frictionless Micro-Flows
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Select an engagement element below to experience it separately.
        </p>

        {/* Mode Switcher Tabs */}
        <div 
          className="w-full flex bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-xl text-xs font-semibold text-white/70 gap-1 pointer-events-auto shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setActiveMode("double-tap")}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeMode === "double-tap"
                ? "bg-white/20 text-white shadow-sm border border-white/20"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> Double Tap
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("drawer")}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeMode === "drawer"
                ? "bg-white/20 text-white shadow-sm border border-white/20"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Drawer
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("loop")}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeMode === "loop"
                ? "bg-white/20 text-white shadow-sm border border-white/20"
                : "hover:text-white hover:bg-white/5"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Loop
          </button>
        </div>

        {/* Mode Content Area */}
        <div className="w-full pointer-events-auto mt-2">
          
          {/* Double Tap Mode Content */}
          {activeMode === "double-tap" && (
            <div className="flex flex-col items-center gap-3.5 animate-in fade-in duration-200">
              <p className="text-white/80 text-xs font-bold leading-normal">
                Double-tap rapidly anywhere on the screen!
              </p>
              <div 
                className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pop-in"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 animate-pulse" />
                <span className="font-semibold text-xs text-white">{likeCount} Likes</span>
              </div>
            </div>
          )}

          {/* Drawer Mode Content */}
          {activeMode === "drawer" && (
            <div className="w-full animate-in fade-in duration-200">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDrawerOpen(true);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="group relative w-full bg-gradient-to-r from-blue-500/10 to-indigo-500/5 hover:from-blue-500/15 hover:to-indigo-500/10 border border-blue-500/30 hover:border-indigo-400/50 active:scale-[0.98] text-white p-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer outline-none text-left overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-md"
              >
                {/* Internal background glow transition */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Glowing Blue Icon Badge */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/40 text-blue-300 flex items-center justify-center shrink-0 group-hover:from-blue-500/30 group-hover:to-indigo-600/30 group-hover:text-blue-200 group-hover:border-indigo-400/50 shadow-[0_0_12px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-all duration-300">
                  <MessageCircle className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* High-Contrast Premium Typography */}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white tracking-tight leading-snug group-hover:text-blue-100 transition-colors duration-200">
                      View Comments
                    </h4>
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <p className="text-[10px] text-zinc-300 group-hover:text-zinc-200 leading-tight mt-0.5 font-medium transition-colors duration-200">
                    Tap to open the interactive sheet
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Loop Mode Content */}
          {activeMode === "loop" && (
            <div className="w-full animate-in fade-in duration-200">
              <div className="relative w-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-white p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-md text-left overflow-hidden shadow-lg animate-pop-in">
                {/* Glowing Emerald Icon Badge */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-300">
                  <RotateCw className="w-4.5 h-4.5 text-emerald-400 animate-spin [animation-duration:4s]" />
                </div>

                {/* Premium Typography */}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white tracking-tight leading-snug">
                      Seamless Loop Active
                    </h4>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-400/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Loop #{loopCount}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-300 leading-tight mt-0.5 font-medium">
                    Auto-replays feed to increase retention
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DRAWER SHEET Drawer Mode */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[320px] bg-zinc-950/95 border-t border-white/10 backdrop-blur-md text-white p-4 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-auto z-40 ${
          isDrawerOpen && activeMode === "drawer" ? "translate-y-0" : "translate-y-full"
        }`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-sm flex items-center gap-1.5 text-white">
            <MessageCircle className="w-4 h-4 text-blue-400" /> Comments <span className="text-zinc-400 font-normal">(1.2k)</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 text-zinc-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[240px] pb-4 no-scrollbar">
          <div className="text-left text-xs bg-white/5 border border-white/5 p-2.5 rounded-xl text-zinc-300">
            <span className="font-bold text-blue-400 mr-1">user123:</span> Great feature! Non-blocking overlay!
          </div>
          <div className="text-left text-xs bg-white/5 border border-white/5 p-2.5 rounded-xl text-zinc-300">
            <span className="font-bold text-blue-400 mr-1">ux_lead:</span> Keeps feed looping in background.
          </div>
          <div className="text-left text-xs bg-white/5 border border-white/5 p-2.5 rounded-xl text-zinc-300">
            <span className="font-bold text-blue-400 mr-1">react_dev:</span> Clean separation of layout concerns!
          </div>
        </div>
      </div>

    </div>
  );
}