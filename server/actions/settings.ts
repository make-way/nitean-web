"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateTheme, getUserSettings } from "../services/settings";
import { revalidatePath } from "next/cache";

export async function updateThemeAction(theme: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const updatedSettings = await updateTheme(session.user.id, theme);
    revalidatePath("/profile/settings/appearance");
    return { success: true, data: updatedSettings };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update theme" };
  }
}

export async function getUserSettingsAction() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }
  
    try {
      const settings = await getUserSettings(session.user.id);
      return { success: true, data: settings };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to fetch settings" };
    }
  }
