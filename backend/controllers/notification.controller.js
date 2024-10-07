import Notification from "../models/notifination.model.js"

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    }
    catch (error) {
        console.error("Error in getUserNotifications Controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}