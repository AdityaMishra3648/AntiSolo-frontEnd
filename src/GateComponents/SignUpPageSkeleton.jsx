import { useState } from 'react';
import React from 'react';


function SignUpPageSkeleton() {

    
const [email,setEmail] = useState('');
const [otp,setOtp] = useState('');
const [username,setUsername] = useState('');
const [password,setPassword] = useState('');


const signUp = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/saveUser/${otp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: username,
        password: password,
        email: email,
      }),
    });

    const data = await response.text(); 
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

const sendOTP = async () =>{
  try {
    const response = await fetch("http://localhost:7000/signUp/sendOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: email,
      }),
    });
    console.log("OTP sent successfully")
  } catch (error) {
    console.error("Error:", error);
  }
}

  return (
    <div>
      <input type="text" placeholder='Enter email' id='email' value={email} onChange={e=>setEmail(e.target.value)} />
      <br />
      <br />
      <input type="text" placeholder='enter OTP' id='email' value={otp} onChange={e=>setOtp(e.target.value)} />
      <br />
      <br />
      <input type="text" placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)} />
      <br />
      <br />
      <input type="password" placeholder='password' value={password} onChange={e=>setPassword(e.target.value)}/>

      <br />
      <br />
      <button onClick={sendOTP}>GenerateOtp</button>
      <br />
      <button onClick={signUp}>Submit</button>
    </div>
  );
}

export default SignUpPageSkeleton;