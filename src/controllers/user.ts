import { Request, Response } from "express";
import { userLogin } from "../types/user";
import prisma from "../db/prisma";
import { hashPassword, verifyPassword } from "../helpers/password";
import { generateJwtToken } from "../helpers/jwt";
import config from "config"
// import { CustomRequest } from "../types/Types";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const schema = userLogin.safeParse(req.body);
        console.log(schema.error, "this is the error on schema");
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
            console.log("res", res);
            res.cookie("access-token", token, {
                httpOnly: true,
                secure: "production" === config.get("node_env"),
                sameSite: "strict"
            })

            console.log("something is there", res);
            res.status(200).json({
                msg: "Login successful",
            })
            return;
        };

        const isPasswordCorrect:boolean = await verifyPassword(password, user.password);
        if(!isPasswordCorrect){
            res.status(404).json({msg: "Please enter correct password"});
            return;
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
        console.log("Something up with the backend, server needs water");
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("access-token", {
            httpOnly: true,
            secure: "production" === config.get("node_env"),
            sameSite: "strict"
        });
        res.status(200).json({msg: "Logout successfully"});
        return;
    } catch (error) {
        console.log("Some error occur", error);
        res.status(500).json({msg: "Error occured while logging out"})
        return;
    }
}

export const verifyCookies = async (req: Request, res: Response) => {
    try {
        res.status(200).json({msg: "User is authenticated, no problem", valid: true});
        return
    }
    catch (error) {
        console.log("Some error occurs", error);
        res.status(500).json({msg: "Error occured"});
        return;
    }
}