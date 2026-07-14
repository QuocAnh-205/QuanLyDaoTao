import axiosClient from './axiosClient';

export const gradeApi = {
    getComponents: (sectionId) => {
        return axiosClient.get(`/grades/sections/${sectionId}/components`);
    },
    configureComponents: (sectionId, data) => {
        return axiosClient.post(`/grades/sections/${sectionId}/components`, data);
    },
    getStudentGrades: (sectionId) => {
        return axiosClient.get(`/grades/sections/${sectionId}/students`);
    },
    submitGrades: (sectionId, data) => {
        return axiosClient.post(`/grades/sections/${sectionId}/grades`, data);
    },
    getStudentTranscript: (studentId) => {
        return axiosClient.get(`/grades/students/${studentId}/transcript`);
    }
};

export default gradeApi;
