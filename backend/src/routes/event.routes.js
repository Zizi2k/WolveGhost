import express from "express";

import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/event.controller.js";

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
    getEvents
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createEvent
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateEvent
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteEvent
);

export default router;