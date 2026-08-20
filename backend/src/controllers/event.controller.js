import prisma from "../config/prisma.js";

export const getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                id: "desc",
            },
        });

        return res.json({
            success: true,
            events,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách sự kiện",
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const {
            name,
            description,
            imageUrl,
            probability,
        } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Tên và mô tả sự kiện là bắt buộc",
            });
        }

        const event = await prisma.event.create({
            data: {
                name,
                description,
                imageUrl: imageUrl || null,
                probability: Number(probability) || 1,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Tạo sự kiện thành công",
            event,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể tạo sự kiện",
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.event.delete({
            where: {
                id,
            },
        });

        return res.json({
            success: true,
            message: "Xóa sự kiện thành công",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể xóa sự kiện",
        });
    }
};