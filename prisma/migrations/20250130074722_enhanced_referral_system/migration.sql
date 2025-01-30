/*
  Warnings:

  - You are about to drop the column `reward` on the `referral` table. All the data in the column will be lost.
  - You are about to drop the column `referralsPoints` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referredBy` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `referral` DROP COLUMN `reward`,
    ADD COLUMN `courseId` VARCHAR(191) NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `message` TEXT NULL,
    ADD COLUMN `purchaseAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `purchaseDate` DATETIME(3) NULL,
    ADD COLUMN `registrationDate` DATETIME(3) NULL,
    ADD COLUMN `rewardAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `rewardStatus` ENUM('PENDING', 'PROCESSED', 'FAILED', 'CANCELLED') NULL DEFAULT 'PENDING',
    MODIFY `status` ENUM('PENDING', 'USER_REGISTERED', 'COURSE_PURCHASED', 'EXPIRED', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `referralsPoints`,
    DROP COLUMN `referredBy`,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `referralPoints` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `referralTier` ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND') NOT NULL DEFAULT 'BRONZE',
    ADD COLUMN `referredById` VARCHAR(191) NULL,
    ADD COLUMN `totalEarnings` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `ReferralStats` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `totalReferrals` INTEGER NOT NULL DEFAULT 0,
    `successfulReferrals` INTEGER NOT NULL DEFAULT 0,
    `pendingReferrals` INTEGER NOT NULL DEFAULT 0,
    `totalRewards` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `monthlyReferrals` INTEGER NOT NULL DEFAULT 0,
    `monthlyRewards` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `lastRewardDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ReferralStats_userId_key`(`userId`),
    INDEX `ReferralStats_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReferralHistory` (
    `id` VARCHAR(191) NOT NULL,
    `referralId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATED', 'STATUS_UPDATED', 'REWARD_PROCESSED', 'EXPIRED', 'CANCELLED', 'REGISTRATION_COMPLETED', 'COURSE_PURCHASED') NOT NULL,
    `status` ENUM('PENDING', 'USER_REGISTERED', 'COURSE_PURCHASED', 'EXPIRED', 'CANCELLED', 'REJECTED') NOT NULL,
    `description` TEXT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ReferralHistory_referralId_idx`(`referralId`),
    INDEX `ReferralHistory_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('REFERRAL_CREATED', 'REFERRAL_ACCEPTED', 'REFERRAL_EXPIRED', 'REWARD_EARNED', 'TIER_UPGRADED', 'SYSTEM_NOTICE') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` JSON NULL,

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Referral_refereeEmail_idx` ON `Referral`(`refereeEmail`);

-- CreateIndex
CREATE INDEX `Referral_status_idx` ON `Referral`(`status`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralStats` ADD CONSTRAINT `ReferralStats_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralHistory` ADD CONSTRAINT `ReferralHistory_referralId_fkey` FOREIGN KEY (`referralId`) REFERENCES `Referral`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReferralHistory` ADD CONSTRAINT `ReferralHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
