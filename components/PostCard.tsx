import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { MessageCircle } from "lucide-react";

type PostCardProps = {
    post: any;
};

export default function PostCard({ post }: PostCardProps) {
    const isLiked = post.isLiked;
    const likeCount = post._count?.likes || 0;
    const commentCount = post._count?.comments || 0;
    const slug = post.slug.trim();

    return (
        <article className="bg-white dark:bg-zinc-900 p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            {/* Header: User Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Link href={`/${post.user.username}`} className="relative">
                        <Image
                            src={post.user.image || "/avatar.png"}
                            alt={post.user.name}
                            width={52}
                            height={52}
                            className="rounded-full object-cover w-14 h-14"
                        />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href={`/${post.user.username}`} className="font-black text-zinc-900 dark:text-white hover:underline leading-none">
                                {post.user.name}
                            </Link>
                            <span className="text-zinc-400 text-sm font-medium">@{post.user.username}</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Author</p>
                    </div>
                </div>
                {/* <button className="text-zinc-400 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button> */}
            </div>

            {/* Content Styling */}
            <div className="space-y-4">
                <Link href={`/article/${slug}`} className="block">
                    <p className="text-[17px] text-zinc-800 dark:text-zinc-200 leading-[1.6] whitespace-pre-wrap font-medium">
                        {post.summary || post.title}
                    </p>
                </Link>

                {/* Media */}
                {post.media?.url && (
                    <Link
                        href={`/article/${slug}`}
                        className="block overflow-hidden bg-zinc-50 dark:bg-zinc-800"
                    >
                        <Image
                            src={post.media.url}
                            alt={post.title}
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </Link>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Like */}
                    <LikeButton
                        articleId={post.id}
                        initialLikeCount={likeCount}
                        isLiked={isLiked}
                        hideLabel={false}
                    />

                    {/* Comments */}
                    <Link
                        href={`/article/${slug}/#comments`}
                        className="flex items-center gap-2 group transition-colors hover:text-indigo-600 text-zinc-500"
                    >
                        <MessageCircle className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-sm font-black text-zinc-500">{commentCount} <span className="text-zinc-400 font-bold ml-1">Comments</span></span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

