import APIManager from "./APIManager";

export const RefreshAccessToken = async (payload: { jwtToken: string | null; refreshToken: string | null }) => {
  try {
    // This endpoint should refresh the access token using the refresh token in cookies
    const response = await APIManager("/User/TokenRefresh", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};
