import axiosClient from "./axiosClient";

const registrationApi = {
    // Registration Periods
    getPeriods: () => axiosClient.get("/registration-periods"),
    getPeriodById: (id) => axiosClient.get(`/registration-periods/${id}`),
    createPeriod: (data) => axiosClient.post("/registration-periods", data),
    updatePeriod: (id, data) => axiosClient.put(`/registration-periods/${id}`, data),
    deletePeriod: (id) => axiosClient.delete(`/registration-periods/${id}`),

    // Course Registrations
    register: (data) => axiosClient.post("/course-registrations", data),
    cancelRegistration: (id) => axiosClient.delete(`/course-registrations/${id}`),
    getStudentRegistrations: (studentId) => axiosClient.get(`/course-registrations/student/${studentId}`),
    getSectionRegistrations: (sectionId) => axiosClient.get(`/course-registrations/section/${sectionId}`),

    // Equivalent Courses
    getEquivalentCourses: () => axiosClient.get("/equivalent-courses"),
    createEquivalentCourse: (data) => axiosClient.post("/equivalent-courses", data),
    deleteEquivalentCourse: (id) => axiosClient.delete(`/equivalent-courses/${id}`),
};

export default registrationApi;
