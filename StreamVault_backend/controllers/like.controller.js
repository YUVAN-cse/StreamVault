import mongoose, {isValidObjectId} from "mongoose";
import Like from "../models/like.models.js";
import Comment from "../models/comment.models.js";
import Video from "../models/video.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/ErrorClass.js";
import wrapAsync from "../utils/wrapAsync.js";

const toggleVideoLike = wrapAsync(async (req, res) => {
    const {videoId} = req.params
    if (!isValidObjectId(videoId)) {
        throw new AppError(400, 'Invalid video ID');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new AppError(404, 'Video not found');
    }
    
    const like = await Like.findOne({video: videoId, likedBy: req.user.userId});
    if (like) {
        video.views -= 1;
        await video.save({ validateBeforeSave: false });
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, 'Video unliked successfully'));
    }



    Like.create({
        video: videoId,
        likedBy: req.user.userId
    })

    video.views += 1;
    await video.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, 'Video liked successfully', video));
})

const toggleCommentLike = wrapAsync(async (req, res) => {
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new AppError(400, 'Invalid comment ID');
    }

    const like = await Like.findOne({comment: commentId, likedBy: req.user.userId});
    if (like) {
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, 'Comment unliked successfully'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new AppError(404, 'Comment not found');
    }

    Like.create({
        comment: commentId,
        likedBy: req.user.userId
    })
    res.status(200).json(new ApiResponse(200, 'Comment liked successfully', comment));

})

const getLikedVideos = wrapAsync(async (req, res) => {
    const videos = await Like.find({likedBy: req.user.userId}).populate('video');
    res.status(200).json(new ApiResponse(200, 'Videos fetched successfully', videos));
})


export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}
