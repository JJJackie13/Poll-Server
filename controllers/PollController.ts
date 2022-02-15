import { Request, Response } from "express";
import { PollService } from "../services/PollService";
import { logger } from "../logger";

export class PollController {
    constructor(private pollSevice: PollService) {}

    getAllActivateCampaigns = async (req: Request, res: Response) => {
        try {
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
        } catch (error) {
            logger.error("Error");
            console.log(error);
            return res.status(500).json({ message: "Error" });
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
            logger.error("Error");
            console.log(error);
            return res.status(500).json({ message: "Error" });
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
        const { poll_options_id } = req.body;
        const checkCampaignValidity = await this.pollSevice.checkCampaignValidity(poll_options_id);
        if(checkCampaignValidity.length == 0) {
            return res.status(403).json({ message: "This campaign had already expired!" });
        } 
        const matchedUsers = await this.pollSevice.checkUserVoteExist(userId, poll_options_id);
        if (matchedUsers) {
            return res.status(401).json({ message: "This HKID no. had voted already." });
        }
        const result = await this.pollSevice.postVote(userId, poll_options_id);
        if(result) {
            return res.json(result)
        } else {
            return res.status(400).json({ message: "Failed" });
        }
    };
    createCampaign = async (req: Request, res: Response) => {
        const userId = parseInt(req["user"].id);
        const { title, start_time, end_time, nameList } = req.body;
        const result = await this.pollSevice.postNewCampaign(userId, title, start_time, end_time, nameList);
        if (result) {
            return res.json(result);
        } else {
            return res.status(400).json({ message: "Request failed" });
        }
    };
    updateCampaign = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req["user"].id);
            const pollId = parseInt(req.params.id);
            if(!pollId) {
                return res.status(400).json({ message: "Failed to update campaign" });
            }
            const ownerIdentity = (await this.pollSevice.checkCampaignOwner(userId, pollId))[0];
            if(!ownerIdentity) {
                return res.status(401).json({ message: "Missing Credentials" });
            }
            const data = req.body;
            const result = await this.pollSevice.updateCampaign(pollId, data);
            if (result) {
                return res.json(result);
            } else {
                return res.status(400).json({ message: "Failed to update campaign" });
            }
        } catch (error) {
            logger.error("Error");
            console.log(error);
            return res.status(500).json({ message: "Error" });
        }
    };
}