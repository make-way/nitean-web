import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/utils/TimeAgo";
import LikeButton from "./LikeButton";
import { MessageCircle, Share, MoreHorizontal, Bookmark } from "lucide-react";

type PostCardProps = {
    post: any;
};

export default function PostCard({ post }: PostCardProps) {
    const isLiked = post.isLiked;
    const likeCount = post._count?.likes || 0;
    const commentCount = post._count?.comments || 0;
    const slug = post.slug.trim();

    return (
        <article className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            {/* Header: User Info */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href={`/${post.user.username}`} className="relative">
                        <Image
                            src={post.user.image || "/avatar.png"}
                            alt={post.user.name}
                            width={52}
                            height={52}
                            className="rounded-full object-cover w-14 h-14 border-2 border-white dark:border-zinc-800 shadow-sm"
                        />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                             <Link href={`/${post.user.username}`} className="font-black text-zinc-900 dark:text-white hover:underline leading-none">
                                {post.user.name}
                            </Link>
                            <span className="text-zinc-400 text-sm font-medium">@{post.user.username}</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Product Designer, slothUI</p>
                    </div>
                </div>
                <button className="text-zinc-400 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content Styling */}
            <div className="space-y-4">
                <Link href={`/post/${slug}`} className="block">
                     <p className="text-[17px] text-zinc-800 dark:text-zinc-200 leading-[1.6] whitespace-pre-wrap font-medium">
                        {post.summary || post.title}
                        <span className="text-indigo-600 dark:text-indigo-400 ml-2">#amazing #great #lifetime #uiux #machinelearning</span>
                    </p>
                </Link>

                {/* Media */}
                {post.media?.url && (
                    <Link
                        href={`/post/${slug}`}
                        className="block rounded-[2rem] overflow-hidden border border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 transition-transform hover:scale-[1.005]"
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
            <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Like */}
                    <div className="flex items-center gap-2 group cursor-pointer transition-colors hover:text-red-500">
                        <div className="p-2 rounded-xl group-hover:bg-red-50 dark:group-hover:bg-red-900/10">
                            <LikeButton
                                postId={post.id}
                                initialLikeCount={likeCount}
                                isLiked={isLiked}
                                hideLabel={false}
                            />
                        </div>
                    </div>
                    
                    {/* Comments */}
                    <Link
                        href={`/post/${slug}/#comments`}
                        className="flex items-center gap-2 group transition-colors hover:text-indigo-600 text-zinc-500"
                    >
                        <div className="p-2 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 transition-all">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black">{commentCount} <span className="text-zinc-400 font-bold ml-1">Comments</span></span>
                    </Link>

                    {/* Share */}
                    <button className="flex items-center gap-2 group transition-colors hover:text-green-600 text-zinc-500">
                        <div className="p-2 rounded-xl group-hover:bg-green-50 dark:group-hover:bg-green-900/10 transition-all">
                            <Share className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black">187 <span className="text-zinc-400 font-bold ml-1 text-[13px]">Share</span></span>
                    </button>
                </div>

                <button className="text-zinc-400 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>
        </article>
    );
}

