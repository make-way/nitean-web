import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/**
 * Extracts the file key from an UploadThing URL.
 * URL format: https://utfs.io/f/<key>
 */
function extractKeyFromUrl(url: string): string | null {
  try {
    const parts = url.split("/");
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Deletes a media record and its associated file from storage
 * if it is no longer referenced by any posts.
 */
export async function deleteMediaIfOrphaned(mediaId: number) {
  try {
    // 1. Check if the media is still referenced by any posts
    const postCount = await prisma.post.count({
      where: { mediaId: mediaId },
    });

    if (postCount > 0) {
      console.log(`Media ${mediaId} is still referenced by ${postCount} posts. Not deleting.`);
      return;
    }

    // 2. Fetch media details
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) return;

    // 3. Delete from UploadThing storage
    const key = extractKeyFromUrl(media.url);
    if (key) {
      console.log(`Deleting file from UploadThing: ${key}`);
      await utapi.deleteFiles(key);
    }

    // 4. Delete from database
    await prisma.media.delete({
      where: { id: mediaId },
    });

    console.log(`Media ${mediaId} (URL: ${media.url}) deleted successfully.`);
  } catch (error) {
    console.error(`Failed to cleanup orphaned media ${mediaId}:`, error);
  }
}
