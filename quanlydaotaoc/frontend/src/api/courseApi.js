import axiosClient from './axiosClient';

export const courseApi = {
    getAllCourses: () => {
        return axiosClient.get('/courses');
    },
    getCourseById: (id) => {
        return axiosClient.get(`/courses/${id}`);
    },
    createCourse: (data) => {
        return axiosClient.post('/courses', data);
    },
    updateCourse: (id, data) => {
        return axiosClient.put(`/courses/${id}`, data);
    },
    deleteCourse: (id) => {
        return axiosClient.delete(`/courses/${id}`);
    }
};
