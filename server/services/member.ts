import prisma from '@/lib/prisma';

/**
 * Service: Pure database interaction for members.
 */
export async function getAllMembers() {
  return await prisma.user.findMany({
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          articles: true,
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
          articles: true,
        },
      },
    },
  });
}
