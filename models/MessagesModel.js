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
        required: false
    },
    message: {
        type: String,
        required: true
    },
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