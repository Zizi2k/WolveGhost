import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import characterRoutes from "./routes/character.routes.js";
import eventRoutes from "./routes/event.routes.js";
import roomRoutes from "./routes/room.routes.js";
import playerRoutes from "./routes/player.routes.js";
import gameRoutes from "./routes/game.routes.js";
import playerAuthRoutes from "./routes/player-auth.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api", playerRoutes);
app.use("/api", gameRoutes);
app.use(
    "/api/player-auth",
    playerAuthRoutes
);
// Trang test
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🐺 WolveGhost API đang hoạt động",
    });
});

// Test database
app.get("/api/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            database: "connected",
            message: "WolveGhost Backend hoạt động bình thường",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            database: "disconnected",
            message: "Không thể kết nối database",
        });
    }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log("");
    console.log("======================================");
    console.log("🐺 WOLVEGHOST BACKEND");
    console.log("======================================");
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
    console.log("======================================");
    console.log("");
});

// Xử lý tắt server an toàn
const shutdown = async () => {
    console.log("Đang tắt WolveGhost Server...");

    await prisma.$disconnect();

    server.close(() => {
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);