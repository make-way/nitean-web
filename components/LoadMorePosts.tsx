// components/LoadMorePosts.tsx
"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import { fetchMorePosts } from "@/server/actions/post";

export default function LoadMorePosts({ initialOffset }: { initialOffset: number }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const newPosts = await fetchMorePosts(10, offset);
    
    if (newPosts.length < 10) setHasMore(false);
    
    setPosts([...posts, ...newPosts]);
    setOffset(offset + 10);
    setLoading(false);
  };

  return (
    <>
      <div className="columns-1 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasMore && (
        <button 
          onClick={loadMore}
          disabled={loading}
          className="mt-8 w-full py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
}