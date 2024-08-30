import Message from "../models/MessagesModel.js";

export const validateMessageSender = async (messageId, senderId) => {
    const message = await Message.findById(messageId);
    if (!message) throw new Error("Message with given Id not found");
    if (message.sender.toString() !== senderId) throw new Error("You are not allowed to edit others' message");
    return message;
}