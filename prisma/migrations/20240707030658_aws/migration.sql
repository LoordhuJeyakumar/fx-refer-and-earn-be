/*
  Warnings:

  - The values [USER_REGISTER] on the enum `Referral_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Referral` MODIFY `status` ENUM('PENDING', 'USER_REGISTERED', 'COURSE_PURCHASED') NOT NULL DEFAULT 'PENDING';
