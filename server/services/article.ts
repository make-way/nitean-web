import { PostStatus } from '@/enum';
import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { deleteMediaIfOrphaned } from './media';

/**
 * Service: Pure database interaction.
 * Use this when you need raw data without Next.js caching overhead
 * (e.g., inside a Cron job or a background worker).
 */
export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { user: true, media: true },
  });
}

export async function createArticle(data: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: PostStatus;
  userId: string;
  mediaId?: number;
}) {
  const post = await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      status: data.status,
      userId: data.userId,
      mediaId: data.mediaId,
    },
    include: {
      user: true, 
      media: true,
    },
  });

  // CACHE INVALIDATION
  // This clears the Next.js Data Cache for the user's post list
  revalidatePath(`/${post.user.username}/posts`);
  revalidatePath(`/posts`); // If you have a global feed
  // Also revalidate the home page so cached main feed updates immediately
  revalidatePath(`/`);
  revalidateTag('posts', 'max');


  return post;
}

export async function checkSlugAvailability(slug: string, excludePostId?: number) {
  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true },
  });

  // If updating, allow the same slug for the same post
  if (excludePostId && existing && existing.id === excludePostId) {
    return true;
  }

  return !existing;
}

export async function updatePost(data: {
  id: number;
  slug: string;
  title: string;
  newSlug: string;
  summary: string;
  content: string;
  status: PostStatus;
  userId: string;
  mediaId?: number;
}) {
  // Only update slug if it has changed
  const updateData: any = {
    title: data.title,
    summary: data.summary,
    content: data.content,
    status: data.status,
    mediaId: data.mediaId ?? null,
  };

  // Only include slug update if it's different from current slug
  if (data.newSlug !== data.slug) {
    updateData.slug = data.newSlug;
  }

  // CHECK FOR OLD MEDIA
  const oldPost = await prisma.article.findUnique({
    where: { slug: data.slug },
    select: { mediaId: true },
  });

  const post = await prisma.article.update({
    where: { slug: data.slug },
    data: updateData,
    include: {
      user: true,
      media: true,
    },
  });

  // CLEANUP OLD MEDIA IF CHANGED
  if (oldPost?.mediaId && oldPost.mediaId !== data.mediaId) {
    // Only cleanup if the media has actually changed
    // This will check if any OTHER posts still use the old media before deleting
    await deleteMediaIfOrphaned(oldPost.mediaId);
  }

  // CACHE INVALIDATION
  revalidatePath(`/${post.user.username}/posts`);
  revalidatePath(`/posts`);
  revalidatePath(`/`);
  revalidatePath(`/post/${post.slug.trim()}`);
  revalidateTag('posts', 'max');

  if (data.newSlug !== data.slug) {
    revalidatePath(`/post/${data.slug.trim()}`); // Old slug path
  }

  return post;
}

export async function deletePost(slug: string) {
  // 1. Fetch the post first to get any associated media
  const postToDelete = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, mediaId: true, user: { select: { username: true } } },
  });

  if (!postToDelete) {
     throw new Error("Post not found");
  }

  // EXPLICITLY delete comments to ensure they are removed (backup for cascade)
  await prisma.comment.deleteMany({
    where: { articleId: postToDelete.id },
  });

  // 2. Delete the post from the database
  const post = await prisma.article.delete({
    where: { slug },
    include: {
      user: true,
    },
  });

  // 3. Cleanup associated media if it's no longer used by any other posts
  if (postToDelete.mediaId) {
    await deleteMediaIfOrphaned(postToDelete.mediaId);
  }

  // CACHE INVALIDATION
  revalidatePath(`/${post.user.username}/posts`);
  revalidatePath(`/posts`);
  revalidatePath(`/`);
  revalidateTag('posts', 'max');

  return post;
}

export async function getPostById(id: number) {
  return prisma.article.findUnique({
    where: { id },
    include: { user: true, media: true },
  });
}

/**
 * Service: Get posts to home page with pagination
 */
export const getCachedPosts = unstable_cache(
  async (limit: number, skip: number) => {
    return await prisma.article.findMany({
      where: { status: PostStatus.Aprove },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
      include: { 
        user: true, 
        media: true,
        _count: { select: { likes: true, comments: true } } 
      },
    });
  },
  ['main-feed-posts'],
  { revalidate: 3600, tags: ['posts'] }
);
