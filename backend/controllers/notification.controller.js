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

export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id;

    try {
        const notification = await Notification.findByIdAndUpdate(
            { _id: notificationId, recipient: req.user._id },
            { read: true },
            { new: true }
        );

        res.status(200).json(notification);
    }
    catch (error) {
        console.error("Error in markNotificationAsRead Controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;

    try {
        await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user._id
        });

        res.status(200).json({ message: "Notification Deleted Successfully" });
    }
    catch (error) {
        console.error("Error in deleteNotification Controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}