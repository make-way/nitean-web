import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function Page() {
  // 1. Get the session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user?.id;

  // 2. Get the articles
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      media: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  // 3. Map through articles to see if the current user liked them
  const articlesWithLikeStatus = await Promise.all(
    articles.map(async (article) => {
      let isLiked = false;

      if (currentUserId) {
        const like = await prisma.like.findUnique({
          where: {
            userId_articleId: {
              userId: currentUserId,
              articleId: article.id,
            },
          },
        });
        isLiked = !!like;
      }

      return { ...article, isLiked };
    })
  );

  return (
    <>
      {/* Floating Action Button (FAB) relative to Bottom Nav */}
      {session?.session.userId && (
            <div className='fixed right-4 bottom-20 z-50 md:hidden'>
                <Link
                href='/article/create'
                className='flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:bg-indigo-700 active:scale-95'
                >
                <Plus className='h-7 w-7' />
                </Link>
        </div>      
      )}


      <div className='mobile-nav-padding min-h-screen bg-zinc-50 selection:bg-indigo-100 selection:text-indigo-900 dark:bg-black'>
        <div className='mx-auto flex max-w-[1600px] justify-center'>
          {/* Left Sidebar */}
          <div className='hidden md:block'>
            <LeftSidebar />
          </div>

          {/* Main Feed */}
          <main className='min-h-screen max-w-[700px] flex-1 border-x border-zinc-100 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50'>
            {/* Tabs */}
            <div className='sticky top-[60px] z-60 flex hidden gap-12 border-b border-zinc-100 bg-white px-3 py-6 pb-4 sm:block sm:px-6 md:top-0 dark:border-zinc-800 dark:bg-black'>
              <button className='-mb-5 border-b-4 border-indigo-600 pb-4 text-[17px] font-black text-zinc-900 dark:text-white'>
                Articles
              </button>
            </div>

            {/* Articles Feed */}
            <div className='p-0 sm:p-4'>
              {articlesWithLikeStatus.map((article) => (
                <PostCard key={article.id} post={article} />
              ))}
            </div>
            {articlesWithLikeStatus.length === 0 && <div className='p-12 text-center text-zinc-500'>No articles found.</div>}
            <div className='flex items-center justify-center border-t border-zinc-100 py-12 dark:border-zinc-800'>End of articles</div>
          </main>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
}
