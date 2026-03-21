import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getPostsByUserId } from '@/server/services/post';
import FeedPostCard from '@/components/feed/FeedPostCard';
import LoadMorePosts from '@/components/feed/LoadMorePosts';

export default async function PostsPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) notFound();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isOwner = session?.user?.id === user.id;

    // Fetch Posts (10 initially)
    const posts = await getPostsByUserId(user.id, session?.user?.id, 15, 0);

    if (posts.length === 0) {
        return (
            <div className='mt-20 text-center text-gray-500'>
                <p>No posts found. Time to write something new!</p>
            </div>
        );
    }

    return (
        <div className='mt-4 space-y-px'>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {posts.map((post) => (
                    <FeedPostCard
                        key={post.id}
                        post={post}
                        currentUserId={session?.user?.id}
                    />
                ))}
            </div>
            {posts.length == 15 && (
                <LoadMorePosts initialOffset={15} currentUserId={user.id} />
            )}
        </div>
    );
}
