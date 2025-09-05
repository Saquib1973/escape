/*
  Warnings:

  - You are about to drop the column `movieId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_movieId_fkey";

-- DropIndex
DROP INDEX "public"."Post_movieId_idx";

-- AlterTable
ALTER TABLE "public"."Movie" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'movie';

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "movieId",
ADD COLUMN     "contentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Post_contentId_idx" ON "public"."Post"("contentId");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
