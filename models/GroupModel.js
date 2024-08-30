import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages"
    }]

},
    {
        timestamps: true
    }
);

const Group = mongoose.model("Groups", groupSchema);

export default Group;