"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Action: Handles user-driven side effects.
 * Always use these for forms or button clicks that change data.
 */
export async function incrementPostLike(postId: number) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }, //like will be added to table in the future
    });
    
    // Purge the cache so the user sees the update
    revalidatePath("/post/[slug]", "page");
  } catch (error) {
    console.error("Failed to increment like:", error);
  }
}