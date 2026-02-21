import prisma from "@/lib/prisma";
import { slugifyUsername } from "@/utils/enerateUsername";

export async function updateSingleUserField(
  userId: string,
  field: 'name' | 'username' | 'phone_number' | 'image' | 'bio' | 'telegram_link' | 'linkedin_link' | 'github_link' | 'youtube_link' | 'tiktok_link' | 'facebook_link',
  value: string
) {
  // 1. Data refinement and validation
  let dataToUpdate: any = {};

  if (field === 'username') {
    const username = slugifyUsername(value);
    
    if (username.length < 3) {
        throw new Error("Username must be at least 3 characters");
    }

    // Condition to check username uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username is already taken");
    }
    
    dataToUpdate.username = username;
  } else if (field === 'name') {
    if (!value.trim()) throw new Error("Name cannot be empty");
    dataToUpdate.name = value.trim();
  } else if (field === 'phone_number') {
    dataToUpdate.phone_number = value.trim();
  } else if (field === 'image') {
    dataToUpdate.image = value;
  } 
  else if (field === 'bio') {
    dataToUpdate.bio = value;
  } 
  else if (field === 'telegram_link') {
    dataToUpdate.telegram_link = value;
  } 
  else if (field === 'linkedin_link') {
    dataToUpdate.linkedin_link = value;
  } 
  else if (field === 'github_link') {
    dataToUpdate.github_link = value;
  } 
  else if (field === 'youtube_link') {
    dataToUpdate.youtube_link = value;
  } 
  else if (field === 'tiktok_link') {
    dataToUpdate.tiktok_link = value;
  } 
  else if (field === 'facebook_link') {
    dataToUpdate.facebook_link = value;
  } 
  else {
    throw new Error("Invalid field update request");
  }

  // 2. Perform the update (strictly updating one field)
  return await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  });
}

export async function checkUsernameUnique(username: string, userId: string) {
  const slug = slugifyUsername(username);
  const existingUser = await prisma.user.findUnique({
    where: { username: slug },
  });

  return !existingUser || existingUser.id === userId;
}
