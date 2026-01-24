import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/utils/TimeAgo";

type PostCardProps = {
    post: any;
};

export default function PostCard({ post }: PostCardProps) {
    return (
        <article
        key={post.id}
        className="mb-6 break-inside-avoid rounded-2xl
                    bg-white border border-dashed border-zinc-300
                    hover:border-solid hover:border-zinc-400 hover:shadow-sm
                    transition-all duration-200
                    dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
            {/* Image */}
            {post?.thumbnail && (
                <Link href={`/post/${post.slug}`} className="relative w-full overflow-hidden rounded-t-2xl">
                <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-120 object-cover"
                />
                </Link>
            )}

            {/* Content */}
            <div className="p-4">
                <Link href={`/post/${post.slug}`}>
                <h3 className="mt-1 text-base font-semibold">{post.title}</h3>
                <span className="text-xs text-zinc-500">{timeAgo(post.createdAt)}</span>

                {post.summary && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{post.summary}</p>
                )}
                </Link>

                {/* Author */}
                <div className="mt-4 flex items-center gap-3">
                {post.user.image ? (
                    <Image
                    src={post.user.image}
                    alt={post.title}
                    width={100}
                    height={100}
                    className="w-7 h-7 object-cover"
                    />
                ) : (
                    <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                )}
                <Link href={`/${post.user.username}`} className="text-xs hover:underline">
                    <p className="font-medium uppercase">{post.user.name}</p>
                    <small>@{post.user.username}</small>
                </Link>
                </div>
            </div>
        </article>
    );
}
