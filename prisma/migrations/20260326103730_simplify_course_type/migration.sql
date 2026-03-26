/*
  Warnings:

  - The values [ZOOM] on the enum `CourseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseType_new" AS ENUM ('VIDEO');
ALTER TABLE "courses" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "courses" ALTER COLUMN "type" TYPE "CourseType_new" USING ("type"::text::"CourseType_new");
ALTER TYPE "CourseType" RENAME TO "CourseType_old";
ALTER TYPE "CourseType_new" RENAME TO "CourseType";
DROP TYPE "CourseType_old";
ALTER TABLE "courses" ALTER COLUMN "type" SET DEFAULT 'VIDEO';
COMMIT;

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "type" SET DEFAULT 'VIDEO';
