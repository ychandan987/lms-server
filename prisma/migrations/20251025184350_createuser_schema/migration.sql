/*
  Warnings:

  - Added the required column `inActive` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastLogin" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "inActive",
ADD COLUMN     "inActive" BOOLEAN NOT NULL;
