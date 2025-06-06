// components/auth/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword,setInputPassword] = useState('');
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setEmail(formData.email);
      setShowOTP(true);
      // Implement actual login and OTP verification logic here
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google login logic
    console.log("Google login clicked");
  };

  return (
  <>
    {/**<form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>

      <div className="text-center text-sm text-gray-500">or</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full border py-2 rounded hover:bg-gray-100"
      >
        <FcGoogle className="mr-2" /> Continue with Google
      </button>
    </form> **/}

              
              <form id="loginForm" action="#" onSubmit={handleLogin}>
              <div className="form-ctrl">
                <label htmlFor="email" style={formData.email !== ""?{color:'#000',transform:'translate(5px,-10px )',backgroundColor:'#FFF',lineHeight:'15px', padding:'0px 5px'}:undefined}>Email</label>
                <input type="email" id="email" name="email" placeholder="" required value={formData.email} onChange={handleChange} autoComplete='email'/>
              </div>
              <div className="form-ctrl">
                <label htmlFor="password" style={formData.password !== ""?{color:'#000',transform:'translate(5px,-10px )',backgroundColor:'#FFF',lineHeight:'15px', padding:'0px 5px'}:undefined}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder=""
                  required autoComplete='current-password' value={formData.password} onChange={handleChange} />
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
              <div><button type="submit" className="btns"><span><FcGoogle /></span></button><span>Google</span></div>
              <div><button type="submit" className="btns"><span style={{color:'#3B5998'}}><FaFacebookF /></span></button><span>Facebook</span></div>
              <div><button type="submit" className="btns"><span><FaApple /></span></button><span>Apple</span></div>
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
