import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getPostsOwner } from '@/server/actions/article';
import { getUserMedia } from '@/server/actions/media';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import MediaGallery from '@/components/MediaGallery';

export default async function MediaPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) notFound();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isOwner = session?.user?.id === user.id;

    const media = await getUserMedia(user.id);

    return (
        <div className='mt-4 space-y-6 px-3'>
            <MediaGallery media={media} isOwner={isOwner} />
        </div>
    );
}
