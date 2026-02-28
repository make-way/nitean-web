'use server';

import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

/**
 * Action: Get media from owner
 * This caches the media fetch for 10 minutes, but tags it for manual invalidation
 */
export const getUserMedia = unstable_cache(
  async (userId: string) => {
    return await prisma.media.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
  ['user-media'], // Cache Key
  {
    revalidate: 600,
    tags: ['media'], // Tag for revalidateTag("media")
  }
);