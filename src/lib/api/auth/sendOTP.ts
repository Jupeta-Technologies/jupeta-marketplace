// lib/auth/sendOTP.ts
export const sendOTP = async (email: string) => {
    const response = await fetch("https://your-dotnet-api.com/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }
  
    return await response.json();
  };
  