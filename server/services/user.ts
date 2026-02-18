import prisma from "@/lib/prisma";
import { slugifyUsername } from "@/utils/enerateUsername";

export async function updateSingleUserField(
  userId: string,
  field: 'name' | 'username' | 'phone_number' | 'image' | 'bio',
  value: string
) {
  // 1. Data refinement and validation
  const dataToUpdate: Partial<Record<'username' | 'name' | 'phone_number' | 'image' | 'bio', string>> = {};

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
  } else if (field === 'bio') {
    dataToUpdate.bio = value;
  } else {
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
