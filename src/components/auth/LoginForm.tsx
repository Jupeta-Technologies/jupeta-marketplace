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
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword,setInputPassword] = useState('');
  const router = useRouter();
  const { setUserEmail, refreshUser, setUser } = useAuth();
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await UserLogin(formData);
      if (response && (response.message === "Success" || response.code === "0") && response.responseData) {
        setEmail(formData.email);
        setUserEmail(formData.email);
        setUser(response.responseData); // Set user directly from login response
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
        setError(response?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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
              <div className="form-ctrl">
                <label htmlFor="email" style={formData.email !== ""?{color:'#000',transform:'translate(5px,-10px )',backgroundColor:'#FFF',lineHeight:'15px', padding:'0px 5px'}:undefined}>Email</label>
                <input type="email" id="email" name="email" placeholder="" required value={formData.email} onChange={handleChange} autoComplete='email'/>
              </div>
              <div className="form-ctrl">
                <label htmlFor="password" style={formData.passwordHash !== ""?{color:'#000',transform:'translate(5px,-10px )',backgroundColor:'#FFF',lineHeight:'15px', padding:'0px 5px'}:undefined}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="passwordHash"
                  placeholder=""
                  required autoComplete='current-password' value={formData.passwordHash} onChange={handleChange} />
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
                <button type="submit" className="signin-btn">Sign in</button>
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
