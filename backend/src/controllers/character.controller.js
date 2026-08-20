import prisma from "../config/prisma.js";

export const getCharacters = async (req, res) => {
    try {
        const characters = await prisma.character.findMany({
            orderBy: {
                id: "desc",
            },
        });

        return res.json({
            success: true,
            characters,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách nhân vật",
        });
    }
};

export const getCharacterById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const character = await prisma.character.findUnique({
            where: {
                id,
            },
        });

        if (!character) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân vật",
            });
        }

        return res.json({
            success: true,
            character,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

export const createCharacter = async (req, res) => {
    try {
        const {
            name,
            faction,
            imageUrl,
            description,
            ability,
            wakeOrder,
        } = req.body;

        if (
            !name ||
            !faction ||
            !description ||
            !ability
        ) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin nhân vật",
            });
        }

        const allowedFactions = [
            "VILLAGER",
            "WEREWOLF",
            "NEUTRAL",
        ];

        if (!allowedFactions.includes(faction)) {
            return res.status(400).json({
                success: false,
                message: "Phe nhân vật không hợp lệ",
            });
        }

        const character = await prisma.character.create({
            data: {
                name,
                faction,
                imageUrl: imageUrl || null,
                description,
                ability,
                wakeOrder: Number(wakeOrder) || 0,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Tạo nhân vật thành công",
            character,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể tạo nhân vật",
        });
    }
};


export const deleteCharacter = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const existing = await prisma.character.findUnique({
            where: {
                id,
            },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân vật",
            });
        }

        await prisma.character.delete({
            where: {
                id,
            },
        });

        return res.json({
            success: true,
            message: "Xóa nhân vật thành công",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể xóa nhân vật",
        });
    }
};
export const updateCharacter = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const existing =
            await prisma.character.findUnique({
                where: {
                    id,
                },
            });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhân vật",
            });
        }

        const {
            name,
            faction,
            imageUrl,
            description,
            ability,
            wakeOrder,
            isActive,
        } = req.body;

        const character =
            await prisma.character.update({
                where: {
                    id,
                },
                data: {
                    name,
                    faction,
                    imageUrl,
                    description,
                    ability,

                    wakeOrder:
                        wakeOrder !== undefined
                            ? Number(wakeOrder)
                            : undefined,

                    isActive:
                        isActive !== undefined
                            ? Boolean(isActive)
                            : undefined,
                },
            });

        return res.json({
            success: true,
            message: "Cập nhật nhân vật thành công",
            character,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Không thể cập nhật nhân vật",
        });
    }
};