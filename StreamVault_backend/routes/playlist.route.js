import express from "express";
import { upload } from "../middleware/multer.config.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
    from "../controllers/playlist.controller.js";

import { requestUser } from "../middleware/auth.middleware.js";

const router = express.Router();



router.post("/", requestUser, createPlaylist);
router.get("/:userId", requestUser, getUserPlaylists);
//interesting stuff
router.get("/get/:playlistId", requestUser, getPlaylistById);
router.post("/:playlistId/videos/:videoId", requestUser, addVideoToPlaylist);
router.delete("/:playlistId/videos/:videoId", requestUser, removeVideoFromPlaylist);

router.delete("/:playlistId", requestUser, deletePlaylist);
router.put("/:playlistId", requestUser, updatePlaylist);

export { router as playlistRouter }