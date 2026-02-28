"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toggleArticleLike } from "@/server/actions/article";

export default function LikeButton({
  articleId,
  initialLikeCount,
  isLiked,
  hideLabel = false
}: {
  articleId: number;
  initialLikeCount: number;
  isLiked: boolean;
  hideLabel?: boolean;
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
      await toggleArticleLike(articleId);
    } catch (error) {
      // Rollback if the server fails
      setLiked(liked);
      setCount(count);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 group transition-colors text-zinc-500"
    >
      <Heart
        className={`w-5 h-5 transition-all ${liked
            ? "fill-red-500 stroke-red-500 scale-110"
            : "stroke-current group-hover:text-red-500"
          }`}
      />
      <span className={`text-sm font-black ${liked ? "text-red-500" : "text-zinc-500"}`}>
        {count} {!hideLabel && <span className="text-zinc-400 font-bold ml-1">Likes</span>}
      </span>
    </button>
  );
}
