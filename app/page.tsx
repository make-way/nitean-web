import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCachedPosts } from "@/server/services/post";
import prisma from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import FeedComposer from "@/components/feed/FeedComposer";

export default async function Page() {
    // 1. Get the session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const currentUserId = session?.user?.id;

    // 2. Get the cached posts
    const posts = await getCachedPosts(20, 0);

    // 3. Map through posts to see if the current user liked them
    const postsWithLikeStatus = await Promise.all(posts.map(async (post) => {
        let isLiked = false;
        
        if (currentUserId) {
            const like = await prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId: currentUserId,
                        postId: post.id
                    }
                }
            });
            isLiked = !!like;
        }

        return { ...post, isLiked };
    }));

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-[1600px] mx-auto flex justify-center">
                {/* Left Sidebar */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {/* Main Feed */}
                <main className="flex-1 max-w-[700px] min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl px-4 py-8">
                    {/* Tabs */}
                    <div className="flex gap-12 mb-8 px-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        <button className="text-[17px] font-black text-zinc-900 dark:text-white border-b-4 border-indigo-600 pb-4 -mb-5">For You</button>
                        {/* <button className="text-[17px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Following</button> */}
                    </div>

                    {/* Composer */}
                    {/* <FeedComposer /> */}

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {postsWithLikeStatus.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </main>

                {/* Right Sidebar */}
                <RightSidebar />
            </div>
        </div>
    );
}
