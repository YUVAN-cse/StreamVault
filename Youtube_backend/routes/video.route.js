import express from "express";
import { upload } from "../middleware/multer.config.js";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getChannelVideos
}
    from "../controllers/video.controller.js";

import { requestUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllVideos);
router.post("/", requestUser, upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), publishAVideo);
router.get("/:videoId",requestUser, getVideoById);
router.put("/:videoId", requestUser, updateVideo);
router.delete("/:videoId", requestUser, deleteVideo);
router.get("/channel/:userId", getChannelVideos); 

export { router as videoRouter }