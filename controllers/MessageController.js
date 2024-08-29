import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const { id: user2 } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};