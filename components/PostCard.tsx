import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/utils/TimeAgo";
import LikeButton from "./LikeButton";
import { MessageCircle, Bookmark } from "lucide-react";

type PostCardProps = {
    post: any;
};

export default function PostCard({ post }: PostCardProps) {
    const isLiked = post.isLiked;
    const likeCount = post._count?.likes || 0;

    return (
        <article
            className="
                rounded-2xl overflow-hidden
                border border-zinc-200 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                transition mb-3
            "
        >
            {/* ================= TOP CONTENT ================= */}
            <div className="p-4 space-y-3">
                {/* Author */}
                <Link
                    href={`/${post.user.username}`}
                    className="flex items-center gap-2"
                >
                    {post.user.image ? (
                        <Image
                            src={post.user.image}
                            alt={post.user.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-10 h-10"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    )}

                    <div className="text-xs text-zinc-500 flex items-center">
                        <span className="text-sm uppercase font-medium text-zinc-700 dark:text-zinc-300">
                            {post.user.name}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{timeAgo(post.createdAt)}</span>
                    </div>
                </Link>

                {/* Title */}
                <Link href={`/post/${post.slug}`}>
                    <h3 className="text-base font-semibold leading-snug hover:underline">
                        {post.title}
                    </h3>
                </Link>

                {/* Summary */}
                {post.summary && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {post.summary}
                    </p>
                )}
            </div>

            {/* ================= IMAGE CENTER ================= */}
            {post.thumbnail && (
                <Link
                    href={`/post/${post.slug}`}
                    className="relative block w-full aspect-[4/3] bg-black"
                >
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-contain"
                    />
                </Link>
            )}

            {/* ================= FOOTER ACTIONS ================= */}
            <div className="px-4 py-4 flex items-center gap-6 border-t border-zinc-200 dark:border-zinc-700">
                <LikeButton
                    postId={post.id}
                    initialLikeCount={likeCount}
                    isLiked={isLiked}
                />

                <Link
                    href={`#`}
                    className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                    <MessageCircle size={18} />
                </Link>

                <button className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                    <Bookmark size={18} />
                </button>
            </div>
        </article>
    );
}
