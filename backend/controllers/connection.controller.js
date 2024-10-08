import ConnectionRequest from "../models/connectionReques.model.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString() === userId) {
            return res.status(400).json({ message: "You Cannot Send a Connection Request to Yourself" });
        }

        if (req.user.connections.includes(userId)) {
            return res.status(400).json({ message: "You are Already Connected" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A Connection Request Already Exists" })
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId
        });

        await newRequest.save();

        res.status(201).json({ message: "Connection Request sent Successfully" });
    }
    catch (error) {
        console.error("Error in sendConnectionRequest Controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId)
            .populate("sender", "name email username")
            .populate("recipient", "name username");

        if (!request) {
            return res.status(404).json({ message: "Connection Request Not Found" });
        }

        if (request.recipient._id.toString() == userId.toString()) {
            return res.status(404).json({ message: "Not Authorized to Accept this Request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This Request has Already been Processed" });
        }

        request.status = "accepted";

        await User.findByIdAndUpdate(request.sender._id,
            {
                $addToSet: {
                    connections: userId
                }
            }
        )

        await User.findByIdAndUpdate(userId,
            {
                $addToSet: {
                    connections: request.sender._id
                }
            }
        )

        const notification = new Notification({
            recipient: request.sender._id,
            type: "connectionAccepted",
            relatedUser: userId
        });

        await notification.save();

        res.json({ message: "Connection Accepted Successfully" });

        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

        try {
            await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);
        }
        catch (error) {
            console.error("Error in sendConnectionAcceptedEmail: ", error);
        }
    }
    catch (error) {
        console.error("Error in acceptConnectionRequest Controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}