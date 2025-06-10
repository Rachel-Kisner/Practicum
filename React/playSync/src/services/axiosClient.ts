import axios from 'axios';

const BASE_URL = 'https://localhost:44322/api'; // Base URL for the API, change this to your actual API URL
const API= 'User'; // The specific API endpoint for user-related operations
// Create an axios instance with the base URL and default headers
// This instance can be used throughout the application to make API requests
const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
}
// Add a request interceptor to include the Authorization header with the access token
// This will automatically attach the token to every request made by this axios instance
axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

axiosClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers)
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        },
                        reject: (error) => {
                            reject(error);
                        },
                    });
                });
            }

            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                const response = await axios.post(`${BASE_URL}${API}/refresh-token`, { refreshToken });
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                processQueue(null, newAccessToken);
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }
                return axiosClient(originalRequest);
            }
            catch (error) {
                processQueue(error, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/'; // Redirect to home page
                return Promise.reject(error);
            }
            finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    });

export default axiosClient;