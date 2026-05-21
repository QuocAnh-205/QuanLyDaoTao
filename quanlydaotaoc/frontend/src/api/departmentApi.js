import axiosClient from './axiosClient';

export const departmentApi = {
    getAllActive: () => {
        return axiosClient.get('/departments');
    }
};
