import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { getCachedPost } from "@/server/cache/post";

// UI Components
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import PostHeader from "@/components/post/PostHeader";
import PostAuthor from "@/components/post/PostAuthor";
import PostContent from "@/components/post/PostContent";
import PostComments from "@/components/post/PostComments";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPost(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCachedPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header sticky={false} />
      <ScrollProgress />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <PostHeader title={post.title} />
        <PostAuthor user={post.user} createdAt={post.createdAt} />
        <PostContent post={post} />
        <PostComments />
      </main>
    </div>
  );
}