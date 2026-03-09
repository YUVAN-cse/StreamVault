import api from './axios';

export const getAllVideos = (params = {}) => {
  // Backend expects `query` not `q`, and `userId` not `owner`
  const mapped = { ...params };
  if (mapped.q) { mapped.query = mapped.q; delete mapped.q; }
  return api.get('/video', { params: mapped });
};

export const publishVideo = (formData) =>
  api.post('/video', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getVideoById = (videoId) => api.get(`/video/${videoId}`);

export const updateVideo = (videoId, data) =>
  api.put(`/video/${videoId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteVideo = (videoId) => api.delete(`/video/${videoId}`);
