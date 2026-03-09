import dotenv from "dotenv";
dotenv.config();
  
import express from "express"
import APIResponse from "./utils/ApiResponse.js"
import cookieParser from "cookie-parser";
import {userRouter} from "./routes/user.route.js"
import {videoRouter} from "./routes/video.route.js"
import { subscriptionRouter } from "./routes/subscription.route.js";
import {playlistRouter} from "./routes/playlist.route.js"
import { likeRouter } from "./routes/like.route.js";
import { commentRouter } from "./routes/comment.route.js";
import cors from "cors";

const app = express()
app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/user", userRouter)
app.use("/video", videoRouter)
app.use("/subscription", subscriptionRouter)
app.use("/playlist", playlistRouter)
app.use("/like", likeRouter)
app.use("/comment", commentRouter)


app.get("/", (req, res) => {
    res.status(200).json(new APIResponse(200, "Welcome to the API"));
})


app.use((err, req, res, next) => {
   res.status(err.status || 500).json(new APIResponse(
      err.status,
      err.message,
      null,
      { code: err.code, details: err.details }
    ));
});


export default app;

