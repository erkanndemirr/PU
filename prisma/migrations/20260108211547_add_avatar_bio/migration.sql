/*
  Warnings:

  - You are about to drop the column `category` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the column `topicContent` on the `topic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_topicId_fkey`;

-- DropForeignKey
ALTER TABLE `topic` DROP FOREIGN KEY `Topic_authorId_fkey`;

-- DropIndex
DROP INDEX `Post_authorId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_topicId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Topic_authorId_fkey` ON `topic`;

-- AlterTable
ALTER TABLE `topic` DROP COLUMN `category`,
    DROP COLUMN `country`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `state`,
    DROP COLUMN `topicContent`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `bio` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Topic` ADD CONSTRAINT `Topic_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
