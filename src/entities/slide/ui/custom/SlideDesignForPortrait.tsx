import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import type { SlideItem } from "~/entities/slide/model/types";
import { X, Layout, Hand, Smartphone, Sparkles, AlertTriangle, GripVertical, ArrowUpRight } from "lucide-react";

type Position = "top" | "center" | "bottom";

export function SlideDesignForPortrait({ slide: _slide }: { slide: SlideItem }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position>("center");
  const [cardPosY, setCardPosY] = useState(0);
  const [isDraggingCard, setIsDraggingCard] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startPosY = useRef(0);

  const ergonomicsNotes = {
    top: {
      zoneLabel: "TOP ZONE (0–30%)",
      title: "Eye Jump Fatigue",
      badgeText: "FATIGUE",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      accentBorder: "border-amber-500/30",
      activeBg: "bg-amber-950/20",
      textColor: "text-zinc-300",
      description:
        "Requires upper vertical eye movement and re-focusing. Hard to reach with one hand during single-handed phone usage.",
    },
    center: {
      zoneLabel: "CENTER ZONE (30–70%)",
      title: "Zero-Effort Focal Sweep",
      badgeText: "NATURAL FOCUS",
      icon: Sparkles,
      iconColor: "text-zinc-200",
      accentBorder: "border-white/20",
      activeBg: "bg-zinc-900/60",
      textColor: "text-zinc-300",
      description:
        "Primary focal zone where user eye gaze naturally rests first (capturing ~80%+ attention) with zero physical strain.",
    },
    bottom: {
      zoneLabel: "BOTTOM ZONE (70–100%)",
      title: "Ergonomic Thumb Reach",
      badgeText: "OPTIMAL REACH",
      icon: Hand,
      iconColor: "text-emerald-400",
      accentBorder: "border-emerald-500/40",
      activeBg: "bg-emerald-950/20",
      textColor: "text-zinc-200",
      description:
        "Optimal thumb sweep zone for 1-handed phone operation. Perfect for interactive CTAs, navigation, and primary controls.",
    },
  };

  const currentNote = ergonomicsNotes[selectedPosition];
  const NoteIcon = currentNote.icon;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingCard(true);
    startY.current = e.clientY;
    startPosY.current = cardPosY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCard) return;
    const deltaY = e.clientY - startY.current;

    if (viewportRef.current) {
      const vh = viewportRef.current.clientHeight;
      const cardH = 110;
      const maxMove = Math.max(20, (vh - cardH) / 2 - 12);

      let newY = startPosY.current + deltaY;
      if (newY > maxMove) newY = maxMove;
      if (newY < -maxMove) newY = -maxMove;

      setCardPosY(newY);

      // Thresholds to switch position state
      if (newY < -maxMove * 0.35) {
        setSelectedPosition("top");
      } else if (newY > maxMove * 0.35) {
        setSelectedPosition("bottom");
      } else {
        setSelectedPosition("center");
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingCard) {
      setIsDraggingCard(false);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  return (
    <div className="relative h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3.5 select-none min-h-0">
      {/* Base Slide View Header */}
      <div className="space-y-1.5 max-w-xs shrink-0">
        <h3 className="text-xl font-semibold text-white tracking-tight">Design for Portrait</h3>
        <p className="text-xs text-zinc-400 font-normal leading-relaxed">
          Optimize content placement for mobile viewports, thumb reach, and natural eye-gaze patterns.
        </p>
      </div>

      {/* Minimalist Ultra-Clean CTA Card */}
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="group relative w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 active:scale-[0.98] text-white p-3.5 rounded-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer outline-none text-left overflow-hidden shadow-lg backdrop-blur-md"
        >
          {/* High-Contrast Icon Badge */}
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors duration-200">
            <Smartphone className="w-4.5 h-4.5 text-white/90 group-hover:scale-110 transition-transform duration-200" />
          </div>

          {/* High-Contrast Minimal Typography */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-semibold text-white tracking-tight leading-snug">
                Explore Content Placement
              </h4>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors duration-200" />
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5 font-normal">
              Test vertical ergonomics in full 9:16 mode
            </p>
          </div>
        </button>
      </div>

      {/* Full Bottom Drawer Overlay (isDrawerOpen state) */}
      {isDrawerOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end p-0 overflow-hidden animate-in fade-in duration-200">
            {/* Backdrop overlay click to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setIsDrawerOpen(false)} />

            {/* Drawer container: full-height 100dvh overlay */}
            <div
              className="relative w-full h-dvh max-w-xl mx-auto bg-black border-x border-white/10 flex flex-col pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 sm:px-5 gap-2.5 animate-in slide-in-from-bottom duration-300 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Header Handle Bar */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto shrink-0 mb-1" />

              {/* Header Row */}
              <div className="flex items-center justify-between shrink-0 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-zinc-300" />
                  <h4 className="text-xs font-semibold text-white tracking-tight">Viewport Ergonomics Sandbox</h4>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated 9:16 Mobile Phone Viewport (Drag & Drop Arena) */}
              <div
                ref={viewportRef}
                className="flex-1 min-h-0 w-full bg-zinc-950 border border-white/15 rounded-3xl p-3 flex flex-col justify-between relative overflow-hidden shadow-2xl touch-none"
              >
                {/* Phone Status Bar Top */}
                <div className="flex items-center justify-between px-2 pt-0.5 pb-2 text-[10px] font-mono text-zinc-500 shrink-0 border-b border-white/5 z-0 pointer-events-none">
                  <span>9:41</span>
                  <div className="w-10 h-2 bg-white/15 rounded-full" />
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-3.5 h-2 border border-zinc-600 rounded-xs flex items-center p-0.5">
                      <div className="w-full h-full bg-zinc-400 rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Vertical Zone Indicators (Background Guides) */}
                <div className="absolute inset-x-3 top-10 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                  <div className={`h-1/3 border-b border-dashed border-white/10 transition-colors duration-300 flex items-start pt-1 px-2 ${selectedPosition === "top" ? "bg-amber-500/5" : ""}`}>
                    <span className={`text-[9px] font-mono tracking-wider ${selectedPosition === "top" ? "text-amber-400 font-semibold" : "text-zinc-600"}`}>
                      01 / TOP ZONE (HARD REACH)
                    </span>
                  </div>
                  <div className={`h-1/3 border-b border-dashed border-white/10 transition-colors duration-300 flex items-start pt-1 px-2 ${selectedPosition === "center" ? "bg-white/5" : ""}`}>
                    <span className={`text-[9px] font-mono tracking-wider ${selectedPosition === "center" ? "text-zinc-200 font-semibold" : "text-zinc-600"}`}>
                      02 / CENTER ZONE (EYE SWEEP)
                    </span>
                  </div>
                  <div className={`h-1/3 transition-colors duration-300 flex items-start pt-1 px-2 ${selectedPosition === "bottom" ? "bg-emerald-500/5" : ""}`}>
                    <span className={`text-[9px] font-mono tracking-wider ${selectedPosition === "bottom" ? "text-emerald-400 font-semibold" : "text-zinc-600"}`}>
                      03 / BOTTOM ZONE (THUMB REACH)
                    </span>
                  </div>
                </div>

                {/* Draggable Card Area */}
                <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ transform: `translateY(${cardPosY}px)` }}
                    className={`absolute z-10 w-full max-w-[280px] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col gap-2.5 cursor-grab active:cursor-grabbing select-none transition-colors duration-300 bg-zinc-900/90 ${currentNote.accentBorder}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <NoteIcon className={`w-4 h-4 ${currentNote.iconColor} shrink-0`} />
                        <span className="text-[9px] font-mono font-medium tracking-widest px-2 py-0.5 rounded bg-white/10 text-zinc-200 uppercase border border-white/10">
                          {currentNote.badgeText}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <span className="text-[9px] font-mono uppercase tracking-wider">
                          {selectedPosition}
                        </span>
                        <GripVertical className="w-3.5 h-3.5 opacity-70" />
                      </div>
                    </div>

                    <h5 className="text-xs font-semibold text-white leading-tight tracking-tight">
                      {currentNote.title}
                    </h5>

                    <p className={`text-[11px] leading-relaxed font-normal ${currentNote.textColor}`}>
                      {currentNote.description}
                    </p>
                  </div>
                </div>

                {/* Phone Home Indicator Bar Bottom */}
                <div className="shrink-0 pt-1 z-0 pointer-events-none">
                  <div className="w-24 h-1 bg-white/20 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}