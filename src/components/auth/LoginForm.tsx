// components/auth/LoginForm.tsx
"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { UserLogin, GoogleLogin } from "@/lib/api/UserAuthenticationAPI";
import { useAuth } from "@/context/AuthContext";


interface LoginFormProps {
  setIsRegistering: (value: boolean) => void;
  setShowOTP: (value: boolean) => void;
  setEmail: (value: string) => void;
}


const LoginForm: React.FC<LoginFormProps> = ({
  setIsRegistering,
  setShowOTP,
  setEmail,
}) => {
  const [formData, setFormData] = useState({ email: "", passwordHash: "" });
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'credential' | 'network' | 'server' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const router = useRouter();
  const { setUserEmail, refreshUser, setUser } = useAuth();

  // Clear error when user starts typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
      setErrorType(null);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function to determine error type and message
  const handleError = (err: any, response?: any) => {
    console.error('Login error:', err, response);
    
    // Check for credential errors - Updated to match your API response format
    if (response?.code === '1' || 
        response?.responseData?.toLowerCase().includes('email or password is incorrect') ||
        response?.responseData?.toLowerCase().includes('invalid') || 
        response?.responseData?.toLowerCase().includes('incorrect') ||
        response?.responseData?.toLowerCase().includes('wrong') ||
        response?.responseData?.toLowerCase().includes('not found') ||
        response?.message?.toLowerCase().includes('invalid') || 
        response?.message?.toLowerCase().includes('incorrect') ||
        response?.message?.toLowerCase().includes('wrong') ||
        response?.message?.toLowerCase().includes('not found') ||
        response?.code === '401' ||
        response?.code === '404') {
      setErrorType('credential');
      setError(response?.responseData || response?.message || 'Invalid email or password. Please check your credentials and try again.');
      return;
    }

    // Check for network errors
    if (err?.name === 'TypeError' || 
        err?.message?.toLowerCase().includes('network') ||
        err?.message?.toLowerCase().includes('fetch') ||
        err?.message?.toLowerCase().includes('connection') ||
        !navigator.onLine) {
      setErrorType('network');
      setError('Network error. Please check your internet connection and try again.');
      return;
    }

    // Check for server errors
    if (response?.code === '500' || 
        response?.code === '503' ||
        err?.message?.toLowerCase().includes('server') ||
        response?.message?.toLowerCase().includes('server') ||
        response?.responseData?.toLowerCase().includes('server')) {
      setErrorType('server');
      setError('Server error. Something went wrong on our end. Please try again later.');
      return;
    }

    // Default error - prioritize responseData over message
    setErrorType('server');
    setError(response?.responseData || response?.message || 'Something went wrong. Please try again.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.passwordHash) {
      setError('Please fill in all fields.');
      setErrorType('credential');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setErrorType('credential');
      setIsLoading(false);
      return;
    }

    try {
      const response = await UserLogin(formData);
      
      if (response && (response.message === "Success" || response.code === "0") && response.responseData) {
        setEmail(formData.email);
        setUserEmail(formData.email);
        setUser(response.responseData);
        
        // Ensure AuthContext is up-to-date before redirecting
        if (refreshUser) {
          await refreshUser(formData.email);
        }
        
        // Redirect to the page where login was triggered from
        const referrer = document.referrer;
        if (referrer && referrer.includes(window.location.origin)) {
          const path = referrer.replace(window.location.origin, "");
          // Prevent redirecting back to /Login or empty path
          if (!path || path === "/Login" || path === "/login") {
            router.push("/");
          } else {
            console.log("Redirecting to:", path);
            router.push(path);
          }
        } else {
          router.push("/");
        }
      } else {
        handleError(null, response);
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = "https://jupeta-project.onrender.com/api/User/ExternalLogin/Google";
  };

  const handleFacebookLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Implement Facebook login logic here
    window.location.href = "https://jupeta-project.onrender.com/api/User/ExternalLogin/Facebook";
  };

  return (
  <>          
              <form id="loginForm" action="#" onSubmit={handleLogin}>
              
              {/* Error Display */}
              {error && (
                <div className={`error-message ${errorType}`}>
                  <div className="error-content">
                    <span className="error-icon">
                      {errorType === 'credential' && '⚠️'}
                      {errorType === 'network' && '📡'}
                      {errorType === 'server' && '🔧'}
                    </span>
                    <span className="error-text">{error}</span>
                  </div>
                  {errorType === 'credential' && (
                    <div className="error-actions">
                      <button 
                        type="button" 
                        onClick={() => setError(null)}
                        className="error-dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {errorType === 'network' && (
                    <div className="error-actions">
                      <button 
                        type="button" 
                        onClick={() => window.location.reload()}
                        className="error-retry"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="form-ctrl">
                <label htmlFor="email" style={formData.email !== ""?{color:'#000',transform:'translate(5px,-10px )',backgroundColor:'#FFF',lineHeight:'15px', padding:'0px 5px'}:undefined}>Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  autoComplete='email'
                  disabled={isLoading}
                  className={error && errorType === 'credential' ? 'error-input' : ''}
                />
              </div>
              
              <div className="form-ctrl">
                <label htmlFor="password" style={formData.passwordHash !== ""?{color:'#000',transform:'translate(5px,-10px )',backgroundColor:'#FFF',lineHeight:'15px', padding:'0px 5px'}:undefined}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="passwordHash"
                  placeholder=""
                  required 
                  autoComplete='current-password' 
                  value={formData.passwordHash} 
                  onChange={handleChange}
                  disabled={isLoading}
                  className={error && errorType === 'credential' ? 'error-input' : ''}
                />
              </div>
              
    
              <div className="forget-stay">
                <div className="stay">
                  <input type="checkbox" name="" id="stay" />
                  <label htmlFor="stay">Stay signed in</label>
                </div>
                <div>
                  <a href="#">Forget your password?</a>
                </div>
              </div>
              <div className='signin-trob'>
                <button 
                  type="submit" 
                  className={`signin-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
                <a className="trob" href="#">Trouble signing in?</a>
              </div>
    
              <div className="hr">
                <p>OR</p>
              </div><br/>
              <div className="socialAuth">
              <div><button className="btns" onClick={handleGoogleLogin}><span><FcGoogle /></span></button><span>Google</span></div>
              <div><button className="btns" onClick={handleFacebookLogin}><span style={{color:'#3B5998'}}><FaFacebookF /></span></button><span>Facebook</span></div>
              <div><button className="btns"><span><FaApple /></span></button><span>Apple</span></div>
              </div>
              <p className="terms">
                By clicking the submit button, I hereby agree to and accept the
                following <a href="#">terms and conditions</a> governing my use of the
                Jupeta™ website. I further reaffirm my acceptance of the general <a href="#">Privacy Policy</a> governing my use of any Jupeta™ website.
              </p>
              </form>
  </>

      
  );
};

export default LoginForm;
