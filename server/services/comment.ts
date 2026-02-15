import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Service: Pure database interaction for Comments.
 */

export async function getCommentsByPostId(postId: number) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function createComment(data: {
  content: string;
  userId: string;
  postId: number;
}) {
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: data.userId,
      postId: data.postId,
    },
    include: {
      user: true,
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  // CACHE INVALIDATION
  revalidatePath(`/post/${comment.post.slug.trim()}`);
  revalidateTag('posts', 'max');
  revalidatePath('/');
  
  return comment;
}

export async function updateComment(data: {
  id: number;
  content: string;
  userId: string;
}) {
  const comment = await prisma.comment.update({
    where: { 
      id: data.id,
      userId: data.userId // Ensure ownership
    },
    data: {
      content: data.content,
    },
    include: {
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  // CACHE INVALIDATION
  revalidatePath(`/post/${comment.post.slug.trim()}`);
  revalidateTag('posts', 'max');
  revalidatePath('/');

  return comment;
}

export async function deleteComment(id: number, userId: string) {
  const comment = await prisma.comment.delete({
    where: { 
      id,
      userId // Ensure ownership
    },
    include: {
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  // CACHE INVALIDATION
  revalidatePath(`/post/${comment.post.slug.trim()}`);
  revalidateTag('posts', 'max');
  revalidatePath('/');

  return comment;
}
