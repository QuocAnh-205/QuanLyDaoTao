import { create } from 'zustand';
import registrationApi from '../api/registrationApi';

const useRegistrationStore = create((set, get) => ({
    periods: [],
    currentRegistrations: [],
    loading: false,
    error: null,

    fetchPeriods: async () => {
        set({ loading: true, error: null });
        try {
            const response = await registrationApi.getPeriods();
            if (response.success) {
                set({ periods: response.data, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchStudentRegistrations: async (studentId) => {
        set({ loading: true, error: null });
        try {
            const response = await registrationApi.getStudentRegistrations(studentId);
            if (response.success) {
                set({ currentRegistrations: response.data, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    addPeriod: async (data) => {
        set({ loading: true });
        try {
            const response = await registrationApi.createPeriod(data);
            if (response.success) {
                set((state) => ({ 
                    periods: [...state.periods, response.data],
                    loading: false 
                }));
                return response;
            }
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    updatePeriod: async (id, data) => {
        set({ loading: true });
        try {
            const response = await registrationApi.updatePeriod(id, data);
            if (response.success) {
                set((state) => ({
                    periods: state.periods.map(p => p.id === id ? response.data : p),
                    loading: false
                }));
                return response;
            }
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    removePeriod: async (id) => {
        set({ loading: true });
        try {
            const response = await registrationApi.deletePeriod(id);
            if (response.success) {
                set((state) => ({
                    periods: state.periods.filter(p => p.id !== id),
                    loading: false
                }));
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useRegistrationStore;
