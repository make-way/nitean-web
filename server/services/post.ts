import prisma from "@/lib/prisma";

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