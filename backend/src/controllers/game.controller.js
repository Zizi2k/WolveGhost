import crypto from "crypto";
import prisma from "../config/prisma.js";
function shuffle(array) {
    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {
        const randomIndex =
            crypto.randomInt(0, i + 1);

        [
            result[i],
            result[randomIndex],
        ] = [
            result[randomIndex],
            result[i],
        ];
    }

    return result;
}
export const createGame = async (
    req,
    res
) => {
    try {
        const roomId =
            Number(req.params.roomId);

        const { characters } =
            req.body;

        /*
        characters mẫu:

        [
            {
                "characterId": 1,
                "quantity": 2
            },
            {
                "characterId": 2,
                "quantity": 3
            }
        ]
        */

        if (
            !Array.isArray(characters) ||
            characters.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng chọn bộ nhân vật",
            });
        }

        const room =
            await prisma.room.findFirst({
                where: {
                    id: roomId,
                    hostId: req.user.id,
                },

                include: {
                    players: true,
                },
            });

        if (!room) {
            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy phòng",
            });
        }

        if (
            room.status !== "WAITING" &&
            room.status !== "FINISHED"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Phòng không ở trạng thái chờ",
            });
        }

        if (room.players.length < 4) {
            return res.status(400).json({
                success: false,
                message:
                    "Cần ít nhất 4 người chơi",
            });
        }

        let totalCards = 0;

        for (const item of characters) {
            const quantity =
                Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Số lượng lá bài không hợp lệ",
                });
            }

            totalCards += quantity;
        }

        if (
            totalCards !==
            room.players.length
        ) {
            return res.status(400).json({
                success: false,

                message:
                    `Số lá bài (${totalCards}) phải bằng số người chơi (${room.players.length})`,
            });
        }

        const characterIds =
            characters.map(
                (item) =>
                    Number(
                        item.characterId
                    )
            );

        const validCharacters =
            await prisma.character.findMany({
                where: {
                    id: {
                        in: characterIds,
                    },

                    isActive: true,
                },
            });

        if (
            validCharacters.length !==
            new Set(characterIds).size
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Có nhân vật không tồn tại hoặc đã bị khóa",
            });
        }

        const gameCount =
            await prisma.game.count({
                where: {
                    roomId,
                },
            });

        const game =
            await prisma.game.create({
                data: {
                    roomId,
                    gameNo:
                        gameCount + 1,

                    gameCharacters: {
                        create:
                            characters.map(
                                (item) => ({
                                    characterId:
                                        Number(
                                            item.characterId
                                        ),

                                    quantity:
                                        Number(
                                            item.quantity
                                        ),
                                })
                            ),
                    },
                },

                include: {
                    gameCharacters: {
                        include: {
                            character: true,
                        },
                    },
                },
            });

        return res.status(201).json({
            success: true,
            message:
                "Tạo ván chơi thành công",
            game,
        });

    } catch (error) {
        console.error(
            "CREATE GAME ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Không thể tạo ván chơi",
        });
    }
};
export const dealCharacters = async (
    req,
    res
) => {
    try {
        const gameId =
            Number(req.params.gameId);

        const game =
            await prisma.game.findFirst({
                where: {
                    id: gameId,

                    room: {
                        hostId:
                            req.user.id,
                    },
                },

                include: {
                    room: {
                        include: {
                            players: true,
                        },
                    },

                    gameCharacters: true,

                    gamePlayers: true,
                },
            });

        if (!game) {
            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy ván chơi",
            });
        }

        if (
            game.gamePlayers.length > 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Ván này đã được phát bài",
            });
        }

        const deck = [];

        for (
            const selected of
            game.gameCharacters
        ) {
            for (
                let i = 0;
                i < selected.quantity;
                i++
            ) {
                deck.push(
                    selected.characterId
                );
            }
        }

        if (
            deck.length !==
            game.room.players.length
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Số lá bài không bằng số người chơi",
            });
        }

        const shuffledDeck =
            shuffle(deck);

        const shuffledPlayers =
            shuffle(
                game.room.players
            );

        const assignments =
            shuffledPlayers.map(
                (player, index) => ({
                    gameId:
                        game.id,

                    playerId:
                        player.id,

                    characterId:
                        shuffledDeck[index],
                })
            );

        await prisma.$transaction(
            async (tx) => {

                await tx.gamePlayer.createMany({
                    data: assignments,
                });

                await tx.room.update({
                    where: {
                        id: game.roomId,
                    },

                    data: {
                        status:
                            "PLAYING",
                    },
                });
            }
        );

        return res.json({
            success: true,

            message:
                "🎴 Phát bài thành công",

            totalPlayers:
                assignments.length,
        });

    } catch (error) {
        console.error(
            "DEAL ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Không thể phát bài",
        });
    }
};

export const finishGame = async (
    req,
    res
) => {
    try {
        const gameId = Number(req.params.gameId);
        const deadPlayerIds = req.body.deadPlayerIds;

        if (!Array.isArray(deadPlayerIds)) {
            return res.status(400).json({
                success: false,
                message: "Danh sách thẻ đã chết không hợp lệ",
            });
        }

        const game = await prisma.game.findFirst({
            where: {
                id: gameId,
                isActive: true,
                room: {
                    hostId: req.user.id,
                },
            },
            include: {
                gamePlayers: true,
            },
        });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ván đang chơi",
            });
        }

        const validPlayerIds = new Set(
            game.gamePlayers.map((gamePlayer) => gamePlayer.playerId)
        );

        if (deadPlayerIds.some((playerId) => {
            return !Number.isInteger(Number(playerId)) ||
                !validPlayerIds.has(Number(playerId));
        })) {
            return res.status(400).json({
                success: false,
                message: "Có thẻ không thuộc ván chơi này",
            });
        }

        const uniqueDeadPlayerIds = [
            ...new Set(deadPlayerIds.map(Number)),
        ];

        await prisma.$transaction(async (tx) => {
            await tx.gamePlayer.updateMany({
                where: {
                    gameId,
                },
                data: {
                    isAlive: true,
                },
            });

            if (uniqueDeadPlayerIds.length > 0) {
                await tx.gamePlayer.updateMany({
                    where: {
                        gameId,
                        playerId: {
                            in: uniqueDeadPlayerIds,
                        },
                    },
                    data: {
                        isAlive: false,
                    },
                });
            }

            await tx.game.update({
                where: {
                    id: gameId,
                },
                data: {
                    isActive: false,
                    endedAt: new Date(),
                    room: {
                        update: {
                            status: "FINISHED",
                        },
                    },
                },
            });
        });

        return res.json({
            success: true,
            message: "Đã kết thúc ván chơi",
        });
    } catch (error) {
        console.error("FINISH GAME ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể kết thúc ván chơi",
        });
    }
};

export const updateGameDeaths = async (
    req,
    res
) => {
    try {
        const gameId = Number(req.params.gameId);
        const deadPlayerIds = req.body.deadPlayerIds;

        if (!Array.isArray(deadPlayerIds)) {
            return res.status(400).json({
                success: false,
                message: "Danh sách thẻ đã chết không hợp lệ",
            });
        }

        const game = await prisma.game.findFirst({
            where: {
                id: gameId,
                isActive: true,
                room: {
                    hostId: req.user.id,
                },
            },
            include: {
                gamePlayers: true,
            },
        });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy ván đang chơi",
            });
        }

        const validPlayerIds = new Set(
            game.gamePlayers.map((gamePlayer) => gamePlayer.playerId)
        );
        const uniqueDeadPlayerIds = [
            ...new Set(deadPlayerIds.map(Number)),
        ];

        if (deadPlayerIds.some((playerId) => {
            return !Number.isInteger(Number(playerId)) ||
                !validPlayerIds.has(Number(playerId));
        })) {
            return res.status(400).json({
                success: false,
                message: "Có thẻ không thuộc ván chơi này",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.gamePlayer.updateMany({
                where: {
                    gameId,
                },
                data: {
                    isAlive: true,
                },
            });

            if (uniqueDeadPlayerIds.length > 0) {
                await tx.gamePlayer.updateMany({
                    where: {
                        gameId,
                        playerId: {
                            in: uniqueDeadPlayerIds,
                        },
                    },
                    data: {
                        isAlive: false,
                    },
                });
            }
        });

        return res.json({
            success: true,
            message: "Đã cập nhật trạng thái thẻ",
        });
    } catch (error) {
        console.error("UPDATE GAME DEATHS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể cập nhật trạng thái thẻ",
        });
    }
};