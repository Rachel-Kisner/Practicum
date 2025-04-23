import axios from 'axios';
import { User } from '../user';
const BASE_URL = 'http://localhost:3000/api';

export const api = {

    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(BASE_URL + '/user/login/', {
                email,
                password
            });
            return response.data.user;
        } catch (error) {
            throw error;
        }
    },
    register: async (email: string, password: string) => {

        try {
            const response = await axios.post(BASE_URL + '/user/register', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    checkEmailAndPassword: async (email: string,password:string): Promise<boolean> => {
        try {
            await api.login(email, password);  
            return true;  
        } catch (error: any) {
            if (error.response?.status === 401) {
                return false;
            }
            throw error; 
        }
    },
    
    updateUser: async (user: User) => {
        console.log("update-API", user);

        try {
            const response = await axios.put(
                BASE_URL + '/user',
                {
                    ...user
                },
                {
                    headers: {
                        'user-id': user.id
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error in updateUser:", error);
            throw new Error('Update failed');
        }
    },


}