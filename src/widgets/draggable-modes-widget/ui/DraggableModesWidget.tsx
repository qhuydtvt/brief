import { useState, useRef, useEffect } from "react";
import type { ReactNode, MouseEvent } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripHorizontal, ChevronDown, ChevronUp } from "lucide-react";

interface DraggableModesWidgetProps {
  coordinates: { x: number; y: number };
  modeSwitcherSlot: ReactNode;
}

export function DraggableModesWidget({ coordinates, modeSwitcherSlot }: DraggableModesWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const wasDraggingRef = useRef(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: "modes-widget",
  });

  useEffect(() => {
    if (isDragging) {
      wasDraggingRef.current = true;
    }
  }, [isDragging]);

  const setCombinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    widgetRef.current = node;
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${coordinates.x + (transform?.x || 0)}px, ${coordinates.y + (transform?.y || 0)}px, 0)`,
    willChange: isDragging ? "transform" : "auto",
  };

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: Event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded]);

  const handleClick = (e: MouseEvent) => {
    if (wasDraggingRef.current) {
      wasDraggingRef.current = false;
      return;
    }

    // Do not toggle if clicking an interactive button inside when expanded
    const target = e.target as HTMLElement;
    if (isExpanded && target.closest("button") && !target.closest(".widget-header-handle")) {
      return;
    }

    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      ref={setCombinedRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 bg-card/90 backdrop-blur-md border border-border/80 shadow-2xl select-none touch-none cursor-grab active:cursor-grabbing hover:border-primary/50 ${
        isDragging
          ? "transition-none shadow-indigo-500/20"
          : "transition-[padding,border-radius,background-color,border-color,box-shadow] duration-200 ease-out"
      } ${isExpanded ? "p-3.5 gap-y-3 rounded-2xl" : "px-3.5 py-2.5 rounded-full"}`}
    >
      {!isExpanded ? (
        <div className="flex items-center gap-x-2 text-xs font-semibold text-foreground pointer-events-none">
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
          <span>Modes</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="widget-header-handle text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center pb-1 transition-colors flex items-center justify-center gap-x-1.5 w-full cursor-pointer hover:text-foreground">
            <GripHorizontal className="h-3.5 w-3.5" />
            <span>Modes</span>
            <ChevronUp className="h-3 w-3" />
          </div>
          {modeSwitcherSlot}
        </>
      )}
    </div>
  );
}

