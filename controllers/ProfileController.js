import User from "../models/UserModel.js";

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await User.create({ firstName, lastName, email, password, role });
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const { userId } = req.params;

        const newUser = await User.findByIdAndUpdate(
            userId,
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
        return res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const existingUser = await User.findById(userId);
        if (!existingUser) res.status(404).json({
            message: "User with given Id not found"
        })

        await User.findByIdAndDelete(userId)

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }, "_id firstName lastName email role");
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { filter } = req.query;
        if (!filter) return res.status(400).json({ message: "Search filter is required" });

        const users = await User.find({
            _id: { $ne: req.userId },
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } },
                { email: { $regex: filter, $options: "i" } }
            ]
        }, "_id firstName lastName email");
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}