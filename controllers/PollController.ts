import { Request, Response } from "express";
import { PollService } from "../services/PollService";
import { logger } from "../logger";

export class PollController {
    constructor(private pollSevice: PollService) {}

    getAllActivateCampaigns = async (req: Request, res: Response) => {
        const offsetQuery = req.query.offset || 0;
        const limitQuery = req.query.limit || 10;
        const offset = parseInt(offsetQuery?.toString());
        const limit = parseInt(limitQuery?.toString());
        const result = await this.pollSevice.getAllActivateCampaigns(offset, limit);
        if(result) {
            return res.json(result)
        } else {
            return res.status(400).json({ message: "Failed to retrieve campaigns" });
        }
    };
    getAllEndedCampaigns = async (req: Request, res: Response) => {
        try {
            const offsetQuery = req.query?.offset || 0;
            const limitQuery = req.query?.limit || 10;
            const offset = parseInt(offsetQuery.toString());
            const limit = parseInt(limitQuery.toString());
            const result = await this.pollSevice.getAllEndedCampaigns(offset, limit);
            if(result) {
                return res.json(result)
            } else {
                return res.status(400).json({ message: "Failed to retrieve campaigns" });
            }
        } catch (error) {
            logger.error("Register Error!");
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }

    };
    getCampaignsById = async (req: Request, res: Response) => {
        try {
            const pollId = parseInt(req.params.id);
            if(!pollId) {
                return res.status(400).json({ message: "Failed to retrieve campaign" });
            }
            const result = await this.pollSevice.getCampaignsById(pollId);
            if(result) {
                return res.json(result)
            } else {
                return res.status(400).json({ message: "Failed to retrieve campaign" });
            }
        } catch (error) {
            logger.error("Register Error!");
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }

    };
    postVote = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const pollOptionId = req.body;
        const result = await this.pollSevice.postVote(userId, pollOptionId);
        if(result) {
            return res.json(result)
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    }
}