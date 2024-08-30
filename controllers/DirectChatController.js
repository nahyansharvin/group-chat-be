import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";

export const getDirectChatList = async (req, res) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const directChatList = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$createdAt" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    firstName: "$user.firstName",
                    lastName: "$user.lastName",
                    email: "$user.email"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        console.log("Direct Chat List: ", directChatList)

        res.status(200).json({ directChatList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}