-- Allow removing a player after a finished game while cleaning up their assignments.
ALTER TABLE `GamePlayer`
DROP FOREIGN KEY `GamePlayer_playerId_fkey`;

ALTER TABLE `GamePlayer`
ADD CONSTRAINT `GamePlayer_playerId_fkey`
FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;
