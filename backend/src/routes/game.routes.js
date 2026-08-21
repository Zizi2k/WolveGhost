import express from "express";

import {
    createGame,
    dealCharacters,
    drawNightEvent,
    finishGame,
    updateGameDeaths,
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

router.post(
    "/games/:gameId/finish",
    authenticate,
    authorize("HOST"),
    finishGame
);

router.post(
    "/games/:gameId/events/random",
    authenticate,
    authorize("HOST"),
    drawNightEvent
);

router.put(
    "/games/:gameId/deaths",
    authenticate,
    authorize("HOST"),
    updateGameDeaths
);

export default router;