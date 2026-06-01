import api from './axiosInstance';

export const logProgress  = (data) => api.post('/progress', data);
export const getSummary   = ()     => api.get('/progress/summary');
export const getAllLogs   = ()     => api.get('/progress');

// Workout logs
export const logWorkout      = (data) => api.post('/workouts/log', data);
export const getWorkoutLogs  = ()     => api.get('/workouts/log');
export const getWeeklyCount  = ()     => api.get('/workouts/log/weekly-count');

// Calorie logs
export const logMeal         = (data) => api.post('/calories/log', data);
export const getTodayCalories= ()     => api.get('/calories/today');
export const deleteMeal      = (id)   => api.delete(`/calories/${id}`);