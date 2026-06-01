import api from './axiosInstance';
export const setGoal       = (data) => api.post('/goals', data);
export const getActiveGoal = ()     => api.get('/goals/active');
export const getGoalHistory= ()     => api.get('/goals/history');