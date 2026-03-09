import api from './axios';

// Comments
export const getVideoComments = (videoId, params = {}) =>
  api.get(`/comment/${videoId}`, { params });

export const addComment = (videoId, data) => api.post(`/comment/${videoId}`, data);
export const updateComment = (commentId, data) => api.put(`/comment/${commentId}`, data);
export const deleteComment = (commentId) => api.delete(`/comment/${commentId}`);

// Likes
export const toggleVideoLike = (videoId) => api.post(`/like/video/${videoId}`);
export const toggleCommentLike = (commentId) => api.post(`/like/comment/${commentId}`);
export const getLikedVideos = () => api.get('/like/videos');

// Subscriptions
export const toggleSubscription = (channelId) => api.post(`/subscription/${channelId}`);
export const getChannelSubscribers = (channelId) => api.get(`/subscription/subscribers/${channelId}`);
export const getSubscribedChannels = (subscriberId) => api.get(`/subscription/channels/${subscriberId}`);

// Playlists
export const createPlaylist = (data) => api.post('/playlist', data);
export const getUserPlaylists = (userId) => api.get(`/playlist/${userId}`);
export const getPlaylistById = (playlistId) => api.get(`/playlist/get/${playlistId}`);
export const addVideoToPlaylist = (playlistId, videoId) =>
  api.post(`/playlist/${playlistId}/video/${videoId}`);
export const removeVideoFromPlaylist = (playlistId, videoId) =>
  api.delete(`/playlist/${playlistId}/videos/${videoId}`);
export const deletePlaylist = (playlistId) => api.delete(`/playlist/${playlistId}`);
export const updatePlaylist = (playlistId, data) => api.put(`/playlist/${playlistId}`, data);
