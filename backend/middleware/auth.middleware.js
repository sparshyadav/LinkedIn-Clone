import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-linkedin"];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unautorized - Invalid Token" });
        }

        const user = await user.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not Found" });
        }

        req.user = user;

        next();
    }
    catch (error) {
        console.log("Error in ProtectRoute Middleware: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}