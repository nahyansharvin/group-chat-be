import { Server as SocketIOServer } from "socket.io";
import Message from "../models/MessagesModel.js";


const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: [process.env.ORIGIN],
            credentials: true
        }
    });

    const userSocktets = new Map();

    const sendMessage = async (message) => {
        console.log("Message received: ", message);
        const senderSocket = userSocktets.get(message.sender);
        const receiverSocket = userSocktets.get(message.receiver);
        console.log("Sender socket: ", senderSocket);
        console.log("Receiver socket: ", receiverSocket);

        const storedMessage = await Message.create(message);

        const messageToSend = await Message.findById(storedMessage._id)
            .populate("sender", "_id firstName lastName email")
            .populate("receiver", "_id firstName lastName email");

        console.log("Message to send: ", messageToSend);

        if (receiverSocket) io.to(receiverSocket).emit("message", messageToSend);
        if (senderSocket) io.to(senderSocket).emit("message", messageToSend);
    };

    io.on("connection", (socket) => {
        // console.log(`Socket connection established with id ${socket.id}`);
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocktets.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
        }

        socket.on("message", sendMessage);

        socket.on("disconnect", () => {
            console.log("Socket connection disconnected");
            userSocktets.forEach((value, key) => {
                if (value === socket.id) {
                    userSocktets.delete(key);
                    console.log(`User ${key} disconnected`);
                }
            });
        });
    });
};

export default setupSocket;