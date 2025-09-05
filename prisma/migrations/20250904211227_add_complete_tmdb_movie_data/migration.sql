-- AlterTable
ALTER TABLE "public"."Movie" ADD COLUMN     "adult" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "backdropPath" TEXT,
ADD COLUMN     "budget" INTEGER,
ADD COLUMN     "homepage" TEXT,
ADD COLUMN     "imdbId" TEXT,
ADD COLUMN     "originalLanguage" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "revenue" INTEGER,
ADD COLUMN     "runtime" INTEGER,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "video" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "voteCount" INTEGER;

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovieGenre" (
    "movieId" TEXT NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("movieId","genreId")
);

-- CreateTable
CREATE TABLE "public"."ProductionCompany" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoPath" TEXT,
    "originCountry" TEXT,

    CONSTRAINT "ProductionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovieProductionCompany" (
    "movieId" TEXT NOT NULL,
    "productionCompanyId" INTEGER NOT NULL,

    CONSTRAINT "MovieProductionCompany_pkey" PRIMARY KEY ("movieId","productionCompanyId")
);

-- CreateTable
CREATE TABLE "public"."ProductionCountry" (
    "iso31661" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductionCountry_pkey" PRIMARY KEY ("iso31661")
);

-- CreateTable
CREATE TABLE "public"."MovieProductionCountry" (
    "movieId" TEXT NOT NULL,
    "productionCountryId" TEXT NOT NULL,

    CONSTRAINT "MovieProductionCountry_pkey" PRIMARY KEY ("movieId","productionCountryId")
);

-- CreateTable
CREATE TABLE "public"."SpokenLanguage" (
    "iso6391" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpokenLanguage_pkey" PRIMARY KEY ("iso6391")
);

-- CreateTable
CREATE TABLE "public"."MovieSpokenLanguage" (
    "movieId" TEXT NOT NULL,
    "spokenLanguageId" TEXT NOT NULL,

    CONSTRAINT "MovieSpokenLanguage_pkey" PRIMARY KEY ("movieId","spokenLanguageId")
);

-- AddForeignKey
ALTER TABLE "public"."MovieGenre" ADD CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieGenre" ADD CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieProductionCompany" ADD CONSTRAINT "MovieProductionCompany_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieProductionCompany" ADD CONSTRAINT "MovieProductionCompany_productionCompanyId_fkey" FOREIGN KEY ("productionCompanyId") REFERENCES "public"."ProductionCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieProductionCountry" ADD CONSTRAINT "MovieProductionCountry_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieProductionCountry" ADD CONSTRAINT "MovieProductionCountry_productionCountryId_fkey" FOREIGN KEY ("productionCountryId") REFERENCES "public"."ProductionCountry"("iso31661") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieSpokenLanguage" ADD CONSTRAINT "MovieSpokenLanguage_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieSpokenLanguage" ADD CONSTRAINT "MovieSpokenLanguage_spokenLanguageId_fkey" FOREIGN KEY ("spokenLanguageId") REFERENCES "public"."SpokenLanguage"("iso6391") ON DELETE CASCADE ON UPDATE CASCADE;
