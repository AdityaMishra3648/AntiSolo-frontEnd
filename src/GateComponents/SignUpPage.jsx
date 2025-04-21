import React, { useState } from "react";
import "./SignUpPage.css"; // Ensure you have your CSS file imported
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGlobalState } from "../Utility/GlobalStateProvider";

const SignUpPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const [notification, setNotification] = useGlobalState();
    const [warning, setWarning] = useState('');

    const validateUsername = (name) => {
        // Clear warning if valid
        if (!name) {
          setWarning('');
          return;
        }
      
        if (name.length < 3 || name.length > 25) {
          setWarning('Username must be between 3 and 25 characters.');
        } else if (!/^[a-zA-Z]/.test(name)) {
          setWarning('Username must start with a letter.');
        } else if (!/^[a-zA-Z0-9._]+$/.test(name)) {
          setWarning('Username can only contain letters, digits, dot (.) or underscore (_).');
        } else if (/\s/.test(name)) {
          setWarning('Username cannot contain spaces.');
        } else {
          setWarning('');
        }
      };

    const showToast = (message, type) => {
        console.log(message+" "+type);
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage("");
            setToastType("");
        }, 5000);
    };

    const handleGenerateOtp = async () => {
        if (!email) {
            showToast("Please enter your email first", "error");
            return;
        }
        showToast("Chech Spam Folder, sending OTP to your email!", "success");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signUp/sendOTP`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: email,
              }),
            });
            const data = await response.text();
            if(data=="success")showToast("OTP sent to your email! Don't forget to check the spam folder too", "success");
            else showToast("Some error occured! Check your mail and Try again", "error");
            console.log("OTP sent successfully")
        } catch (error) {
            showToast("Some error occured! Check your mail and Try again", "error");
            console.error("Error:", error);
          }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToast("Passwords do not match!", "error");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signUp/saveUser/${otp}`, {
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
        if(data=="saved Successfully"){
            showToast("Account created successfully!", "success");
            //accound is created now so lets log in the user and then navigate them to homepage
            const r = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
                method: "POST",
                headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName: username,
                        password : password
                    }),
                });
                const d = await r.text();
                //save details to the cookies
                Cookies.set("token", d, { expires: 7});
                // Cookies.set("username", username, { expires: 7, secure: true, sameSite: "Strict" });
                // Cookies.set("password", password, { expires: 7, secure: true, sameSite: "Strict" });
                setNotification("Account Created Successfully!");
                navigate("/home");
            }
            else 
                showToast(data, "error");
        } catch (error) {
              showToast("some error Occured! Try again", "error");
            console.error("Error:", error);
          }
    };

    return (
        <div className="container">
            <h1 className="title">AntiSolo</h1>
            <div className="form-card">
                <div className="pattern-bg"></div>
                <div className="form-container">
                    <h2>Welcome Aboard, Friend!</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="email-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email goes here"
                                className="input-style"
                            />
                            <button
                                type="button"
                                className="btn-otp"
                                onClick={handleGenerateOtp}
                            >
                                Generate OTP
                            </button>
                        </div>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="input-style"
                            style={{ marginBottom: "0" }}
                            />
                              <div style={{ marginTop: "0",marginBottom: "1rem" ,fontWeight: 600 , color: 'red', fontSize: '0.9rem' }}>
                                *Check Spam Folder if you don't see the OTP in your inbox
                              </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                validateUsername(e.target.value);
                            }}
                            placeholder="Pick a unique username"
                            className="input-style"
                        />
                        {warning && (
                          <div style={{ marginTop: "0",marginBottom: "1rem", color: 'red', fontSize: '0.9rem' }}>
                            * {warning}
                          </div>
                        )}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="input-style"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            className="input-style"
                        />
                        <button type="submit" className="btn-primary">
                            Sign Up
                        </button>
                    </form>
                    <p className="login-text">
                        Already have an account? <a                 href="#"
                                                                  className="login-link"
                                                                  onClick={(e) => {
                                                                      e.preventDefault();
                                                                    navigate("/login");
                                                                }}>Login here</a>
                    </p>
                </div>
            </div>
            {toastMessage && <div className={`toast ${toastType} `}>{toastMessage}</div>}
        </div>
    );
};

export default SignUpPage;