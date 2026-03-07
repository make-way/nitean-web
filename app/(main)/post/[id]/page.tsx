import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPostById, getReplies } from "@/server/services/post";
import prisma from "@/lib/prisma";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import FeedComposer from "@/components/feed/FeedComposer";
import FeedPostCard from "@/components/feed/FeedPostCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) return { title: 'Post Not Found' };

    const snippet = post.content.length > 50 ? post.content.substring(0, 50) + "..." : post.content;
    const description = post.content.substring(0, 160);
    const title = `${post.user.name} on Nitean: "${snippet}"`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: post.media?.[0]?.url ? [post.media[0].url] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        }
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const postId = id;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const currentUserId = session?.user?.id;

    // 1. Fetch main post and replies
    const [post, replies] = await Promise.all([
        getPostById(postId),
        getReplies(postId)
    ]);
    console.log(post);

    if (!post) {
        notFound();
    }

    // 2. Determine like status for parent, post, and replies
    let likedPostIds = new Set<string>();
    if (currentUserId) {
        const allPostIds = [post.id];
        if (post.replyToPostId) allPostIds.push(post.replyToPostId);
        allPostIds.push(...replies.map(r => r.id));

        const likes = await prisma.postLike.findMany({
            where: {
                userId: currentUserId,
                postId: { in: allPostIds }
            },
            select: { postId: true }
        });
        likedPostIds = new Set(likes.map(l => l.postId));
    }

    const isPostLiked = likedPostIds.has(post.id);

    let parentPostWithStatus = null;
    if (post.replyToPost) {
        const isParentLiked = likedPostIds.has(post.replyToPost.id);
        parentPostWithStatus = { ...post.replyToPost, isLiked: isParentLiked };
    }

    const repliesWithLikeStatus = replies.map((reply) => ({
        ...reply,
        isLiked: likedPostIds.has(reply.id)
    }));

    return (
        <main className="flex-1 max-w-175 py-0 border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center bg-white dark:bg-black backdrop-blur-xl gap-6 px-3 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 sticky md:top-0 top-0 z-60">
                <Link
                    href="/"
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold">Post</h1>
            </div>

            {/* Thread Context (Parent) */}
            {parentPostWithStatus && (
                <div className="bg-white dark:bg-black">
                    <FeedPostCard post={parentPostWithStatus} isThreadParent={true} />
                </div>
            )}

            {/* Main Featured Post */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black">
                <FeedPostCard
                    post={{ ...post, isLiked: isPostLiked }}
                    isDetailsView={true}
                    isThreadChild={!!parentPostWithStatus}
                />

                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <FeedComposer
                        replyToPostId={post.id}
                        placeholder="Post your reply"
                    />
                </div>
            </div>

            {/* Replies Feed */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-black min-h-screen">
                {repliesWithLikeStatus.length > 0 ? (
                    repliesWithLikeStatus.map((reply) => (
                        <FeedPostCard key={reply.id} post={reply} />
                    ))
                ) : (
                    <div className="p-12 text-center text-zinc-500 font-medium bg-zinc-50/20 dark:bg-zinc-900/10">
                        No replies yet.
                    </div>
                )}
            </div>
        </main>
    );
}
