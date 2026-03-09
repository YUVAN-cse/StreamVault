import express from "express";
import { upload } from "../middleware/multer.config.js";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
    from "../controllers/subscription.controller.js";

import { requestUser } from "../middleware/auth.middleware.js";

const router = express.Router();



router.post("/:channelId", requestUser, toggleSubscription);
router.get("/subscribers/:channelId", getUserChannelSubscribers);
router.get("/channels/:subscriberId", getSubscribedChannels);

export { router as subscriptionRouter }