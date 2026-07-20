import { PlusSquare, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { SlideCard } from "~/entities/slide";
import type { SlideItem } from "~/entities/slide";
import { LikeButton } from "~/features/like-slide";

interface MobileSimulatorFeedProps {
  slides: SlideItem[];
  mode: "view" | "edit";
  likedSlides: Set<string>;
  onLike: (id: string) => void;
  onScroll?: () => void;
}

export function MobileSimulatorFeed({ slides, mode, likedSlides, onLike, onScroll }: MobileSimulatorFeedProps) {
  return (
    <div 
      onScroll={onScroll}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black select-none relative"
    >
      {slides.map((slide, index) => {
        const isLiked = likedSlides.has(slide.id);

        return (
          <SlideCard
            key={slide.id}
            slide={slide}
            index={index}
            totalSlides={slides.length}
            mode={mode}
            likeButtonSlot={
              <LikeButton
                isLiked={isLiked}
                likesCount={slide.likes}
                onClick={() => onLike(slide.id)}
              />
            }
            commentButtonSlot={
              <button className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none">
                <div className="h-10 w-10 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold shadow-sm">{slide.comments}</span>
              </button>
            }
            saveButtonSlot={
              <button className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none">
                <div className="h-10 w-10 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all">
                  <Bookmark className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold shadow-sm">Save</span>
              </button>
            }
            shareButtonSlot={
              <button className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none">
                <div className="h-10 w-10 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold shadow-sm">{slide.shares}</span>
              </button>
            }
          />
        );
      })}

      {slides.length === 0 && (
        <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 text-white/50 space-y-2 bg-neutral-950">
          <PlusSquare className="h-10 w-10 mb-2 opacity-50" />
          <span className="text-sm font-semibold">Feed is empty</span>
        </div>
      )}
    </div>
  );
}
