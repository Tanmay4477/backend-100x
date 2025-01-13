import bcrypt from 'bcrypt';
import config from "config";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(config.get("saltRounds"));
        const hashPassword: string = await bcrypt.hash(password, salt);
        return hashPassword
    }
    catch (error) {
        throw new Error("Error in hashing password")
    }
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error in verifying password")
    }
}