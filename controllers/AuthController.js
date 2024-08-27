import User from "../models/UserModel.js";

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await User.create({ firstName, lastName, email, password });
        res.status(201).json({ message: "User created successfully", user: firstName + " " + lastName });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}