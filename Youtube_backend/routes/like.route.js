import express from "express";
import { upload } from "../middleware/multer.config.js";
import {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}
    from "../controllers/like.controller.js";

import { requestUser } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/video/:videoId", requestUser, toggleVideoLike);
router.get("/videos", requestUser, getLikedVideos);
router.post("/comment/:commentId", requestUser, toggleCommentLike);

export { router as likeRouter }