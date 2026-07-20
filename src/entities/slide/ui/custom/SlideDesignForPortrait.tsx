import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import type { SlideItem } from "~/entities/slide/model/types";
import { X, Layout, Hand, Smartphone, Sparkles, AlertTriangle, GripVertical } from "lucide-react";

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
      title: "Top Zone (0-30%): Eye Jump Fatigue",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/20 border-amber-400/40",
      textColor: "text-amber-100",
      description:
        "Requires upper vertical eye movement and re-focusing. Hard to reach with one hand during single-handed phone usage.",
    },
    center: {
      title: "Center Zone (30-70%): Zero-Effort Natural Focal Sweep",
      icon: Sparkles,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/20 border-emerald-400/40",
      textColor: "text-emerald-100",
      description:
        "Primary focal zone where user eye gaze naturally rests first (capturing ~80%+ attention) with zero physical strain.",
    },
    bottom: {
      title: "Bottom Zone (70-100%): Ergonomic Thumb Reach",
      icon: Hand,
      iconColor: "text-indigo-400",
      bgColor: "bg-indigo-500/20 border-indigo-400/40",
      textColor: "text-indigo-100",
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
    <div className="relative h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      {/* Base Slide View Header */}
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Design for Portrait</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Optimize content placement for mobile viewports, thumb reach, and natural eye-gaze patterns.
        </p>
      </div>

      {/* Streamlined Interactive Action Button */}
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="group relative w-full bg-slate-900/90 hover:bg-slate-800/90 backdrop-blur-md border border-emerald-500/40 hover:border-emerald-400/70 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] active:scale-[0.98] text-white p-3.5 rounded-xl transition-all duration-200 flex items-center gap-3 cursor-pointer outline-none text-left overflow-hidden"
        >
          {/* Subtle ambient light glow */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-300 pointer-events-none" />

          {/* Glowing Emerald Icon Badge */}
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-200">
            <Smartphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
          </div>

          {/* Balanced Typography Text Block */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
              Explore how content placements affect retention
            </h4>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
              Test vertical ergonomics in full viewport mode
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
              className="relative w-full h-dvh max-w-xl mx-auto bg-slate-900 border-x border-white/10 flex flex-col pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 sm:px-5 gap-2.5 animate-in slide-in-from-bottom duration-300 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Header Handle Bar */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto shrink-0 mb-1" />

              {/* Header Row */}
              <div className="flex items-center justify-between shrink-0 pb-1 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white tracking-tight">Mobile Viewport Ergonomics</h4>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated 9:16 Mobile Phone Viewport (Drag & Drop Arena) */}
              <div
                ref={viewportRef}
                className="flex-1 min-h-0 w-full bg-slate-950 border border-white/20 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden shadow-inner touch-none"
              >
                {/* Phone Status Bar Top */}
                <div className="flex items-center justify-between px-2 pt-0.5 pb-1.5 text-[10px] font-mono text-white/50 shrink-0 border-b border-white/5 z-0 pointer-events-none">
                  <span>9:41</span>
                  <div className="w-10 h-2 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-3.5 h-2 border border-white/50 rounded-xs flex items-center p-0.5">
                      <div className="w-full h-full bg-white/70 rounded-xs" />
                    </div>
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
                    className={`absolute z-10 w-full max-w-[275px] p-3.5 rounded-xl border shadow-xl flex flex-col gap-2 cursor-grab active:cursor-grabbing select-none transition-colors duration-200 ${currentNote.bgColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <NoteIcon className={`w-4 h-4 ${currentNote.iconColor} shrink-0`} />
                        <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-xs uppercase bg-white/15 text-white">
                          DRAG ME VERTICALLY
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono font-bold text-white/70 uppercase">
                          {selectedPosition}
                        </span>
                        <GripVertical className="w-3.5 h-3.5 text-white/50" />
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-white leading-tight">
                      {currentNote.title}
                    </h5>

                    <p className={`text-[10px] leading-relaxed ${currentNote.textColor}`}>
                      {currentNote.description}
                    </p>
                  </div>
                </div>

                {/* Phone Home Indicator Bar Bottom */}
                <div className="shrink-0 pt-1.5 z-0 pointer-events-none">
                  <div className="w-24 h-1 bg-white/30 rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}