import { NextFunction, RequestHandler, Response } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/Types";

const commonAuth: RequestHandler = (req: any, res: Response, next: NextFunction): void => {
        const token = req.cookies["access-token"];
        if(!token) {
            res.status(401).json({msg: "No Token Provided", valid: false});
            return
        };
        try {
            if(!config.get("jwtSecret")) {
                throw new Error("Please enter jwt secret in your config file");
            }
            const id: string = jwt.verify(token, config.get("jwtSecret")) as string;
            req.userId = id;
            next();
    } catch (error){
        res.status(400).json({msg: "Not a verified User", valid: false})
        return
    }
}

export default commonAuth;