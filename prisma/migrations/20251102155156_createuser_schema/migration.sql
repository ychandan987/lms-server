-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
