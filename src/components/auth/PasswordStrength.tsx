// components/auth/PasswordStrengthMeter.tsx
"use client";

import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const calculateStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const getStrengthLabel = (score: number) => {
  switch (score) {
    case 0:
    case 1:
      return { label: "Very Weak", color: "bg-red-500" };
    case 2:
      return { label: "Weak", color: "bg-orange-500" };
    case 3:
      return { label: "Moderate", color: "bg-yellow-500" };
    case 4:
      return { label: "Strong", color: "bg-green-500" };
    case 5:
      return { label: "Very Strong", color: "bg-emerald-600" };
    default:
      return { label: "", color: "bg-gray-300" };
  }
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const score = calculateStrength(password);
  const { label, color } = getStrengthLabel(score);

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div className={`h-full ${color}`} style={{ width: `${(score / 5) * 100}%` }}></div>
      </div>
      <p className="text-xs mt-1 text-gray-700">Strength: {label}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
