import axiosClient from './axiosClient';

export const studentApi = {
    getAll: (params) => {
        return axiosClient.get('/students', { params });
    },

    getById: (id) => {
        return axiosClient.get(`/students/${id}`);
    },

    create: (data) => {
        return axiosClient.post('/students', data);
    },

    update: (id, data) => {
        return axiosClient.put(`/students/${id}`, data);
    },

    changeStatus: (id, data) => {
        return axiosClient.put(`/students/${id}/status`, data);
    },

    getStatusHistory: (id) => {
        return axiosClient.get(`/students/${id}/status-history`);
    },
};

export const classApi = {
    getAll: () => axiosClient.get('/student-classes'),
    getHierarchy: () => axiosClient.get('/student-classes/hierarchy'),
    getById: (id) => axiosClient.get(`/student-classes/${id}`),
};