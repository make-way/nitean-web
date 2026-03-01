import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { MobileNavigation } from './MobileNavigation';

export async function MobileNavWrapper() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    let userData = null;
    if (session?.user?.id) {
        userData = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                image: true,
                level: true,
            }
        });
    }

    return <MobileNavigation session={session} userData={userData} />;
}
