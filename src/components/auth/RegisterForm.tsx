"use client";

import React, { useEffect, useState } from "react";
import { sendOTP } from "@/lib/api/auth/sendOTP"; 
import { verifyOTP } from "@/lib/api/auth/verifyOTP";
import PasswordStrengthMeter from "./PasswordStrength";
import { PiWarningCircleFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { BsCheck2Circle, BsFillCheckCircleFill, BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { SlArrowRight } from "react-icons/sl";
import { User } from "lucide-react";
import { UserSignUp } from "@/lib/api/UserAuthenticationAPI";

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

const RegisterForm: React.FC<RegisterFormProps> = ({
  setShowOTP,
  setEmail,
  setTempData,
}) => {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "", // store as string for input compatibility
    phoneNumber: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [emailVerified,setemailVerified] = useState<boolean>(false);
  const [emailValid,setemailValid] = useState<boolean>(false);
  const [emailVericode,setemailVericode] = useState("");
  const [newemailValid,setnewemailValid] = useState<boolean>(false);
  const [regCompleted, setRegCompleted] = useState<boolean>(false);
  const [psdChcked,setpsdChcked] = useState("");
  const [showsUPPass, setsUPShowP] = useState(false);
  const [showConfPass, setsUPShowCP] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Add a state to track if OTP has been sent
  const [confirmPassword, setconfirmPassword] = useState<string>("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const confirmPasswd = (confirmPasswd: string) =>{
    return confirmPasswd.match(form.password);
  }

  const handleShowpassword = () =>{
    setsUPShowP(!showsUPPass);
  }
  const handlesUPConfPvis = () =>{
    setsUPShowCP(!showConfPass);
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return isValid;
  };

  useEffect(() => {
    // This effect will run whenever the 'form.email' state changes
    if (form.email) {
      setnewemailValid(validateEmail(form.email));
    } else {
      setnewemailValid(false); // Reset validity if email is empty
    }
  }, [form.email]); // Only run this effect when 'form.email' changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    /* if (!validateForm()) {
      return;
    } */
    setemailValid(newemailValid);
    setError('');

    try {
      const response = await sendOTP(form.email);
      
      if (response.code === "0") {
        setEmail(form.email);
        setTempData(form);
        setShowOTP(true);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleEVeriCode = (e: { preventDefault: () => void; target: { value: any; }; }) =>{
        const veriCode = e.target.value;
        setemailVericode(veriCode);
        veriCode.length == 4?
        setTimeout(()=>{setemailVerified(true)},5000) :setemailVerified(false);
      };

      const handleRegistrationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Prepare form data with correct date format for backend
        let submitForm = { ...form };
        if (form.dateOfBirth) {
          // Convert yyyy-MM-dd to ISO string with time at 00:00:00Z
          const dateObj = new Date(form.dateOfBirth);
          submitForm = { ...form, dateOfBirth: dateObj.toISOString() };
        }
        try {
          const response = await UserSignUp(submitForm);
          if (response && response.code === "0") {
            setRegCompleted(true);
            setEmail(form.email); // Set email for further use
            setTempData(form); // Store the form data in context or state
          } else {
            setError(response.message || 'Registration failed');
          }
        } catch (error) {
          setError('An error occurred during registration. Please try again.');
        }
        // Optionally, you can redirect the user or show a success message
        setShowOTP(false); // Hide OTP form after successful registration
        //setemailVerified(false); // Reset email verification state
        //setemailValid(false); // Reset email validity state
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
          dateOfBirth: "",
        }); // Reset form state
        setOtpSent(false); // Reset OTP sent state
        setconfirmPassword(""); // Reset confirm password state
        setsUPShowP(false); // Reset password visibility state
        setsUPShowCP(false); // Reset confirm password visibility state
        setpsdChcked(""); // Reset password check state
      };
  

  return (
    <>
              {/* {!regCompleted&&<h5>Create account</h5>} */}
            
            <form onSubmit={!emailVerified?handleSubmit:handleRegistrationSubmit}>
                <div style={{display:'flex', flexDirection:'column',width:'100%', alignItems:'center'}}>
                {
                  !emailValid?
                  (
                          <>
                          <span style={{fontSize:'0.9rem'}}><b>Now let's make you a jUPETA member.</b></span>
                          <p style={{textAlign:'left',fontSize:'0.9rem',marginBottom:'8px'}}>Please enter your email address to create account</p>
                          <div className="form-ctrl">
                          <input type="email" name="email" id="email" placeholder="Enter email address" required value={form.email} onChange={handleChange} style={newemailValid && form.email !== ''? {border:"1px solid green"}:(!newemailValid && form.email !==''?{border:"1px solid red",boxShadow:'inset 0px 0px 5px red'}:undefined)}/>
                          {!newemailValid && form.email !==""?<span style={{display:'inline-flex', flexDirection:'row', alignItems:'center',color:'red'}}><PiWarningCircleFill /> <span style={{fontSize:'0.8rem',marginLeft:'4px'}}>Email is invalid</span></span>:""}
                          </div>
                          <button className='validEmail form__button'>submit</button>
                          <div className="socialAuth">
                          <div><button type="submit" className="btns"><span><FcGoogle /></span></button><span>Google</span></div>
                          <div><button type="submit" className="btns"><span style={{color:'#3B5998'}}><FaFacebookF /></span></button><span>Facebook</span></div>
                          <div><button type="submit" className="btns"><span><FaApple /></span></button><span>Apple</span></div>
                          </div>
                      </>
                ):
                
                !emailVerified ? (
                  <>
                    <span>We've sent a verification code to</span>
                    <p style={{margin:'8px 0 8px 0'}}>
                      <b>{form.email}</b>
                      <span
                        style={{
                          textDecoration: 'underline',
                          marginLeft: '4px',
                          fontWeight: '400',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setemailValid(false);
                          setemailVerified(false); // Go back to the email input
                          setOtpSent(false); //reset otp sent
                        }}
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
                        value={emailVericode}
                        onChange={handleEVeriCode}
                        required
                      />
                    </div>
                    <button className="form__button" type="submit">Verify Code</button> {/* Submit button for OTP verification */}
                  </>
                ) : emailVerified && !regCompleted ? (
                  <>
                    <p style={{textAlign:'center', margin:'0px 0 8px 0'}}>Email address verified</p>
                    <p style={{textAlign:'center', margin:'8px 0 8px 0'}}>
                      <b>{form.email}</b> <span style={{ color: 'green', fontSize: '24px', position: 'absolute', marginLeft:'4px' }}>
                        <BsCheck2Circle />
                      </span>
                
                    </p>
                    <div className="formcontainer">
                      <div className="form-ctrl">
                        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} required />
              
                        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} required />
              
                        <input type={!showsUPPass ? 'password' : 'text'} name="password" placeholder="Password" onChange={handleChange} value={form.password} required style={{ paddingRight: '50px' }} />
                        <span style={{ position: 'absolute', right: '40px', cursor: 'pointer', marginTop: '12px', fontSize: '18px' }}>
                         {!showsUPPass? <BsFillEyeSlashFill onClick={handleShowpassword} /> : <BsFillEyeFill onClick={handleShowpassword} />}
                        </span>
                        {form.password !== "" && <PasswordStrengthMeter password={form.password} />}
                        {form.password !== "" && psdChcked !== "" ? <span style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', color: 'red' }}>
                          <PiWarningCircleFill /> <span style={{ fontSize: '0.7rem' }}>{psdChcked}</span>
                        </span> : ""}
              
                        <input type={!showConfPass ? 'password' : 'text'} name="confirmPassword" placeholder="Confirm password" onChange={(e)=>setconfirmPassword(e.target.value)} value={confirmPassword} required style={{ paddingRight: '50px' }} />
                        <span style={{ position: 'absolute', right: '40px', cursor: 'pointer', marginTop: '12px', fontSize: '18px' }}>
                          {!showConfPass ? <BsFillEyeSlashFill onClick={handlesUPConfPvis} /> : <BsFillEyeFill onClick={handlesUPConfPvis} />}
                        </span>
                        {!confirmPasswd(confirmPassword) && confirmPassword !== "" ? <p style={{ color: 'red', fontSize: '0.7rem', padding: '5px 10px 10px', lineHeight: '2px' }}>Password does not match</p> : ""}
              
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={form.phoneNumber} required />
              
                        <input
                          type="date"
                          name="dateOfBirth"
                          placeholder="Date of Birth"
                          onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                          value={form.dateOfBirth}
                          required
                        />
                      </div>
                      <div className="checkboxitems" style={{margin:'16px 0 16px 0'}}>
                        <input type="checkbox" required />
                        <span style={{ fontSize: '0.9rem', marginLeft: '4px'}}>I agree to jUPETA's Privacy Policy and Terms of Use</span>
                      </div>
              
                    </div>
                    <button type="submit" className="form__button" >Create account</button>
                  </>
                ) : regCompleted ? (
                  <>
                    <BsFillCheckCircleFill style={{ color: 'green', fontSize: '3rem' , marginBottom:'16px'}} />
                    <h5 style={{marginBottom:'8px'}}>You are all set!</h5>
                    <p style={{ textAlign: 'center',marginBottom:'8px' }}>Confirmation email has been sent to <b>{form.email}</b></p>
                    <span style={{ textDecoration: 'underline', fontWeight: '400', cursor: 'pointer' }} onClick={() => { window.location.reload(); }}>Sign-in</span>
                  </>
                ) : null

              }
              </div>
              </form>
                  
              
            </>
  );
};

export default RegisterForm;
