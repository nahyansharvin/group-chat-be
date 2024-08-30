import { Server as SocketIOServer } from "socket.io";
import userSocktetMap from "./UserSocketsMap.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";
import { sendDirectMessage } from "./DirectChat.js";
import { sendGroupMessage } from "./GroupChat.js";
import { deleteMessage, editMessage, markAsRead } from "./CommonChat.js";

let io;

const setupSocket = (server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: [process.env.ORIGIN],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        // console.log(`Socket connection established with id ${socket.id}`);
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocktetMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
        } else {
            console.log("User id not found in socket connection");
            // throw new Error("User id not found in socket connection");
        }

        socket.on(SOCKET_EVENTS.DIRECT_MESSAGE, (message) => sendDirectMessage(message, socket));
        socket.on(SOCKET_EVENTS.GROUP_MESSAGE, (message) => sendGroupMessage(message, socket));

        socket.on(SOCKET_EVENTS.EDIT_MESSAGE, (message) => editMessage(message, socket));
        socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (message) => deleteMessage(message, socket));
        socket.on(SOCKET_EVENTS.MARK_AS_READ, (message) => markAsRead(message, socket));

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