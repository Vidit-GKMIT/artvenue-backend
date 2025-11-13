import { prisma } from '../db/postgres.db.js'

export const verifyEmail = async (req, res) => {
    try {
        const email = req.body.email
        const existedEmail = await prisma.users.findUnique({
            where: { email },
        })

        if (existedEmail) {
            return res
                .status(400)
                .json({ message: 'Email already exists', success: false })
        }

        return res
            .status(200)
            .json({ message: 'Email is available', success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message,
        })
    }
}

export const register = (req,res) => {
    return res.status(200).json({ message: "register route" });
}

export const login = (req,res) => {
    return res.status(200).json({ message: "login route" });
}   

export const logout = (req,res) => {
    return res.status(200).json({ message: "logout route" });
}