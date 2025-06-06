// components/auth/OtpVerification.tsx
"use client";

import React, { useState } from "react";
import { sendOTP } from "@/lib/api/auth/sendOTP";
import { verifyOTP } from "@/lib/api/auth/verifyOTP";// You can create this similarly

interface Props {
  email: string;
  tempData: any;
  setIsRegistering: (val: boolean) => void;
  setShowOTP: (val: boolean) => void;
}

const OtpVerification: React.FC<Props> = ({
  email,
  tempData,
  setIsRegistering,
  setShowOTP,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyOTP(email, otp, tempData);
      if (res.success) {
        alert("Account verified! You can now log in.");
        setIsRegistering(false);
        setShowOTP(false);
      } else {
        setError(res.message || "OTP verification failed.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await sendOTP(email);
      setResendMessage("OTP resent! Check your inbox.");
    } catch {
      setResendMessage("Failed to resend OTP.");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {resendMessage && <p className="text-green-500 text-sm">{resendMessage}</p>}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      <button
        onClick={handleResend}
        className="text-sm text-blue-500 underline mt-2"
      >
        Resend OTP
      </button>
    </div>
  );
};

export default OtpVerification;
