"use client";
import { useState } from "react";
import FeedPostCard from "./FeedPostCard";
import { getMorePostsAction } from "@/server/actions/post";
import { Loader2 } from "lucide-react";
import TranslatedText from "@/components/i18n/TranslatedText";
interface LoadMorePostsProps {
    initialOffset: number;
    currentUserId?: string;
    userId?: string;
}
export default function LoadMorePosts({ initialOffset, currentUserId, userId }: LoadMorePostsProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [offset, setOffset] = useState(initialOffset);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loadMore = async () => {
        if (loading || !hasMore) return;
       
        setLoading(true);
        try {
            const newPosts = await getMorePostsAction(10, offset, userId);
           
            if (newPosts.length < 10) {
                setHasMore(false);
            }
           
            setPosts((prev) => [...prev, ...newPosts]);
            setOffset((prev) => prev + 10);
        } catch (error) {
            console.error("Failed to load more posts:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {posts.map((post) => (
                    <FeedPostCard key={post.id} post={post} currentUserId={currentUserId} />
                ))}
            </div>
            {hasMore ? (
                <div className="bg-zinc-900 text-white p-2 text-center cursor-pointer border-t border-zinc-100 dark:border-zinc-800" onClick={loadMore}>
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin inline-block" />
                    ) : (
                        <TranslatedText translationKey="label.show_more_posts" />
                    )}
                </div>
            ) : (
                <div className="border-t border-zinc-100 dark:border-zinc-800 py-12 flex items-center justify-center">
                    <TranslatedText translationKey="label.end_screen" />
                </div>
            )}
        </>
    );
}