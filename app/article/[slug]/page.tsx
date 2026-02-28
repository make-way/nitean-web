import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedArticle } from '@/server/cache/article';

// UI Components
import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';
import PostHeader from '@/components/post/PostHeader';
import PostAuthor from '@/components/post/PostAuthor';
import PostContent from '@/components/post/PostContent';
import PostComments from '@/components/post/PostComments';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await getCachedArticle(slug);

    if (!article) return { title: 'Article Not Found' };

    return {
        title: article.title,
        description: article.summary,
        openGraph: {
            title: article.title,
            images: article.media ? [{ url: article.media.url }] : [],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getCachedArticle(slug);

    if (!article) notFound();

    return (
        <div className='min-h-screen bg-zinc-50 dark:bg-black'>
            <Header sticky={false} />
            <ScrollProgress />

            <main className='mx-auto max-w-5xl px-4 py-8'>
                <PostHeader title={article.title} />
                <PostAuthor user={article.user} createdAt={article.createdAt} />
                <PostContent post={article} />
                <PostComments postId={article.id} postUserId={article.userId} />
            </main>
        </div>
    );
}
