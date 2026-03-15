import axios from 'axios';

// Default to relative /api so production traffic goes through Nginx proxy.
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401 (expired/invalid token), clear auth so ProtectedRoute can redirect to login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('companyName');
            localStorage.removeItem('companyLogo');
            localStorage.removeItem('companyModules');
        }
        return Promise.reject(error);
    }
);

export const AuthAPI = {
    login: async (data: any) => apiClient.post('/auth/login', data),
    register: async (data: any) => apiClient.post('/auth/register', data),
};

export default apiClient;
