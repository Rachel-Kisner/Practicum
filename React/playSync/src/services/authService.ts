import axios from "axios";
import axiosClient from "./axiosClient";
import {tokenManager} from "../utils/tokenManager";
const API = '/User';
const BASE_URL = 'https://localhost:44322/api'

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}${API}/login`, {
            email,
            password
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        console.log(response.data.accessToken, "accessToken from loginUser");
        console.log(response.data.refreshToken, "refreshToken from loginUser");
        tokenManager.setAccessToken(response.data.accessToken);
        tokenManager.setRefreshToken(response.data.refreshToken);
        console.log("Login success response:", response.data);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error(`Email or password is incorrect`);
            }
        }
        console.log("Login error:", error);
        throw new Error(`Login failed .Please try again later: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
export const registerUser = async (data: { email: string, password: string, username: string, role?: number }) => {
    try {
        const response = await axios.post(`${BASE_URL}${API}/`, {
            email: data.email,
            passwordHash: data.password,
            name: data.username,
            role: data.role || 2 // Default to 2 if role is not provided

        },
            {
                headers: {
                    'Content-Type': 'application/json'

                }
            });
        console.log(response.data, "response from registerUser");

        return response.data;
    }
    catch (error: any) {
        console.log(data.email, data.password, data.username, data.role, "wrong!!!! data from registerUser");
        console.error("Error in registerUser:", error);

        const serverMessage = error.response?.data?.message;

        throw new Error(`registration failed: ${serverMessage || error.message || 'Unknown error'}`);

    }

};
export const checkEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
    try {
        await loginUser(email, password);
        return true; // If login is successful, return true
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return false; // ✅ במקום לזרוק שגיאה - נחזיר false
        }
        console.error("Login error:", error);
        return false; // ✅ גם כל שגיאה אחרת (כמו timeout) - תיחשב ככשלון
    }
};
export const updateUser = async (user: { id: string; name: string; email: string }) => {
    try {
        const response = await axiosClient.put(`${API}/update`, user, {
            headers: {
                'Content-Type': 'application/json',
                'user-id': user.id
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in updateUser:", error);
        throw new Error('Update failed');
    }
};
export const refreshToken = async (refreshToken: string) => {
    try {
        const response = await axios.post(`${BASE_URL}${API}/refresh-token`,  
            {refreshToken} , {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const accessToken = response.data.accessToken;
        tokenManager.setAccessToken(accessToken);
        const newRefreshToken = response.data.refreshToken;
        tokenManager.setRefreshToken(newRefreshToken);
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw new Error('Token refresh failed');
    }
};
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await axiosClient.post(`${API}/exists`, { email });
        console.log("checkEmailExists response:", response.data);
        return response.data.exists; // ✅ מחזיר true אם קיים
    } catch (error) {
        console.log("checkEmailExists ERROR:", error);
        return false; // במקרה של שגיאה, תתייחסי אליו כלא קיים כדי לא להפיל את הטופס
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosClient.get(`${API}/me`);
        return response.data;
    } catch (error) {
        console.error("Error getting current user:", error);
        throw new Error('Failed to get current user');
    }
};





