import React, { useState } from "react";
import "./SignUpPage.css"; // Ensure you have your CSS file imported
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGlobalState } from "../Utility/GlobalStateProvider";

const ForgotPassword = () => {

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
        }, 4500);
    };

    const handleGenerateOtp = async () => {
        if (!email) {
            showToast("Please enter your email first", "error");
            return;
        }
        showToast("sending OTP to your email!", "success");
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signUp/editPassword/${otp}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: password,
                    email: email,
            }),
        });
        
        const data = await response.text(); 
        // console.log("response = "+response.status+" data = "+data);
        if(response.status==200){
            setUsername(data);
            console.log("username = "+data);
            showToast("Account created successfully!", "success");
            //accound is created now so lets log in the user and then navigate them to homepage
            const r = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
                method: "POST",
                headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName: data,
                        password : password
                    }),
                });
                const d = await r.text();
                //save details to the cookies
                console.log("token in cokei from login = "+d);
                Cookies.set("token", d, { expires: 7});
                // Cookies.set("username", username, { expires: 7, secure: true, sameSite: "Strict" });
                // Cookies.set("password", password, { expires: 7, secure: true, sameSite: "Strict" });
                setNotification("Password Changed Successfully!");
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
                    <h2>No Worries, We've Got You!</h2>
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
                        {/* <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Pick a unique username"
                            className="input-style"
                        /> */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Pick a new password"
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
                            Login
                        </button>
                    </form>
                </div>
            </div>
            {toastMessage && <div className={`toast ${toastType} `}>{toastMessage}</div>}
        </div>
    );
};

export default ForgotPassword;