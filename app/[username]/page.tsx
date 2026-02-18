import prisma from '@/lib/prisma';
import ProfileContent from './ProfileContent';

type ProfilePageProps = {
  params?: {
    username?: string;
  };
};

// Fetch bio for the user whose profile is being viewed (by username)
export default async function ProfilePage({ params }: ProfilePageProps) {
  const username = params?.username;

  // Safety guard: avoid calling Prisma with undefined username
  if (!username) {
    return <ProfileContent bio={null} />;
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { bio: true },
  });

  return <ProfileContent bio={user?.bio ?? null} />;
}
