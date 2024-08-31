import request from "supertest";
import app from "../app.js";
import { io as ioClient } from "socket.io-client";
import setupSocket, { io } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";
import { TEST_PORT } from "../constants/TestConstants.js";

const user1Cookie = global.adminCookie;
const user1 = global.adminId;
const user2 = global.userId;
let clientSocket, client2Socket, groupId;

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

describe('Group Chat sockets', () => {
    it("Should create a new group chat", async () => {
        const response = await request(app).post("/api/groups/create-group")
            .set('cookie', user1Cookie)
            .send({
                name: "New Group For Test",
                members: [user2]
            })
        expect(response.status).toBe(201)
        expect(response.body.data).toHaveProperty("name", "New Group For Test")
        groupId = response.body.data.groupId;
    })

    it("Should send message to group", (done) => {
        const message = "This is a test message sent to group."
        clientSocket.on(SOCKET_EVENTS.GROUP_MESSAGE, (data) => {
            expect(data.message).toBe(message)
            done()
        });
        client2Socket.on(SOCKET_EVENTS.GROUP_MESSAGE, (data) => {
            expect(data.message).toBe(message)
            done()
        });
        clientSocket.emit(SOCKET_EVENTS.GROUP_MESSAGE, {
            groupId,
            message
        });
    })

    it("Should get all messages in group", async () => {
        const response = await request(app).get(`/api/messages/get-group-messages/${groupId}`)
            .set('cookie', user1Cookie)
        expect(response.status).toBe(200)
        expect(response.body.messages.length).toBe(1)
    })
})
