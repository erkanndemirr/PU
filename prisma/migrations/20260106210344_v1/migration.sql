-- AlterTable
ALTER TABLE `topic` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `imageUrl` TEXT NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;
