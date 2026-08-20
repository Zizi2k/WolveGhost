import express from "express";

import {
    addPlayer,
    getPlayers,
    deletePlayer,
    resetPlayerPassword,
    setPlayerPassword,
    setPlayerUsername,
} from "../controllers/player.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorize,
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
    "/rooms/:roomId/players",
    authenticate,
    authorize("HOST"),
    addPlayer
);

router.post(
    "/rooms/:roomId/players/:playerId/reset-password",
    authenticate,
    authorize("HOST"),
    resetPlayerPassword
);

router.get(
    "/rooms/:roomId/players",
    authenticate,
    authorize("HOST"),
    getPlayers
);
router.put(
    "/rooms/:roomId/players/:playerId/password",
    authenticate,
    authorize("HOST"),
    setPlayerPassword
);

router.put(
    "/rooms/:roomId/players/:playerId/username",
    authenticate,
    authorize("HOST"),
    setPlayerUsername
);

router.delete(
    "/rooms/:roomId/players/:playerId",
    authenticate,
    authorize("HOST"),
    deletePlayer
);

export default router;