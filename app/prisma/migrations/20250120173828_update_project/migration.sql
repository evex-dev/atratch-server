/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `assetMap` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectJson` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Like_subjectUser_subjectKey_key";

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("user", "subjectUser", "subjectKey");

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "assetMap" JSONB NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "projectJson" JSONB NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
