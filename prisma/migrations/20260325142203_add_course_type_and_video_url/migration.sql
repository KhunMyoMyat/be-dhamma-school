-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('ZOOM', 'VIDEO');

-- AlterTable
ALTER TABLE "contact_inquiries" ADD COLUMN     "event_id" TEXT,
ADD COLUMN     "sponsor_type" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'ZOOM',
ADD COLUMN     "video_url" TEXT;

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "slip_url" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'approved';

-- AlterTable
ALTER TABLE "monthly_donors" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "end_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contact_inquiries" ADD CONSTRAINT "contact_inquiries_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
