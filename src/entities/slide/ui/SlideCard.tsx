import type { ReactNode } from "react";
import { Music } from "lucide-react";
import { Badge } from "~/shared/ui/badge";
import type { SlideItem } from "../model/types";

import {
  SlideLessIsMore,
  SlideSeeAndHear,
  SlideTestToRemember,
  SlideSpaceYourPractice,
  SlideMakeItPersonal,
  SlideDesignForPortrait,
  SlideKeepWithinReach,
  SlideReadTheSound,
  SlideHookThemFast,
  SlideSwipeAndRepeat
} from "./custom";

interface SlideCardProps {
  slide: SlideItem;
  index: number;
  totalSlides: number;
  mode: "static" | "dynamic";
  likeButtonSlot: ReactNode;
  commentButtonSlot: ReactNode;
  saveButtonSlot: ReactNode;
  shareButtonSlot: ReactNode;
}

export function SlideCard({
  slide,
  index,
  totalSlides,
  mode: _mode,
  likeButtonSlot,
  commentButtonSlot,
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
      case 's7': return <SlideKeepWithinReach slide={slide} />;
      case 's8': return <SlideReadTheSound slide={slide} />;
      case 's9': return <SlideHookThemFast slide={slide} />;
      case 's10': return <SlideSwipeAndRepeat slide={slide} />;
      default: return (
        <div className="my-auto flex flex-col items-center text-center space-y-4 px-4 py-8 bg-black/10 backdrop-blur-[2px] rounded-2xl border border-white/5 w-full">
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
      <div className="mx-auto w-full max-w-lg h-full flex flex-col justify-between px-3 pt-8 pb-3 z-10 relative overflow-hidden">
        {/* Top Info */}
        <div className="flex justify-between items-center shrink-0 w-full">
          <Badge className="bg-white/10 text-white border-none backdrop-blur-sm text-[10px] px-2 py-0.5">
            {slide.title}
          </Badge>
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
            Slide {index + 1} / {totalSlides}
          </span>
        </div>

        {/* Center Card */}
        <div className="flex-1 w-full grid place-items-center min-h-0 overflow-y-auto no-scrollbar py-2">
          <div className="w-full flex flex-col items-center py-2">
            {renderCustomContent()}
          </div>
        </div>

        {/* Bottom Actions Overlay */}
        <div className="flex justify-between items-end gap-x-4 relative shrink-0 w-full">
          {/* Metadata Description */}
          <div className="space-y-2 text-white text-left flex-1 max-w-[70%]">
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
            <div className="flex items-center gap-x-1.5 text-[9px] text-white/60 bg-white/5 backdrop-blur-sm px-2 py-1 rounded-full w-fit">
              <Music className="h-3 w-3 animate-spin [animation-duration:8s]" />
              <span className="truncate max-w-[120px] font-medium">Original Sound - Brief</span>
            </div>
          </div>

          {/* Vertical Action Bar */}
          <div className="flex flex-col items-center gap-y-4 text-white shrink-0">
            {likeButtonSlot}
            {commentButtonSlot}
            {saveButtonSlot}
            {shareButtonSlot}
          </div>
        </div>
      </div>
    </div>
  );
}
