import type { ReactNode } from "react";
import { Badge } from "~/shared/ui/badge";
import type { SlideItem } from "../model/types";

import {
  SlideLessIsMore,
  SlideSeeAndHear,
  SlideTestToRemember,
  SlideSpaceYourPractice,
  SlideMakeItPersonal,
  SlideDesignForPortrait,
  SlideFrontloadKeywords,
  SlideReadTheSound,
  SlideHookThemFast,
  SlideSwipeAndRepeat
} from "./custom";

interface SlideCardProps {
  slide: SlideItem;
  index: number;
  totalSlides: number;
  mode: "view" | "edit";
  saveButtonSlot: ReactNode;
  shareButtonSlot: ReactNode;
}

export function SlideCard({
  slide,
  index,
  totalSlides,
  mode: _mode,
  saveButtonSlot,
  shareButtonSlot
}: SlideCardProps) {

  const renderCustomContent = () => {
    switch (slide.id) {
      case 's1': return <SlideLessIsMore slide={slide} />;
      case 's2': return <SlideSeeAndHear slide={slide} />;
      case 's3': return <SlideTestToRemember slide={slide} />;
      case 's4': return <SlideSpaceYourPractice slide={slide} />;
      case 's5': return <SlideMakeItPersonal slide={slide} />;
      case 's6': return <SlideDesignForPortrait slide={slide} />;
      case 's7': return <SlideFrontloadKeywords slide={slide} />;
      case 's8': return <SlideReadTheSound slide={slide} />;
      case 's9': return <SlideHookThemFast slide={slide} />;
      case 's10': return <SlideSwipeAndRepeat slide={slide} />;
      default: return (
        <div className="my-auto flex flex-col items-center text-center space-y-4 px-4 py-8 bg-black/20 backdrop-blur-[2px] rounded-2xl border border-white/10 w-full">
          <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-white shadow-inner animate-bounce">
            <span className="text-xl">✨</span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">{slide.title}</h3>
          <p className="text-xs text-white/70 leading-relaxed font-medium">{slide.description}</p>
        </div>
      );
    }
  };

  return (
    <div className={`h-full w-full shrink-0 snap-start bg-gradient-to-br ${slide.bgColor} relative`}>
      {/* Outer Card (Yellow border/tint) */}
      <div className="mx-auto w-full max-w-lg h-full z-10 relative overflow-hidden px-3 pt-8 pb-3">
        
        {/* Top Info (Red Block) */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
          <Badge className="bg-white/10 text-white border-none backdrop-blur-sm text-[10px] px-2 py-0.5">
            {slide.title}
          </Badge>
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
            Slide {index + 1} / {totalSlides}
          </span>
        </div>

        {/* Center Card (Blue Block) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xs z-30 flex flex-col items-center justify-center">
          {renderCustomContent()}
        </div>

        {/* Bottom Metadata Overlay (Green Block, Left) */}
        <div className="absolute bottom-6 left-3 max-w-[65%] z-20 bg-black/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-white text-left space-y-2">
          <div className="flex items-center gap-x-2">
            <div className="h-6 w-6 rounded-full bg-indigo-500 border border-white/30 flex items-center justify-center text-[10px] font-black text-white shadow">
              B
            </div>
            <span className="text-xs font-bold text-white">@brief_dev</span>
          </div>
          {!slide.id.startsWith("s") && (
            <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
              {slide.description}
            </p>
          )}
          <span className="text-[10px] font-bold text-indigo-300 block">
            {slide.tag}
          </span>
        </div>

        {/* Floating Actions Bar (Pink/Red Block, Right) */}
        <div className="absolute bottom-6 right-0 z-40 flex flex-col items-center gap-y-4 text-white bg-transparent p-2 shrink-0">
          {saveButtonSlot}
          {shareButtonSlot}
        </div>
      </div>
    </div>
  );
}
