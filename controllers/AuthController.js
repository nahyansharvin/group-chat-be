import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days

const createToken = (email, userId, role) => {
    return jwt.sign({ email, userId, role }, process.env.JWT_SECRET, { expiresIn: maxAge });
}

export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await User.create({ firstName, lastName, email, password, role });
        res.status(201).json({ message: "User created successfully", user: firstName + " " + lastName });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.cookie("token", createToken(email, user._id, user.role), { 
            httpOnly: true,
            maxAge,
            secure: true,
            sameSite: "None"
        });
        return res.status(200).json({ 
            message: "User signed in successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

};

export const signout = (_req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User signed out successfully" });
};
