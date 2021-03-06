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
    router.post("/v1/user/register", authController.register);
    router.post("/v1/user/login", authController.login);
    router.get("/v1/user/logout", authController.logout);

    //POLL ACTION
    router.get("/v1/campaigns", pollController.getAllActivateCampaigns);
    router.get("/v1/campaigns/ended", pollController.getAllEndedCampaigns);
    router.post("/v1/campaigns", isAuth, pollController.createCampaign);
    router.get("/v1/campaigns/:id", pollController.getCampaignsById);
    router.post("/v1/campaigns/vote", isAuth, pollController.postVote);
    router.put("/v1/campaigns/:id", isAuth, pollController.updateCampaign);

    return router;
}