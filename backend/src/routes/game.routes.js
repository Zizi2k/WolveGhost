import express from "express";

import {
    createGame,
    dealCharacters,
} from "../controllers/game.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorize,
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
    "/rooms/:roomId/games",
    authenticate,
    authorize("HOST"),
    createGame
);

router.post(
    "/games/:gameId/deal",
    authenticate,
    authorize("HOST"),
    dealCharacters
);

export default router;