'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createComment, updateComment, deleteComment } from '@/server/services/comment';
import prisma from '@/lib/prisma';

/**
 * Action: Create a new comment
 */
export async function createCommentAction(postId: number, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, message: 'You must be logged in to comment.' };
  }

  if (!content || content.trim().length === 0) {
    return { success: false, message: 'Comment content cannot be empty.' };
  }

  try {
    await createComment({
      content,
      userId: session.user.id,
      postId,
    });

    return { success: true, message: 'Comment added successfully.' };
  } catch (error) {
    console.error('Failed to create comment:', error);
    return { success: false, message: 'Failed to add comment.' };
  }
}

/**
 * Action: Update an existing comment
 */
export async function updateCommentAction(commentId: number, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, message: 'You must be logged in to update a comment.' };
  }

  try {
    // Check ownership before calling service (service also checks, but good to be explicit here)
    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!existing) {
      return { success: false, message: 'Comment not found.' };
    }

    if (existing.userId !== session.user.id) {
      return { success: false, message: 'You do not have permission to edit this comment.' };
    }

    await updateComment({
      id: commentId,
      content,
      userId: session.user.id,
    });

    return { success: true, message: 'Comment updated successfully.' };
  } catch (error) {
    console.error('Failed to update comment:', error);
    return { success: false, message: 'Failed to update comment.' };
  }
}

/**
 * Action: Delete a comment
 */
export async function deleteCommentAction(commentId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { success: false, message: 'You must be logged in to delete a comment.' };
  }

  try {
    const existing = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: { userId: true }
        }
      }
    });

    if (!existing) {
      return { success: false, message: 'Comment not found.' };
    }

    // Allow comment owner OR post owner to delete
    const isCommentOwner = existing.userId === session.user.id;
    const isPostOwner = existing.post.userId === session.user.id;

    if (!isCommentOwner && !isPostOwner) {
      return { success: false, message: 'You do not have permission to delete this comment.' };
    }

    await deleteComment(commentId, existing.userId);

    return { success: true, message: 'Comment deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return { success: false, message: 'Failed to delete comment.' };
  }
}
