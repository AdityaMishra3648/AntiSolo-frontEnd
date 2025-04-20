import React, { useEffect, useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, MessageSquare, Upload, LogOut, Filter, Home,MessageCircle } from 'lucide-react';
 // Import your CSS file for styling
 import Cookies from "js-cookie";
 import './HomePageCompleted.css';
 import HomepageContent from './HomepageContent';
 import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import PostProjectSkeleton from './PostProjectSkeleton';
import { Outlet } from 'react-router-dom';
import { useLocation, matchPath } from 'react-router-dom';
import { set } from 'react-hook-form';


const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Sample user data
  const [searchPrefix, setSearchPrefix] = useState("");
  const [isGuest, setIsGuest] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const buttonRef = useRef(null);
  const [chatRoute, setChatRoute] = useState(false);
  useEffect(() => {
    const isChatPath = matchPath('/home/private/:id', location.pathname);
    const  isChatPath2 = matchPath('/home/group/:id', location.pathname);
    setChatRoute(isChatPath!=null || isChatPath2!=null);
    console.log("chat orute" +(isChatPath!=null || isChatPath2!=null)+" isLoginRoute = "+isChatPath+" isChatPath2 = "+isChatPath2);
  },[location.pathname])
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent newline or default form submit
      buttonRef.current?.click(); // programmatically click the submit button
    }
  };

  const [userData,setUserData] = useState({
    name: isGuest ? 'Guest' : 'John Doe',
    profileImage: isGuest 
      ? "https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png" 
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcauUs8R0kv2QxC66jCMgDWM1P4OVSDK7KsQnsDPGewdmNzgN0huSYTCHzhqkAGNPxV3o&usqp=CAU"
  }); 
  useEffect(() => {
      console.log("useeffect called in navbar");
        const fetchUserInfo =  async () => {
          // if(notification){
          //   showToast(notification,"success");
          //   setNotification("");
          // }
          console.log("fetchUserinfo called");
          // setUsername(Cookies.get("username"));
    
          // if(Cookies.get("token")=="")return;
          if(!document.cookie.includes("token=")){
            return;
          }
          // console.log("token in cokei from Homepage = "+Cookies.get("token"));
          // console.log("token in cokei from Homepage = "+Cookies.get("token")+" or in state it is =  "+token);
                  try{
                      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/userInfo`,{
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookies.get("token")}`
                          },
                      });
                      console.log("response "+response+" status = "+response.status);
                      if(response.ok){ 
                        const data = await response.json();
                        // console.log("data " +data);
                        // setUserName(data.userName);
                        // setImage(data.profileImageUrl);
                        // setUserName(data.userName);
                        // setImage(data.profileImageUrl);
                        // Cookies.set("userName", data.userName, { expires: 7, secure: true, sameSite: "Strict" });
                        // Cookies.set("image", data.profileImageUrl, { expires: 7, secure: true, sameSite: "Strict" });
                        Cookies.set("userName", data.userName, { expires: 7 });
                        Cookies.set("image", data.profileImageUrl, { expires: 7 });
                        setUserData({
                          name:Cookies.get("userName"),
                          profileImage:Cookies.get("image")
                        });
                      }
                  }catch(error){
                      console.error("some error occured Error:", error);
                  }
    
          console.log(Cookies.get("token"));
        }
        console.log("token = "+Cookies.get("token"));
        if(Cookies.get("token")!=""){
          const verifyToken = async () => {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/login/checkToken/${Cookies.get("token")}`,{
                method: "GET" });
                if (!response.ok) {
                  return false;
                }
                let result  = await response.json();
                if(result==true){
                  console.log("result from check token = "+result);
                  setIsGuest(false);
                  fetchUserInfo();
                }else{
                  Cookies.remove("token");
                  Cookies.remove("userName");
                  Cookies.remove("image");
                }
            } catch (error) {
              return false;
            }
          }
          verifyToken();
        }
  
  },[]);
  const handleSeachEvent = (e) => {
    e.preventDefault();
    setShowMobileSearch(false);
    if(searchPrefix=="")return;
    navigate(`/home/searchuser/${searchPrefix}`);
  }

  // State for mobile search bar

  // Handle login redirect for guest users
  // const handleGuestAction = (e) => {
  //   if (isGuest) {
  //     e.preventDefault();
  //     alert("Please log in to access this feature");
  //     // In a real app, redirect to login page
  //     // window.location.href = "/login";
  //   }
  // };

    function logout() {
      Cookies.remove("token");
      Cookies.remove("userName");
      Cookies.remove("image");
      // Cookies.remove("username");
      // Cookies.remove("password");
    }

  const handlePostProject = () => {
    if(isGuest)navigate("/login");
    // navigate("/home/postproject");
  }
  const handleNotifications = () => {
    if(isGuest)navigate("/login");
    // navigate("/home/postproject");
  }
  const handleGuestAction = () =>{
    if(isGuest)navigate("/login");
  }
  
  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="site-title">AntiSolo </h1> 
        </div>

        <div className="mobile-chat-icon">
          <Link to="/home/chat">
            <MessageCircle color="#4f6bff" size={29} />
          </Link>
        </div>

        <div className="navbar-center">
          <div className={`search-container ${showMobileSearch ? 'mobile-search-active' : ''}`}>
            <form>
              <input type="text" placeholder="Search users..." value={searchPrefix} onChange={(e)=>setSearchPrefix(e.target.value)}/>
              <button ref={buttonRef} className="search-button" onClick={handleSeachEvent}>
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="navbar-right">
          
          <Link to="/home" className="nav-item desktop-only" onClick={handleGuestAction}>
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link to="/home/notification" className="nav-item desktop-only" onClick={handleGuestAction}>
            <Bell size={20} />
            <span>Notifications</span>
          </Link>
          
          <Link to="/home/chat" className="nav-item desktop-only" onClick={handleGuestAction}>
            <MessageSquare size={20} />
            <span>Chat</span>
          </Link>
          
          <Link to="/home/postproject" className="nav-item desktop-only" onClick={handlePostProject}>
            <Upload size={20} />
            <span>Post Project</span>
          </Link>
          
          <Link to={isGuest ? "/login" : `/home/profile/${Cookies.get("userName")}`} className="profile-container desktop-only" onClick={handleGuestAction}>
            <img 
              src={userData.profileImage} 
              alt="Profile" 
              className="profile-image" 
            />
            <span className="username">{userData.name}</span>
          </Link>
          
          <Link to="/" className="nav-item logout-btn desktop-only" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </nav>









      <Outlet />
      {/* Main Content Area */}
        {/* <Routes>
          <Route path="/" element={<HomepageContent />} />
          <Route path="/postproject" element={<PostProjectSkeleton />} />
        </Routes> */}













 
      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <Link to="/home" className="mobile-nav-item">
          <Home size={24} />
        </Link>
        
        <div className="mobile-nav-item" onClick={toggleMobileSearch}>
          <Search size={24} />
        </div>
        
        <Link to="/home/postproject" className="mobile-nav-item post-project-btn" onClick={handlePostProject}>
          <Upload size={24} />
        </Link>
        
        <Link to="/home/notification" className="mobile-nav-item" onClick={handleGuestAction}>
          <Bell size={24} />
        </Link>
        
        <Link to={isGuest ? "/login" : `/home/profile/${Cookies.get("userName")}`} className="mobile-nav-item" onClick={handleGuestAction}>
          <img 
            src={userData.profileImage} 
            alt="Profile" 
            className="mobile-profile-image" 
          />
        </Link>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchPrefix} onChange={(e)=>setSearchPrefix(e.target.value)}
              autoFocus
              onKeyDown={handleKeyDown}
            />
            <button className="mobile-search-close" onClick={toggleMobileSearch}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;