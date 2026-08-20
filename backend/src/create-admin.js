import bcrypt from "bcrypt";
import prisma from "./config/prisma.js";

async function createAdmin() {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: {
                username: "admin",
            },
        });

        if (existingAdmin) {
            console.log("⚠️ Tài khoản admin đã tồn tại.");
            return;
        }

        const passwordHash = await bcrypt.hash(
            "Admin@123",
            12
        );

        const admin = await prisma.user.create({
            data: {
                name: "Quản trị viên",
                username: "admin",
                passwordHash: passwordHash,
                role: "ADMIN",
            },
        });

        console.log("==============================");
        console.log("✅ TẠO ADMIN THÀNH CÔNG");
        console.log("==============================");

        console.log("ID:", admin.id);
        console.log("Tên:", admin.name);
        console.log("Username:", admin.username);
        console.log("Role:", admin.role);

        console.log("==============================");
        console.log("Username: admin");
        console.log("Password: Admin@123");
        console.log("==============================");
    } catch (error) {
        console.error("❌ Lỗi tạo Admin:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();