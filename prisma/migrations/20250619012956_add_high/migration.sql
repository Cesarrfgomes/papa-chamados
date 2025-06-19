/*
  Warnings:

  - The values [HIGh] on the enum `Priority` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Priority_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
ALTER TABLE "tickets" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "tickets" ALTER COLUMN "priority" TYPE "Priority_new" USING ("priority"::text::"Priority_new");
ALTER TYPE "Priority" RENAME TO "Priority_old";
ALTER TYPE "Priority_new" RENAME TO "Priority";
DROP TYPE "Priority_old";
ALTER TABLE "tickets" ALTER COLUMN "priority" SET DEFAULT 'LOW';
COMMIT;
