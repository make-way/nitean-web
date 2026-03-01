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
import RightSidebar from '@/components/layout/RightSidebar';
import LeftSidebar from '@/components/layout/LeftSidebar';

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
         <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
                    <div className="max-w-[1600px] mx-auto flex justify-center">
                        {/* Left Sidebar */}
                        <div className="hidden md:block">
                            <LeftSidebar />
                        </div>
        
                        {/* Main Feed */}
                        <main className="flex-1 max-w-[700px] min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">        
                            {/* Articles Content */}
                            <div className="space-y-4 p-4">
                                <div className='min-h-screen bg-zinc-50 dark:bg-black'>
                                    <ScrollProgress />

                                    <main className='mx-auto max-w-5xl px-4 py-8'>
                                        <PostHeader title={article.title} />
                                        <PostAuthor user={article.user} createdAt={article.createdAt} />
                                        <PostContent post={article} />
                                        <PostComments postId={article.id} postUserId={article.userId} />
                                    </main>
                                </div>
                                
                            </div>
                            <div className="border-t border-zinc-100 dark:border-zinc-800 py-12 flex items-center justify-center">
                                End of articles
                            </div>
                        </main>
        
                        {/* Right Sidebar */}
                        <RightSidebar />
                    </div>
                </div>
    );
}
