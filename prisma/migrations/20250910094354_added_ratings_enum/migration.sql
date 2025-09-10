/*
  Warnings:

  - The `rating` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Rating" AS ENUM ('TRASH', 'TIMEPASS', 'ONE_TIME_WATCH', 'MUST_WATCH', 'LEGENDARY');

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "rating",
ADD COLUMN     "rating" "public"."Rating";
