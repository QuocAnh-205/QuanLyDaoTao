// src/api/adminApi.js
import axiosClient from './axiosClient';

export const adminApi = {
    // ======== User Management ========

    /**
     * Lấy danh sách tất cả tài khoản người dùng (Admin only).
     * @param {Object} params - { keyword, page, size }
     */
    getAllUsers: (params) => {
        return axiosClient.get('/admin/users', { params });
    },

    /**
     * Lấy chi tiết một tài khoản theo ID.
     * @param {string} id - UUID của user
     */
    getUserById: (id) => {
        return axiosClient.get(`/admin/users/${id}`);
    },

    /**
     * Admin tạo tài khoản người dùng mới.
     * @param {Object} data - { username, fullName, email, phone, password, isActive }
     */
    createUser: (data) => {
        return axiosClient.post('/admin/users', data);
    },

    /**
     * Admin cập nhật thông tin tài khoản.
     * @param {string} id - UUID của user
     * @param {Object} data - { username, fullName, email, phone, password?, isActive }
     */
    updateUser: (id, data) => {
        return axiosClient.put(`/admin/users/${id}`, data);
    },

    /**
     * Khoá / Mở khoá tài khoản (toggle isActive).
     * @param {string} id - UUID của user
     */
    toggleUserStatus: (id) => {
        return axiosClient.put(`/admin/users/${id}/toggle-status`);
    },

    /**
     * Gán danh sách vai trò mới cho người dùng (thay thế toàn bộ vai trò cũ).
     * @param {string} id - UUID của user
     * @param {string[]} roleCodes - Mảng mã vai trò, ví dụ: ["ADMIN", "GIAOVU"]
     */
    assignRoles: (id, roleCodes) => {
        return axiosClient.put(`/admin/users/${id}/roles`, { roleCodes });
    },

    // ======== Role Management ========

    /**
     * Lấy tất cả vai trò trong hệ thống.
     */
    getAllRoles: () => {
        return axiosClient.get('/admin/roles');
    },
};

export default adminApi;
