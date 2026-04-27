import prisma from "../configs/prisma.js";

export const protect = async (req, res, next) => {
    try {
        let userId = "user_1"; // fallback

        // Get first user from database to avoid foreign key issues
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            userId = firstUser.id;
        }

        // Mock req.auth()
        req.auth = () => ({ userId });

        return next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.code || error.message });
    }
};