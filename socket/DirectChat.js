import Message from "../models/MessagesModel.js";
import usersocketMap from "./UserSocketsMap.js";
import { io } from "./socket.js";

const sendDirectMessage = async (message) => {
    console.log("Message received: ", message);
    const senderSocket = usersocketMap.get(message.sender);
    const receiverSocket = usersocketMap.get(message.receiver);
    console.log("Sender socket: ", senderSocket);
    console.log("Receiver socket: ", receiverSocket);

    const storedMessage = await Message.create(message);

    const messageToSend = await Message.findById(storedMessage._id)
        .populate("sender", "_id firstName lastName email")
        .populate("receiver", "_id firstName lastName email");

    if (receiverSocket) io.to(receiverSocket).emit("message", messageToSend);
    if (senderSocket) io.to(senderSocket).emit("message", messageToSend);
};

export default sendDirectMessage;