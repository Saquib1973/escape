-- CreateTable
CREATE TABLE "public"."UserActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityDate" TIMESTAMP(3) NOT NULL,
    "activityType" TEXT NOT NULL,
    "contentId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserActivity_userId_idx" ON "public"."UserActivity"("userId");

-- CreateIndex
CREATE INDEX "UserActivity_activityDate_idx" ON "public"."UserActivity"("activityDate");

-- CreateIndex
CREATE INDEX "UserActivity_userId_activityDate_idx" ON "public"."UserActivity"("userId", "activityDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_userId_activityDate_activityType_key" ON "public"."UserActivity"("userId", "activityDate", "activityType");

-- AddForeignKey
ALTER TABLE "public"."UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
