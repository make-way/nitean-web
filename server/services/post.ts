import { PostStatus } from '@/enum';
import prisma from '@/lib/prisma';
import { revalidatePath, unstable_cache } from 'next/cache';

/**
 * Service: Pure database interaction.
 * Use this when you need raw data without Next.js caching overhead
 * (e.g., inside a Cron job or a background worker).
 */
export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { user: true },
  });
}

export async function createPost(data: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: PostStatus;
  userId: string;
  thumbnail?: string;
}) {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      status: data.status,
      userId: data.userId,
      thumbnail: data.thumbnail,
    },
    include: {
      user: true, // Useful if you need to return the username immediately
    },
  });

  // CACHE INVALIDATION
  // This clears the Next.js Data Cache for the user's post list
  revalidatePath(`/${post.user.username}/posts`);
  revalidatePath(`/posts`); // If you have a global feed
  // Also revalidate the home page so cached main feed updates immediately
  revalidatePath(`/`);

  return post;
}

export async function checkSlugAvailability(slug: string, excludePostId?: number) {
  const existing = await prisma.post.findUnique({
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
  thumbnail?: string;
}) {
  // Only update slug if it has changed
  const updateData: any = {
    title: data.title,
    summary: data.summary,
    content: data.content,
    status: data.status,
    thumbnail: data.thumbnail,
  };

  // Only include slug update if it's different from current slug
  if (data.newSlug !== data.slug) {
    updateData.slug = data.newSlug;
  }

  const post = await prisma.post.update({
    where: { slug: data.slug },
    data: updateData,
    include: {
      user: true,
    },
  });

  // CACHE INVALIDATION
  revalidatePath(`/${post.user.username}/posts`);
  revalidatePath(`/posts`);
  revalidatePath(`/`);
  revalidatePath(`/post/${post.slug}`);
  if (data.newSlug !== data.slug) {
    revalidatePath(`/post/${data.slug}`); // Old slug path
  }

  return post;
}

export async function deletePost(slug: string) {
  const post = await prisma.post.delete({
    where: { slug },
    include: {
      user: true,
    },
  });

  // CACHE INVALIDATION
  revalidatePath(`/${post.user.username}/posts`);
  revalidatePath(`/posts`);
  revalidatePath(`/`);

  return post;
}

export async function getPostById(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { user: true },
  });
}

/**
 * Service: Get posts to home page with pagination
 */
export const getCachedPosts = unstable_cache(
  async (limit: number, skip: number) => {
    return await prisma.post.findMany({
      where: { status: PostStatus.Aprove },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
      include: { user: true, _count: { select: { likes: true } } },
    });
  },
  ['main-feed-posts'],
  { revalidate: 3600, tags: ['posts'] }
);
