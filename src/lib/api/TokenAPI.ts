import APIManager from "./APIManager";

export const RefreshAccessToken = async (token: string): Promise<{ success: boolean }> => {
  try {
    // This endpoint should refresh the access token using the refresh token in cookies
    const response = await APIManager("/User/TokenRefresh", {
      method: "POST",
      data: { token },
      withCredentials: true,
    });
    return { success: response.data?.success ?? false };
  } catch {
    return { success: false };
  }
};
