'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { PostStatus } from '@/enum';
import { createPost, getCachedPosts, updatePost, deletePost } from '@/server/services/post';
import { headers } from 'next/headers';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

/**
 * Action: Handles user-driven side effects.
 * Always use these for forms or button clicks that change data.
 */
export async function togglePostLike(postId: number) {
  // 1. Get the session securely on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('You must be logged in to like a post.');
  }

  const userId = session.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
    }

    revalidateTag('posts', 'max');
    revalidatePath('/');
  } catch (error) {
    console.error('Failed to toggle like:', error);
    throw new Error('Could not process like action.');
  }
}

/**
 * Action: create
 */
export async function createPostAction(values: { title: string; slug: string; summary: string; content: string; status: PostStatus }) {
  // 1. Authenticate the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, message: 'You must be logged in to post.' };
  }

  try {
    // 2. Call the service
    const post = await createPost({
      ...values,
      userId: session.user.id,
    });

    return {
      success: true,
      slug: post.slug,
      username: session.user.username,
    };
  } catch (error: any) {
    // Handle Prisma unique constraint errors for slugs
    if (error.code === 'P2002') {
      return { success: false, message: 'Slug is already in use.' };
    }
    return { success: false, message: 'Failed to save post to database.' };
  }
}

/**
 * Action: Get posts from owner
 * This caches the post fetch for 1 hour, but tags it for manual invalidation
 */
export const getPostsOwner = unstable_cache(
  async (userId: string) => {
    return await prisma.post.findMany({
      where: {
        userId: userId,
        // status: PostStatus.Aprove,
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  },
  ['draft-posts'], // Cache Key
  {
    revalidate: 3600,
    tags: ['posts'], // Tag for revalidateTag("posts")
  }
);

export async function fetchMorePosts(limit: number, offset: number) {
  const posts = await getCachedPosts(limit, offset);
  return posts;
}

/**
 * Action: Update post
 */
export async function updatePostAction(values: {
  slug: string;
  title: string;
  newSlug: string;
  summary: string;
  content: string;
  status: PostStatus;
}) {
  // 1. Authenticate the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, message: 'You must be logged in to update a post.' };
  }

  try {
    // 2. Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { slug: values.slug },
      select: { userId: true },
    });

    if (!existingPost) {
      return { success: false, message: 'Post not found.' };
    }

    if (existingPost.userId !== session.user.id) {
      return { success: false, message: "You don't have permission to update this post." };
    }

    // 3. Call the service
    const post = await updatePost({
      id: 0,
      slug: values.slug,
      title: values.title,
      newSlug: values.newSlug,
      summary: values.summary,
      content: values.content,
      status: values.status,
      userId: session.user.id,
    });

    return {
      success: true,
      slug: post.slug,
      username: session.user.username,
    };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'Slug is already in use.' };
    }
    return { success: false, message: 'Failed to update post.' };
  }
}

/**
 * Action: Delete post
 */
export async function deletePostAction(slug: string) {
  // 1. Authenticate the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, message: 'You must be logged in to delete a post.' };
  }

  try {
    // 2. Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { userId: true },
    });

    if (!existingPost) {
      return { success: false, message: 'Post not found.' };
    }

    if (existingPost.userId !== session.user.id) {
      return { success: false, message: "You don't have permission to delete this post." };
    }

    // 3. Call the service
    await deletePost(slug);

    return { success: true, message: 'Post deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete post.' };
  }
}
