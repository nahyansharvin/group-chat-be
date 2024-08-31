import request from "supertest";
import app from "../app.js";
import { io as ioClient } from "socket.io-client";
import setupSocket, { io } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";
import mongoose from "mongoose";

const PORT = 5000;
let serverSocket, clientSocket, client2Socket, messageId;

jest.setTimeout(20000);

beforeAll((done) => {
    const server = app.listen(PORT, () => {
        // console.log(`Server is running on port ${PORT}`);
        setupSocket(server);
        clientSocket = ioClient(`http://localhost:${PORT}`, {
            query: {
                userId: global.userId
            }
        });
        client2Socket = ioClient(`http://localhost:${PORT}`, {
            query: {
                userId: global.user2Id
            }
        });
        io.on("connection", (socket) => {
            serverSocket = socket;
        });
        clientSocket.on("connect", done);
    });
});
beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL)
        .catch((error) => console.log("Databse error: ", error.message));
});

afterAll(async () => {
    io.close()
    clientSocket.disconnect()
    client2Socket.disconnect()
    await mongoose.connection.close()
});

describe("Chat Sockets", () => {
    it("should send direct message from Admin to User", (done) => {
        const message = "This is a test message sent from Admin to User."
        clientSocket.on(SOCKET_EVENTS.DIRECT_MESSAGE, (data) => {
            expect(data.message).toBe(message)
            done()
        });
        client2Socket.on(SOCKET_EVENTS.DIRECT_MESSAGE, (data) => {
            expect(data.message).toBe(message)
            messageId = data._id
            done()
        });
        clientSocket.emit(SOCKET_EVENTS.DIRECT_MESSAGE, {
            receiver: global.user2Id,
            message
        });
    })

    it("should edit message", (done) => {
        const editedMessage = "This is an edited message."
        clientSocket.on(SOCKET_EVENTS.EDIT_MESSAGE, (data) => {
            expect(data.message).toBe(editedMessage)
            done()
        });
        client2Socket.on(SOCKET_EVENTS.EDIT_MESSAGE, (data) => {
            expect(data.message).toBe(editedMessage)
            done()
        });
        clientSocket.emit(SOCKET_EVENTS.EDIT_MESSAGE, {
            messageId: messageId,
            message: editedMessage
        });
    })

    it("Should mark message as read", (done) => {
        clientSocket.on(SOCKET_EVENTS.MARK_AS_READ, (data) => {
            expect(data).toHaveProperty("message")
            expect(data.data.modifiedCount).toBe(1)
            done()
        });
        client2Socket.emit(SOCKET_EVENTS.MARK_AS_READ, {
            userId: global.userId
        });
    })

    it("Should get Direct Chat List", async () => {
        const response = await request(app)
            .get("/api/chats")
            .set("Cookie", global.adminCookie)
            .expect(200);
        expect(response.body).toHaveProperty("directChatList")
        expect(response.body.directChatList).toBeInstanceOf(Array)
    })

    it("Should delete message", (done) => {
        clientSocket.on(SOCKET_EVENTS.DELETE_MESSAGE, (data) => {
            expect(data.message).toBe("Message deleted successfully")
            done()
        });
        client2Socket.on(SOCKET_EVENTS.DELETE_MESSAGE, (data) => {
            expect(data.message).toBe("Message deleted successfully")
            expect(data.messageId).toBe(messageId)
            done()
        });
        clientSocket.emit(SOCKET_EVENTS.DELETE_MESSAGE, {
            messageId: messageId
        });
    })

});
