import { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Header } from "~/widgets/header";
import { MobileSimulatorFeed } from "~/widgets/mobile-simulator-feed";
import { DraggableModesWidget } from "~/widgets/draggable-modes-widget";
import { ThemeToggleButton } from "~/features/toggle-theme";
import { ModeSwitcher } from "~/features/switch-feed-mode";
import { staticSlides, defaultDynamicSlides } from "~/entities/slide";
import type { SlideItem } from "~/entities/slide";

export function FeedPage() {
  // Mode state: static vs dynamic
  const [mode, setMode] = useState<"static" | "dynamic">("static");

  // Draggable widget coordinate offset state
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  // Liked slides set (to toggle color state)
  const [likedSlides, setLikedSlides] = useState<Set<string>>(new Set());

  // Dynamic Slides state
  const [dynamicSlides] = useState<SlideItem[]>(() => {
    const saved = localStorage.getItem("brief_mobile_slides");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultDynamicSlides;
  });

  const handleLike = (id: string) => {
    setLikedSlides((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setCoordinates((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  };

  const currentSlides = mode === "static" ? staticSlides : dynamicSlides;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-full w-full bg-background text-foreground transition-colors duration-300 font-sans relative overflow-hidden">

        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background dark:from-indigo-950/20 pointer-events-none" />
        
        {/* Floating Right Modes Widget */}
        <DraggableModesWidget 
          coordinates={coordinates} 
          modeSwitcherSlot={
            <ModeSwitcher mode={mode} setMode={setMode} />
          } 
        />

        {/* Navigation */}
        <Header actionSlot={<ThemeToggleButton />} />

        {/* Main Content Area */}
        <main className="w-full h-full relative">
          <MobileSimulatorFeed 
            slides={currentSlides}
            mode={mode}
            likedSlides={likedSlides}
            onLike={handleLike}
          />
        </main>
      </div>
    </DndContext>
  );
}
export default FeedPage;
