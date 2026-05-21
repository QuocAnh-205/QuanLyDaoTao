import axiosClient from './axiosClient';

export const lecturerApi = {
    getAll: (params) => {
        return axiosClient.get('/employees', { params });
    },

    getAllLecturers: () => {
        // Có thể filter theo role giảng viên nếu cần, tạm thời lấy tất cả
        return axiosClient.get('/employees');
    },

    getById: (id) => {
        return axiosClient.get(`/employees/${id}`);
    },

    create: (data) => {
        return axiosClient.post('/employees', data);
    },

    update: (id, data) => {
        return axiosClient.put(`/employees/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/employees/${id}`);
    }
};

export const departmentApi = {
    getAllActive: () => axiosClient.get('/departments'),
};

export const positionApi = {
    getAllActive: () => axiosClient.get('/positions'),
};

// Alias for backward compatibility
export const employeeApi = lecturerApi;
