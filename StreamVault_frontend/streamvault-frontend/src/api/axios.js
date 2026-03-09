import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const error = err.response?.data || { message: 'Network error', status: 500 };
    return Promise.reject(error);
  }
);

export default api;