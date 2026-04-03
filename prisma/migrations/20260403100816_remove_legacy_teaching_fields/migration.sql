/*
  Warnings:

  - You are about to drop the column `content` on the `teachings` table. All the data in the column will be lost.
  - You are about to drop the column `content_mm` on the `teachings` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `teachings` table. All the data in the column will be lost.
  - You are about to drop the column `title_mm` on the `teachings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "teachings" DROP COLUMN "content",
DROP COLUMN "content_mm",
DROP COLUMN "title",
DROP COLUMN "title_mm";
