import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser, refreshToken as refreshTokenService } from "../services/authService";

const AuthContext = createContext<any>(null);
function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const[accessToken, setAccessToken] = useState<string | null>(()=>localStorage.getItem('accessToken'));

    useEffect(()=>{
        if(accessToken) 
            localStorage.setItem('accessToken', accessToken);

    },[accessToken]);
    const login=async({email, password}: {email: string, password: string})=>{
        const response=await loginUser(email,password);
        setAccessToken(response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        console.log("Login successful", response.user);
        setUser(response.user); 
    }
    const register=async({email, password, username}: {email: string, password: string, username: string})=>{
        await registerUser({email,password,username});
        await login({email, password});
        
    }
    const refresh= async () => {
        try {
            const refreshToken= localStorage.getItem('refreshToken');
            if (!refreshToken) {
            console.log("No refresh token found");
            return;
            }
            const response = await refreshTokenService(refreshToken);
            setAccessToken(response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
        } catch (error) {
            console.error("Failed to refresh access token", error);
        }
    }
    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };
    return (
        <AuthContext.Provider value={{ user, accessToken, login, register, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthContext, AuthProvider };