// components/auth/AuthForm.tsx
"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import OtpVerification from "./OtpVerification";
import { AiOutlineClose } from "react-icons/ai";

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [tempData, setTempData] = useState({});
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
    const handleLoginToggle = () => {
     if(isRegistering){
      setIsRegistering(!isRegistering);
      setIsLogin(!isLogin);
      setIsSignUp(!isSignUp);}
    };
  
    const handleSignUpToggle = () => {
      if(!isRegistering){
        setIsRegistering(!isRegistering);
        setIsSignUp(!isSignUp);
        setIsLogin(!isLogin);}
    };

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
    setShowOTP(false);
  };

  return (
    <div className="login-body" style={{backgroundImage:'url(https://images.unsplash.com/photo-1637004732258-4b792ce8f474?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMxfHxibGFjayUyMHRleHR1cmVkfGVufDB8fDB8fHww)'}}>
                    <AiOutlineClose style={{padding:'4px', borderRadius:'50%', background:'#FFF',color:'#000',position:'absolute', right:'16px', top:'16px', fontSize:'2rem', cursor:'pointer'}} onClick={()=>window.history.back()}/>
      <div className="container-login" >
                    <div className="head-label">
                      <span onClick={handleLoginToggle} className={isLogin ? 'sIN-active' : 'LS-sIN'} >Sign in</span>
                      <span onClick={handleSignUpToggle} className={isSignUp ? 'sUP-active':'LS-sUP' } >Register</span>
                    </div>
            <h2 className="text-2xl font-semibold text-center mb-6">
              {showOTP
                ? "Verify OTP"
                : isRegistering
                ? "Create an account"
                : "Sign in to your account"}
            </h2>
        {!showOTP ? (
          isRegistering ? (
            <RegisterForm
              setShowOTP={setShowOTP}
              setEmail={setEmail}
              setTempData={setTempData}
            />
          ) : (
            <LoginForm
              setIsRegistering={setIsRegistering}
              setShowOTP={setShowOTP}
              setEmail={setEmail}
            />
          )
        ) : (
          <OtpVerification
            email={email}
            tempData={tempData}
            setIsRegistering={setIsRegistering}
            setShowOTP={setShowOTP}
          />
        )}
      </div>
    </div>
  );
};

export default AuthForm;
