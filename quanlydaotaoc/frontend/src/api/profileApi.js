import axiosClient from './axiosClient';

export const profileApi = {
    getProfile: () => {
        return axiosClient.get('/profile');
    },
    updateProfile: (data) => {
        return axiosClient.put('/profile', data);
    },
    updateAvatar: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post('/profile/avatar', formData);
    }
};
