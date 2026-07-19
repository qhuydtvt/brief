import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onClick: () => void;
}

export function LikeButton({ isLiked, likesCount, onClick }: LikeButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center gap-y-0.5 group cursor-pointer focus:outline-none"
    >
      <div className="h-10 w-10 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all">
        <Heart className={`h-5 w-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
      </div>
      <span className="text-[10px] font-bold shadow-sm">{likesCount + (isLiked ? 1 : 0)}</span>
    </button>
  );
}
