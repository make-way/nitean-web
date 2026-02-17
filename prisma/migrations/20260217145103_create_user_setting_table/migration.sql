-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "userSetting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "showProfileInMemberList" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'en',
    "fontFamily" TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userSetting_userId_key" ON "userSetting"("userId");

-- AddForeignKey
ALTER TABLE "userSetting" ADD CONSTRAINT "userSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
