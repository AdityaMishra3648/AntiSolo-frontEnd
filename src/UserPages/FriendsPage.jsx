import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import { UserMinus,UserPlus } from "lucide-react";
import './FriendsPage.css';

const FriendsPage = () => {

  const navigate = useNavigate();
  const location = useLocation();
  let user = location.state?.user;

  const [trigger, setTrigger] = useState(0);
  const [processing, setProcessing] = useState(false);
 
  // Sample friends data (replace with real data later)
  const [friends, setFriends] = useState([]);

  const [requests, setRequests] = useState([]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");

  const handleChangedData = async () => {
    // if(trigger == 0){
    //   setFriends(user.buddies);
    //   setRequests(user.friendRequest);
    //   return;
    // }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login/userInfo/${user.userName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      
        if (!response.ok) {
           throw new Error("Failed to fetch user data");  
       }
        const data = await response.json();
            setFriends(data.buddies);
            setRequests(data.friendRequest);
         } catch (err) {
           console.log(err);
         }
    
  }

  useEffect(() => {
    handleChangedData();
  },[trigger]);

  const handleUsserFriendsImage = () => {
    navigate('/home/friends' ,{
      state: {
        user:user
      },
      },);
  };

  const handleUnfriend = (friend) => {
    setSelectedFriend(friend);
    setShowConfirmDialog(true);
  };

  const confirmUnfriend = async () => {
    // setFriends(friends.filter(friend => friend.id !== selectedFriend.id));
    setProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/removeFriend/${selectedFriend}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`,
        },
      });

    } catch (error) {
      console.error("Error removing friend:", error);
    }
    setTrigger(trigger + 1);
    setShowConfirmDialog(false);
    setSelectedFriend("");
    setProcessing(false);
  };

  const handleAcceptRequest = async (friend) => {
    setProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/confirmRequest/${friend}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`,
        },
      });

    } catch (error) {
      console.error("Error Accepting friend:", error);
    }
    setTrigger(trigger + 1);
    setShowConfirmDialog(false);
    setSelectedFriend("");
    setProcessing(false);
    
  }

  // Custom Dialog component
  const CustomDialog = ({ open, onClose, children }) => {
    if (!open) return null;
    
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          {children}
          <button className="dialog-close" onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const CustomDialogHeader = ({ children }) => {
    return <div className="dialog-header">{children}</div>;
  };

  const CustomDialogTitle = ({ children }) => {
    return <h2 className="dialog-title">{children}</h2>;
  };

  const CustomDialogDescription = ({ children }) => {
    return <p className="dialog-description">{children}</p>;
  };

  const CustomDialogFooter = ({ children }) => {
    return <div className="dialog-footer">{children}</div>;
  };

  const CustomButton = ({ variant, onClick, children, className }) => {
    return (
      <button 
        className={`custom-button ${variant} ${className || ''}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  if(!user || user.userName !== Cookies.get("userName")){
    navigate('/home');
  }

  return (
    <div className="friends-page">
      {(requests.length<1 || friends.length>0 ) &&  <h1>Your Friends</h1>}
      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.name} className="friend-card" >
            <div className="friend-info" onClick={()=>navigate(`/home/profile/${friend.name}`)} >
              <div className="friend-image-container">
                <img src={friend.imageUrl} alt={friend.name} className="friend-image" />
              </div>
              <h3 className="friend-username">{friend.name}</h3>
            </div>
            <button 
              className="unfriend-button"
              onClick={() => handleUnfriend(friend.name)}
            >
              <UserMinus size={20} />
              <span>Unfriend</span>
            </button>
          </div>
        ))}
      </div>
      <br />
      {requests.length>0 && <h1>Friend Requests</h1>}
      <div className="friends-list">
        {requests.map((friend) => (
          <div key={friend.name} className="friend-card">
            <div className="friend-info" onClick={()=>navigate(`/home/profile/${friend.name}`)}>
              <div className="friend-image-container">
                <img src={friend.imageUrl} alt={friend.name} className="friend-image" />
              </div>
              <h3 className="friend-username">{friend.name}</h3>
            </div>
            <button 
              className="unfriend-button"
              disabled={processing}
              onClick={() => handleAcceptRequest(friend.name)}
            >
              <UserPlus size={20} />
              <span>Accept</span>
            </button>
          </div>
        ))}
      </div>

      <CustomDialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <CustomDialogHeader>
          <CustomDialogTitle>Confirm Unfriend</CustomDialogTitle>
          <CustomDialogDescription>
            Are you sure you want to unfriend {selectedFriend}? This action cannot be undone.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <CustomDialogFooter>
          <CustomButton 
            variant="outline" 
            onClick={() => setShowConfirmDialog(false)}
            className="cancel-button"
          >
            Cancel
          </CustomButton>
          <CustomButton 
            variant="destructive" 
            onClick={confirmUnfriend}
            disabled={processing}
            className="confirm-button"
          >
            Unfriend
          </CustomButton>
        </CustomDialogFooter>
      </CustomDialog>
    </div>
  );
};

export default FriendsPage;
