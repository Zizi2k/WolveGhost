import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export const getHosts = async (req, res) => {
    try {
        const hosts = await prisma.user.findMany({
            where: {
                role: "HOST",
            },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        return res.json({
            success: true,
            hosts,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách chủ phòng",
        });
    }
};

export const createHost = async (req, res) => {
    try {
        const {
            name,
            username,
            password,
        } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Tên đăng nhập đã tồn tại",
            });
        }

        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        const host = await prisma.user.create({
            data: {
                name,
                username,
                passwordHash,
                role: "HOST",
            },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                createdAt: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Tạo chủ phòng thành công",
            host,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

export const deleteHost = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "ID không hợp lệ",
            });
        }

        const host = await prisma.user.findFirst({
            where: {
                id,
                role: "HOST",
            },
        });

        if (!host) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy chủ phòng",
            });
        }

        await prisma.user.delete({
            where: {
                id,
            },
        });

        return res.json({
            success: true,
            message: "Xóa chủ phòng thành công",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể xóa chủ phòng",
        });
    }
};