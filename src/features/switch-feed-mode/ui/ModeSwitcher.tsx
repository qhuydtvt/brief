import { Eye, Pencil } from "lucide-react";
import { Button } from "~/shared/ui/button";

interface ModeSwitcherProps {
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
}

export function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <Button
        variant={mode === "view" ? "default" : "outline"}
        size="sm"
        onClick={() => setMode("view")}
        className="w-20 justify-center gap-x-1 shadow-sm text-xs h-8 cursor-pointer font-medium"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </Button>
      <Button
        variant={mode === "edit" ? "default" : "outline"}
        size="sm"
        onClick={() => setMode("edit")}
        className="w-20 justify-center gap-x-1 shadow-sm text-xs h-8 cursor-pointer font-medium"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
}
