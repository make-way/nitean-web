"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateSingleUserField, checkUsernameUnique } from "../services/user";
import { revalidatePath } from "next/cache";

export async function updateSingleUserFieldAction(field: 'name' | 'username' | 'phone_number' | 'image', value: string) {
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
