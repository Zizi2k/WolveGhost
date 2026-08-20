import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const authenticatePlayer =
    async (req, res, next) => {
        try {
            const authHeader =
                req.headers.authorization;

            if (!authHeader) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Bạn chưa đăng nhập",
                    });
            }

            const [
                type,
                token,
            ] =
                authHeader.split(" ");

            if (
                type !== "Bearer" ||
                !token
            ) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Token không hợp lệ",
                    });
            }

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            if (
                decoded.type !==
                "PLAYER"
            ) {
                return res
                    .status(403)
                    .json({
                        success: false,
                        message:
                            "Đây không phải tài khoản người chơi",
                    });
            }

            const player =
                await prisma.player.findUnique({
                    where: {
                        id:
                            decoded.playerId,
                    },
                });

            if (!player) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message:
                            "Người chơi không tồn tại",
                    });
            }

            req.player =
                player;

            next();

        } catch (error) {
            return res
                .status(401)
                .json({
                    success: false,
                    message:
                        "Token hết hạn hoặc không hợp lệ",
                });
        }
    };