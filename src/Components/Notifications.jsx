import React, { useState,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Search, Home, BellRing, Mail, Plus, User } from 'lucide-react';
import '../CssFiles/Notifications.css';
import Cookies from "js-cookie";
import LoadingPage from './LoadingPage';

const Notifications = () => {
  // State for notifications with mock data
  const [page,setPage] = useState(0);
  const [notifications,setNotifications] = useState([]);
  const [loading,setLoading] = useState(false);
  const [hasMore,setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
      fetchNotifications();
  },[]);
  const fetchNotifications = async () => {
          if(!hasMore)return;
          if(!Cookies.get("token"))navigate("/login");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/notification?page=${page}&size=10`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get("token")}`
              }
          });
          if(response.status === 401){
              navigate("/login");
          };
          if(!response.ok){
              return;
          }
          const data = await response.json();
          console.log("length = "+data.content.length);
          if(data.content.length == 0){
              setHasMore(false);
          }
          setNotifications([...notifications,...data.content]);
          if(data.content.length < 2){
              setHasMore(false);
              return;
          }
          setPage(page+1);
      }
  
      const fetchNextPage = async () => {
          setLoading(true);
          await fetchNotifications();
          setLoading(false);
  
      }
  
      const notificationClickHandler = (notification) => {
          if(notification.type == 1){
              navigate(`/home/profile/${notification.userName}`);
          }else if(notification.type == 2){
              navigate(`/home/project/${notification.projectId}`);       
          }
      }
  

  // const [notifications, setNotifications] = useState([
  //   "John Smith invited you to join the project 'AI-Driven Task Management System'",
  //   "Sara Wilson liked your comment on 'React State Management Patterns'",
  //   "Your project 'Modern Authentication System' has 3 new applicants",
  //   "Amir Khan mentioned you in a comment on 'Building Microservices with Node.js'",
  //   "Reminder: Team meeting for 'E-commerce Platform' in 30 minutes",
  //   "Project 'Data Visualization Dashboard' was featured in weekly highlights",
  //   "Michael Brown accepted your invitation to collaborate on 'Mobile Payment Gateway'",
  //   "New message from Jane Doe regarding your 'Progressive Web App' project"
  // ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Function to toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Function to load more notifications
  // const loadMoreNotifications = () => {
  //   setIsLoading(true);
    
  //   // Simulate API call with timeout
  //   setTimeout(() => {
  //     const newNotifications = [
  //       "Elena Rodriguez shared a resource for 'Cloud Infrastructure Design'",
  //       "Your project 'Voice Recognition App' reached 100 views",
  //       "Weekly summary: Your profile was viewed by 24 developers",
  //       "New opportunity matching your skills: 'Full Stack Developer for AI Application'"
  //     ];
      
  //     setNotifications([...notifications, ...newNotifications]);
  //     setIsLoading(false);
  //   }, 1500);
  // };
  function getDaysAgo(createdAtInstant) {
    console.log("createdAtInstant = "+createdAtInstant);
    const createdDate = new Date(createdAtInstant); // Parse ISO string
    const currentDate = new Date();
  
    // Time difference in milliseconds
    const timeDiff = currentDate - createdDate;
  
    // Convert to full days
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
    return daysAgo;
  }
  
  function formatDaysAgo(createdAtInstant) {
    const daysAgo = getDaysAgo(createdAtInstant);
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "1 day ago";
    return `${daysAgo} days ago`;
  }

  if(hasMore && notifications.length == 0){
    return <><LoadingPage/></>;
  }

  return (
    <div className="homepage">
      {/* Notifications Container */}
      <div className="notifications-container">
        <h2 className="notifications-title">Notifications</h2>
        
        <div className="notifications-list">
          {notifications.map((notification, index) => (
            <div 
              key={index} 
              className="notification-item"
              onClick={() => notificationClickHandler(notification)}
            >
              <div className="notification-icon">
                <BellRing size={20} />
              </div>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">{formatDaysAgo(notification.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="load-more-container">
          <button 
            className="load-more-button"
            onClick={fetchNextPage}
            disabled={loading}
          >
            {isLoading ? (
              <div className="loading-dots-small">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;