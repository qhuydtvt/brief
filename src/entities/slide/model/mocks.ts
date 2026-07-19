import type { SlideItem } from "./types";

export const staticSlides: SlideItem[] = [
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

export const defaultDynamicSlides: SlideItem[] = [
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
