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
  console.log(score);
  switch (score) {
    case 0:
    case 1:
      return { label: "Very Weak", color: "red-500" };
    case 2:
      return { label: "Weak", color: "orange-500" };
    case 3:
      return { label: "Moderate", color: "yellow-500" };
    case 4:
      return { label: "Strong", color: "green-500" };
    case 5:
  return { label: "Very Strong", color: "indigo-600" };
    default:
      return { label: "", color: "gray-300" };
  }
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const score = calculateStrength(password);
  const { label, color } = getStrengthLabel(score);

  return (
    <div className="mt-2">
      <div style={{backgroundColor:'rgb(229 231 235)', height:'2px', width:'100%'}}>
        <div className={`h-full ${color}`} style={{ width: `${(score / 5) * 100}%`}}></div>
      </div>
      <p className="" style={{fontSize:'small'}}>Strength: {label}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
