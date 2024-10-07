import mongoose from "mongoose";

const notificationSceham = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["like", "comment", "connectionAccepted"]
    },
    relateduser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSceham);