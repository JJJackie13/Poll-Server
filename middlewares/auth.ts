import { Request, Response, NextFunction } from "express";
import { Bearer } from "permit";
import jwtSimple from "jwt-simple";
import { authService } from "../server";
import jwt from "../jwt";

const permit = new Bearer({
    query: "access_token",
})

export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = permit.check(req);
        if(!token) {
            return res.status(401).json({ message: "Missing Credentials" });
        }
        const payload = jwtSimple.decode(token, jwt.jwtSecret);
        const user = await authService.getUserInfo(payload.hkid);
        if(user && user.length === 1) {
            req["user"] = user[0]
            return next();
        } else {
            return res.status(403).json({ message: "Permission Denied" });
        }
    } catch (error) {
        return res.status(403).json({ message: "Permission Denied" });
    }
}