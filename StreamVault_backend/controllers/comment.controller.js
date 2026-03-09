import mongoose, { isValidObjectId } from "mongoose"
import Comment from "../models/comment.models.js";
import wrapAsync from "../utils/wrapAsync.js";
import AppError from "../utils/ErrorClass.js";
import APIResponse from "../utils/ApiResponse.js";


const getVideoComments = wrapAsync(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new AppError(400, 'Video ID is required');
    }

    if (!isValidObjectId(videoId)) {
        throw new AppError(400, 'Invalid video ID');
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination info
    const total = await Comment.countDocuments({ video: videoId });

    // Get paginated comments
    const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limitNumber)
        .populate('author', 'username email fullName');

    res.status(200).json(new APIResponse(200, 'Comments fetched successfully', {
        totalDocs: total,
        totalPages: Math.ceil(total / limitNumber),
        currentPage: pageNumber,
        pageSize: limitNumber,
        comments
    }));
});

const addComment = wrapAsync(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!videoId) {
        throw new AppError(400, 'Video ID is required');
    }

    if (!content) {
        throw new AppError(400, 'Comment content is required');
    }

    if (!isValidObjectId(videoId)) {
        throw new AppError(400, 'Invalid video ID');
    }

    const comment = await Comment.create({
        video: videoId,
        author: req.user.userId,
        content
    });

    res.status(200).json(new APIResponse(200, 'Comment added successfully', comment));
})

const updateComment = wrapAsync(async (req, res) => {
    let { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
        throw new AppError(400, 'Invalid comment ID');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new AppError(404, 'Comment not found');
    }

    if (comment.author.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to update this comment');
    }

    const { content } = req.body;
    if (content) {
        comment.content = content;
        await comment.save();
        res.status(200).json(new APIResponse(200, 'Comment updated successfully', comment));
    } else {
        throw new AppError(400, 'Comment content is required');
    }
})

const deleteComment = wrapAsync(async (req, res) => {
    let { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
        throw new AppError(400, 'Invalid comment ID');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new AppError(404, 'Comment not found');
    }

    if (comment.author.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to delete this comment');
    }

    await comment.deleteOne();
    res.status(200).json(new APIResponse(200, 'Comment deleted successfully', comment));
})


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}