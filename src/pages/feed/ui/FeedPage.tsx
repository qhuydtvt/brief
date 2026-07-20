import { useState, useRef, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { Header } from "~/widgets/header";
import { MobileSimulatorFeed } from "~/widgets/mobile-simulator-feed";
import { DraggableModesWidget } from "~/widgets/draggable-modes-widget";
import { ThemeToggleButton } from "~/features/toggle-theme";
import { ModeSwitcher } from "~/features/switch-feed-mode";
import { PortraitLockOverlay } from "~/features/lock-portrait";
import { staticSlides, defaultDynamicSlides } from "~/entities/slide";
import type { SlideItem } from "~/entities/slide";

export function FeedPage() {
  // Mode state: view vs edit
  const [mode, setMode] = useState<"view" | "edit">("view");

  // Dnd Sensors configuration for instant response and smooth tap detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Header visibility state (hidden by default, shown during scroll)
  const [headerVisible, setHeaderVisible] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHeaderHoveredRef = useRef(false);

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

  const handleScroll = () => {
    setHeaderVisible(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (!isHeaderHoveredRef.current) {
        setHeaderVisible(false);
      }
    }, 1500);
  };

  const handleHeaderMouseEnter = () => {
    isHeaderHoveredRef.current = true;
    setHeaderVisible(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleHeaderMouseLeave = () => {
    isHeaderHoveredRef.current = false;
    scrollTimeoutRef.current = setTimeout(() => {
      setHeaderVisible(false);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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

  const currentSlides = mode === "view" ? staticSlides : dynamicSlides;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <PortraitLockOverlay />
      <div className="h-dvh w-full bg-background text-foreground transition-colors duration-300 font-sans relative overflow-hidden">

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
        <Header 
          visible={headerVisible}
          actionSlot={<ThemeToggleButton />}
          onMouseEnter={handleHeaderMouseEnter}
          onMouseLeave={handleHeaderMouseLeave}
        />

        {/* Main Content Area */}
        <main className="w-full h-full relative">
          <MobileSimulatorFeed 
            slides={currentSlides}
            mode={mode}
            likedSlides={likedSlides}
            onLike={handleLike}
            onScroll={handleScroll}
          />
        </main>
      </div>
    </DndContext>
  );
}
export default FeedPage;
