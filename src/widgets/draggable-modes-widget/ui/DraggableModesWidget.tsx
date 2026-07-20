import type { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripHorizontal } from "lucide-react";

interface DraggableModesWidgetProps {
  coordinates: { x: number; y: number };
  modeSwitcherSlot: ReactNode;
}

export function DraggableModesWidget({ coordinates, modeSwitcherSlot }: DraggableModesWidgetProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "modes-widget",
  });

  const style = {
    transform: `translate3d(${coordinates.x + (transform?.x || 0)}px, ${coordinates.y + (transform?.y || 0)}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-y-3 z-50 bg-card/90 backdrop-blur-md p-3.5 rounded-2xl border border-border/80 shadow-2xl select-none touch-none cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center pb-1 transition-colors flex items-center justify-center gap-x-1 w-full pointer-events-none">
        <GripHorizontal className="h-3.5 w-3.5" />
        Modes
      </div>
      {modeSwitcherSlot}
    </div>
  );
}
