import jwt from "jsonwebtoken";
import config from "config";

export const generateJwtToken = (userId: string): string => {
    try {
        const token: string = jwt.sign({userId}, config.get<string>("jwtSecret"), { expiresIn: config.get<string>("jwtExpiration")});
        return token;
    } catch (error) {
        throw new Error("Error in generating token")
    }
}
