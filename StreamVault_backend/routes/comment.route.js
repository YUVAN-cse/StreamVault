import express from "express";
import { upload } from "../middleware/multer.config.js";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
    from "../controllers/comment.controller.js";

import { requestUser } from "../middleware/auth.middleware.js";

const router = express.Router();



router.get("/:videoId", getVideoComments);


router.post("/:videoId", requestUser, addComment);
router.put("/:commentId", requestUser, updateComment);
router.delete("/:commentId", requestUser, deleteComment);

export { router as commentRouter }