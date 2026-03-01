import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { MediaType } from "@/lib/generated/prisma/client";

const f = createUploadthing();

/** Helper – derive a MediaType from a MIME type string */
function resolveMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) return MediaType.Image;
  if (mimeType.startsWith("video/")) return MediaType.Video;
  if (mimeType.startsWith("audio/")) return MediaType.Audio;
  return MediaType.File;
}

/** Helper – extract the file extension from a file name or MIME type */
function resolveExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export const ourFileRouter = {
  /** ---- Profile Image ---- */
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Persist to Media table
      const media = await prisma.media.create({
        data: {
          userId:    metadata.userId,
          name:      file.name,
          url:       file.url,
          mediaType: MediaType.Image,
          extension: resolveExtension(file.name),
          size:      file.size,
        },
      });

      console.log("Profile image uploaded – mediaId:", media.id);
      return { uploadedBy: metadata.userId, url: file.url, mediaId: media.id };
    }),

  /** ---- Post Thumbnail ---- */
  postThumbnail: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Persist to Media table
      const media = await prisma.media.create({
        data: {
          userId:    metadata.userId,
          name:      file.name,
          url:       file.url,
          mediaType: resolveMediaType(file.type),
          extension: resolveExtension(file.name),
          size:      file.size,
        },
      });

      console.log("Post thumbnail uploaded – mediaId:", media.id);
      return { uploadedBy: metadata.userId, url: file.url, mediaId: media.id };
    }),

  /** ---- Generic File (PDF, docs, etc.) ---- */
  postFile: f({ blob: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const media = await prisma.media.create({
        data: {
          userId:    metadata.userId,
          name:      file.name,
          url:       file.url,
          mediaType: resolveMediaType(file.type),
          extension: resolveExtension(file.name),
          size:      file.size,
        },
      });

      console.log("File uploaded – mediaId:", media.id);
      return { uploadedBy: metadata.userId, url: file.url, mediaId: media.id };
    }),
  /** ---- Feed Media (Multiple images/videos) ---- */
  feedMedia: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    video: { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // We don't necessarily need to persist to the 'Media' table here 
      // if we're going to use 'PostMedia' in the post creation,
      // but it's good for tracking orphaned files.
      return { uploadedBy: metadata.userId, url: file.url, size: file.size, type: file.type };
    }),
} satisfies FileRouter;


export type OurFileRouter = typeof ourFileRouter;
