/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "Project" (
    "user" TEXT NOT NULL,
    "rkey" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("user","rkey")
);

-- CreateTable
CREATE TABLE "Like" (
    "subjectUser" TEXT NOT NULL,
    "subjectKey" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("user","key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_subjectUser_subjectKey_key" ON "Like"("subjectUser", "subjectKey");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_subjectUser_subjectKey_fkey" FOREIGN KEY ("subjectUser", "subjectKey") REFERENCES "Project"("user", "rkey") ON DELETE RESTRICT ON UPDATE CASCADE;
