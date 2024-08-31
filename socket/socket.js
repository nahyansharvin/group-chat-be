import { Server as SocketIOServer } from "socket.io";
import userSocktetMap from "./UserSocketsMap.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";
import { sendDirectMessage } from "./DirectChat.js";
import { sendGroupMessage } from "./GroupChat.js";
import { deleteMessage, editMessage, likeMessage, markAsRead, unlikeMessage } from "./CommonChat.js";
import User from "../models/UserModel.js";

let io;

const setupSocket = (server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: [process.env.ORIGIN],
            credentials: true
        }
    });

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                io.to(socket.id).emit(SOCKET_EVENTS.ERROR, {
                    error: "Invalid user",
                    message: "User not found"
                });
                socket.disconnect();
            }
            userSocktetMap.set(userId, socket.id);
        } else {
            io.to(socket.id).emit(SOCKET_EVENTS.ERROR, {
                error: "Invalid user",
                message: "Please send a userId in the query params"
            });
            socket.disconnect();
        }

        socket.on(SOCKET_EVENTS.DIRECT_MESSAGE, (message) => sendDirectMessage(message, socket));
        socket.on(SOCKET_EVENTS.GROUP_MESSAGE, (message) => sendGroupMessage(message, socket));

        socket.on(SOCKET_EVENTS.EDIT_MESSAGE, (message) => editMessage(message, socket));
        socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (message) => deleteMessage(message, socket));
        socket.on(SOCKET_EVENTS.MARK_AS_READ, (message) => markAsRead(message, socket));
        socket.on(SOCKET_EVENTS.LIKE_MESSAGE, (message) => likeMessage(message, socket));
        socket.on(SOCKET_EVENTS.UNLIKE_MESSAGE, (message) => unlikeMessage(message, socket));

        socket.on("disconnect", () => {
            console.log("Socket connection disconnected");
            userSocktetMap.forEach((value, key) => {
                if (value === socket.id) {
                    userSocktetMap.delete(key);
                    console.log(`User ${key} disconnected`);
                }
            });
        });
    });
};

export default setupSocket;
export { io };