-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone_number" TEXT;
