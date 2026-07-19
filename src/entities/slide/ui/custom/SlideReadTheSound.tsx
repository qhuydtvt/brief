import { useState, useEffect } from "react";
import type { SlideItem } from "../../model/types";
import { Play } from "lucide-react";

export function SlideReadTheSound({ slide: _slide }: { slide: SlideItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordIndex, setWordIndex] = useState(-1);

  const text = "Audio is optional. Design for mute.";
  const words = text.split(" ");

  useEffect(() => {
    if (isPlaying) {
      if (wordIndex < words.length) {
        const timer = setTimeout(() => {
          setWordIndex(prev => prev + 1);
        }, 400); // speed of words
        return () => clearTimeout(timer);
      } else {
        const resetTimer = setTimeout(() => {
          setIsPlaying(false);
          setWordIndex(-1);
        }, 1500);
        return () => clearTimeout(resetTimer);
      }
    }
  }, [isPlaying, wordIndex, words.length]);

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Read the Sound</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          80% of feeds are muted. Sync text overlays with audio to capture eyes instantly.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="flex flex-col items-center justify-center h-[100px] w-full relative">
      {!isPlaying && wordIndex === -1 ? (
        <button 
          onClick={() => {
            setIsPlaying(true);
            setWordIndex(0);
          }}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform"
        >
          <Play className="w-8 h-8 ml-1" />
        </button>
      ) : (
        <div className="text-3xl font-black leading-tight text-white text-center h-16 flex items-center justify-center">
          {wordIndex >= 0 && wordIndex < words.length && (
            <span className="animate-pop-in inline-block">
              {words[wordIndex]}
            </span>
          )}
        </div>
      )}
    </div>
      </div>
    </div>
  );
}