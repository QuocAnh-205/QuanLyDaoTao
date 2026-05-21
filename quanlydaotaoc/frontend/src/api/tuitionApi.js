import axiosClient from './axiosClient';

export const tuitionFeeApi = {
    getAll: (params) => {
        return axiosClient.get('/tuition-fees', { params });
    },
    getById: (id) => {
        return axiosClient.get(`/tuition-fees/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/tuition-fees', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/tuition-fees/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/tuition-fees/${id}`);
    },
};

export const studentTuitionApi = {
    getAll: (params) => {
        return axiosClient.get('/student-tuitions', { params });
    },
    getById: (id) => {
        return axiosClient.get(`/student-tuitions/${id}`);
    },
    calculate: (studentId, semesterId) => {
        return axiosClient.post('/student-tuitions/calculate', null, {
            params: { studentId, semesterId }
        });
    },
    calculateAll: (semesterId) => {
        return axiosClient.post('/student-tuitions/calculate-all', null, {
            params: { semesterId }
        });
    },
    adjust: (id, data) => {
        return axiosClient.put(`/student-tuitions/${id}/adjust`, data);
    },
    createManual: (data) => {
        return axiosClient.post('/student-tuitions/manual', data);
    },
    delete: (id) => {
        return axiosClient.delete(`/student-tuitions/${id}`);
    },
};

export const paymentApi = {
    create: (data) => {
        return axiosClient.post('/payments', data);
    },
    getByTuitionId: (tuitionId) => {
        return axiosClient.get(`/payments/tuition/${tuitionId}`);
    },
    getAll: (params) => {
        return axiosClient.get('/payments', { params });
    },
};
