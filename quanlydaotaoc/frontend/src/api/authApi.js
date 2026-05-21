// src/api/authApi.js
import axiosClient from './axiosClient';

export const authApi = {
    login: (data) => {
        return axiosClient.post('/auth/login', data);
    },
    getMe: () => {
        return axiosClient.get('/auth/me');
    },
    register: (data) => {
        return axiosClient.post('/auth/register', data);
    },
    forgotPassword: (data) => {
        return axiosClient.post('/auth/forgot-password', data);
    },
    resetPassword: (data) => {
        return axiosClient.post('/auth/reset-password', data);
    },
};