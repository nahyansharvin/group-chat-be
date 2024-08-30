import Message from "../models/MessagesModel.js";
import usersocketMap from "./UserSocketsMap.js";
import { io } from "./socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";

const validateMessageSender = async (messageId, senderId) => {
    const message = await Message.findById(messageId);
    if (!message) throw new Error("Message with given Id not found");
    if (message.sender.toString() !== senderId) throw new Error("You are not allowed to edit others' message");
    return message;
}

const sendDirectMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = usersocketMap.get(sender);
    const receiverSocket = usersocketMap.get(message.receiver);
    try {
        const storedMessage = await Message.create({ ...message, sender });

        const messageToSend = await Message.findById(storedMessage._id)
            .populate("sender", "_id firstName lastName email")
            .populate("receiver", "_id firstName lastName email");

        if (receiverSocket) io.to(receiverSocket).emit(SOCKET_EVENTS.DIRECT_MESSAGE, messageToSend);
        if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.DIRECT_MESSAGE, messageToSend);
    } catch (error) {
        io.to(senderSocket).emit(SOCKET_EVENTS.ERROR, { error: "Error sending message", message: error.message });
    }

};

const editMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = usersocketMap.get(sender);
    const receiverSocket = usersocketMap.get(message.receiver);

    try {
        await validateMessageSender(message.messageId, sender);

        const editedMessage = await Message.findByIdAndUpdate(message.messageId, {
            message: message.message
        }, { new: true });

        if (receiverSocket) io.to(receiverSocket).emit(SOCKET_EVENTS.EDIT_MESSAGE, editedMessage);
        if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.EDIT_MESSAGE, editedMessage);
    } catch (error) {
        console.log("Error editing message: ", error.message);
        io.to(senderSocket).emit(SOCKET_EVENTS.ERROR, { error: "Error editing message", message: error.message });
    }
}

const deleteDirectMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = usersocketMap.get(sender);

    try {
        const existingMessage = await validateMessageSender(message.messageId, sender);
        const receiverSocket = usersocketMap.get(existingMessage.receiver.toString());

        await Message.findByIdAndDelete(message.messageId);

        const response = {
            message: "Message deleted successfully",
            messageId: message.messageId
        };

        if (receiverSocket) io.to(receiverSocket).emit(SOCKET_EVENTS.DELETE_DIRECT_MESSAGE, response);
        if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.DELETE_DIRECT_MESSAGE, response);
    } catch (error) {
        console.log("Error deleting message: ", error.message);
        if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.ERROR, { message: "Error deleting message", data: error.message });
    }
}

export {
    sendDirectMessage,
    editMessage,
    deleteDirectMessage
}