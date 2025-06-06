// lib/auth/verifyOTP.ts
export const verifyOTP = async (email: string, otp: string, tempData: any) => {
    const response = await fetch("https://your-dotnet-api.com/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, ...tempData }),
    });
  
    const data = await response.json();
  
    if (!response.ok || !data.success) {
      return { success: false, message: data.message || "Verification failed" };
    }
  
    return { success: true };
  };