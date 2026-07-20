import { useState, useRef, useEffect } from "react";
import type { SlideItem } from "../../model/types";
import { Apple, Bell, Bird, Volume2 } from "lucide-react";

type ItemType = "apple" | "bell" | "bird";

const ITEMS: Record<ItemType, { name: string; Icon: any; color: string; soundUrl: string }> = {
  apple: { name: "Apple", Icon: Apple, color: "text-red-400", soundUrl: "/sounds/apple.mp3" },
  bell: { name: "Bell", Icon: Bell, color: "text-yellow-400", soundUrl: "/sounds/bell.mp3" },
  bird: { name: "Bird", Icon: Bird, color: "text-blue-400", soundUrl: "/sounds/bird.mp3" },
};

export function SlideSeeAndHear({ slide: _slide }: { slide: SlideItem }) {
  const [selectedItem, setSelectedItem] = useState<ItemType>("apple");
  const [visualOn, setVisualOn] = useState(false);
  const [auditoryOn, setAuditoryOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bothOn = visualOn && auditoryOn;

  const speakItemName = (itemName: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(itemName);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const handleAudioPlay = () => {
    if (!auditoryOn) return;
    
    setIsPlaying(true);
    const item = ITEMS[selectedItem];

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = item.soundUrl;
      audioRef.current.onended = () => speakItemName(item.name);
      audioRef.current.onerror = () => speakItemName(item.name);
      audioRef.current.play().catch((err) => {
        console.error("Audio play error", err);
        speakItemName(item.name);
      });
    } else {
      speakItemName(item.name);
    }
  };

  useEffect(() => {
    // When auditory turns on or selected item changes while auditory is on, play sound
    if (auditoryOn) {
      handleAudioPlay();
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [auditoryOn, selectedItem]);

  const activeItem = ITEMS[selectedItem];
  const ActiveIcon = activeItem.Icon;

  // For waveform animation
  const heights = [60, 100, 40, 80, 50];

  return (
    <div className="h-full w-full flex flex-col justify-start items-center p-4 text-center gap-4 select-none min-h-0 overflow-hidden">
      <div className="space-y-1 w-full shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">See and Hear</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed max-w-[280px] mx-auto">
          Combine visuals and words. Dual coding builds double the memory pathways in the brain.
        </p>
      </div>

      <div className="flex gap-2 w-full justify-center shrink-0">
        {(Object.keys(ITEMS) as ItemType[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedItem(key)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              selectedItem === key
                ? "bg-white/20 border-white/40 text-white font-semibold"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            {ITEMS[key].name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-[280px] flex-1 min-h-[180px] flex flex-col items-center justify-center relative">
        <div 
          className={`w-full h-full rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden p-6 ${
            bothOn 
              ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/40 shadow-[0_0_30px_rgba(99,102,241,0.2)]" 
              : visualOn
              ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              : auditoryOn
              ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              : "bg-white/5 border-white/10 backdrop-blur-md"
          }`}
        >
          {/* Channel Badge */}
          {bothOn && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-indigo-500/80 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce whitespace-nowrap shadow-lg">
              🧠 Dual Coding Active
            </div>
          )}
          {!bothOn && !visualOn && !auditoryOn && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/10 text-white/70 text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border border-white/10">
              📝 Text Channel
            </div>
          )}
          {!bothOn && visualOn && !auditoryOn && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border border-indigo-500/30">
              👁️ Image Channel
            </div>
          )}
          {!bothOn && !visualOn && auditoryOn && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-purple-500/20 text-purple-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border border-purple-500/30">
              🔊 Sound Channel
            </div>
          )}

          {/* Main Display Content */}
          <div className="flex flex-col items-center justify-center gap-3 mt-4">
            {/* 1. Plain Text Channel (No modes active) */}
            {!visualOn && !auditoryOn && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl font-extrabold text-white tracking-wide drop-shadow-md">
                  {activeItem.name}
                </span>
                <span className="text-[11px] text-white/40 font-medium">Plain Text Word</span>
              </div>
            )}

            {/* 2. Visual / Image Channel (Visual mode active, Auditory off) */}
            {visualOn && !auditoryOn && (
              <div className="flex flex-col items-center gap-2">
                <ActiveIcon className={`w-20 h-20 ${activeItem.color} drop-shadow-[0_0_15px_currentColor] transition-all duration-300`} strokeWidth={1.5} />
                <span className="text-[11px] text-indigo-200/60 font-medium">Visual Representation</span>
              </div>
            )}

            {/* 3. Sound Channel (Auditory mode active, Visual off) */}
            {!visualOn && auditoryOn && (
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
                  <Volume2 className={`w-7 h-7 ${isPlaying ? "animate-pulse text-purple-200" : "text-purple-300/70"}`} />
                </div>
                <div className="flex items-end gap-1 h-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 bg-purple-300/80 rounded-full transition-all duration-300 ${isPlaying ? "opacity-100" : "opacity-40"}`}
                      style={{
                        height: isPlaying ? `${heights[i]}%` : '4px',
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-purple-200/60 font-medium">Auditory Sound</span>
              </div>
            )}

            {/* 4. Dual Coding (Both Visual and Auditory active) */}
            {bothOn && (
              <div className="flex flex-col items-center gap-2">
                <ActiveIcon className={`w-16 h-16 ${activeItem.color} drop-shadow-[0_0_15px_currentColor] transition-all duration-300`} strokeWidth={1.5} />
                <span className="text-2xl font-bold text-white tracking-tight">{activeItem.name}</span>
                <div className="flex items-end gap-1 h-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 bg-white/80 rounded-full transition-all duration-300 ${isPlaying ? "opacity-100" : "opacity-50"}`}
                      style={{
                        height: isPlaying ? `${heights[i]}%` : '4px',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full justify-center shrink-0 mt-2 mb-4">
        <button
          onClick={() => setVisualOn(!visualOn)}
          className={`flex-1 max-w-[120px] py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            visualOn 
              ? "bg-indigo-500/20 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] font-semibold" 
              : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
          }`}
        >
          <span className="text-xl">👁️</span>
          <span className="text-xs font-semibold">Visual</span>
        </button>
        <button
          onClick={() => setAuditoryOn(!auditoryOn)}
          className={`flex-1 max-w-[120px] py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            auditoryOn 
              ? "bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] font-semibold" 
              : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
          }`}
        >
          <span className="text-xl">🔊</span>
          <span className="text-xs font-semibold">Auditory</span>
        </button>
      </div>

      <audio ref={audioRef} className="hidden" preload="auto" />
    </div>
  );
}