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
  refreshUser: (email?: string) => Promise<void>;
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
    if (userObj && userObj.email) {
      localStorage.setItem('email', userObj.email);
    }
  };

  const refreshUser = async (emailOverride?: string, forceRefresh: boolean = false) => {
    setLoading(true);
    try {
      // If user is already set and not forcing refresh, skip API call
      if (user && !forceRefresh) {
        setLoading(false);
        return;
      }
      let email = emailOverride || user?.email;
      if (!email) email = localStorage.getItem('email') || undefined;
      if (email) {
        const res = await GetUserDetails(email);
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
      //const refreshToken = getCookie('refreshToken'); // Change to your actual cookie name
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken'); // Change to your actual storage mechanism
      const payload = { jwtToken: accessToken, refreshToken: refreshToken };

      console.log("Attempting token refresh with:", payload);

      if (payload.jwtToken && payload.refreshToken) {
        const result = await RefreshAccessToken(payload);
        console.log("Token refresh result:", result.responseData);
        if (result.message === "Success") {
          localStorage.setItem('accessToken', result.responseData.accessToken);
          localStorage.setItem('refreshToken', result.responseData.refreshToken);
          // If user info is present in the refresh response, set it immediately
          if (result.responseData.email && result.responseData.fullName) {
            setUser(result.responseData);
          } else {
            await refreshUser(undefined, true);
          }
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
      //const refreshToken = getCookie('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken'); // Change to your actual storage mechanism
      const payload = { jwtToken: accessToken, refreshToken: refreshToken };

      console.log("Attempting token refresh with:", payload);

  if (payload.jwtToken && payload.refreshToken) {
    const result = await RefreshAccessToken(payload);
    if (result.success && result.responseData) {
      // Type guard to check if result has accessToken and refreshToken
      if (
        typeof result.responseData.accessToken === "string" &&
        typeof result.responseData.refreshToken === "string"
      ) {
        localStorage.setItem('accessToken', result.responseData.accessToken);
        localStorage.setItem('refreshToken', result.responseData.refreshToken);
      }
      await refreshUser(undefined, true);
    } else {
      setUser(null);
    }
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
