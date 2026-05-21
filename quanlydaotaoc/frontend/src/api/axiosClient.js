// src/api/axiosClient.js
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // URL của Spring Boot Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho Request: Tự động đính kèm Token trước khi gửi
axiosClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý lỗi tập trung (vd: 401 Hết hạn token)
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về thẳng data từ ApiResponse của Backend
        return response.data;
    },
    (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            // Nếu lỗi 401 (Unauthorized), xóa phiên làm việc và bắt đăng nhập lại
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;