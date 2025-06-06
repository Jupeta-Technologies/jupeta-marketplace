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
  birthDate: Date | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  setShowOTP,
  setEmail,
  setTempData,
}) => {
  const [form, setForm] = useState<FormState>({
    firstName:"",
    lastName:"",
    birthDate:new Date(), //initialize with current date of specific default.
    phoneNumber:"",
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

  const validateEmail = (email: string): boolean => {
    if (!email) {
      return false; // Or you could handle this differently, like returning false
    }
    return !!email.match(
      /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|info|edu)\b)$/
    );
  };

  useEffect(() => {
    // This effect will run whenever the 'form.email' state changes
    if (form.email) {
      setnewemailValid(validateEmail(form.email));
      console.log('Current email:', form.email, 'Valid:', emailValid);
    } else {
      setnewemailValid(false); // Reset validity if email is empty
    }
  }, [form.email]); // Only run this effect when 'form.email' changes

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if(newemailValid){
      setemailValid(newemailValid);

    try {
      await sendOTP(form.email);
      setEmail(form.email);
      setTempData({ password: form.password });
      setShowOTP(true);
    } catch (err) {
      setError("Failed to send OTP. Try again later.");
    }
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
        // Logic to submit the final registration data
        console.log('Handling final registration submission', form);
        setRegCompleted(true);
      };
  

  return (
    <>
              {/* {!regCompleted&&<h5>Create account</h5>} */}
            
            <form onSubmit={!emailVerified?handleEmailSubmit:handleRegistrationSubmit}>
                {
                  !emailValid?
                  (
                      <div>
                          <span style={{fontSize:'0.9rem'}}><b>Now let’s make you a jUPETA member.</b></span>
                          <p style={{textAlign:'left',fontSize:'0.9rem'}}>Please enter your email address to create account</p>
                          <div className="form-ctrl">
                          <input type="email" name="email" id="email" placeholder="Enter email address" required value={form.email} onChange={handleChange} style={newemailValid && form.email !== ''? {border:"1px solid green"}:(!newemailValid && form.email !==''?{border:"1px solid red",boxShadow:'inset 0px 0px 5px red'}:undefined)}/>
                          {!newemailValid && form.email !==""?<span style={{display:'inline-flex', flexDirection:'row', alignItems:'center',color:'red'}}><PiWarningCircleFill /> <span style={{fontSize:'0.8rem',marginLeft:'5px'}}>Email is invalid</span></span>:""}
                          </div>
                          <button  style={{display:'inline-flex', flexDirection:'row',gap:'4px', alignItems:'center', background:'#000', color:'#FFF', padding:'8px 16px', borderRadius:'32px', marginBottom:'24px', border:'none'}}  className='validEmail'>submit <span><SlArrowRight  type="submit"/></span></button>
                          <div className="socialAuth">
                          <div><button type="submit" className="btns"><span><FcGoogle /></span></button><span>Google</span></div>
                          <div><button type="submit" className="btns"><span style={{color:'#3B5998'}}><FaFacebookF /></span></button><span>Facebook</span></div>
                          <div><button type="submit" className="btns"><span><FaApple /></span></button><span>Apple</span></div>
                          </div>
                      </div>
                ):
                
                !emailVerified ? (
                  <>
                    <span>We've sent a verification code to</span>
                    <p>
                      <b>{form.email}</b>
                      <span
                        style={{
                          textDecoration: 'underline',
                          marginLeft: '5px',
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
                    <button type="submit">Verify Code</button> {/* Submit button for OTP verification */}
                  </>
                ) : emailVerified && !regCompleted ? (
                  <>
                    <span>Email address verified</span>
                    <p>
                      <b>{form.email}</b> <span style={{ color: 'green', fontSize: '30px', position: 'absolute' }}>
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
                        {form.password !== "" && psdChcked !== "" ? <span style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', color: 'red' }}>
                          <PiWarningCircleFill /> <span style={{ fontSize: '0.7rem' }}>{psdChcked}</span>
                        </span> : ""}
              
                        <input type={!showConfPass ? 'password' : 'text'} name="confirmPassword" placeholder="Confirm password" onChange={(e)=>setconfirmPassword(e.target.value)} value={confirmPassword} required style={{ paddingRight: '50px' }} />
                        <span style={{ position: 'absolute', right: '40px', cursor: 'pointer', marginTop: '12px', fontSize: '18px' }}>
                          {!showConfPass ? <BsFillEyeSlashFill onClick={handlesUPConfPvis} /> : <BsFillEyeFill onClick={handlesUPConfPvis} />}
                        </span>
                        {!confirmPasswd(confirmPassword) && confirmPassword !== "" ? <p style={{ color: 'red', fontSize: '0.7rem', padding: '5px 10px 10px', lineHeight: '2px' }}>Password does not match</p> : ""}
              
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={form.phoneNumber} required />
              
                        <input type="date" name="birthDate" placeholder="Date of Birth" onChange={handleChange} value={form.birthDate ? form.birthDate.toISOString().split('T')[0] : ''} required />
                      </div>
                      {/* <div>
                        <p style={{ fontSize: '0.9rem' }}>Get a jUPETA Member Reward on your birthday</p>
                      </div> */}
                      <div className="checkboxitems">
                        <input type="checkbox" required />
                        <p style={{ fontSize: '0.9rem' }}>I agree to jUPETA's Privacy Policy and Terms of Use</p>
                      </div>
              
                    </div>
                    <button type="submit" className="signupbtn" >Create account</button>
                  </>
                ) : regCompleted ? (
                  <>
                    <BsFillCheckCircleFill style={{ color: 'green', fontSize: '3rem' }} />
                    <h5>You are all set!</h5>
                    <p style={{ textAlign: 'center' }}>Confirmation email has been sent to <b>{form.email}</b></p>
                    <span style={{ textDecoration: 'underline', fontWeight: '400', cursor: 'pointer' }} onClick={() => { window.location.reload(); }}>Sign-in</span>
                  </>
                ) : null

              } 
              </form>
                  
              
            </>
  );
};

export default RegisterForm;
