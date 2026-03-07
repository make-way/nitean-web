import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPosts } from "@/server/services/post";
import FeedPostCard from "@/components/feed/FeedPostCard";
import prisma from "@/lib/prisma";
import TranslatedText from "@/components/i18n/TranslatedText";
import FeedComposer from "@/components/feed/FeedComposer";

export default async function Page() {
    // 1. Get the session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const currentUserId = session?.user?.id;

    // 2. Get the posts
    const posts = await getPosts(20, 0);

    // 3. Map through posts to see if the current user liked them
    let likedPostIds = new Set<string>();
    if (currentUserId) {
        const likes = await prisma.postLike.findMany({
            where: {
                userId: currentUserId,
                postId: { in: posts.map(p => p.id) }
            },
            select: { postId: true }
        });
        likedPostIds = new Set(likes.map(l => l.postId));
    }

    const postsWithLikeStatus = posts.map((post) => ({
        ...post,
        isLiked: likedPostIds.has(post.id)
    }));

    return (
        <main className="flex-1 max-w-175 min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
            {/* Tabs */}
            <div className="flex bg-white dark:bg-black gap-12 px-3 sm:px-6 py-6 border-b border-zinc-100 dark:border-zinc-800 pb-4 sticky md:top-0 top-15 z-60 sm:block hidden">
                <button className="text-[17px] font-black text-zinc-900 dark:text-white border-b-4 border-indigo-600 pb-4 -mb-5"><TranslatedText translationKey="buttons.for_you" /></button>
            </div>

            {/* Composer */}
            <div className="p-4">
                <FeedComposer />
            </div>

            {/* Posts Feed */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {postsWithLikeStatus.map((post) => (
                    <FeedPostCard key={post.id} post={post} />
                ))}
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 py-12 flex items-center justify-center">
                <TranslatedText translationKey="label.end_screen" />
            </div>
        </main>
    );
}
