import Message from "../models/MessagesModel.js";
import userSocketMap from "./UserSocketsMap.js";
import { io } from "./socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";

const sendDirectMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const senderSocket = userSocketMap.get(sender);
    const receiverSocket = userSocketMap.get(message.receiver);
    try {
        if (!message.receiver) throw new Error("Receiver is required");
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

export { sendDirectMessage }