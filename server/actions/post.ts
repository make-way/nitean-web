'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createPost, deletePost, togglePostLike } from '@/server/services/post';
import { revalidatePath } from 'next/cache';
import { Visibility } from '@/lib/generated/prisma/client';

export async function createPostAction(data: {
    content: string;
    visibility?: Visibility;
    replyToPostId?: number;
    repostOfId?: number;
    quotePostId?: number;
    media?: { url: string; type: 'Image' | 'Video' | 'Audio' | 'File'; size: number }[];
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const post = await createPost({
            ...data,
            userId: session.user.id,
        });

        revalidatePath('/');
        return { success: true, post };
    } catch (error: any) {
        console.error('Failed to create post:', error);
        return { success: false, error: error.message || 'Failed to create post' };
    }
}

export async function deletePostAction(postId: number) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await deletePost(postId, session.user.id);
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete post:', error);
        return { success: false, error: error.message || 'Failed to delete post' };
    }
}

export async function togglePostLikeAction(postId: number) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const result = await togglePostLike(postId, session.user.id);
        revalidatePath('/');
        return { success: true, ...result };
    } catch (error: any) {
        console.error('Failed to toggle like:', error);
        return { success: false, error: error.message || 'Failed to toggle like' };
    }
}
