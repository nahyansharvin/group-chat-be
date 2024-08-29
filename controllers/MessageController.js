import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const { userId: user2 } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const user1 = req.userId;
        const { userId: user2 } = req.body;

        const messages = await Message.updateMany(
            { sender: user2, receiver: user1, read: false },
            { read: true }
        );

        res.status(200).json({
            message: `${messages.modifiedCount} Messages marked as read`,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId, message } = req.body;

        const existingMessage = await Message.findById(messageId);

        if (!existingMessage) return res.status(404).json({ message: "Message with given Id not found" });
        if (existingMessage.sender.toString() !== userId) return res.status(403).json({ message: "You are not allowed to edit others' message" });

        const updatedMessage = await Message.findByIdAndUpdate(messageId, { message }, { new: true });

        res.status(200).json({
            message: "Message updated successfully",
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};