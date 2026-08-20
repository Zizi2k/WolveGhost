import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

function generatePassword() {
    return crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();
}

async function generateUsername(roomCode) {
    let username;
    let exists = true;

    while (exists) {
        const suffix = crypto
            .randomBytes(2)
            .toString("hex")
            .toUpperCase();

        username = `${roomCode}-${suffix}`;

        exists = await prisma.player.findUnique({
            where: {
                username,
            },
        });
    }

    return username;
}

export const addPlayer = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);

        const {
    displayName,
    password,
} = req.body;

        if (!displayName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập tên người chơi",
            });
        }

        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                hostId: req.user.id,
            },

            include: {
                _count: {
                    select: {
                        players: true,
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

        if (room.status !== "WAITING") {
            return res.status(400).json({
                success: false,
                message: "Không thể thêm người khi ván đã bắt đầu",
            });
        }

        if (
            room._count.players >=
            room.maxPlayers
        ) {
            return res.status(400).json({
                success: false,
                message: "Phòng đã đủ người chơi",
            });
        }

        const username =
            await generateUsername(
                room.roomCode
            );

        const plainPassword =
    password?.trim()
        ? password.trim()
        : generatePassword();
        if (
    password &&
    password.trim().length < 4
) {
    return res.status(400).json({
        success: false,
        message:
            "Mật khẩu phải có ít nhất 4 ký tự",
    });
}


        const passwordHash =
            await bcrypt.hash(
                plainPassword,
                12
            );

        const player =
            await prisma.player.create({
                data: {
                    displayName:
                        displayName.trim(),

                    username,

                    passwordHash,

                    roomId,
                },

                select: {
                    id: true,
                    displayName: true,
                    username: true,
                    roomId: true,
                },
            });

        return res.status(201).json({
            success: true,

            message:
                "Thêm người chơi thành công",

            player,

            credentials: {
                username,
                password: plainPassword,
            },
        });

    } catch (error) {
        console.error(
            "ADD PLAYER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Không thể thêm người chơi",
        });
    }
};
export const getPlayers = async (req, res) => {
    try {
        const roomId =
            Number(req.params.roomId);

        const room =
            await prisma.room.findFirst({
                where: {
                    id: roomId,
                    hostId: req.user.id,
                },
            });

        if (!room) {
            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy phòng",
            });
        }

        const players =
            await prisma.player.findMany({
                where: {
                    roomId,
                },

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
            });

        return res.json({
            success: true,

            total: players.length,

            maxPlayers:
                room.maxPlayers,

            players,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Không thể lấy người chơi",
        });
    }
};
export const deletePlayer = async (
    req,
    res
) => {
    try {
        const roomId =
            Number(req.params.roomId);

        const playerId =
            Number(req.params.playerId);

        const room =
            await prisma.room.findFirst({
                where: {
                    id: roomId,
                    hostId: req.user.id,
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
                    "Không thể xóa người khi ván đang chơi",
            });
        }

        const player =
            await prisma.player.findFirst({
                where: {
                    id: playerId,
                    roomId,
                },
            });

        if (!player) {
            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy người chơi",
            });
        }

        await prisma.player.delete({
            where: {
                id: playerId,
            },
        });

        return res.json({
            success: true,
            message:
                "Xóa người chơi thành công",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Không thể xóa người chơi",
        });
    }
};
export const setPlayerPassword = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const playerId = Number(req.params.playerId);

        const { password } = req.body;

        if (!password || password.trim().length < 4) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 4 ký tự",
            });
        }

        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                hostId: req.user.id,
            },
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng",
            });
        }

        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                roomId,
            },
        });

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người chơi",
            });
        }

        const passwordHash = await bcrypt.hash(
            password.trim(),
            12
        );

        await prisma.player.update({
            where: {
                id: playerId,
            },
            data: {
                passwordHash,
            },
        });

        return res.json({
            success: true,
            message: "Đổi mật khẩu thành công",
            username: player.username,
        });

    } catch (error) {
        console.error(
            "SET PLAYER PASSWORD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Không thể đổi mật khẩu",
        });
    }
};

export const setPlayerUsername = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const playerId = Number(req.params.playerId);
        const username = req.body.username?.trim();

        if (!username || username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username phải có ít nhất 3 ký tự",
            });
        }

        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                hostId: req.user.id,
            },
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng",
            });
        }

        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                roomId,
            },
        });

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người chơi",
            });
        }

        const existingPlayer = await prisma.player.findFirst({
            where: {
                username,
                id: {
                    not: playerId,
                },
            },
        });

        if (existingPlayer) {
            return res.status(409).json({
                success: false,
                message: "Username đã được sử dụng",
            });
        }

        await prisma.player.update({
            where: {
                id: playerId,
            },
            data: {
                username,
            },
        });

        return res.json({
            success: true,
            message: "Đổi username thành công",
            username,
        });
    } catch (error) {
        console.error("SET PLAYER USERNAME ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể đổi username",
        });
    }
};

export const resetPlayerPassword = async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const playerId = Number(req.params.playerId);

        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                hostId: req.user.id,
            },
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng",
            });
        }

        const player = await prisma.player.findFirst({
            where: {
                id: playerId,
                roomId,
            },
        });

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người chơi",
            });
        }

        const newPassword = generatePassword();

        const passwordHash = await bcrypt.hash(
            newPassword,
            12
        );

        await prisma.player.update({
            where: {
                id: playerId,
            },
            data: {
                passwordHash,
            },
        });

        return res.json({
            success: true,
            message: "Reset mật khẩu thành công",

            credentials: {
                username: player.username,
                password: newPassword,
            },
        });

    } catch (error) {
        console.error(
            "RESET PLAYER PASSWORD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Không thể reset mật khẩu",
        });
    }
};