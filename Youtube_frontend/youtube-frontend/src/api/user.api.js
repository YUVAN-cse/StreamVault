import api from './axios';

export const registerUser = (formData) =>
  api.post('/user/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const loginUser = (data) => api.post('/user/login', data);
export const logoutUser = () => api.post('/user/logout');
export const refreshToken = () => api.post('/user/refresh-token');
export const getCurrentUser = () => api.get('/user/current-user');
export const getChannelVideos = (userId) => api.get(`/video/channel/${userId}`);
export const changePassword = (data) => api.post('/user/change-password', data);
export const updateAccount = (data) => api.put('/user/update-account', data);

export const updateAvatar = (formData) =>
  api.put('/user/update-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateCoverImage = (formData) =>
  api.put('/user/update-cover-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getChannelInfo = (username) => api.get(`/user/channel-info/${username}`);
export const getWatchHistory = () => api.get('/user/watch-history');
