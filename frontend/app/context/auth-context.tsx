import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import apiClient from "~/api/axios";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await apiClient().post('/v1/auth/login', {
          usr_nama: username,
          usr_pswd: password
        });
        const responseData = response.data;
        if (!responseData.status) {
          reject(new Error(responseData.message));
        } else {
          localStorage.setItem("token", responseData.data.token);
          setIsAuthenticated(true);
          resolve(responseData);
        }
      } catch (error: any) {
        console.error(error);
        if (error?.status >= 400 || error?.status < 500) {
          reject(new Error(error?.response?.data?.message || "Internal server error"));
        } else if (error?.status >= 500) {
          reject(new Error('Internal server error'));
        } else {
          reject(new Error('Unknown error'));
        }
      }
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
