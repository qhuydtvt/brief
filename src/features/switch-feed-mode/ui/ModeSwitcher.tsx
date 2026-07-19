import { Lock, Zap } from "lucide-react";
import { Button } from "~/shared/ui/button";

interface ModeSwitcherProps {
  mode: "static" | "dynamic";
  setMode: (mode: "static" | "dynamic") => void;
}

export function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <Button
        variant={mode === "static" ? "default" : "outline"}
        size="sm"
        onClick={() => setMode("static")}
        className="w-20 justify-center gap-x-1 shadow-sm text-xs h-8 cursor-pointer font-medium"
      >
        <Lock className="h-3.5 w-3.5" />
        Static
      </Button>
      <Button
        variant={mode === "dynamic" ? "default" : "outline"}
        size="sm"
        onClick={() => setMode("dynamic")}
        className="w-20 justify-center gap-x-1 shadow-sm text-xs h-8 cursor-pointer font-medium"
      >
        <Zap className="h-3.5 w-3.5" />
        Dynamic
      </Button>
    </div>
  );
}
