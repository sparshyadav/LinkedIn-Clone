import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:id", protectRoute, acceptConnectionRequest);
router.put("/reject/:id", protectRoute, rejectConnectionRequest);
router.get("/requests", protectRoute, getConnectionRequests);
router.get("/", protectRoute, getUserConnections);
router.delete("/:userId", protectRoute, removeConnection);
router.get("/status/:userId", protectRoute, getConnectionStatus);