import { createContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  refreshToken as refreshTokenService,
  getCurrentUser,
} from "../services/authService";
import { tokenManager } from "../utils/tokenManager";

const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const isProd = import.meta.env.PROD
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  function persistAuth(accessToken: string, refreshToken: string, user: any) {
    if (!isProd) return;
    tokenManager.setAccessToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  }

  function clearAuthStorage() {
    tokenManager.clearTokens();
    if (isProd) {
      localStorage.removeItem("user");
    }
  }
  function isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // מפענח את ה־payload של ה־JWT
      return payload.exp * 1000 < Date.now(); // אם הזמן הנוכחי עבר את תאריך התפוגה => פג תוקף
    } catch (e) {
      return true; // אם יש שגיאה – נניח שהטוקן לא תקף
    }
  }

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await loginUser(email, password);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      console.log("Login successful", response.user);
      persistAuth(response.accessToken, response.refreshToken, response.user);

    } catch (error) {
      throw error;
    }
  };

  const register = async ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => {
    try {
      await registerUser({ email, password, username });
      await login({ email, password });
    } catch (error) {
      throw error;
    }
  };

  const refresh = async () => {
    try {
      const storedRefreshToken = tokenManager.getAccessToken();
      if (!storedRefreshToken) return;
      const response = await refreshTokenService(storedRefreshToken);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      const userResponse = await getCurrentUser();
      setUser(userResponse);
      persistAuth(response.accessToken, response.refreshToken, response.user);
    } catch (error) {
      console.error("Failed to refresh access token", error);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);

      clearAuthStorage();
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearAuthStorage();
  };

  useEffect(() => {
    const storedToken = tokenManager.getAccessToken();
    if (storedToken && !isTokenExpired(storedToken)) {
      getCurrentUser()
        .then((user) => {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((error) => {
          console.warn("[AuthProvider] getCurrentUser failed:", error);
          setUser(null);
          clearAuthStorage();
        });
    } else {
      const storedRefreshToken = tokenManager.getRefreshToken();
      if (storedRefreshToken) {
        (async () => {
          try {
            console.log("[AuthProvider] No access token, trying refresh with stored refresh token");
            await refresh(); // הפעלת refresh בצורה בטוחה
          } catch (err) {
            console.error("[AuthProvider] Refresh token failed on mount", err);
          }
        })();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setAccessToken, login, register, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
