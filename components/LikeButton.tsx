"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { togglePostLike } from "@/server/actions/post";

export default function LikeButton({ 
  postId, 
  initialLikeCount, 
  isLiked 
}: { 
  postId: number; 
  initialLikeCount: number; 
  isLiked: boolean 
}) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(initialLikeCount);

  // Sync state when props change after revalidation
  useEffect(() => {
    setLiked(isLiked);
    setCount(initialLikeCount);
  }, [isLiked, initialLikeCount]);

  const handleLike = async () => {
    // Optimistic Update: Change UI immediately
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      await togglePostLike(postId);
    } catch (error) {
      // Rollback if the server fails
       setLiked(liked);  
       setCount(count); 
    }
  };

  return (
    <button 
      onClick={handleLike}
      className="flex items-center gap-1.5 group transition-colors"
    >
      <Heart 
        size={18} 
        className={`transition-all cursor-pointer ${
          liked 
            ? "fill-red-500 stroke-red-500 scale-110" 
            : "stroke-zinc-500 group-hover:stroke-red-400"
        }`} 
      />
      <span className={`font-medium ${liked ? "text-red-500" : "text-zinc-500"}`}>
        {count}
      </span>
    </button>
  );
}