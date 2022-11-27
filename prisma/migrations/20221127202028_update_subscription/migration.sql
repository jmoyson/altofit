/*
  Warnings:

  - Added the required column `price` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('MONTHLY', 'DAILY');

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "recurrence" "Recurrence" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "renewedAt" TIMESTAMP(3);
