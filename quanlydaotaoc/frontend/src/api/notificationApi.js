import axiosClient from './axiosClient';

export const notificationApi = {
    getNotifications: () => {
        return axiosClient.get('/notifications');
    },
    getUnreadCount: () => {
        return axiosClient.get('/notifications/unread-count');
    },
    markAsRead: (id) => {
        return axiosClient.put(`/notifications/${id}/read`);
    },
    markAllAsRead: () => {
        return axiosClient.put('/notifications/read-all');
    }
};

export default notificationApi;
