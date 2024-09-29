import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All Fields are Required" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username Already Exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password Must be at least 6 Characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({ message: "User Registered Successsfully" });

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl);
        }
        catch (emailError) {
            console.log("Error Sending Welcome Email", emailError);

        }
    }
    catch (error) {
        console.log("Error in Signup: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
    }
    catch (error) {
        console.error("Error in Login Controller: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt-linkedin");
    res.json({ message: "Logged Out Successfully" });
}

export const getCurrentUser = async (req, res) => {
    try {
        res.json(req.user);
    }
    catch (error) {
        console.error("Error in getCurrentUser Controller: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}
