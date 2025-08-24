import axios from 'axios';

const instance = axios.create({
    timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截器
instance.interceptors.response.use(
    (response) => response.data, // 直接返回 data 部分
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error.response?.data || error);
    }
);

export default instance;