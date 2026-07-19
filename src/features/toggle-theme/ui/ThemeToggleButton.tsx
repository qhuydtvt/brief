import { Sun, Moon } from "lucide-react";
import { Button } from "~/shared/ui/button";
import { useTheme } from "../model/useTheme";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-md h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
