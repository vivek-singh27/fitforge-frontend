import api from './axiosInstance';
export const getDietPlan    = () => api.get('/plans/diet');
export const getWorkoutPlan = () => api.get('/plans/workout');