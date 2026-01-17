import prisma from "../lib/prisma";

export function slugifyUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20);
}

export async function generateUniqueUsername(base: string) {
  let username = slugifyUsername(base);
  let exists = await prisma.user.findUnique({ where: { username } });

  let counter = 1;
  while (exists) {
    const newUsername = `${username}${counter}`;
    exists = await prisma.user.findUnique({
      where: { username: newUsername },
    });
    if (!exists) return newUsername;
    counter++;
  }

  return username;
}
