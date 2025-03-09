import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";

function InitailScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkToken() {
          const token = Cookies.get("token");
          console.log("token = "+token);
          if (token) {
            console.log("checking token");

            try {
              const response = await fetch(`http://localhost:7000/login/checkToken/${token}`, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
            
              if (!response.ok) {
                  throw new Error("Error checking token");
              }
            
              const isValid = await response.json(); // Expecting boolean response
              console.log("Token is valid:", isValid);
              if(isValid){
                navigate("/homepage");
              }
             } catch (error) {
              console.error("Error:", error);
            }
          }

    }
    checkToken();
  }, []);
  return (
    <div>
        <h1>Hello lazy world Create an account for practice</h1>
        
        <br />
        <br />
        <button onClick={()=>navigate("/signup")}>SignUp karo yaha kya karoge</button>
        <br />
        <br />
        <button onClick={()=>navigate("/login")}>login</button>
      
    </div>
  );
}

export default InitailScreen;