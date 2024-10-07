import ConnectionRequest from "../models/connectionReques.model.js";

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