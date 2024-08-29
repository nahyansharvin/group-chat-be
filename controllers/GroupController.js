import User from "../models/UserModel.js";
import Group from "../models/GroupModel.js";


const validateGroupAdmin = async (groupId, userId) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) return { isValid: false, statusCode: 404, message: "Group with given Id not found" };
        if (group.admin.toString() !== userId) return { isValid: false, statusCode: 403, message: "You are not allowed to edit this group" };
    } catch (error) {
        throw new Error(error.message);
    }
}


export const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const admin = req.userId;

        if (!name) return res.status(400).json({ message: "Group name is required" });

        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) return res.status(400).json({ message: "Invalid members" });

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
        const { groupId } = req.params;

        const validateGroup = await validateGroupAdmin(groupId, req.userId);
        if (!validateGroup.isValid) return res.status(validateGroup.statusCode).json({ message: validateGroup.message });

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

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const validateGroup = await validateGroupAdmin(groupId, req.userId);
        if (!validateGroup.isValid) return res.status(validateGroup.statusCode).json({ message: validateGroup.message });

        await Group.findByIdAndDelete(groupId);

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const searchGroups = async (req, res) => {
    try {
        const { filter } = req.query;
        if (!filter) return res.status(400).json({ message: "Search filter is required" });

        const groups = await Group.find({ name: { $regex: filter, $options: "i" } });

        res.status(200).json({ groups: groups });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addMembers = async (req, res) => {
    try {
        const { members } = req.body;
        const { groupId } = req.params;

        const validateGroup = await validateGroupAdmin(groupId, req.userId);
        if (!validateGroup.isValid) return res.status(validateGroup.statusCode).json({ message: validateGroup.message });

        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) return res.status(400).json({ message: "Invalid members" });

        const updatedGroup = await Group.findByIdAndUpdate(groupId, { $push: { members: members } }, { new: true });

        res.status(200).json({
            message: "Members added successfully",
            data: {
                groupId: updatedGroup._id,
                name: updatedGroup.name,
                members: updatedGroup.members
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeMembers = async (req, res) => {
    try {
        const { members } = req.body;
        const { groupId } = req.params;

        const validateGroup = await validateGroupAdmin(groupId, req.userId);
        if (!validateGroup.isValid) return res.status(validateGroup.statusCode).json({ message: validateGroup.message });

        const updatedGroup = await Group.findByIdAndUpdate(groupId, { $pull: { members: { $in: members } } }, { new: true });

        res.status(200).json({
            message: "Members removed successfully",
            data: {
                groupId: updatedGroup._id,
                name: updatedGroup.name,
                members: updatedGroup.members
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}