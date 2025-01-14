import {z} from "zod";

export const userLogin = z.object({
    username: z.string(),
    password: z.string()
})