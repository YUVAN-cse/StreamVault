import express from "express";
import { userRegisterSchema, userLoginSchema } from "../schema.js";
import authVerify from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.config.js";
import { requestUser } from "../middleware/auth.middleware.js";

import {
    register,
    login,
    logout,
    refreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccount,
    updateAvatar,
    updateCoverImage,
    getChannelInfo,
    getWatchHistory

} from "../controllers/user.controller.js";



const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  authVerify(userRegisterSchema),
  register
);
router.post("/login", authVerify(userLoginSchema), login);
router.post("/refresh-token", refreshToken);



//secure routes 

router.post("/logout", requestUser, logout);
router.post("/change-password", requestUser, changeCurrentPassword);
router.get("/current-user", requestUser, getCurrentUser);
router.put("/update-account", requestUser, updateAccount);
router.put("/update-avatar", requestUser, upload.single("avatar") ,updateAvatar);
router.put("/update-cover-image", requestUser, upload.single("coverImage") ,updateCoverImage);
router.get("/channel-info/:userId", requestUser, getChannelInfo);
router.get("/watch-history", requestUser, getWatchHistory);


export { router as userRouter }



