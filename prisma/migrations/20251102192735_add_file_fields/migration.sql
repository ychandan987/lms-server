/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `Video` table. All the data in the column will be lost.
  - Added the required column `title` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "createdAt",
DROP COLUMN "publicId",
DROP COLUMN "resourceType",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
