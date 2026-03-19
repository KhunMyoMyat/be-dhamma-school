-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "class_time" TEXT,
ADD COLUMN     "days_of_week" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "days_per_week" INTEGER,
ADD COLUMN     "start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "co_sponsors" JSONB,
ADD COLUMN     "main_sponsor" TEXT,
ADD COLUMN     "main_sponsor_mm" TEXT;

-- AlterTable
ALTER TABLE "teachings" ADD COLUMN     "document_name" TEXT,
ADD COLUMN     "document_size" INTEGER,
ADD COLUMN     "document_type" TEXT,
ADD COLUMN     "document_url" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "teaching_translations" (
    "id" TEXT NOT NULL,
    "teaching_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teaching_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teaching_translations_locale_idx" ON "teaching_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_translations_teaching_id_locale_key" ON "teaching_translations"("teaching_id", "locale");

-- AddForeignKey
ALTER TABLE "teaching_translations" ADD CONSTRAINT "teaching_translations_teaching_id_fkey" FOREIGN KEY ("teaching_id") REFERENCES "teachings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
