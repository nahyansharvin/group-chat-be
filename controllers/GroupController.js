import User from "../models/UserModel.js";
import Group from "../models/GroupModel.js";

export const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const admin = req.userId;

        if(!name) return res.status(400).json({ message: "Group name is required" });

        const validMembers = await User.find({ _id: { $in: members } });
        if(validMembers.length !== members.length) return res.status(400).json({ message: "Invalid members" });
        
        const newGroup = await Group.create({ name, admin, members });

        res.status(201).json({
            message: "Group created successfully",
            data: {
                groupId: newGroup._id,
                name: newGroup.name,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const groupId = req.params.id;

        const existingGroup = await Group.findById(groupId);

        if (!existingGroup) return res.status(404).json({ message: "Group with given Id not found" });
        if (existingGroup.admin.toString() !== req.userId) return res.status(403).json({ message: "You are not allowed to edit this group" });

        const updatedGroup = await Group.findByIdAndUpdate(groupId, { name, members }, { new: true });

        res.status(200).json({
            message: "Group updated successfully",
            data: {
                groupId: updatedGroup._id,
                name: updatedGroup.name,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}