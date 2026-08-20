import express from "express";

import {
    playerLogin,
    getMyRole,
} from "../controllers/player-auth.controller.js";

import {
    authenticatePlayer,
} from "../middlewares/player-auth.middleware.js";

const router = express.Router();

router.post(
    "/login",
    playerLogin
);

router.get(
    "/my-role",
    authenticatePlayer,
    getMyRole
);

export default router;