import api from './axiosInstance';
export const saveProfile = (data) => api.post('/users/profile', data);
export const getProfile  = ()     => api.get('/users/profile');