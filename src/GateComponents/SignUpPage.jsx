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

    const showToast = (message, type) => {
        console.log(message+" "+type);
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage("");
            setToastType("");
        }, 3000);
    };

    const handleGenerateOtp = async () => {
        if (!email) {
            showToast("Please enter your email first", "error");
            return;
        }
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
            const data = await response.text();
            if(data=="success")showToast("OTP sent to your email!", "success");
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
            const response = await fetch(`http://localhost:7000/signUp/saveUser/${otp}`, {
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
            const r = await fetch("http://localhost:7000/login",{
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
                Cookies.set("token", d, { expires: 7, secure: true, sameSite: "Strict" });
                // Cookies.set("username", username, { expires: 7, secure: true, sameSite: "Strict" });
                // Cookies.set("password", password, { expires: 7, secure: true, sameSite: "Strict" });
                setNotification("Account Created Successfully!");
                navigate("/homePage");
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
                                placeholder="Enter your email"
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
                        />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="input-style"
                        />
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