import User from "../models/UserModel.js";

export const createUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const updateId = req.params.id;

        const newUser = await User.findByIdAndUpdate(
            updateId,
            { firstName, lastName, email, password, role },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ 
            message: "User updated successfully",
            user: {
                userId: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }, "_id firstName lastName email role");
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { term } = req.query;
        if (!term) return res.status(400).json({ message: "Search term is required" });
        
        const users = await User.find({ 
            _id: { $ne: req.userId },
            $or: [
                { firstName: { $regex: term, $options: "i" } },
                { lastName: { $regex: term, $options: "i" } },
                { email: { $regex: term, $options: "i" } }
            ]
        }, "_id firstName lastName email");
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}