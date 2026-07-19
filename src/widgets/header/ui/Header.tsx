import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  actionSlot?: ReactNode;
}

export function Header({ actionSlot }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-transparent">
      <div className="flex h-11 w-full items-center justify-between px-6">
        <div className="flex items-center gap-x-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            Brief
          </span>
        </div>

        {actionSlot && (
          <div className="flex items-center gap-x-3">
            {actionSlot}
          </div>
        )}
      </div>
    </header>
  );
}
