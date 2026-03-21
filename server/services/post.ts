import prisma from '@/lib/prisma';
import { Visibility, Prisma } from '@/lib/generated/prisma/client';
import { UTApi } from "uploadthing/server";
import { extractKeyFromUrl } from './media';

const utapi = new UTApi();

export async function createPost(data: {
    userId: string;
    content: string;
    visibility?: Visibility;
    replyToPostId?: string;
    repostOfId?: string;
    quotePostId?: string;
    media?: { url: string; type: 'Image' | 'Video' | 'Audio' | 'File'; size: number }[];
}) {
    return await prisma.post.create({
        data: {
            userId: data.userId,
            content: data.content,
            visibility: data.visibility || 'PUBLIC',
            replyToPostId: data.replyToPostId,
            repostOfId: data.repostOfId,
            quotePostId: data.quotePostId,
            media: data.media ? {
                create: data.media.map(m => ({
                    userId: data.userId,
                    url: m.url,
                    type: m.type,
                    size: m.size
                }))
            } : undefined
        },
        include: {
            user: true,
            media: true
        }
    });
}

async function getAllDescendantPosts(postId: string): Promise<{ id: string; media: any[] }[]> {
    const replies = await prisma.post.findMany({
        where: { replyToPostId: postId },
        select: { id: true, media: true }
    });
    
    let descendants: { id: string; media: any[] }[] = [];
    for (const reply of replies) {
        const childDescendants = await getAllDescendantPosts(reply.id);
        descendants = descendants.concat(childDescendants);
    }
    // Return children before parents to delete bottom-up without foreign key errors
    return descendants.concat(replies);
}

export async function deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true, media: true }
    });

    if (!post) throw new Error('Post not found');
    if (post.userId !== userId) throw new Error('Unauthorized');

    // Find all descendants (nested comments/replies) to delete their media and them
    const descendants = await getAllDescendantPosts(postId);

    // Delete descendants from database, bottom up
    for (const descendant of descendants) {
        await prisma.post.delete({
            where: { id: descendant.id }
        });
    }

    const deletedPost = await prisma.post.delete({
        where: { id: postId }
    });

    // Delete post media
    if (post.media && post.media.length > 0) {
        const keysToDelete = post.media
            .map(m => extractKeyFromUrl(m.url))
            .filter((key): key is string => key !== null);
            
        if (keysToDelete.length > 0) {
            try {
                console.log(`Deleting post media keys from UploadThing:`, keysToDelete);
                await utapi.deleteFiles(keysToDelete);
            } catch (err) {
                console.error("Failed to delete post media from UT:", err);
            }
        }
    }

    // Delete replies media
    const replyKeysToDelete = descendants
        .flatMap(r => r.media || [])
        .map(m => extractKeyFromUrl(m.url))
        .filter((key): key is string => key !== null);

    if (replyKeysToDelete.length > 0) {
        try {
            console.log(`Deleting reply media keys from UploadThing:`, replyKeysToDelete);
            await utapi.deleteFiles(replyKeysToDelete);
        } catch (err) {
            console.error("Failed to delete reply media from UT:", err);
        }
    }

    return deletedPost;
}

export async function togglePostLike(postId: string, userId: string) {
    const existingLike = await prisma.postLike.findUnique({
        where: {
            postId_userId: {
                postId,
                userId
            }
        }
    });

    if (existingLike) {
        await prisma.$transaction([
            prisma.postLike.delete({
                where: { id: existingLike.id }
            }),
            prisma.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } }
            })
        ]);
        return { liked: false };
    } else {
        await prisma.$transaction([
            prisma.postLike.create({
                data: { postId, userId }
            }),
            prisma.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } }
            })
        ]);
        return { liked: true };
    }
}

export async function getPosts(limit: number = 20, offset: number = 0) {
    return await prisma.post.findMany({
        where: {
            replyToPostId: null, // Only top-level posts in main feed
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                }
            },
            media: true,
            _count: {
                select: {
                    likes: true,
                    replies: true,
                }
            }
        }
    });
}

export type PostWithDetails = Prisma.PostGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                username: true;
                image: true;
            }
        };
        media: true;
        replyToPost: {
            include: {
                user: {
                    select: {
                        id: true;
                        name: true;
                        username: true;
                        image: true;
                    }
                };
                media: true;
                _count: {
                    select: {
                        likes: true;
                        replies: true;
                    }
                };
            }
        };
        _count: {
            select: {
                likes: true;
                replies: true;
            }
        };
    };
}>;

export async function getPostById(postId: string): Promise<PostWithDetails | null> {
    return await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                }
            },
            media: true,
            replyToPost: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        }
                    },
                    media: true,
                    _count: {
                        select: {
                            likes: true,
                            replies: true,
                        }
                    }
                }
            },
            _count: {
                select: {
                    likes: true,
                    replies: true,
                }
            }
        }
    });
}

export async function getReplies(postId: string) {
    return await prisma.post.findMany({
        where: {
            replyToPostId: postId
        },
        orderBy: { createdAt: 'asc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                }
            },
            media: true,
            _count: {
                select: {
                    likes: true,
                    replies: true,
                }
            }
        }
    });
}

export async function getPostsByUserId(userId: string, currentUserId?: string, limit: number = 20, offset: number = 0) {
    const posts = await prisma.post.findMany({
        where: {
            userId: userId,
            replyToPostId: null, // Only top-level posts
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                }
            },
            media: true,
            likes: currentUserId ? {
                where: {
                    userId: currentUserId
                }
            } : false,
            _count: {
                select: {
                    likes: true,
                    replies: true,
                }
            }
        }
    });

    return posts.map(post => ({
        ...post,
        isLiked: currentUserId ? post.likes.length > 0 : false
    }));
}

export async function updatePost(postId: string, userId: string, data: {
    content: string;
    media?: { url: string; type: 'Image' | 'Video' | 'Audio' | 'File'; size: number }[];
}) {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true, media: true }
    });

    if (!post) throw new Error('Post not found');
    if (post.userId !== userId) throw new Error('Unauthorized');

    // Update post content
    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
            content: data.content,
            media: data.media ? {
                deleteMany: {}, // Delete existing media records
                create: data.media.map(m => ({
                    userId: userId,
                    url: m.url,
                    type: m.type,
                    size: m.size
                }))
            } : undefined
        },
        include: {
            user: true,
            media: true
        }
    });

    return updatedPost;
}
