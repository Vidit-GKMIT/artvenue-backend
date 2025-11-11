import { Prisma } from "@prisma/client";

export const register = (req,res) => {
    return res.status(200).json({ message: "register route" });
}

export const login = (req,res) => {
    return res.status(200).json({ message: "login route" });
}   

export const logout = (req,res) => {
    return res.status(200).json({ message: "logout route" });
}