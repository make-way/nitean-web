import prisma from "@/lib/prisma";

export async function getUserSettings(userId: string) {
  let settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        userId,
        id: userId, // Using userId as id for convenience or generate a new one
        theme: "system",
      },
    });
  }

  return settings;
}

export async function updateTheme(userId: string, theme: string) {
  return await prisma.userSettings.upsert({
    where: { userId },
    update: { theme },
    create: {
      userId,
      id: userId,
      theme,
    },
  });
}
