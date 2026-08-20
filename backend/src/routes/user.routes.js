import express from "express";

import {
    getHosts,
    createHost,
    deleteHost,
} from "../controllers/user.controller.js";

import {
    authenticate,
} from "../middlewares/auth.middleware.js";

import {
    authorize,
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
    "/hosts",
    authenticate,
    authorize("ADMIN"),
    getHosts
);

router.post(
    "/hosts",
    authenticate,
    authorize("ADMIN"),
    createHost
);

router.delete(
    "/hosts/:id",
    authenticate,
    authorize("ADMIN"),
    deleteHost
);

export default router;