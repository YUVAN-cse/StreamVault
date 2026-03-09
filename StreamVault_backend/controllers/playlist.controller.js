import mongoose, {isValidObjectId} from "mongoose"
import Playlist from "../models/playlist.models.js"
import wrapAsync from "../utils/wrapAsync.js"
import ApiResponse from "../utils/ApiResponse.js"
import AppError from "../utils/ErrorClass.js";
import {User} from "../models/user.models.js"
import Video from "../models/video.models.js"

const createPlaylist = wrapAsync(async (req, res) => {
    const {name, description} = req.body

    if (!name || !description) {
        throw new AppError(400, 'All fields are required');
    }

    let playlist = await Playlist.create({
        name,
        description,
        owner: req.user.userId
    })

    if (!playlist) {
        throw new AppError(500, 'Failed to create playlist');
    }
    res.status(200).json(new ApiResponse(200, 'Playlist created successfully', playlist));
})


const getUserPlaylists = wrapAsync(async (req, res) => {
    const {userId} = req.params

    if (!isValidObjectId(userId)) {
        throw new AppError(400, 'Invalid user ID');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    const playlists = await Playlist.find({owner: userId});
    if (!playlists) {
        throw new AppError(404, 'Playlists not found');
    }

    res.status(200).json(new ApiResponse(200, 'Playlists fetched successfully', playlists));
})


const getPlaylistById = wrapAsync(async (req, res) => {
    const {playlistId} = req.params
    console.log(playlistId)
    if (!isValidObjectId(playlistId)) {
        throw new AppError(400, 'Invalid playlist ID');
    }
    const playlist = await Playlist.findById(playlistId).populate('owner', 'username email fullName');
    if (!playlist) {
        throw new AppError(404, 'Playlist not found');
    }
    res.status(200).json(new ApiResponse(200, 'Playlist fetched successfully', playlist));
})


const addVideoToPlaylist = wrapAsync(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new AppError(400, 'Invalid playlist or video ID');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, 'Playlist not found please create a playlist first');
    }
    if(playlist.owner.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to add video to this playlist');
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new AppError(404, 'Video not found');
    }

    if (playlist.videos.includes(videoId)) {
        throw new AppError(400, 'Video already added to playlist');
    }

    playlist.videos.push(videoId);
    await playlist.save();
    res.status(200).json(new ApiResponse(200, 'Video added to playlist successfully', playlist));
})


const removeVideoFromPlaylist = wrapAsync(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new AppError(400, 'Invalid playlist or video ID');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, 'Playlist not found please create a playlist first');
    }
    if(playlist.owner.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to remove video from this playlist');
    }
    playlist.videos.pull(videoId);
    await playlist.save();
    res.status(200).json(new ApiResponse(200, 'Video removed from playlist successfully', playlist));

})


const deletePlaylist = wrapAsync(async (req, res) => {
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new AppError(400, 'Invalid playlist ID');
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, 'Playlist not found');
    }
    if(playlist.owner.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to delete this playlist');
    }
    await playlist.deleteOne();
    res.status(200).json(new ApiResponse(200, 'Playlist deleted successfully'));
})


const updatePlaylist = wrapAsync(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if (!isValidObjectId(playlistId)) {
        throw new AppError(400, 'Invalid playlist ID');
    }

    if(!(name || description)) {
        throw new AppError(400, 'All fields are required');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError(404, 'Playlist not found');
    }
    if(playlist.owner.toString() !== req.user.userId) {
        throw new AppError(403, 'You are not authorized to update this playlist');
    }
    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    await playlist.save();
    res.status(200).json(new ApiResponse(200, 'Playlist updated successfully', playlist));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}