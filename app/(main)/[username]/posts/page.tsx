import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getPostsOwner } from '@/server/actions/article';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function ArticlesPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) notFound();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isOwner = session?.user?.id === user.id;

    // Fetch Posts using the cached function
    const posts = await getPostsOwner(user.id);

    if (posts.length === 0) {
        return (
            <div className='mt-20 text-center text-gray-500'>
                <p>No posts found. Time to write something new!</p>
            </div>
        );
    }

    return (
        <div className='mt-4 space-y-6'>
            <div className="flex items-center justify-center rounded-sm border-dashed">
                <h1>Coming Soon</h1>
            </div>
        </div>
    );
}
