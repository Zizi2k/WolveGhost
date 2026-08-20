import express from "express";

import {
    getCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
} from "../controllers/character.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorize,
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    getCharacters
);

router.get(
    "/:id",
    authenticate,
    getCharacterById
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createCharacter
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateCharacter
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCharacter
);

export default router;
router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateCharacter
);