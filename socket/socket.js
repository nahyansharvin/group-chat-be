import { Server as SocketIOServer } from "socket.io";
import sendDirectMessage from "./DirectChat.js";
import userSocktetMap from "./UserSocketsMap.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";

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

        socket.on(SOCKET_EVENTS.MESSAGE, sendDirectMessage);

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