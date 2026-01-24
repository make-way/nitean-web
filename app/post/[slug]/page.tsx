import prisma from "@/lib/prisma";
import CommentCard from '@/components/CommentCard';
import Header from '@/components/Header';
import PostComment from '@/components/PostComment';
import TiptapViewer from '@/components/rich-text-editor/TiptapViewer';
import { ArrowLeft, ThumbsUp, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { timeAgo } from "@/utils/TimeAgo";
import Link from "next/link";
import ScrollProgress from "@/components/ScrollProgress";

const sampleComments = [
    {
        id: 1,
        author: 'PMP',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        timeAgo: '4 months ago',
        content: 'Love the article you wrote',
        likes: 0,
    },
    {
        id: 2,
        author: 'Macha',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        timeAgo: '4 months ago',
        content: 'I want to read your articles more',
        likes: 1,
    },
];

type PageProps = {
    params: {
        slug?: string;
    };
};

async function getPostBySlug(slug: string) {
    return prisma.post.findUnique({
        where: { slug },
        include: {
            user: true
        }
    });
}


export default async function PostPage({ params }: {params: Promise<{ slug: string }>;}) {
    const { slug } = await params;
        // ✅ SAFETY CHECK
    if (!slug) {
        notFound();
    }
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

  return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <Header sticky={false} />
            <ScrollProgress/>

            <main className="mx-auto max-w-3xl px-4 py-8">
                {/* Back button + Title */}
                <div className="mb-8">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                        aria-label="Back to posts"
                        >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-semibold">
                    {post.title}
                    </h1>
                </div>
                </div>

                {/* Author & Metadata */}
                <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <Link href={`/${post.user.username}`} className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                            src={post.user.image || ""}
                            alt="Thon"
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <div>
                    <Link href={`/${post.user.username}`} className="font-medium text-lg uppercase hover:underline hover:text-blue-500">{post.user.name}</Link>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Student • {timeAgo(post.createdAt)}
                    </p>
                    </div>
                </div>

                {/* Follow Button */}
                    <button className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-full transition flex items-center gap-2 cursor-pointer">
                        <UserPlus className="w-5 h-5" /> {/* smaller icon */}
                        Follow
                    </button>

                </div>

                {/* Engagement Bar */}
                <div className="flex items-center gap-8 py-4 border-y border-zinc-200 dark:border-zinc-800">
                <button className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">0 Likes</span>
                </button>
                <button className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <span className="font-medium">0 Comments</span>
                </button>
                </div>

                {/* Post Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    {post.thumbnail && (
                        <Image className="w-full h-120 object-cover" src={post.thumbnail || ""} alt={post.title} width={600} height={400}/>
                    )}
                <TiptapViewer content={post.content} />
                </article>

                {/* Comment Section */}
                <PostComment/>

                {/* === COMMENTS LIST === */}
                <div className="space-y-6">
                <h2 className="text-2xl font-semibold my-4">Comments ({sampleComments.length})</h2>

                    {sampleComments.map((comment) => (
                        <CommentCard
                        key={comment.id}
                        author={comment.author}
                        avatar={comment.avatar}
                        timeAgo={comment.timeAgo}
                        content={comment.content}
                        likes={comment.likes}
                        />
                    ))}
                </div>

            </main>
        </div>
    );
};