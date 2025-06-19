/*
  Warnings:

  - Made the column `priority` on table `tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "priority" SET NOT NULL;
