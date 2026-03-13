'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createPost, deletePost, getPosts, getPostsByUserId, togglePostLike, updatePost } from '@/server/services/post';
import { revalidatePath } from 'next/cache';
import { Visibility } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { notifyPostCreated, notifyReplyCreated } from './sendNotification';

export async function createPostAction(data: {
    content: string;
    visibility?: Visibility;
    replyToPostId?: string;
    repostOfId?: string;
    quotePostId?: string;
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

        // Send notification
        try {
            const username = post.user.name || post.user.username || 'Anonymous';
            if (data.replyToPostId) {
                await notifyReplyCreated(username, post.content, post.id, data.replyToPostId);
            } else {
                await notifyPostCreated(username, post.content, post.id);
            }
        } catch (notifyError) {
            console.error('Failed to send notification:', notifyError);
        }

        revalidatePath('/');
        return { success: true, post };
    } catch (error: any) {
        console.error('Failed to create post:', error);
        return { success: false, error: error.message || 'Failed to create post' };
    }
}

export async function deletePostAction(postId: string) {
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

export async function togglePostLikeAction(postId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const result = await togglePostLike(postId, session.user.id);
        
        // Send notification if liked
        if (result.liked) {
            try {
                const post = await prisma.post.findUnique({
                    where: { id: postId },
                    select: { content: true }
                });
                if (post) {
                    const { notifyPostLiked } = await import('./sendNotification');
                    await notifyPostLiked(session.user.name || session.user.username || 'Anonymous', post.content, postId);
                }
            } catch (notifyError) {
                console.error('Failed to send post like notification:', notifyError);
            }
        }

        revalidatePath('/');
        return { success: true, ...result };
    } catch (error: any) {
        console.error('Failed to toggle like:', error);
        return { success: false, error: error.message || 'Failed to toggle like' };
    }
}

export async function updatePostAction(postId: string, data: {
    content: string;
    media?: { url: string; type: 'Image' | 'Video' | 'Audio' | 'File'; size: number }[];
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const post = await updatePost(postId, session.user.id, data);
        revalidatePath('/');
        return { success: true, post };
    } catch (error: any) {
        console.error('Failed to update post:', error);
        return { success: false, error: error.message || 'Failed to update post' };
    }
}

export async function getMorePostsAction(limit: number, offset: number, userId?: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const currentUserId = session?.user?.id;

    if (userId) {
        return await getPostsByUserId(userId, currentUserId, limit, offset);
    }

    const posts = await getPosts(limit, offset);
    
    let likedPostIds = new Set<string>();
    if (currentUserId) {
        const likes = await prisma.postLike.findMany({
            where: {
                userId: currentUserId,
                postId: { in: posts.map(p => p.id) }
            },
            select: { postId: true }
        });
        likedPostIds = new Set(likes.map(l => l.postId));
    }

    return posts.map((post) => ({
        ...post,
        isLiked: likedPostIds.has(post.id)
    }));
}
