-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT,
ALTER COLUMN "active" SET DEFAULT false,
ALTER COLUMN "usertype" SET DEFAULT 'ADMIN',
ALTER COLUMN "inActive" SET DEFAULT false;
