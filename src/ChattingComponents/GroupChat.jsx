import React, { useEffect, useState, useRef } from "react";
// import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Home, BellRing, Mail, Plus, User, ArrowLeft } from 'lucide-react';
import './ChattingPage.css';
import Cookies from "js-cookie";
import LoadingPage from "../Components/LoadingPage";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

var stomp = null;
const myMap = new Map();

const GroupChat = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [team, setTeam] = useState(null);
  // const [messages, setMessages] = useState([]);
      // const navigate = useNavigate();
      const { projectId } = useParams();
      const [message, setMessage] = useState("");
      const [chatMessages, setChatMessages] = useState([]);
      const [stompClient, setStompClient] = useState(null);
      const [loadingMessages, setLoadingMessages] = useState(false);
      const chatContainerRef = useRef(null);
      const messagesEndRef = useRef(null);
      // const [messages, setMessages] = useState([]);
      const [cursorCreatedAt, setCursorCreatedAt] = useState(null);
      // const [chatId, setChatId] = useState("");
      const [isFirstLoad, setIsFirstLoad] = useState(true);
      const prevScrollHeight = useRef(0);

        const fetchProject = async () => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getProject/${projectId}`);
                if (!response.ok) {
                  throw new Error("Failed to fetch project data "+response.status);
                }
                const data = await response.json();
                // setProject(data);
                for(let app of data.members){
                  // console.log(app.name)
                  // if(app.name==Cookies.get("userName")){
                    
                  // setMember(true);
                  // } 
                  myMap.set(app.name,app.imageUrl);
                }
                setTeam(data);
              } catch (err) {
                console.log("error");
              }
            };

          useEffect(() => {
            const chatContainer = chatContainerRef.current;
            if (!chatContainer) return;
          
            if (isFirstLoad) {
              // On first load, scroll to bottom
              chatContainer.scrollTop = chatContainer.scrollHeight;
              setIsFirstLoad(false);
            } else {
              // Preserve scroll position when loading older messages
              const newScrollHeight = chatContainer.scrollHeight;
              chatContainer.scrollTop += (newScrollHeight - prevScrollHeight.current);
            }
            
            prevScrollHeight.current = chatContainer.scrollHeight;
          }, [chatMessages]);
  
                useEffect(() => {
                  const chatContainer = chatContainerRef.current;
                  if (!chatContainer) return;
                
                  if (isFirstLoad) {
                    // On first load, scroll to bottom
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    setIsFirstLoad(false);
                  } else {
                    // Preserve scroll position when loading older messages
                    const newScrollHeight = chatContainer.scrollHeight;
                    chatContainer.scrollTop += (newScrollHeight - prevScrollHeight.current);
                  }
                  
                  prevScrollHeight.current = chatContainer.scrollHeight;
                }, [chatMessages]);
            
                useEffect(() => {
                  const handleScroll = () => {
                    if (chatContainerRef.current) {
                      if (chatContainerRef.current.scrollTop === 0) {  // User reached the top
                        fetchMessages();
                      }
                    }
                  };
                
                  const container = chatContainerRef.current;
                  if (container) {
                    container.addEventListener("scroll", handleScroll);
                  }
                
                  return () => {
                    if (container) {
                      container.removeEventListener("scroll", handleScroll);
                    }
                  };
                }, [cursorCreatedAt]);
    
          const connect = () => {
              const token = Cookies.get("token");
              const sender = Cookies.get("userName");
              // console.log("chatId = "+chatId);
      
              if (!token || !sender) {
                  alert("Token and sender username are required!");
                  return;
              }
      
              if (!window.SockJS || !window.Stomp) {
                  alert("SockJS or Stomp.js not loaded. Make sure CDN links are added in index.html.");
                  return;
              }
      
              let socket = new window.SockJS(`${import.meta.env.VITE_API_URL}/chat`);
              console.log("SockJS instance created:", socket);
              socket.onopen = () => console.log("Connected to WebSocket!");
              socket.onerror = (error) => console.error("WebSocket Error:", error);
              socket.onclose = () => console.log("WebSocket Closed");
      
              stomp = window.Stomp.over(socket);
              console.log("stomp instance created:", stomp);
              console.log(`sending header =  Bearer ${Cookies.get("token")}`);
      
              stomp.connect(
                  { Authorization: `Bearer ${Cookies.get("token")}` },
                  (frame) => {
                      console.log("Connected: ", frame);
                      console.log("Subscribing to " + `/group/${projectId}`);
                      stomp.subscribe(
                          `/group/${projectId}`,
                          (message) => {
                              console.log("subscribe read something");
                              showMessage(JSON.parse(message.body));
                          },
                          { Authorization: `Bearer ${Cookies.get("token")}` }
                      );
      
                      console.log(`Connected and Subscribed to ${projectId}`);
                  },
                  (error) => {
                    console.log("Error connecting: " + error);
                    navigate("/friendschat");
                  }
              );
              stomp.onWebSocketError = (error) => {
                console.error("WebSocket Error:", error);
                navigate("/friendschat");
              };
            
              stomp.onStompError = (frame) => {
                  console.error("STOMP Subscription Error:", frame);
                  navigate("/friendschat");
              };
      
              setStompClient(stomp);
            };
            
  
            const sendMessage = (e) => {
              e.preventDefault();
              if (message.trim() === "") return;
              const token = Cookies.get("token");
              const sender = Cookies.get("userName");
              if (!token || !sender ) {
                alert("All fields are required!");
                return;
              }
  
                  let messageObj = { projectId:projectId, sender, message };
  
                  if (stompClient) {
                      stompClient.send("/app/group-message", { Authorization: `Bearer ${token}` }, JSON.stringify(messageObj));
                      setMessage("");
                  }
              };
                    useEffect(() => {
                      if(!Cookies.get("token"))navigate("/login");
                    },[]);
  
          useEffect(() => {
            connect();
            fetchProject();
            fetchMessages();
          }, [projectId]);
  
  
          const fetchMessages = async () => {
                  if(loadingMessages)return;
          
                setLoadingMessages(true);
                const token = Cookies.get("token");
                const sender = Cookies.get("userName");
                console.log("fetching messages called");
                const url = cursorCreatedAt 
                    ? `${import.meta.env.VITE_API_URL}/api/messages/group/${projectId}?cursorCreatedAt=${cursorCreatedAt}&pageSize=15`
                    : `${import.meta.env.VITE_API_URL}/api/messages/group/${projectId}?pageSize=15`;
                    const response = await fetch(url,{
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("token")}`
                      }
                    });
                        console.log("url = "+url);
                        console.log("response = "+response.status+" url = "+url);
                        if(response.status != 200){
                          setLoadingMessages(false);
                          return;
                        }
                        const data = await response.json();
                        // const data = await response.text();
                        console.log("data = "+data);
                        
                        if (data.length > 0) {
                          data.reverse();
                          setChatMessages([...data,...chatMessages]);
                          setCursorCreatedAt(data[0].createdAt); // Update cursor
                          // console.log("cursorCreatedAt = "+data[data.length-1].createdAt +" hence = "+cursorCreatedAt);
                        }
                        setLoadingMessages(false);
                };

                const showMessage = (messageObj) => {
                  setChatMessages((prevMessages) => [...prevMessages,messageObj]);
                  // setChatMessages((prevMessages) => [...prevMessages,messageObj]);
              };

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Go back to chat list
  const goBack = () => {
    navigate('/home/chat');
  };

  // useEffect(() => {
    // In a real app, fetch the team data and messages from API
    // Mock data for demo
    // const mockTeams = [
    //   { id: 101, name: 'Web Portfolio App', avatar: 'https://picsum.photos/id/180/200', members: 5, lastActivity: '30m ago' },
    //   { id: 102, name: 'Mobile Game Dev', avatar: 'https://picsum.photos/id/160/200', members: 4, lastActivity: '1h ago' },
    //   { id: 103, name: 'AI Research Project', avatar: 'https://picsum.photos/id/190/200', members: 7, lastActivity: '2h ago' },
    //   { id: 104, name: 'E-commerce Platform', avatar: 'https://picsum.photos/id/20/200', members: 3, lastActivity: '5h ago' },
    // ];

    // // Find the team by ID
    // const foundTeam = mockTeams.find(t => t.id === parseInt(id));
    // if (foundTeam) {
    //   setTeam(foundTeam);
    // }

    // Mock team members
    // const teamMembers = [
    //   { id: 1, name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    //   { id: 2, name: 'Samantha Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    //   { id: 3, name: 'Mike Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
    //   { id: 4, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
    //   { id: 5, name: 'Jason Smith', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    // ];
    
    // Mock messages for the team chat
  //   const mockMessages = [
  //     { id: 1, sender: 'other', senderId: 1, senderName: 'Alex Johnson', senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Hey team! How\'s everyone doing?', time: '10:30 AM' },
  //     { id: 2, sender: 'me', senderId: 0, senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Pretty good! Just working on the UI components.', time: '10:32 AM' },
  //     { id: 3, sender: 'other', senderId: 2, senderName: 'Samantha Lee', senderAvatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'The backend is coming along nicely. Should be done by tomorrow.', time: '10:33 AM' },
  //     { id: 4, sender: 'other', senderId: 3, senderName: 'Mike Chen', senderAvatar: 'https://randomuser.me/api/portraits/men/67.jpg', text: 'Great progress everyone! Let\'s sync up later today.', time: '10:35 AM' },
  //     { id: 5, sender: 'me', senderId: 0, senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Sounds good to me. I should have the nav component finished by then.', time: '10:36 AM' },
  //     { id: 6, sender: 'other', senderId: 4, senderName: 'Emily Davis', senderAvatar: 'https://randomuser.me/api/portraits/women/17.jpg', text: 'Don\'t forget we have the client meeting tomorrow morning!', time: '10:40 AM' },
  //     { id: 7, sender: 'other', senderId: 1, senderName: 'Alex Johnson', senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Thanks for the reminder, Emily. I\'ll prepare the demo.', time: '10:42 AM' },
  //     { id: 8, sender: 'me', senderId: 0, senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'I\'ll help with the demo preparations tonight.', time: '10:45 AM' },
  //   ];
    
  //   // setMessages(mockMessages);
  // }, [id]);

  // Handle sending a message
  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   if (messageInput.trim() === '') return;
    
  //   // In a real app, you would send this message to your backend
  //   const newMessage = {
  //     id: messages.length + 1,
  //     sender: 'me',
  //     senderId: 0,
  //     senderName: 'John Dev',
  //     senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg',
  //     text: messageInput,
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //   };
    
  //   setMessages([...messages, newMessage]);
    
  //   // Clear the input field
  //   setMessageInput('');
  // };


  function formatMessageTime(createdAt) {
    const now = new Date();
    const messageDate = new Date(createdAt);
    const diffMs = now - messageDate;
    const diffSec = diffMs / 1000;
    const diffMin = diffSec / 60;
    const diffHrs = diffMin / 60;
    const diffDays = Math.floor(diffHrs / 24);
  
    const isToday =
      now.toDateString() === messageDate.toDateString();
  
    if (isToday || diffDays === 0) {
      // If it's today, return time like 10:45 AM
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(messageDate);
    }
    console.log("diffDays = "+diffDays);
  
    if (diffMs < 0) {
      // Future time
      if (Math.abs(diffDays) === 1 ) {
        return "Tomorrow";
      }
      return `${Math.abs(diffDays)} days from now`;
    }
  
    if (diffDays === 1 || diffDays==0) {
      return "Yesterday";
    }
  
    return `${diffDays} days ago`;
  }
  

  if (!team) {
    return <><LoadingPage/></>;
  }

  return (
    <div className="chatting-page">
      {/* Navbar - Same as homepage and other pages */}
      {/* Main Content */}
      <div className="chatting-container">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <button className="back-button" onClick={goBack}>
                <ArrowLeft size={20} />
              </button>
              <img src={team.image} alt={team.title} className="chat-avatar" />
              <div className="chat-header-details">
                <h3>{team.title}</h3>
                <span className="chat-status">
                  {team.filled} members 
                  {/* • Active {team.lastActivity} */}
                </span>
              </div>
            </div>
          </div>
          
          <div className="messages-container" ref={chatContainerRef}>
          <div ref={messagesEndRef}></div>
            {chatMessages.map(message => (
              <div key={message.id} className={`message ${message.sender == Cookies.get("userName")  ? 'message-sent' : 'message-received'}`}>
                <img 
                  src={myMap.get(message.sender)} 
                  alt={message.sender} 
                  className="message-avatar" 
                />
                <div className="message-content">
                  {message.sender !== Cookies.get("userName") && (
                    <p className="sender-name">{message.sender}</p>
                  )}
                  <p>{message.message}</p>
                  <span className="message-time">{formatMessageTime(message.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <form className="message-input-container" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Bar - Same as other pages */}
    </div>
  );
};

export default GroupChat;