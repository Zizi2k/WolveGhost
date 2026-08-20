import express from "express";

import {
    createRoom,
    getMyRooms,
    getRoomById,
} from "../controllers/room.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorize,
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(
    authenticate,
    authorize("HOST")
);

router.post("/", createRoom);

router.get("/", getMyRooms);

router.get("/:id", getRoomById);

export default router;