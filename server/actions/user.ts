"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateSingleUserField, checkUsernameUnique } from "../services/user";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

export async function updateSingleUserFieldAction(field: 'name' | 'username' | 'phone_number' | 'image' | 'bio' | 'telegram_link' | 'linkedin_link' | 'github_link' | 'youtube_link' | 'tiktok_link' | 'facebook_link', value: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const updatedUser = await updateSingleUserField(session.user.id, field, value);
    revalidatePath("/profile/settings/account");
    return { success: true, data: updatedUser };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update field" };
  }
}

export async function checkUsernameUniqueAction(username: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const isUnique = await checkUsernameUnique(username, session.user.id);
    return { success: true, isUnique };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to check username" };
  }
}

export async function deleteUploadThingFileAction(fileUrl: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const url = new URL(fileUrl);
    const fileKey = url.pathname.split('/').pop();
    if (!fileKey) return { success: false, message: "Invalid file URL" };

    const utapi = new UTApi();
    await utapi.deleteFiles(fileKey);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete file" };
  }
}
