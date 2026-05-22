import axiosClient from './axiosClient';

export const systemConfigApi = {
    getConfigs: () => {
        return axiosClient.get('/system-configs');
    },
    getConfigByKey: (key) => {
        return axiosClient.get(`/system-configs/${key}`);
    },
    saveConfigs: (configs) => {
        return axiosClient.put('/system-configs', configs);
    }
};

export default systemConfigApi;
