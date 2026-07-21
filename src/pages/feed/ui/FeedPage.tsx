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

  // Draggable widget coordinate offset state with localStorage persistence
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brief_modes_widget_pos");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
            return parsed;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return { x: 0, y: 0 };
  });

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
    setCoordinates((prev) => {
      const next = {
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      };
      try {
        localStorage.setItem("brief_modes_widget_pos", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const currentSlides = mode === "view" ? staticSlides : dynamicSlides;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <PortraitLockOverlay />
      <div className="h-dvh w-full bg-black text-foreground transition-colors duration-300 font-sans relative overflow-hidden">
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
        <main className="w-full h-full flex items-center justify-center relative">
          <div className="w-full h-full md:aspect-[9/16] md:h-[85vh] md:max-h-[880px] md:max-w-[440px] md:rounded-[36px] md:border md:border-white/15 md:shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
            <MobileSimulatorFeed 
              slides={currentSlides}
              mode={mode}
              likedSlides={likedSlides}
              onLike={handleLike}
              onScroll={handleScroll}
            />
          </div>
        </main>
      </div>
    </DndContext>
  );
}
export default FeedPage;
