import Message from "../models/MessagesModel.js";
import Group from "../models/GroupModel.js";
import userSocktetMap from "./UserSocketsMap.js";
import { io } from "./socket.js";
import { SOCKET_EVENTS } from "../constants/SocketConstants.js";

const sendGroupMessage = async (message, socket) => {
    const sender = socket.handshake.query.userId;
    const { groupId, ...receivedMessage } = message;
    try {
        const storedMessage = await Message.create({ ...receivedMessage, groupId, sender })

        const messageToSend = await Message.findById(storedMessage._id)
            .populate("sender", "_id firstName lastName email");

        await Group.findByIdAndUpdate(groupId, {
            $push: { messages: storedMessage._id }
        });

        const group = await Group.findById(groupId)
            .populate("members", "_id");

        group.members.forEach(member => {
            const memberSocket = userSocktetMap.get(member._id.toString());
            if (memberSocket) io.to(memberSocket).emit(SOCKET_EVENTS.GROUP_MESSAGE, messageToSend);
        });

    } catch (error) {
        io.to(socket.id).emit(SOCKET_EVENTS.ERROR, { error: "Error sending group message", message: error.message });
    }
}

export { sendGroupMessage };