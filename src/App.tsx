import { useEffect, useState } from "react";
import { 
  Sparkles, 
  Sun, 
  Moon,
  Lock,
  Zap,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  PlusSquare,
  GripHorizontal
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DndContext, useDraggable, type DragEndEvent } from "@dnd-kit/core";

interface SlideItem {
  id: string;
  bgColor: string;
  title: string;
  description: string;
  tag: string;
  likes: number;
  comments: number;
  shares: number;
}

interface DraggableModesWidgetProps {
  mode: "static" | "dynamic";
  setMode: (mode: "static" | "dynamic") => void;
  coordinates: { x: number; y: number };
}

function DraggableModesWidget({ mode, setMode, coordinates }: DraggableModesWidgetProps) {
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
      className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-y-3 z-50 bg-card/90 backdrop-blur-md p-3.5 rounded-2xl border border-border/80 shadow-2xl select-none touch-none"
    >
      <div
        {...listeners}
        {...attributes}
        className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center pb-1 cursor-grab active:cursor-grabbing hover:text-foreground transition-colors flex items-center justify-center gap-x-1 w-full"
      >
        <GripHorizontal className="h-3.5 w-3.5" />
        Modes
      </div>
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
    </div>
  );
}

function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  // Mode state: static vs dynamic
  const [mode, setMode] = useState<"static" | "dynamic">("static");

  // Draggable widget coordinate offset state
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  // Liked slides set (to toggle color state)
  const [likedSlides, setLikedSlides] = useState<Set<string>>(new Set());

  // Static Slides data
  const staticSlides: SlideItem[] = [
    {
      id: "s1",
      bgColor: "from-purple-900 via-indigo-950 to-black",
      title: "Welcome to Brief",
      description: "A premium mobile emulator viewport styled in 9:16 aspect ratio. Swipe or scroll down to explore.",
      tag: "#react19 #vite7",
      likes: 1240,
      comments: 89,
      shares: 45
    },
    {
      id: "s2",
      bgColor: "from-indigo-950 via-slate-900 to-black",
      title: "Tailwind CSS v4",
      description: "Powered by the brand new lightning-fast CSS engine. Full custom-variant dark modes support.",
      tag: "#tailwind #styling",
      likes: 980,
      comments: 64,
      shares: 30
    },
    {
      id: "s3",
      bgColor: "from-emerald-950 via-zinc-900 to-black",
      title: "shadcn/ui Layout",
      description: "Includes Radix primitives, tailwind-merge, and clean configurations in components.json.",
      tag: "#shadcn #radix",
      likes: 1450,
      comments: 112,
      shares: 78
    }
  ];

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
    return [
      {
        id: "d1",
        bgColor: "from-orange-600 via-pink-600 to-indigo-950",
        title: "Dynamic Feed Mode",
        description: "Add new slides from state or local storage. Use custom titles, tags, and gradients.",
        tag: "#builder #dynamic",
        likes: 420,
        comments: 24,
        shares: 12
      }
    ];
  });

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col font-sans relative overflow-x-hidden">
        {/* Scrollbar hide helper */}
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background dark:from-indigo-950/20 pointer-events-none" />
        
        {/* Floating Right Modes Widget */}
        <DraggableModesWidget mode={mode} setMode={setMode} coordinates={coordinates} />

        {/* Navigation */}
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                Brief
              </span>
            </div>

            <div className="flex items-center gap-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-md h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
          
          {/* Mobile Viewport Container */}
          <div className="relative h-[85vh] max-h-[880px] aspect-[9/16] max-w-[95vw] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden bg-black flex flex-col select-none border border-border/80">
            
            {/* 9:16 Scroll-Snap Feed Viewport */}
            <div className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar h-full w-full relative">
              {currentSlides.map((slide, index) => {
                const isLiked = likedSlides.has(slide.id);
                return (
                  <div 
                    key={slide.id} 
                    className={`h-full w-full shrink-0 snap-start bg-gradient-to-br ${slide.bgColor} relative flex flex-col justify-between p-6 pb-8`}
                  >
                    {/* Top title info inside mobile view */}
                    <div className="flex justify-between items-center z-10">
                      <Badge className="bg-white/10 text-white border-none backdrop-blur-sm text-[10px] px-2 py-0.5">
                        {mode === "static" ? "Static Feed" : "Dynamic Feed"}
                      </Badge>
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                        Slide {index + 1} / {currentSlides.length}
                      </span>
                    </div>

                    {/* Middle Card Preview/Mockup Illustration */}
                    <div className="my-auto flex flex-col items-center text-center space-y-4 px-4 py-8 z-10 bg-black/10 backdrop-blur-[2px] rounded-2xl border border-white/5">
                      <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-white shadow-inner animate-bounce">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-white">{slide.title}</h3>
                      <p className="text-xs text-white/70 leading-relaxed font-medium">{slide.description}</p>
                    </div>

                    {/* Bottom overlay (Metadata + Side buttons) */}
                    <div className="flex justify-between items-end gap-x-4 z-10 relative">
                      
                      {/* Left: Metadata info */}
                      <div className="space-y-2 text-white text-left flex-1 max-w-[70%]">
                        <div className="flex items-center gap-x-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-500 border border-white/30 flex items-center justify-center text-[10px] font-black text-white shadow">
                            B
                          </div>
                          <span className="text-xs font-bold text-white">@brief_dev</span>
                        </div>
                        <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
                          {slide.description}
                        </p>
                        <span className="text-[10px] font-bold text-indigo-300 block">
                          {slide.tag}
                        </span>
                        
                        {/* Audio track ticker mock */}
                        <div className="flex items-center gap-x-1.5 text-[9px] text-white/60 bg-white/5 backdrop-blur-sm px-2 py-1 rounded-full w-fit">
                          <Music className="h-3 w-3 animate-spin [animation-duration:8s]" />
                          <span className="truncate max-w-[120px] font-medium">Original Sound - Brief</span>
                        </div>
                      </div>

                      {/* Right: Actions icons group */}
                      <div className="flex flex-col items-center gap-y-4 text-white z-20 shrink-0">
                        {/* Like */}
                        <button 
                          onClick={() => handleLike(slide.id)} 
                          className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none"
                        >
                          <div className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 active:scale-95 transition-all">
                            <Heart className={`h-5 w-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
                          </div>
                          <span className="text-[10px] font-bold shadow-sm">{slide.likes + (isLiked ? 1 : 0)}</span>
                        </button>

                        {/* Comment */}
                        <button className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none">
                          <div className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 active:scale-95 transition-all">
                            <MessageCircle className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-[10px] font-bold shadow-sm">{slide.comments}</span>
                        </button>

                        {/* Save */}
                        <button className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none">
                          <div className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 active:scale-95 transition-all">
                            <Bookmark className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-[10px] font-bold shadow-sm">Save</span>
                        </button>

                        {/* Share */}
                        <button className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none">
                          <div className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 active:scale-95 transition-all">
                            <Share2 className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-[10px] font-bold shadow-sm">{slide.shares}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}

              {currentSlides.length === 0 && (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 text-white/50 space-y-2 bg-neutral-950">
                  <PlusSquare className="h-10 w-10 mb-2 opacity-50" />
                  <span className="text-sm font-semibold">Feed is empty</span>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </DndContext>
  );
}

export default App;
