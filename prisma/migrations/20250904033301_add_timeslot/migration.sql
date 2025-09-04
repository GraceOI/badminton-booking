-- AlterTable
ALTER TABLE `booking` ADD COLUMN `timeSlotId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TimeSlot` (
    `id` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_timeSlotId_fkey` FOREIGN KEY (`timeSlotId`) REFERENCES `TimeSlot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
