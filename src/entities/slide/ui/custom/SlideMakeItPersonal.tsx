import { useState } from "react";
import type { SlideItem } from "../../model/types";
import { Briefcase, Gamepad2, GraduationCap } from "lucide-react";

export function SlideMakeItPersonal({ slide: _slide }: { slide: SlideItem }) {
  const [activePersona, setActivePersona] = useState<string>("Work");

  const personas = [
    { id: "Work", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/20", glow: "shadow-blue-500/50" },
    { id: "Hobby", icon: Gamepad2, color: "text-pink-400", bg: "bg-pink-400/20", glow: "shadow-pink-500/50" },
    { id: "Exams", icon: GraduationCap, color: "text-yellow-400", bg: "bg-yellow-400/20", glow: "shadow-yellow-500/50" },
  ];

  const activeData = personas.find(p => p.id === activePersona)!;
  const ActiveIcon = activeData.icon;

  return (
    <div className="h-auto w-full flex flex-col justify-start items-center p-2 text-center gap-3 select-none min-h-0">
      <div className="space-y-1 max-w-xs shrink-0">
        <h3 className="text-xl font-bold text-white tracking-tight">Make it Personal</h3>
        <p className="text-xs text-white/70 font-medium leading-relaxed">
          Connect facts to real use. We pay attention to what feels directly relevant now.
        </p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-start gap-2 h-auto">
          <div className="flex flex-col items-center justify-center w-full space-y-4">
      
      <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm">
        {personas.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePersona(p.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
              activePersona === p.id 
                ? `bg-white text-black shadow-sm` 
                : "text-white/60 hover:text-white"
            }`}
          >
            {p.id}
          </button>
        ))}
      </div>

      <div className={`
        relative flex flex-col items-center justify-center p-3 rounded-2xl border border-white/10 
        transition-all duration-500 w-full max-w-[160px] aspect-square
        ${activeData.bg} shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] ${activeData.glow}
      `}>
        <ActiveIcon className={`w-14 h-14 mb-2 transition-colors ${activeData.color}`} />
        <h3 className="text-xl font-bold text-white text-center">
          {activePersona} Template
        </h3>
      </div>

    </div>
      </div>
    </div>
  );
}