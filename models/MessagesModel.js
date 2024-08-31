import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [function(){return !(this.groupId)}, "Either receiver or groupId is required"]
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups",
        required: [function(){return !(this.receiver)}, "Either groupId or receiver is required"]
    },
    message: {
        type: String,
        required: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    read: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const Message = mongoose.model("Messages", messagesSchema);

export default Message;