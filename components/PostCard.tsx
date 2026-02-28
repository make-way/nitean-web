import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/utils/TimeAgo";
import LikeButton from "./LikeButton";
import { MessageCircle, Share, MoreHorizontal } from "lucide-react";

type PostCardProps = {
    post: any;
};

export default function PostCard({ post }: PostCardProps) {
    const isLiked = post.isLiked;
    const likeCount = post._count?.likes || 0;

    const commentCount = post._count?.comments || 0;
    const slug = post.slug.trim();

    return (
        <article
            className="
                rounded-none sm:rounded-2xl overflow-hidden
                border-b sm:border sm:border-solid sm:border-zinc-200 sm:dark:border-zinc-700
                bg-white dark:bg-zinc-900 mb-0 sm:mb-3
            "
        >
            {/* ================= SOCIAL STYLE LAYOUT ================= */}
            <div className="p-4 flex gap-3">
                {/* Left: Avatar */}
                <div className="flex-shrink-0">
                    <Link href={`/${post.user.username}`}>
                        {post.user.image ? (
                            <Image
                                src={post.user.image}
                                alt={post.user.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-12 h-12 hover:opacity-90 transition-opacity"
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" />
                        )}
                    </Link>
                </div>

                {/* Right: Content container */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Header: Name, Handle, Time */}
                    <div className="flex items-center gap-1.5 text-[15px] leading-5">
                        <Link href={`/${post.user.username}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline truncate">
                            {post.user.name}
                        </Link>
                        <span className="text-zinc-500 truncate">@{post.user.username}</span>
                        <span className="text-zinc-500">·</span>
                        <span className="text-zinc-500 whitespace-nowrap">{timeAgo(post.createdAt)}</span>
                    </div>

                    {/* Body Text */}
                    <Link href={`/post/${slug}`} className="block group">
                        <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 leading-normal group-hover:underline">
                            {post.title}
                        </h3>
                        {post.summary && (
                            <p className="text-[15px] text-zinc-800 dark:text-zinc-200 leading-normal mt-0.5 whitespace-pre-wrap">
                                {post.summary}
                            </p>
                        )}
                    </Link>

                    {/* Media */}
                    {post.media?.url && (
                        <Link
                            href={`/post/${slug}`}
                            className="mt-3 block rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:opacity-95 transition-opacity bg-zinc-100 dark:bg-zinc-800"
                        >
                            <div className="relative aspect-auto min-h-[200px] max-h-[500px]">
                                <Image
                                    src={post.media.url}
                                    alt={post.title}
                                    width={1000}
                                    height={1000}
                                    className="w-full h-auto object-contain max-h-[500px] bg-zinc-50 dark:bg-zinc-950"
                                />
                            </div>
                        </Link>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-3 flex items-center justify-start gap-12 max-w-sm text-zinc-500">
                        {/* Like */}
                        <div className="flex items-center -ml-2">
                            <LikeButton
                                postId={post.id}
                                initialLikeCount={likeCount}
                                isLiked={isLiked}
                            />
                        </div>
                        
                        {/* Reply */}
                        <Link
                            href={`/post/${slug}/#comments`}
                            className="flex items-center gap-2 group transition-colors hover:text-blue-500"
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <MessageCircle size={18} />
                            </div>
                            {commentCount > 0 && <span className="text-xs font-medium">{commentCount}</span>}
                        </Link>


                        {/* Share */}
                        {/* <button className="group transition-colors hover:text-green-500">
                            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                                <Share size={18} />
                            </div>
                        </button> */}

                        {/* More */}
                        {/* <button className="group transition-colors hover:text-blue-500">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <MoreHorizontal size={18} />
                            </div>
                        </button> */}
                    </div>
                </div>
            </div>
        </article>
    );
}
