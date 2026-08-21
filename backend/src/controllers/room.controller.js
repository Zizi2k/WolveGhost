import crypto from "crypto";
import prisma from "../config/prisma.js";

function generateRoomCode() {
    return `WG-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export const createRoom = async (req, res) => {
    try {
        const { name, maxPlayers } = req.body;

        if (!name || !maxPlayers) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập tên phòng và số người chơi",
            });
        }

        const numberOfPlayers = Number(maxPlayers);

        if (
            !Number.isInteger(numberOfPlayers) ||
            numberOfPlayers < 4 ||
            numberOfPlayers > 30
        ) {
            return res.status(400).json({
                success: false,
                message: "Số người chơi phải từ 4 đến 30",
            });
        }

        let roomCode;
        let exists = true;

        while (exists) {
            roomCode = generateRoomCode();

            exists = await prisma.room.findUnique({
                where: {
                    roomCode,
                },
            });
        }

        const room = await prisma.room.create({
            data: {
                name,
                roomCode,
                maxPlayers: numberOfPlayers,
                hostId: req.user.id,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Tạo phòng thành công",
            room,
        });

    } catch (error) {
        console.error("CREATE ROOM ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể tạo phòng",
        });
    }
};

export const getMyRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            where: {
                hostId: req.user.id,
            },

            include: {
                _count: {
                    select: {
                        players: true,
                        games: true,
                    },
                },
            },

            orderBy: {
                id: "desc",
            },
        });

        return res.json({
            success: true,
            rooms,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách phòng",
        });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const room = await prisma.room.findFirst({
            where: {
                id,
                hostId: req.user.id,
            },
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng",
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.game.deleteMany({
                where: {
                    roomId: id,
                },
            });

            await tx.room.delete({
                where: {
                    id,
                },
            });
        });

        return res.json({
            success: true,
            message: "Xóa phòng thành công",
        });
    } catch (error) {
        console.error("DELETE ROOM ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể xóa phòng",
        });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const room = await prisma.room.findFirst({
            where: {
                id,
                hostId: req.user.id,
            },

            include: {
                players: {
                    select: {
                        id: true,
                        displayName: true,
                        username: true,
                        isOnline: true,
                        createdAt: true,
                    },

                    orderBy: {
                        id: "asc",
                    },
                },

                games: {
                    orderBy: {
                        id: "desc",
                    },
                    take: 1,
                    include: {
                        gamePlayers: {
                            include: {
                                player: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                    },
                                },
                                character: {
                                    select: {
                                        id: true,
                                        name: true,
                                        faction: true,
                                        imageUrl: true,
                                    },
                                },
                            },
                            orderBy: {
                                playerId: "asc",
                            },
                        },
                        gameNights: {
                            select: {
                                night: true,
                                playerId: true,
                            },
                            orderBy: [
                                { night: "asc" },
                                { playerId: "asc" },
                            ],
                        },
                        gameEvents: {
                            include: {
                                event: true,
                            },
                            orderBy: {
                                round: "asc",
                            },
                        },
                    },
                },
            },
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng",
            });
        }

        return res.json({
            success: true,
            room,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể lấy thông tin phòng",
        });
    }
};