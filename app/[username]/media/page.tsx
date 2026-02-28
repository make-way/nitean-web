import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getPostsOwner } from '@/server/actions/post';
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
        <div className='mt-8 space-y-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-bold tracking-tight'>Media Library</h1>
                <p className='text-muted-foreground'>
                    {isOwner 
                        ? "Manage all your uploaded images and files." 
                        : `Browse media shared by ${user.name}.`}
                </p>
            </div>
            
            <MediaGallery media={media} isOwner={isOwner} />
        </div>
    );
}
