import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';

console.log("[axiosClient] Loaded and interceptors attached");
const BASE_URL = 'https://localhost:44322/api'; // Base URL for the API, change this to your actual API URL
const API = 'User'; // The specific API endpoint for user-related operations

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
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[axiosClient] Attached access token to request:", config.url);
    }
    return config;
}, error => Promise.reject(error));



axiosClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const status = error.response?.status
        const refreshToken = tokenManager.getRefreshToken();
        console.log("[axiosClient] Interceptor caught error:", error, status, originalRequest?.url);
        if (status === 401 && refreshToken && !originalRequest._retry) {
            console.log("[axiosClient] No access token, trying refresh with refreshToken");
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers)
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        },
                        reject,
                    });
                });
            }
            isRefreshing = true;
            try {
                const response = await axios.post(`${BASE_URL}/${API}/refresh-token`, { refreshToken });
                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                tokenManager.setAccessToken(newAccessToken);
                tokenManager.setRefreshToken(newRefreshToken);
                processQueue(null, newAccessToken);
                console.log("[axiosClient] Received new tokens", { newAccessToken, newRefreshToken });

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
            }
            catch (error) {
                console.error("[axiosClient] Failed to refresh token:", error);
                processQueue(error, null);
                tokenManager.clearTokens();
                window.location.href = '/'; // Redirect to home page
                return Promise.reject(error);
            }
            finally {
                isRefreshing = false;
                console.log("[axiosClient] Loaded and interceptors attached");
            }
        }
        return Promise.reject(error);
    }
);
export default axiosClient;

//         if (status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             if (isRefreshing) {
//                 console.log("[axiosClient] Token is already refreshing, queuing request:", originalRequest.url);
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({
//                         resolve: (token: string) => {
//                             if (originalRequest.headers)
//                                 originalRequest.headers['Authorization'] = `Bearer ${token}`;
//                             resolve(axiosClient(originalRequest));
//                         },
//                         reject: (error) => {
//                             reject(error);
//                         },
//                     });
//                 });
//             }
//             isRefreshing = true;
//             try {
//                 if (!refreshToken) {
//                     console.error("[axiosClient] No refresh token available");
//                     throw new Error('No refresh token available');
//                 }
//                 const response = await axios.post(`${BASE_URL}/${API}/refresh-token`, { refreshToken });
//                 const newAccessToken = response.data.accessToken;
//                 const newRefreshToken = response.data.refreshToken;
//                 console.log("[axiosClient] Received new tokens", { newAccessToken, newRefreshToken });
//                 localStorage.setItem('accessToken', newAccessToken);
//                 localStorage.setItem('refreshToken', newRefreshToken);
//                 processQueue(null, newAccessToken);
//                 originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                 return axiosClient(originalRequest);
//             }
//             catch (error) {
//                 processQueue(error, null);
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 window.location.href = '/'; // Redirect to home page
//                 return Promise.reject(error);

//             }
//             finally {
//                 isRefreshing = false;
//                 console.log("[axiosClient] Loaded and interceptors attached");
//             }
//         }
//         return Promise.reject(error);
//     }
// );
