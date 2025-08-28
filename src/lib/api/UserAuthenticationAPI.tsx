import APIManager from "./APIManager";
import { APIResponse,User } from "@/types/api";


interface UserAuthAPI{
    data: User
}

export const UserLogin = async (data: Record<string, any>): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager('/User/Login', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false // Ensure cookies are sent with the request
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Login failed', code: "1", statusCode: 500, responseData: null };
    }
}

export const UserSignUp = async (data: Record<string, any>): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager('/User/AddUser', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Sign up failed' };
    }
}

export const GetRegistration_OTP = async (data: Record<string, any>): Promise<APIResponse<any>> => {
    try {
        const regOTP = await APIManager('/User/GenerateOTPWithEmail', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false
        });
        return regOTP.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'OTP generation failed' };
    }
}

export const VerifyReg_OTP = async (data: Record<string, any>): Promise<APIResponse<any>> => {
    try {
        const regOTP = await APIManager('/User/ValidateOTP', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false
        });
        return regOTP.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'OTP verification failed' };
    }
}


export const GetUserDetails = async (email: string): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager(`/User/GetUserById?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Failed to fetch user details' };
    }
}

export const UpdateUserDetails = async (userId: string, data: Record<string, any>): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager(`/User/UpdateUserDetails/${userId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Failed to update user details' };
    }
}

export const UserLogout = async (): Promise<APIResponse<any>> => {
    try {
        const response = await APIManager('/User/Logout', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Logout failed' };
    }
}

export const GoogleLogin = async (): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager('/User/ExternalLogin/Google', {
            method: "GET", // Assuming Google login is a GET request
            // If your API requires a POST request with specific data, change this to POST and provide
            headers: { 'Content-Type': 'application/json' },
            data: {}, // Assuming no additional data is needed for Google login
            withCredentials: false
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Google login failed' };
    }
}
export const FacebookLogin = async (data: Record<string, any>): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager('/User/FacebookLogin', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Facebook login failed' };
    }
}
export const AppleLogin = async (data: Record<string, any>): Promise<APIResponse<User>> => {
    try {
        const response = await APIManager('/User/AppleLogin', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: data,
            withCredentials: false
        });
        return response.data;
    } catch (error: any) {
        return error?.responseData || { success: false, message: error?.message || 'Apple login failed' };
    }
}