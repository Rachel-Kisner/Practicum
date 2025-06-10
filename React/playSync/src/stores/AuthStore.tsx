// import { createContext, useEffect, useState } from "react";
// import { loginUser, registerUser, refreshToken as refreshTokenService, getCurrentUser } from "../services/authService";
// import { get } from "react-hook-form";

// function AuthProvider({ children }: { children: React.ReactNode }) {
// function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<any>(() => {
//         const storedUser = localStorage.getItem('user');
//         return storedUser ? JSON.parse(storedUser) : null;
//     });
//     const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));


//     // useEffect(() => {
//     //     if (accessToken)
//     //         localStorage.setItem('accessToken', accessToken);

//     // }, [accessToken]);
//     const login = async ({ email, password }: { email: string, password: string }) => {
//         const response = await loginUser(email, password);
//         setAccessToken(response.accessToken);
//         localStorage.setItem('accessToken', response.accessToken);
//         localStorage.setItem('refreshToken', response.refreshToken);
//         console.log("Login successful", response.user);
//         setUser(response.user);
//         localStorage.setItem('user', JSON.stringify(response.user));
//     }
//     const register = async ({ email, password, username }: { email: string, password: string, username: string }) => {
//         await registerUser({ email, password, username });
//         await login({ email, password });

//     }
//     const refresh = async () => {
//         try {
//             const refreshToken = localStorage.getItem('refreshToken');
//             if (!refreshToken) {
//                 console.log("No refresh token found");
//                 return;
//             }
//             const response = await refreshTokenService(refreshToken);
//             setAccessToken(response.accessToken);
//             localStorage.setItem('accessToken', response.accessToken);
//             localStorage.setItem('refreshToken', response.refreshToken);
//             const userResponse= await getCurrentUser();
//         } catch (error) {
//             console.error("Failed to refresh access token", error);
//         }
//     }
//     const logout = () => {
//         setUser(null);
//         setAccessToken(null);
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//     };
//     return (
//         <AuthContext.Provider value={{ user, accessToken, login, register, refresh, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
// export { AuthContext, AuthProvider };


import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser, refreshToken as refreshTokenService, getCurrentUser } from "../services/authService";
import { get } from "react-hook-form";

const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
    // אתחול ה-user מה-localStorage כדי שגם אחרי רענון דף ה-Avatar יופיע
    const [user, setUser] = useState<any>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));

    // בכל login: עדכון גם של ה-user ב-context וגם ב-localStorage
    const login = async ({ email, password }: { email: string, password: string }) => {
        const response = await loginUser(email, password);
        setAccessToken(response.accessToken);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setUser(response.user); // ⬅️ עדכון ה-user ב-context
        localStorage.setItem('user', JSON.stringify(response.user)); // ⬅️ שמירה ב-localStorage
    };

    // בכל register: אותו תהליך כמו login
    const register = async ({ email, password, username }: { email: string, password: string, username: string }) => {
        await registerUser({ email, password, username });
        await login({ email, password });
    };

    // רענון טוקן: עדכון גם של ה-user ב-context וגם ב-localStorage
    const refresh = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.log("No refresh token found");
                return;
            }
            const response = await refreshTokenService(refreshToken);
            setAccessToken(response.accessToken);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            // שליפת המשתמש מהשרת ועדכון ב-context וב-localStorage
            const userResponse = await getCurrentUser();
            setUser(userResponse); // ⬅️ עדכון ה-user ב-context
            localStorage.setItem('user', JSON.stringify(userResponse)); // ⬅️ שמירה ב-localStorage
        } catch (error) {
            console.error("Failed to refresh access token", error);
            setUser(null); // ⬅️ איפוס ה-user במקרה של כישלון
            localStorage.removeItem('user');
        }
    };

    // ב-logout: איפוס הכל
    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('user'); // ⬅️ מחיקת ה-user מה-localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // אפשרות: לטעון את ה-user מהשרת בכל טעינה (לא חובה, רק אם רוצים עדכון תמידי)
    useEffect(() => {
        if (accessToken) {
            getCurrentUser().then(user => {
                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
            }).catch(() => {
                setUser(null);
                localStorage.removeItem('user');
            });
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ user, accessToken, login, register, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };