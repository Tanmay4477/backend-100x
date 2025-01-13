import { NextFunction, Request, Response } from "express";

const commonAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json("No Token Provided");
        }
    } catch (error){
        return res.status(400).json("Not a verified User")
    }
}