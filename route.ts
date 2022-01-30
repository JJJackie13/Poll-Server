import express from "express";
import { isAuth } from "./middlewares/auth";

import { AuthController } from "./controllers/AuthController";
import { PollController } from "./controllers/PollController";

export function createRouter (options: {
    authController: AuthController;
    pollController: PollController;
}) {
    const {
        authController,
        pollController,
    } = options;

    let router = express.Router();

    //REGISTER AND LOGIN
    router.post("/v1/register", authController.register);
    router.post("/v1/login", authController.login);
    router.get("/v1/logout", authController.logout);

    //POLL ACTION
    router.get("/v1/campaigns", pollController.getAllActivateCampaigns);
    router.get("/v1/campaigns_ended", pollController.getAllEndedCampaigns);
    router.get("/v1/campaigns/:id", pollController.getCampaignsById);
    router.post("/v1/compaigns_vote", isAuth, pollController.postVote);

    return router;
}