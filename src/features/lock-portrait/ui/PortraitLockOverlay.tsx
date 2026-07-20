import { RotateCcw, Smartphone } from "lucide-react";
import { useOrientationLock } from "../model/useOrientationLock";

export function PortraitLockOverlay() {
  const { isLandscapeMobile } = useOrientationLock();

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-300 ${
        isLandscapeMobile ? "flex opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
      } portrait-guard-media`}
      aria-live="polite"
      role="alert"
    >
      <div className="relative mb-6 flex items-center justify-center">
        {/* Glowing backdrop circle */}
        <div className="absolute h-24 w-24 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
        
        {/* Animated smartphone rotation hint */}
        <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl">
          <Smartphone className="h-10 w-10 text-indigo-400 animate-[bounce_2s_infinite]" />
          <RotateCcw className="absolute h-5 w-5 text-indigo-300 -top-1 -right-1 animate-spin duration-3000" />
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
        Portrait Mode Required
      </h2>

      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Brief is designed exclusively for portrait orientation. Please rotate your device back vertically.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900/60 px-4 py-1.5 border border-neutral-800/80 text-xs text-neutral-400">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
        Waiting for vertical rotation...
      </div>
    </div>
  );
}
