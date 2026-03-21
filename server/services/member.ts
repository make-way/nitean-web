import prisma from '@/lib/prisma';

/**
 * Service: Pure database interaction for members.
 */
export async function getAllMembers() {
  return await prisma.user.findMany({
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      lastSeen: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });
}

export async function getOnlineMembers() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return await prisma.user.findMany({
    where: {
      lastSeen: {
        gte: fiveMinutesAgo,
      },
    },
    orderBy: {
      lastSeen: 'desc',
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      lastSeen: true,
      _count: {
        select: {
            posts: true,
        },
      },
    },
  });
}

export async function updateLastSeen(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { lastSeen: new Date() },
  });
}


export async function getMemberByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}
