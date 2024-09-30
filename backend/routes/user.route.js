import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getSuggestedConnections } from "../controllers/user.controller";
const router=express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);
export default router;