import prisma from '@/lib/prisma';

/**
 * Service: Pure database interaction for members.
 */
export async function getAllMembers() {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });
}

export async function getMemberByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });
}
