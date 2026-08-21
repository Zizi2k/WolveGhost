-- CreateTable
CREATE TABLE `GameNight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gameId` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,
    `night` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GameNight_gameId_night_idx`(`gameId`, `night`),
    UNIQUE INDEX `GameNight_gameId_night_playerId_key`(`gameId`, `night`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameNight` ADD CONSTRAINT `GameNight_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameNight` ADD CONSTRAINT `GameNight_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;