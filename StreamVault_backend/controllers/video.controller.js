import { User } from '../models/user.models.js';
import APIResponse from '../utils/ApiResponse.js';
import Video from "../models/video.models.js";
import AppError from '../utils/ErrorClass.js';
import { uploadAndDeleteLocal } from '../utils/cloudinary.js';
import wrapAsync from '../utils/wrapAsync.js';// assuming you're using this middleware
import cloudinary from 'cloudinary'; // import your configured Cloudinary instance



const getChannelVideos = wrapAsync(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new AppError(400, "UserId is required");
  }

  const videos = await Video.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate("owner", "username avatar fullName");

  res.status(200).json(
    new APIResponse(200, "Channel videos fetched", {
      videos
    })
  );
});

const getAllVideos = wrapAsync(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,          // text search (e.g., title)
        sortBy = 'createdAt',
        sortType = 'desc',
        userId          // optional filter by uploader
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // 1. Build filter object
    const filter = {};

    // Full-text or partial title match (case-insensitive)
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }

    // Filter by uploader
    if (userId) {
        filter.owner = userId;
    }

    // 2. Build sort object
    const sort = {};
    sort[sortBy] = sortType === 'asc' ? 1 : -1;

    // 3. Fetch total count
    const total = await Video.countDocuments(filter);

    // 4. Fetch paginated + sorted + populated videos
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'username email fullName'); // only include selected user fields

    // 5. Send response
    res.status(200).json(new APIResponse(200, 'Videos fetched', {
        totalDocs: total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        pageSize: limitNum,
        videos
    }));
});


const publishAVideo = wrapAsync(async (req, res) => {
    console.log(req.files)
    const { title, description } = req.body;

    if (!title || !description) {
        throw new AppError(400, 'All fields are required');
    }

    if (!req.files || !req.files.video || !req.files.thumbnail) {
        throw new AppError(400, 'Video and thumbnail files are required');
    }

    const videoUrl = await uploadAndDeleteLocal(req.files.video[0].path);
    const thumbnailUrl = await uploadAndDeleteLocal(req.files.thumbnail[0].path);

    if (!videoUrl || !thumbnailUrl) {
        throw new AppError(500, 'Failed to upload video or thumbnail');
    }

    const video = await Video.create({
        title,
        description,
        url: videoUrl.secure_url,
        duration: videoUrl.duration,
        thumbnail: thumbnailUrl.secure_url,
        owner: req.user?.userId,
        isPublished: true,
        publicVideoId: videoUrl.public_id,       // Save public IDs for easy deletion
        publicThumbnailId: thumbnailUrl.public_id
    });

    res.status(200).json(new APIResponse(200, 'Video published successfully', video));
});


const getVideoById = wrapAsync(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new AppError(400, 'Video ID is required');
    }

    const video = await Video.findById(videoId).populate('owner', 'username email fullName');
    if (!video) {
        throw new AppError(404, 'Video not found');
    }

    let user = await User.findById(req.user.userId)
        .select("-password -refreshToken");

    if (!user) {
        throw new AppError(404, 'User not found');
    }

   user.watchHistory = user.watchHistory || [];
    if (user.watchHistory.includes(videoId)) {
        user.watchHistory = user.watchHistory.filter(id => id.toString() !== videoId);
    }
    user.watchHistory.push(videoId);
    await user.save({ validateBeforeSave: false });

    // video.views += 1;
    if (!user.watchHistory.some(id => id.toString() === videoId.toString())) {
        video.views += 1;
    }
    await video.save({ validateBeforeSave: false });

    res.status(200).json(new APIResponse(200, 'Video fetched successfully', video));
});





const updateVideo = wrapAsync(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new AppError(400, 'Video ID is required');
    }
    const video = await Video.findById(videoId);
    // console.log(video)
    if (!video) {
        throw new AppError(404, 'Video not found');
    }

    if (video.owner.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to update this video');
    }
    console.log(req.body)
    const { title, description } = req.body;
    if (!(title || description)) {
        throw new AppError(400, 'All fields are required');
    }


    video.title = title || video.title;
    video.description = description || video.description;


    if (req.files && req.files.video && req.files.thumbnail) {

        if (video.publicVideoId) {
            await cloudinary.uploader.destroy(video.publicVideoId, { resource_type: 'video' });
        }


        if (video.publicThumbnailId) {
            await cloudinary.uploader.destroy(video.publicThumbnailId, { resource_type: 'image' });
        }


        const videoUrl = req.files.video ? await uploadAndDeleteLocal(req.files.video[0].path) : null;
        const thumbnailUrl = req.files.thumbnail ? await uploadAndDeleteLocal(req.files.thumbnail[0].path) : null;

        if (!(videoUrl || thumbnailUrl)) {
            throw new AppError(500, 'Failed to upload video or thumbnail');
        }

        if (videoUrl) {
            video.url = videoUrl.secure_url || video.url;
            video.duration = videoUrl.duration || video.duration;
            video.publicVideoId = videoUrl.public_id || video.publicVideoId;
        }

        if (thumbnailUrl) {
            video.thumbnail = thumbnailUrl.secure_url || video.thumbnail;
            video.publicThumbnailId = thumbnailUrl.public_id || video.publicThumbnailId;
            video.duration = videoUrl.duration || video.duration;
            video.url = videoUrl.secure_url || video.url;
            video.isPublished = true;
        }
    }

    await video.save({ validateBeforeSave: false });
    res.status(200).json(new APIResponse(200, 'Video updated successfully', video));
});


const deleteVideo = wrapAsync(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new AppError(400, 'Video ID is required');
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new AppError(404, 'Video not found');
    }


    if (video.owner.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to delete this video');
    }

    if (video.publicVideoId) {
        await cloudinary.uploader.destroy(video.publicVideoId, { resource_type: 'video' });
    }
    if (video.publicThumbnailId) {
        await cloudinary.uploader.destroy(video.publicThumbnailId, { resource_type: 'image' });
    }

    await video.deleteOne();

    res.status(200).json(new APIResponse(200, 'Video deleted successfully'));
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getChannelVideos
};
