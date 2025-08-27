// src/context/AuthContext.tsx'
'use client';
// This file provides the authentication context for the application,
// managing user state, loading status, and authentication checks.
// It also provides methods for refreshing user data and logging out.
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/api";
import APIManager from "@/lib/api/APIManager";
import { GetUserDetails } from "@/lib/api/UserAuthenticationAPI";
import { RefreshAccessToken } from "@/lib/api/TokenAPI";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: (userId?: string) => Promise<void>;
  logout: () => void;
  setUserId: (userId: string) => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserIdState] = useState<string | null>(null);


  const setUserId = (id: string) => {
    setUserIdState(id);
    // Optionally, persist to localStorage if you want to survive reloads
    // localStorage.setItem('userId', id);
  };

  // Just update state, don't persist user in localStorage
  const setUser = (userObj: User | null) => {
    setUserState(userObj);
  };

  const refreshUser = async (userIdOverride?: string, forceRefresh: boolean = false) => {
    setLoading(true);
    try {
      // If user is already set and not forcing refresh, skip API call
      if (user && !forceRefresh) {
        setLoading(false);
        return;
      }
      let userId = userIdOverride || user?.userId || user?.id;
      if (!userId) userId = localStorage.getItem('userId') || undefined;
      if (userId) {
        const res = await GetUserDetails(userId);
        if (res && res.code === "0") {
          setUser(res.responseData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await APIManager.post("/User/Logout"); // Adjust endpoint as needed
    setUser(null);
  };

  useEffect(() => {
    // Helper to extract token from cookies
    function getCookie(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    }

    // On mount, try to restore session using refresh token
    const tryRestoreSession = async () => {
      setLoading(true);
      const refreshToken = getCookie('refreshToken'); // Change to your actual cookie name
      if (refreshToken) {
        const result = await RefreshAccessToken(refreshToken);
        if (result.success) {
          await refreshUser(undefined, true);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    tryRestoreSession();

    // Set up periodic token refresh (e.g., every 10 minutes)
    const interval = setInterval(async () => {
      const refreshToken = getCookie('refreshToken');
      if (!refreshToken) {
        setUser(null);
        return;
      }
      const result = await RefreshAccessToken(refreshToken);
      if (result.success) {
        await refreshUser(undefined, true);
      } else {
        setUser(null);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, refreshUser, logout, setUserId, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
