import prisma from "./config/prisma.js";

async function testDatabase() {
    try {
        await prisma.$connect();

        console.log("================================");
        console.log("✅ KẾT NỐI MYSQL THÀNH CÔNG");
        console.log("✅ PRISMA CLIENT HOẠT ĐỘNG");
        console.log("================================");

        const users = await prisma.user.findMany();

        console.log("Số lượng User:", users.length);
    } catch (error) {
        console.error("❌ KẾT NỐI DATABASE THẤT BẠI");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();