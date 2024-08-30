import Message from "../models/MessagesModel.js";
import Group from "../models/GroupModel.js";
import userSocketMap from "./UserSocketsMap.js";
import { io } from "./socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";
import { validateMessageSender } from "../utils/validateMessageSender.js";


const editMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = userSocketMap.get(sender);

    try {
        const existingMessage = await validateMessageSender(message.messageId, sender);
        const receiverSocket = userSocketMap.get(existingMessage.receiver.toString());

        const editedMessage = await Message.findByIdAndUpdate(message.messageId, {
            message: message.message
        }, { new: true });

        if (existingMessage.groupId) {
            // If the message is a group message
            const group = await Group.findById(existingMessage.groupId).populate("members", "_id");
            group.members.forEach(member => {
                const memberSocket = userSocktetMap.get(member._id.toString());
                if (memberSocket) io.to(memberSocket).emit(SOCKET_EVENTS.GROUP_MESSAGE, messageToSend);
            });
        } else if (existingMessage.receiver) {
            // If the message is a direct message
            if (receiverSocket) io.to(receiverSocket).emit(SOCKET_EVENTS.EDIT_MESSAGE, editedMessage);
            if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.EDIT_MESSAGE, editedMessage);
        }
    } catch (error) {
        console.log("Error editing message: ", error.message);
        io.to(senderSocket).emit(SOCKET_EVENTS.ERROR, { error: "Error editing message", message: error.message });
    }
}

const deleteMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = userSocketMap.get(sender);

    try {
        const existingMessage = await validateMessageSender(message.messageId, sender);
        const receiverSocket = userSocketMap.get(existingMessage.receiver.toString());


        await Message.findByIdAndDelete(message.messageId);

        const response = {
            message: "Message deleted successfully",
            messageId: message.messageId
        };

        if (existingMessage.groupId) {
            // If the message is a group message
            const group = await Group.findByIdAndUpdate(existingMessage.groupId, {
                $pull: { messages: message.messageId },
            }, { new: true });
            group.members.forEach(member => {
                const memberSocket = userSocketMap.get(member._id.toString());
                if (memberSocket) io.to(memberSocket).emit(SOCKET_EVENTS.DELETE_MESSAGE, response);
            });
        } else {
            // If the message is a direct message
            if (receiverSocket) io.to(receiverSocket).emit(SOCKET_EVENTS.DELETE_MESSAGE, response);
            if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.DELETE_MESSAGE, response);
        }

    } catch (error) {
        console.log("Error deleting message: ", error.message);
        if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.ERROR, { message: "Error deleting message", data: error.message });
    }
}

const markAsRead = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = userSocketMap.get(sender);
    const receiverSocket = userSocketMap.get(message.userId);

    try {
        const messages = await Message.updateMany(
            { sender: message.userId, receiver: sender, read: false },
            { read: true }
        );

        const response = {
            message: `${messages.modifiedCount} Messages marked as read`,
            data: messages
        };

        if (receiverSocket) io.to(receiverSocket).emit(SOCKET_EVENTS.MARK_AS_READ, response);
        if (senderSocket) io.to(senderSocket).emit(SOCKET_EVENTS.MARK_AS_READ, response);
    } catch (error) {
        console.log("Error marking message as read: ", error.message);
        io.to(senderSocket).emit(SOCKET_EVENTS.ERROR, { error: "Error marking message as read", message: error.message });
    }
}

export {
    editMessage,
    deleteMessage,
    markAsRead
}
