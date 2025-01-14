import { Request, Response } from "express";
import { userLogin } from "../types/user";
import prisma from "../db/prisma";
import { hashPassword, verifyPassword } from "../helpers/password";
import { generateJwtToken } from "../helpers/jwt";
import config from "config"

export const loginUser = async (req: Request, res: Response) => {
    try {
        const schema = userLogin.safeParse(req.body);
        console.log(schema.error, "schemaǎ");
        if(schema.success === false){
            res.status(400).json({msg: "Please enter all inputs"});
            return
        };
        const username: string = schema.data.username;
        const password: string = schema.data.password;

        const user = await prisma.user.findUnique({
            where: {
                email: username,
            },
        });

        if(!user) {
            // create the user then
            const hashedPassword = await hashPassword(password);
            const newUser = await prisma.user.create({
                data: {
                    email: username,
                    password: hashedPassword
                },
            });
            if(!newUser) {
                res.status(400).json({msg: "Something went wrong, login again"});
                return;
            }
            const token = generateJwtToken(newUser.id);
            res.cookie("access-token", token, {
                httpOnly: true,
                secure: "production" === config.get("node_env"),
                sameSite: "strict"
            })

            res.status(200).json({
                msg: "Login successful",
            })
            return;
        };

        const isPasswordCorrect:boolean = await verifyPassword(password, user.password);
        if(!isPasswordCorrect){
            res.status(404).json({msg: "Please enter correct password"})
        }
        const token = generateJwtToken(user.id);
        res.cookie("access-token", token, {
            httpOnly: true,
            secure: "production" === config.get("node_env"),
            sameSite: "strict"
        });
        res.status(200).json({
            msg: "Login successful",
        });
        return;
    } catch (error) {
        throw new Error("something occur in login or creating user")
    }
}