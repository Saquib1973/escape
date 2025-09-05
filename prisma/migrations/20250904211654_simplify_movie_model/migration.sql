/*
  Warnings:

  - You are about to drop the column `adult` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `backdropPath` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `homepage` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `imdbId` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `originalLanguage` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `originalTitle` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `posterPath` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `runtime` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `voteCount` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieProductionCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieProductionCountry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieSpokenLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductionCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductionCountry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpokenLanguage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MovieGenre" DROP CONSTRAINT "MovieGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieGenre" DROP CONSTRAINT "MovieGenre_movieId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieProductionCompany" DROP CONSTRAINT "MovieProductionCompany_movieId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieProductionCompany" DROP CONSTRAINT "MovieProductionCompany_productionCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieProductionCountry" DROP CONSTRAINT "MovieProductionCountry_movieId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieProductionCountry" DROP CONSTRAINT "MovieProductionCountry_productionCountryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieSpokenLanguage" DROP CONSTRAINT "MovieSpokenLanguage_movieId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieSpokenLanguage" DROP CONSTRAINT "MovieSpokenLanguage_spokenLanguageId_fkey";

-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "adult",
DROP COLUMN "backdropPath",
DROP COLUMN "budget",
DROP COLUMN "homepage",
DROP COLUMN "imdbId",
DROP COLUMN "originalLanguage",
DROP COLUMN "originalTitle",
DROP COLUMN "overview",
DROP COLUMN "popularity",
DROP COLUMN "posterPath",
DROP COLUMN "rating",
DROP COLUMN "releaseDate",
DROP COLUMN "revenue",
DROP COLUMN "runtime",
DROP COLUMN "status",
DROP COLUMN "tagline",
DROP COLUMN "title",
DROP COLUMN "video",
DROP COLUMN "voteCount";

-- DropTable
DROP TABLE "public"."Genre";

-- DropTable
DROP TABLE "public"."MovieGenre";

-- DropTable
DROP TABLE "public"."MovieProductionCompany";

-- DropTable
DROP TABLE "public"."MovieProductionCountry";

-- DropTable
DROP TABLE "public"."MovieSpokenLanguage";

-- DropTable
DROP TABLE "public"."ProductionCompany";

-- DropTable
DROP TABLE "public"."ProductionCountry";

-- DropTable
DROP TABLE "public"."SpokenLanguage";
