import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const playerLogin = async (
    req,
    res
) => {
    try {
        const {
            username,
            password,
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng nhập tài khoản và mật khẩu",
            });
        }

        const player =
            await prisma.player.findUnique({
                where: {
                    username,
                },

                include: {
                    room: true,
                },
            });

        if (!player) {
            return res.status(401).json({
                success: false,
                message:
                    "Tài khoản hoặc mật khẩu không đúng",
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                player.passwordHash
            );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message:
                    "Tài khoản hoặc mật khẩu không đúng",
            });
        }

        const token =
            jwt.sign(
                {
                    playerId:
                        player.id,

                    type:
                        "PLAYER",

                    roomId:
                        player.roomId,
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "12h",
                }
            );

        await prisma.player.update({
            where: {
                id: player.id,
            },

            data: {
                isOnline: true,
            },
        });

        return res.json({
            success: true,

            message:
                "Đăng nhập thành công",

            token,

            player: {
                id:
                    player.id,

                displayName:
                    player.displayName,

                username:
                    player.username,

                room: {
                    id:
                        player.room.id,

                    roomCode:
                        player.room.roomCode,

                    name:
                        player.room.name,

                    status:
                        player.room.status,
                },
            },
        });

    } catch (error) {
        console.error(
            "PLAYER LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};
export const getMyRole = async (
    req,
    res
) => {
    try {
        const assignment =
            await prisma.gamePlayer.findFirst({
                where: {
                    playerId:
                        req.player.id,

                    game: {
                        roomId:
                            req.player.roomId,
                    },
                },

                include: {
                    character: true,

                    game: {
                        select: {
                            id: true,
                            gameNo: true,
                        },
                    },
                },

                orderBy: {
                    id: "desc",
                },
            });

        if (!assignment) {
            return res.status(404).json({
                success: false,

                message:
                    "Bạn chưa được phát thẻ",
            });
        }

        if (
            !assignment.hasViewedRole
        ) {
            await prisma.gamePlayer.update({
                where: {
                    id:
                        assignment.id,
                },

                data: {
                    hasViewedRole:
                        true,
                },
            });
        }

        return res.json({
            success: true,

            game: assignment.game,

            role: {
                id:
                    assignment.character.id,

                name:
                    assignment.character.name,

                faction:
                    assignment.character.faction,

                imageUrl:
                    assignment.character.imageUrl,

                description:
                    assignment.character.description,

                ability:
                    assignment.character.ability,
            },

            isAlive:
                assignment.isAlive,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Không thể lấy thẻ nhân vật",
        });
    }
};