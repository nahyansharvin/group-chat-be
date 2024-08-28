import User from "../models/UserModel.js";


export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId, "_id firstName lastName email role");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// Get all users except the current user
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }, "_id firstName lastName email role");
        return res.status(200).json({ users });
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
