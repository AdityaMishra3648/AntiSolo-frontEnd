import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";
import "./initialpage.css";
// import "../Components/HomePageCompleted.css";

const EntryPage = () => {
    const navigate = useNavigate();


    useEffect(() => {
        setTimeout(() => {
          document.querySelector(".title").classList.add("loaded");
          document.querySelector(".buttons-container").classList.add("loaded");
          document.querySelector(".cat-story-container").classList.add("loaded");
        }, 100);
        async function checkToken() {
                  const token = Cookies.get("token");
                  console.log("token = "+token);
                  if (token) {
                    console.log("checking token");
        
                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_URL}/login/checkToken/${token}`, {
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
                        navigate("/home");
                      }
                     } catch (error) {
                      console.error("Error:", error);
                    }
                  }
        
            }
            checkToken();
        }, []);

  return (
    <div className="page-container">
      <div className="background">
        <img
          src="https://i.pinimg.com/originals/8b/35/fe/8b35fef55fba1a201c9c7a11d3ec3d64.gif"
          // src="https://res.cloudinary.com/dx7bcuxjn/image/upload/v1745087736/8b35fef55fba1a201c9c7a11d3ec3d64_ao7or2.gif"
          alt="Coding animation"
        />
      </div>
      <div className="backdrop"></div>
      
      <div className="content">
        <div className="title">
          <h1>AntiSolo</h1>
        </div>
        
        <div className="buttons-container">
          <button className="btn login-btn" onClick={()=>navigate("/login")}>
            <span className="icon user-round"></span>
            Login
          </button>
          
          <button className="btn signup-btn" onClick={()=>navigate("/signup")}>
            <span className="icon user-plus"></span>
            Sign Up
          </button>
          
          <button className="btn guest-btn" onClick={()=>navigate("/home")}>
            <span className="icon user-cog"></span>
            Guest
          </button>
        </div>
        
        <div className="cat-story-container">
          <div className="cat-story-item cat-story-item-1">
            <div className="cat-container">
              <div className="cat cat-coding">
                <div className="cat-head">
                  <div className="cat-ears"></div>
                  <div className="cat-face">
                    <div className="cat-eyes cat-angry"></div>
                    <div className="cat-mouth cat-sad"></div>
                  </div>
                </div>
                <div className="cat-body">
                  <div className="cat-laptop"></div>
                  <div className="cat-arms cat-typing"></div>
                </div>
              </div>
            </div>
            <p className="cat-quote">Developing and<br />Stressed Alone?</p>
          </div>
          
          <div className="arrow-container arrow-1-to-2">
            <div className="arrow-right"></div>
          </div>
          
          <div className="cat-story-item cat-story-item-2">
            <div className="cat-container">
              <div className="cat cat-searching">
                <div className="cat-head cat-looking">
                  <div className="cat-ears"></div>
                  <div className="cat-face">
                    <div className="cat-eyes cat-curious"></div>
                    <div className="cat-mouth cat-neutral"></div>
                  </div>
                </div>
                <div className="cat-body">
                  <div className="cat-magnify"></div>
                </div>
              </div>
            </div>
            <p className="cat-quote">Need similar<br />tech teammates?</p>
          </div>
          
          <div className="arrow-container arrow-2-to-3">
            <div className="arrow-right"></div>
          </div>
          
          <div className="cat-story-item cat-story-item-3">
            <div className="cat-container">
              <div className="cat cat-happy">
                <div className="cat-head">
                  <div className="cat-ears cat-happy-ears"></div>
                  <div className="cat-face">
                    <div className="cat-eyes cat-happy-eyes"></div>
                    <div className="cat-mouth cat-smile"></div>
                  </div>
                </div>
                <div className="cat-body cat-celebrating">
                  <div className="cat-friends"></div>
                </div>
              </div>
            </div>
            <p className="cat-quote">Find your team<br />on AntiSolo!</p>
          </div>
          
          <div className="arrow-container arrow-3-to-4">
            <div className="arrow-right"></div>
          </div>
          
          <div className="cat-story-item cat-story-item-4">
            <div className="cat-container">
              <div className="cat cat-building">
                <div className="cat-head">
                  <div className="cat-ears cat-excited-ears"></div>
                  <div className="cat-face">
                    <div className="cat-eyes cat-excited-eyes"></div>
                    <div className="cat-mouth cat-big-smile"></div>
                  </div>
                </div>
                <div className="cat-body cat-building-body">
                  <div className="cat-project"></div>
                  <div className="cat-sparkles"></div>
                </div>
              </div>
            </div>
            <p className="cat-quote">Learn & build<br />together!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
