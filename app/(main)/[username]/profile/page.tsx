import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProfilePage from '../profile';
import { TProfileUser } from '@/types';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) notFound();

    return <ProfilePage user={user as unknown as TProfileUser} />;
}
