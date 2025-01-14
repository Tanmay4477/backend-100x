import { NextFunction, Response } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/Types";

const commonAuth = (req: CustomRequest, res: Response, next: NextFunction):void | Response<{msg: string}> => {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({msg: "No Token Provided"});
        };
        try {
            if(!config.get("jwtSecret")) {
                throw new Error("Please enter jwt secret in your config file");
            }
            const id: string = jwt.verify(token, config.get("jwtSecret")) as string;
            req.userId = id;
            next();
    } catch (error){
        return res.status(400).json({msg: "Not a verified User"})
    }
}