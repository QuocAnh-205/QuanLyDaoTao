import axiosClient from './axiosClient';

export const semesterApi = {
    getAllSemesters: () => {
        return axiosClient.get('/semesters');
    },
    getActiveSemester: () => {
        return axiosClient.get('/semesters/active');
    },
    getSectionsBySemester: (semesterId) => {
        return axiosClient.get(`/course-sections/semester/${semesterId}`);
    },
    getSectionById: (id) => {
        return axiosClient.get(`/course-sections/${id}`);
    },
    createSemester: (data) => {
        return axiosClient.post('/semesters', data);
    },
    updateSemester: (id, data) => {
        return axiosClient.put(`/semesters/${id}`, data);
    },
    deleteSemester: (id) => {
        return axiosClient.delete(`/semesters/${id}`);
    },
    createSection: (data) => {
        return axiosClient.post('/course-sections', data);
    },
    updateSection: (id, data) => {
        return axiosClient.put(`/course-sections/${id}`, data);
    },
    deleteSection: (id) => {
        return axiosClient.delete(`/course-sections/${id}`);
    }
};
