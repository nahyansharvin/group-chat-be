import request from "supertest";
import app from "../app.js";
import { io as ioClient } from "socket.io-client";
import setupSocket, { io } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";
import { TEST_PORT } from "../constants/TestConstants.js";

const adminCookie = global.adminCookie;
const user1 = global.adminId;
const user2 = global.userId;
let clientSocket, client2Socket, messageId;

//Setup Socket connection
beforeAll((done) => {
    const server = app.listen(TEST_PORT, () => {
        setupSocket(server);
        clientSocket = ioClient(`http://localhost:${TEST_PORT}`, {
            query: {
                userId: user1
            }
        });
        client2Socket = ioClient(`http://localhost:${TEST_PORT}`, {
            query: {
                userId: user2
            }
        });
        clientSocket.on("connect", done);
        client2Socket.on("connect", done);
    });
});
afterAll(async () => {
    io.close()
    clientSocket.disconnect()
    client2Socket.disconnect()
});

describe("Direct chat Sockets", () => {
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
            receiver: user2,
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

    it("Sould not be able to edit message sent by other user", (done) => {
        client2Socket.on(SOCKET_EVENTS.ERROR, (data) => {
            expect(data.error).toBe("Error editing message")
            expect(data.message).toBe("You are not allowed to edit others' message")
            done()
        });
        client2Socket.emit(SOCKET_EVENTS.EDIT_MESSAGE, {
            messageId: messageId,
            message: "This is an edited message."
        });
    })

    it("Should mark message as read", (done) => {
        clientSocket.on(SOCKET_EVENTS.MARK_AS_READ, (data) => {
            expect(data).toHaveProperty("message")
            expect(data.data.modifiedCount).toBe(1)
            done()
        });
        client2Socket.emit(SOCKET_EVENTS.MARK_AS_READ, {
            userId: user1
        });
    })

    it("Should like the message", (done) => {
        clientSocket.on(SOCKET_EVENTS.LIKE_MESSAGE, (data) => {
            expect(data).toHaveProperty("message")
            expect(data).toHaveProperty("messageId", messageId)
            done()
        })
        clientSocket.emit(SOCKET_EVENTS.LIKE_MESSAGE, {
            messageId
        })
    })

    it("Should unlike the message", (done) => {
        clientSocket.on(SOCKET_EVENTS.UNLIKE_MESSAGE, (data) => {
            expect(data).toHaveProperty("message")
            expect(data).toHaveProperty("messageId", messageId)
            done()
        })
        clientSocket.emit(SOCKET_EVENTS.UNLIKE_MESSAGE, {
            messageId
        })
    })

    it("Should get Direct Chat List", async () => {
        const response = await request(app)
            .get("/api/chats")
            .set("Cookie", adminCookie)
            .expect(200);
        expect(response.body).toHaveProperty("directChatList")
        expect(response.body.directChatList).toBeInstanceOf(Array)
    })

    it("Should get all Direct Messages", async () => {
        const response = await request(app)
            .get(`/api/messages/get-user-messages/${user2}`)
            .set("Cookie", adminCookie)
            .expect(200);
        expect(response.body).toHaveProperty("messages")
        expect(response.body.messages).toBeInstanceOf(Array)
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
