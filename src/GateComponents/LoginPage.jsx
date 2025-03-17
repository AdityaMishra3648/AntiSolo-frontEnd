import { useEffect, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGlobalState } from "../Utility/GlobalStateProvider";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const [notification, setNotification] = useGlobalState();

    // useEffect(() => {
    //     if (notification) {
    //         setToastMessage(notification,"success");
    //         setTimeout(() => {
    //             setNotification("");
    //         }, 3000);
    //     }
    // },[])

    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage("");
            setToastType("");
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            showToast("Please fill in all fields", "error");
            return;
        }
        try{
            const response = await fetch("http://localhost:7000/login",{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: username,
                    password : password
                }),
            });
            const data = await response.text();
            if(data!="Credentials Invalid !!" && response.ok){
                showToast("Successfully logged in!", "success"); 
                Cookies.set("token", data, { expires: 7, secure: true, sameSite: "Strict" });
                // Cookies.set("username", username, { expires: 7, secure: true, sameSite: "Strict" });
                // Cookies.set("password", password, { expires: 7, secure: true, sameSite: "Strict" });
                console.log("token in cokei from login = "+Cookies.get("token"));
                setNotification("Successfully logged in!");
                navigate("/homepage");
            }
            else showToast(data, "error");
        }catch(error){
            showToast("Some error occured! Try again", "error");
        }
    }

    return (
        <div className="login_container">
            <h1 className="login_title">AntiSolo</h1>
            <div className="login_form-card">
                <div className="login_pattern-bg"></div>
                <div className="login_form-container">
                    <h2>Welcome Back!</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="login_input-style"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="login_input-style"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="login_btn-primary" onClick={handleSubmit}>Login</button>
                        <button type="button" className="login_btn-forgot">Forgot Password?</button>
                    </form>
                    <p className="login_signup-text">
                        Don't have an account?
                        <a href="#" onClick={(e) => {e.preventDefault(); navigate("/signup");}} className="login_signup-link">Sign up here</a>
                    </p>
                </div>
            </div>
            {toastMessage && <div className={`login_toast ${toastType}`}>{toastMessage}</div>}
        </div>
    );
};

export default LoginPage;
