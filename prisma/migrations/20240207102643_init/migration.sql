/*
  Warnings:

  - Added the required column `taskStatus` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskStatus" TEXT NOT NULL;
