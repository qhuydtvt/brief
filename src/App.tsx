import { useEffect, useState } from "react";
import { 
  Sparkles, 
  Github, 
  Sun, 
  Moon,
  Plus,
  Trash2,
  Lock,
  Zap,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  Home,
  Search,
  MessageSquare,
  User,
  PlusSquare,
  Volume2,
  ExternalLink
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

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
  const [dynamicSlides, setDynamicSlides] = useState<SlideItem[]>(() => {
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
        description: "Add new slides from the left panel controls. Use custom titles, tags, and gradients.",
        tag: "#builder #dynamic",
        likes: 420,
        comments: 24,
        shares: 12
      }
    ];
  });

  // Slide builder inputs
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTag, setNewTag] = useState("");
  const [gradientType, setGradientType] = useState("sunset");

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

  // Sync dynamic slides
  useEffect(() => {
    localStorage.setItem("brief_mobile_slides", JSON.stringify(dynamicSlides));
  }, [dynamicSlides]);

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

  const addSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let bgColor = "from-purple-900 via-indigo-950 to-black";
    if (gradientType === "sunset") bgColor = "from-orange-600 via-pink-600 to-indigo-950";
    else if (gradientType === "ocean") bgColor = "from-cyan-600 via-blue-800 to-slate-950";
    else if (gradientType === "cyberpunk") bgColor = "from-purple-600 via-fuchsia-800 to-black";
    else if (gradientType === "forest") bgColor = "from-emerald-600 via-teal-800 to-zinc-950";

    const newSlide: SlideItem = {
      id: `d-${Date.now()}`,
      bgColor,
      title: newTitle.trim(),
      description: newDescription.trim() || "No description provided.",
      tag: newTag.trim() ? (newTag.trim().startsWith("#") ? newTag.trim() : `#${newTag.trim()}`) : "#development",
      likes: 0,
      comments: 0,
      shares: 0
    };

    setDynamicSlides((prev) => [...prev, newSlide]);
    setNewTitle("");
    setNewDescription("");
    setNewTag("");
  };

  const deleteSlide = (id: string) => {
    setDynamicSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const currentSlides = mode === "static" ? staticSlides : dynamicSlides;

  return (
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
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-y-3 z-50 bg-card/90 backdrop-blur-md p-3.5 rounded-2xl border border-border/80 shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center select-none pb-1">
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

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
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

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left Control Panel: Only visible/interactive in dynamic mode */}
        <div className={`w-full lg:w-80 shrink-0 transition-all duration-300 ${mode === "static" ? "opacity-40" : "opacity-100"}`}>
          <div className="border border-border/60 bg-card rounded-2xl p-5 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-x-2">
                Slide Creator
                <Badge variant={mode === "static" ? "outline" : "default"} className="text-[10px] px-2 py-0">
                  {mode === "static" ? "Locked" : "Active"}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === "static" 
                  ? "Switch to Dynamic Mode in the floating panel to create custom slides."
                  : "Design custom 9:16 scroll cards for your mobile viewport."}
              </p>
            </div>

            <form onSubmit={addSlide} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Slide Title</label>
                <input
                  type="text"
                  required
                  disabled={mode === "static"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. User Interface"
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <textarea
                  disabled={mode === "static"}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short summary of this slide..."
                  className="w-full h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Hashtag</label>
                <input
                  type="text"
                  disabled={mode === "static"}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. #design"
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Gradient Theme</label>
                <select
                  disabled={mode === "static"}
                  value={gradientType}
                  onChange={(e) => setGradientType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 cursor-pointer"
                >
                  <option value="sunset">Sunset (Orange/Pink)</option>
                  <option value="ocean">Ocean (Cyan/Blue)</option>
                  <option value="cyberpunk">Cyberpunk (Purple/Fuchsia)</option>
                  <option value="forest">Forest (Emerald/Teal)</option>
                </select>
              </div>

              <Button 
                type="submit" 
                disabled={mode === "static"}
                className="w-full h-9 gap-x-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
            </form>

            {/* List of custom slides to delete */}
            {mode === "dynamic" && dynamicSlides.length > 0 && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Custom Cards ({dynamicSlides.length})</span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                  {dynamicSlides.map((slide) => (
                    <div key={slide.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs border border-border/30">
                      <span className="font-semibold truncate max-w-[180px]">{slide.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSlide(slide.id)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Mobile Frame Simulator */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full max-w-[340px] xs:max-w-[360px] md:max-w-[380px] h-[640px] md:h-[680px] rounded-[48px] border-[10px] border-neutral-900 dark:border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden bg-black flex flex-col select-none ring-1 ring-white/10">
            
            {/* Phone Notch/Dynamic Island */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 h-5 w-24 bg-neutral-900 dark:bg-neutral-800 rounded-full z-30 flex items-center justify-center">
              <div className="h-1.5 w-1.5 bg-neutral-800 dark:bg-neutral-700 rounded-full absolute right-4" />
              <div className="h-1 w-8 bg-neutral-800 dark:bg-neutral-700 rounded-full absolute left-4" />
            </div>

            {/* 9:16 Scroll-Snap Feed Viewport */}
            <div className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar h-full w-full relative">
              {currentSlides.map((slide, index) => {
                const isLiked = likedSlides.has(slide.id);
                return (
                  <div 
                    key={slide.id} 
                    className={`h-full w-full shrink-0 snap-start bg-gradient-to-br ${slide.bgColor} relative flex flex-col justify-between p-5 pt-12 pb-14`}
                  >
                    {/* Status bar top-overlay inside phone */}
                    <div className="absolute top-2 left-6 right-6 flex justify-between text-[10px] font-bold text-white/60 z-20 pointer-events-none">
                      <span>9:41</span>
                      <div className="flex gap-x-1 items-center">
                        <Volume2 className="h-3 w-3" />
                        <span>LTE</span>
                      </div>
                    </div>

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

                    {/* Bottom overlay inside phone (Metadata + Side buttons) */}
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
                  <span className="text-xs">Add custom slides using the creator panel.</span>
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar overlay inside phone */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur border-t border-white/10 flex items-center justify-around text-white/40 px-2 z-20">
              <button className="text-white flex flex-col items-center cursor-pointer">
                <Home className="h-4.5 w-4.5" />
                <span className="text-[8px] font-bold mt-0.5">Home</span>
              </button>
              <button className="hover:text-white flex flex-col items-center cursor-pointer transition-colors">
                <Search className="h-4.5 w-4.5" />
                <span className="text-[8px] font-bold mt-0.5">Discover</span>
              </button>
              <button className="hover:text-white flex items-center justify-center h-7 w-11 rounded-md bg-white text-black font-extrabold text-sm cursor-pointer transition-transform hover:scale-105 active:scale-95">
                +
              </button>
              <button className="hover:text-white flex flex-col items-center cursor-pointer transition-colors">
                <MessageSquare className="h-4.5 w-4.5" />
                <span className="text-[8px] font-bold mt-0.5">Inbox</span>
              </button>
              <button className="hover:text-white flex flex-col items-center cursor-pointer transition-colors">
                <User className="h-4.5 w-4.5" />
                <span className="text-[8px] font-bold mt-0.5">Profile</span>
              </button>
            </div>
            
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 bg-background/50 z-10">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-y-4 text-[10px] text-muted-foreground sm:px-6 lg:px-8">
          <div>
            Built with React, Vite & Tailwind CSS. Mobile viewport emulator ratio 9:16.
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
