"use client";

import React, { useEffect, useState, useCallback } from "react";
// TODO: Re-enable when API is ready
// import { sendOTP } from "@/lib/api/auth/sendOTP"; 
// import { verifyOTP } from "@/lib/api/auth/verifyOTP";
import PasswordStrengthMeter from "./PasswordStrength";
import { PiWarningCircleFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { BsCheck2Circle, BsFillCheckCircleFill, BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { SlArrowRight } from "react-icons/sl";
import { User, Loader2 } from "lucide-react";
import { UserSignUp } from "@/lib/api/UserAuthenticationAPI";
import "@/styles/RegisterForm.css";

interface RegisterFormProps {
  setShowOTP: (show: boolean) => void;
  setEmail: (email: string) => void;
  setTempData: (data: any) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string; // For general errors like registration failures
}

enum RegistrationStep {
  EMAIL_INPUT = 'email_input',
  EMAIL_VERIFICATION = 'email_verification',
  USER_DETAILS = 'user_details',
  COMPLETED = 'completed'
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  setShowOTP,
  setEmail,
  setTempData,
}) => {
  // Form state
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: ""
  });
  
  // UI state
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.EMAIL_INPUT);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    if (!/\d/.test(password)) errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain at least one special character");
    return errors;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // First name validation (only for user details step)
    if (currentStep === RegistrationStep.USER_DETAILS) {
      if (!form.firstName.trim()) {
        newErrors.firstName = "First name is required";
      } else if (form.firstName.length < 2) {
        newErrors.firstName = "First name must be at least 2 characters";
      }

      // Last name validation
      if (!form.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      } else if (form.lastName.length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters";
      }

      // Password validation
      if (!form.password) {
        newErrors.password = "Password is required";
      } else {
        const passwordErrors = validatePassword(form.password);
        if (passwordErrors.length > 0) {
          newErrors.password = passwordErrors[0];
        }
      }

      // Confirm password validation
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (confirmPassword !== form.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // Phone number validation
      if (!form.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!validatePhoneNumber(form.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }

      // Date of birth validation
      if (!form.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const birthDate = new Date(form.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          newErrors.dateOfBirth = "You must be at least 13 years old to register";
        }
      }

      // Terms validation
      if (!termsAccepted) {
        newErrors.terms = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(form.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO: Replace with actual sendOTP call when API is ready
      // const response = await sendOTP(form.email);
      
      // Mock successful response for testing
      const mockResponse = {
        Code: "0",
        message: "OTP sent successfully"
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (mockResponse.Code === "0") {
        setEmail(form.email);
        setTempData(form);
        setCurrentStep(RegistrationStep.EMAIL_VERIFICATION);
        console.log(`🚀 Mock OTP sent to: ${form.email} (Code: 1234 for testing)`);
      } else {
        setErrors({ email: mockResponse.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailVerificationCode || emailVerificationCode.length !== 4) {
      setErrors({ email: "Please enter a valid 4-digit verification code" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO: Replace with actual verifyOTP call when API is ready
      // const response = await verifyOTP(form.email, emailVerificationCode, "email");
      
      // Mock successful response for testing (accept 1234 as valid code)
      const mockResponse = {
        success: emailVerificationCode === "1234",
        message: emailVerificationCode === "1234" ? "OTP verified successfully" : "Invalid verification code"
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockResponse.success) {
        setCurrentStep(RegistrationStep.USER_DETAILS);
        console.log(`✅ Mock OTP verification successful for: ${form.email}`);
      } else {
        setErrors({ email: mockResponse.message || 'Invalid verification code' });
      }
    } catch (error) {
      setErrors({ email: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare form data with correct date format for backend
      let submitForm = { ...form };
      if (form.dateOfBirth) {
        const dateObj = new Date(form.dateOfBirth);
        submitForm = { ...form, dateOfBirth: dateObj.toISOString() };
      }

      const response = await UserSignUp(submitForm);
      
      if (response && response.code === "0") {
        setCurrentStep(RegistrationStep.COMPLETED);
        setEmail(form.email);
        setTempData(form);
      } else {
        // Handle error response structure: code "1" with message in responseData
        let errorMessage = 'Registration failed';
        
        if (response?.responseData && typeof response.responseData === 'string') {
          errorMessage = response.responseData;
        } else if (response?.message) {
          errorMessage = response.message;
        }
        
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      // Check if it's a 504 Gateway Timeout error
      if (error instanceof Error && error.message.includes('504')) {
        setErrors({ general: 'An error occurred during registration. Please try again.' });
      } else if (error && typeof error === 'object' && 'status' in error && error.status === 504) {
        setErrors({ general: 'An error occurred during registration. Please try again.' });
      } else {
        setErrors({ general: 'An error occurred during registration. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
    });
    setConfirmPassword("");
    setEmailVerificationCode("");
    setTermsAccepted(false);
    setErrors({});
    setCurrentStep(RegistrationStep.EMAIL_INPUT);
  };
  // Helper function to render input with error
  const renderInputWithError = (
    name: keyof FormState,
    placeholder: string,
    type: string = "text",
    required: boolean = true,
    additionalProps?: any
  ) => (
    <div className="form-group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleInputChange}
        required={required}
        className={errors[name] ? "error" : ""}
        {...additionalProps}
      />
      {errors[name] && (
        <span className="error-message">
          <PiWarningCircleFill />
          <span>{errors[name]}</span>
        </span>
      )}
    </div>
  );

  // Render different steps
  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit}>
      <div className="registration-step">
        <div className="step-header">
          <span className="step-title">
            <b>Now let's make you a jUPETA member.</b>
          </span>
          <p className="step-description">
            Please enter your email address to create account
          </p>
        </div>
        
        <div className="form-ctrl">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email address"
            required
            value={form.email}
            onChange={handleInputChange}
            className={errors.email ? "error" : ""}
            style={
              !errors.email && form.email !== "" && validateEmail(form.email)
                ? { border: "1px solid green" }
                : errors.email
                ? { border: "1px solid red", boxShadow: "inset 0px 0px 5px red" }
                : undefined
            }
          />
          {errors.email && (
            <span className="error-message">
              <PiWarningCircleFill />
              <span>{errors.email}</span>
            </span>
          )}
        </div>
        
        <button type="submit" className="validEmail form__button" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Submit"}
        </button>
        
        <div className="socialAuth">
          <div>
            <button type="button" className="btns">
              <span><FcGoogle /></span>
            </button>
            <span>Google</span>
          </div>
          <div>
            <button type="button" className="btns">
              <span style={{ color: "#3B5998" }}><FaFacebookF /></span>
            </button>
            <span>Facebook</span>
          </div>
          <div>
            <button type="button" className="btns">
              <span><FaApple /></span>
            </button>
            <span>Apple</span>
          </div>
        </div>
      </div>
    </form>
  );

  const renderVerificationStep = () => (
    <form onSubmit={handleVerificationSubmit}>
      <div className="registration-step">
        <span>We've sent a verification code to</span>
        <p style={{ margin: "8px 0 8px 0" }}>
          <b>{form.email}</b>
          <span
            style={{
              textDecoration: "underline",
              marginLeft: "4px",
              fontWeight: "400",
              cursor: "pointer",
            }}
            onClick={() => setCurrentStep(RegistrationStep.EMAIL_INPUT)}
          >
            edit
          </span>
        </p>
        
        <div className="form-ctrl">
          <input
            type="text"
            minLength={4}
            maxLength={4}
            placeholder="Enter code"
            value={emailVerificationCode}
            onChange={(e) => setEmailVerificationCode(e.target.value)}
            required
            className={errors.email ? "error" : ""}
          />
          {errors.email && (
            <span className="error-message">
              <PiWarningCircleFill />
              <span>{errors.email}</span>
            </span>
          )}
        </div>
        
        <button type="submit" className="form__button" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Verify Code"}
        </button>
      </div>
    </form>
  );

  const renderUserDetailsStep = () => (
    <form onSubmit={handleRegistrationSubmit}>
      <div className="registration-step">
        <div className="step-header">
          <p style={{ textAlign: "center", margin: "0px 0 8px 0" }}>
            Email address verified
          </p>
          <p style={{ textAlign: "center", margin: "8px 0 16px 0" }}>
            <b>{form.email}</b>
            <span style={{ color: "green", fontSize: "24px", position: "absolute", marginLeft: "4px" }}>
              <BsCheck2Circle />
            </span>
          </p>
        </div>
        
        <div className="">
          <div className="">
            {renderInputWithError("firstName", "First Name")}
            {renderInputWithError("lastName", "Last Name")}
            
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                required
                className={errors.password ? "error" : ""}
                style={{ paddingRight: "50px" }}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
              </span>
              {errors.password && (
                <span className="error-message">
                  <PiWarningCircleFill />
                  <span>{errors.password}</span>
                </span>
              )}
              {form.password && <PasswordStrengthMeter password={form.password} />}
            </div>
            
            <div className="form-group password-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={errors.confirmPassword ? "error" : ""}
                style={{ paddingRight: "50px" }}
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
              </span>
              {errors.confirmPassword && (
                <span className="error-message">
                  <PiWarningCircleFill />
                  <span>{errors.confirmPassword}</span>
                </span>
              )}
            </div>
            
            {renderInputWithError("phoneNumber", "Phone Number", "tel")}
            {renderInputWithError("dateOfBirth", "Date of Birth", "date")}
          </div>
          
          <div className="checkboxitems" style={{ margin: "16px 0 16px 0" }}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span style={{ fontSize: "0.9rem", marginLeft: "4px" }}>
              I agree to jUPETA's Privacy Policy and Terms of Use
            </span>
            {errors.terms && (
              <div className="error-message">
                <PiWarningCircleFill />
                <span>{errors.terms}</span>
              </div>
            )}
          </div>
        </div>
        
        {errors.general && (
          <div className="error-message" style={{ marginBottom: "1rem", textAlign: "center" }}>
            <PiWarningCircleFill />
            <span>{errors.general}</span>
          </div>
        )}
        
        <button type="submit" className="form__button" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Create account"}
        </button>
      </div>
    </form>
  );

  const renderCompletedStep = () => (
    <div className="registration-step">
      <BsFillCheckCircleFill
        style={{ color: "green", fontSize: "3rem", marginBottom: "16px" }}
      />
      <h5 style={{ marginBottom: "8px" }}>You are all set!</h5>
      <p style={{ textAlign: "center", marginBottom: "8px" }}>
        Confirmation email has been sent to <b>{form.email}</b>
      </p>
      <span
        style={{
          textDecoration: "underline",
          fontWeight: "400",
          cursor: "pointer",
        }}
        onClick={() => window.location.reload()}
      >
        Sign-in
      </span>
    </div>
  );

  return (
    <div className="register-form">
      {currentStep === RegistrationStep.EMAIL_INPUT && renderEmailStep()}
      {currentStep === RegistrationStep.EMAIL_VERIFICATION && renderVerificationStep()}
      {currentStep === RegistrationStep.USER_DETAILS && renderUserDetailsStep()}
      {currentStep === RegistrationStep.COMPLETED && renderCompletedStep()}
    </div>
  );
};

export default RegisterForm;
