import { Request, Response } from "express";
import jwtSimple from "jwt-simple";

import jwt from "../jwt";
import { AuthService } from "../services/AuthService";
import { io } from "../server";
import { hashPassword, checkPassword } from "../hash";
import { logger } from "../logger";

export class AuthController {
    constructor(private authService: AuthService){}
    register = async (req: Request, res: Response) => {
        try {
            const { hkid, last_Name, password } = req.body;
            if(!hkid || !last_Name || !password) {
                return res.status(401).json({ message: "Please provide valid HKID no. and your surname" });
            }
            if(hkid.length !== 8) {
                return res.status(401).json({ message: "Please provide valid HKID no. and your surname" });
            }
            const matchedUsers = await this.authService.getUserInfo(hkid);
            if (matchedUsers.length >= 1) {
                return res.status(403).json({ message: "This HKID no. is already register!" });
            }
            const hashedPassword = await hashPassword(password);
            const result = await this.authService.register(
                hkid,
                last_Name,
                hashedPassword
            )
            if(result.success) {
                return res.json(true);
            } else {
                return res.status(400).json({ message: "Failed to register!" })
            }
        } catch (error) {
            logger.error("Register Error!");
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }
    };
    logout = async (req: Request, res: Response) => {
        try {
            io.emit("status-offline", req["user"]);
            req.session.destroy(() => {});
            res.json(true);
        } catch (error) {
            logger.error("LOGOUT ERROR");
            console.log(error);
            res.status(500).json({ message: error.toString() });
        }
    };
    login = async (req: Request, res: Response) => {
        try {
            const { hkid, last_Name, password } = req.body;
            if(!hkid || !last_Name) {
                return res.status(401).json({ message: "Failed. Wrong WWW id/name!" });
            }
            const user = (await this.authService.getUserInfo(hkid))[0];
            if(!user || !(await checkPassword(password, user.password))) {
                return res.status(401).json({ message: "Failed. Wrong id/name!" });
            }
            const payload = {
                id: user.id,
                hkid: user.hkid,
                last_Name: user.last_name,
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);

            return res.json({ token: token });
        } catch (error) {
            logger.error("LOGIN ERROR");
            console.log(error);
            return res.status(500).json({ message: error.toString() });
        }
    }
}