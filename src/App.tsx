import { useEffect, useState } from "react";
import { 
  Sparkles, 
  Code2, 
  Layers, 
  BookOpen, 
  Github, 
  Sun, 
  Moon,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface PlanItem {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  // Local state for interactive features planner
  const [plans, setPlans] = useState<PlanItem[]>(() => {
    const saved = localStorage.getItem("brief_plans");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: "1", text: "Customize styling in src/styles/globals.css", completed: false },
      { id: "2", text: "Create new components under src/components", completed: false },
      { id: "3", text: "Configure client routing or state management", completed: false },
    ];
  });
  const [newPlanText, setNewPlanText] = useState("");

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync plans
  useEffect(() => {
    localStorage.setItem("brief_plans", JSON.stringify(plans));
  }, [plans]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const addPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanText.trim()) return;
    const newPlan: PlanItem = {
      id: Date.now().toString(),
      text: newPlanText.trim(),
      completed: false,
    };
    setPlans((prev) => [...prev, newPlan]);
    setNewPlanText("");
  };

  const togglePlan = (id: string) => {
    setPlans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background dark:from-indigo-950/20" />
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Brief
            </span>
          </div>

          <div className="flex items-center gap-x-4">
            <a
              href="https://github.com/dan5py/react-vite-shadcn-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-y-16">
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center gap-y-4 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-3 py-1 text-xs gap-x-1 border border-border/50">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
            Vite + React 19 + Tailwind v4 + shadcn/ui
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent leading-none">
            Ready for Development
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mt-2 leading-relaxed">
            Welcome to your clean workspace. The environment is optimized with ESLint, path aliases, Tailwind v4, and Radix UI.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Clean Structure</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Start editing <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">src/App.tsx</code> to see live updates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 dark:text-pink-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Preconfigured UI</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Components are available in <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">src/components/ui</code>.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Tailwind v4</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Harness lightning-fast builds with the new Tailwind compiler engine.
            </p>
          </div>
        </section>

        {/* Action / Widget Area */}
        <section className="max-w-2xl mx-auto w-full border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Project Setup Checklist</h2>
              <p className="text-xs text-muted-foreground mt-1">Keep track of your setup tasks as you build.</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {plans.filter(p => p.completed).length} / {plans.length} Done
            </Badge>
          </div>

          <form onSubmit={addPlan} className="flex gap-x-2 mb-6">
            <input
              type="text"
              value={newPlanText}
              onChange={(e) => setNewPlanText(e.target.value)}
              placeholder="Add a setup task (e.g., install React Router)..."
              className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button type="submit" size="sm" className="h-9 gap-x-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </form>

          <div className="space-y-3">
            {plans.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-background/40 hover:bg-background/80 transition-all duration-200 group/item"
              >
                <div
                  className="flex items-center gap-x-3 cursor-pointer flex-1"
                  onClick={() => togglePlan(item.id)}
                >
                  <CheckCircle2
                    className={`h-5 w-5 transition-colors ${
                      item.completed
                        ? "text-emerald-500 fill-emerald-500/10"
                        : "text-muted-foreground/30 hover:text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm transition-all duration-200 ${
                      item.completed ? "line-through text-muted-foreground/60" : "text-foreground"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePlan(item.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-all duration-200 opacity-0 group-hover/item:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {plans.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                All checklist items completed! Add new tasks to keep planning.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 bg-background/50">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-y-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div>
            Built with React, Vite & Tailwind CSS.
          </div>
          <div className="flex gap-x-4">
            <a
              href="https://ui.shadcn.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-x-0.5"
            >
              shadcn/ui Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

