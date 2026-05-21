// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            user: null, // { username, fullName, roles: [] }

            // Hàm gọi khi đăng nhập thành công
            setAuth: (token, user) =>
                set({
                    token,
                    isAuthenticated: true,
                    user,
                }),

            // Hàm gọi khi đăng xuất hoặc token hết hạn
            logout: () =>
                set({
                    token: null,
                    isAuthenticated: false,
                    user: null,
                }),
        }),
        {
            name: 'auth-storage', // Tên key lưu trong localStorage
        }
    )
);

export default useAuthStore;