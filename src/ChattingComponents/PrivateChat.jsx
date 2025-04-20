// import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Home, BellRing, Mail, Plus, User, ArrowLeft, Receipt } from 'lucide-react';
import './ChattingPage.css';
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { set } from 'react-hook-form';
import LoadingPage from '../Components/LoadingPage';
// import {  useParams } from "react-router-dom";

var stomp = null;

const PrivateChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [friend, setFriend] = useState(null);
  const [messages, setMessages] = useState([]);

    //   const navigate = useNavigate();
    //   const { userId } = useParams();
      const [token, setToken] = useState("");
      const [sender, setSender] = useState("");
      const [recipient, setRecipient] = useState("");
      const [recepentImage, setRecepentImage] = useState("");
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
  
      const generateChatId = (user1, user2) => {
        const sortedUsers = [user1, user2].sort(); // Ensure same order
        return `${sortedUsers[0]}$${sortedUsers[1]}`; // Concatenation with $
      };
    
      const connect = () => {
          const token = Cookies.get("token");
          const sender = Cookies.get("userName");
          const recepient = id;
          const chatId = generateChatId(sender, recepient);
          console.log("chatId = "+chatId);
  
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
                  console.log("Subscribing to " + `/user/${chatId}/queue/private`);
                  stomp.subscribe(
                      `/user/${chatId}/queue/private`,
                      (message) => {
                          showMessage(JSON.parse(message.body));
                      },
                      { Authorization: `Bearer ${Cookies.get("token")}` }
                  );
  
                  console.log(`Connected and Subscribed to ${chatId}`);
              },
              (error) => {
                console.log("Error connecting: " + error);
                navigate("/home/chat");
              }
          );
          stomp.onWebSocketError = (error) => {
            console.error("WebSocket Error:", error);
            navigate("/friendschat");
          };
        
          stomp.onStompError = (frame) => {
              console.error("STOMP Subscription Error:", frame);
              navigate("/home/chat");
          };
  
          setStompClient(stomp);
        };
        
        useEffect(() => {
          if(id==undefined)navigate("/login");
        if(id==Cookies.get("userName"))navigate("/home/chat");
        setToken(Cookies.get("token"));
        setSender(Cookies.get("userName"));
        setRecipient(id);
        // const token = Cookies.get("token");
        // const sender = Cookies.get("userName");
        // const recepient = userId;
        // const chatId = generateChatId(sender, recepient);
        // setChatId(chatId);
          fetchMessages();
          connect();
          fetchUser();

          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, [id]);


        const fetchUser = async () => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/login/userInfo/${id}`, {
                                        method: "GET",
                                       headers: {
                                         "Content-Type": "application/json"
                                        //  "Authorization": `Bearer ${Cookies.get("token")}`
                                       },
                });
                
                if (!response.ok) {
                  throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setRecepentImage(data.profileImageUrl);
                // setUser(data);
                // for(let buddy of data.buddies){
                //   if(buddy.name==Cookies.get("userName")){
                //     setAlreadyBuddy(true);
                //     break;
                //   }
                // }
                // setRequestSent(false);
                // for(let buddy of data.friendRequest){
                //   if(buddy.name==Cookies.get("userName")){
                //     setRequestSent(true);
                //     break;
                //   }
                // }
                // extractProjectData();
              } catch (err) {
                setError(err.message);
              }
            }
        

        const fetchMessages = async () => {
          if(loadingMessages)return;
  
        setLoadingMessages(true);
        const token = Cookies.get("token");
        const sender = Cookies.get("userName");
        const recepient = id;
        const chatId = generateChatId(sender, recepient);
        console.log("chatId = "+chatId);
        console.log("fetching messages called");
        const url = cursorCreatedAt 
            ? `${import.meta.env.VITE_API_URL}/api/messages/${chatId}?cursorCreatedAt=${cursorCreatedAt}&pageSize=10`
            : `${import.meta.env.VITE_API_URL}/api/messages/${chatId}?pageSize=15`;
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
                  console.log("cursorCreatedAt = "+data[data.length-1].createdAt +" hence = "+cursorCreatedAt);
                }
                setLoadingMessages(false);
        };
              
      const sendMessage = (e) => {
        e.preventDefault();
          if (!token || !sender || !recipient || !message) {
            alert("All fields are required!");
            return;
          }
  
          let messageObj = { sender, recipient, message };
  
          if (stompClient) {
              stompClient.send("/app/private-message", { Authorization: `Bearer ${token}` }, JSON.stringify(messageObj));
              setMessage("");
          }
      };
  
      const showMessage = (messageObj) => {
          setChatMessages((prevMessages) => [...prevMessages,messageObj]);
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
  //   console.log("reached fetch projects");
  //   // In a real app, fetch the friend data and messages from API
  //   // Mock data for demo
  //   const mockFriends = [
  //     { id: 1, name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', lastSeen: '2h ago' },
  //     { id: 2, name: 'Samantha Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', lastSeen: '1h ago' },
  //     { id: 3, name: 'Mike Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', lastSeen: '3h ago' },
  //     { id: 4, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', lastSeen: '5h ago' },
  //     { id: 5, name: 'Jason Smith', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', lastSeen: 'Just now' },
  //   ];

  //   // Find the friend by ID
  //   const foundFriend = mockFriends.find(f => f.id === parseInt(id));
  //   if (foundFriend) {
  //     setFriend(foundFriend);
  //   }

  //   // Mock messages
  //   const mockMessages = [
  //     { id: 1, sender: 'other', senderName: foundFriend?.name, senderAvatar: foundFriend?.avatar, text: 'Hey there! How\'s the project going?', time: '10:30 AM' },
  //     { id: 2, sender: 'me', senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Pretty good actually. Just finished the main feature.', time: '10:32 AM' },
  //     { id: 3, sender: 'other', senderName: foundFriend?.name, senderAvatar: foundFriend?.avatar, text: 'That\'s awesome! Can I see a demo?', time: '10:33 AM' },
  //     { id: 4, sender: 'me', senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Sure! I\'ll send you the link in a bit.', time: '10:35 AM' },
  //     { id: 5, sender: 'other', senderName: foundFriend?.name, senderAvatar: foundFriend?.avatar, text: 'Great, looking forward to it! By the way, do you have time for a quick call later today?', time: '10:36 AM' },
  //     { id: 6, sender: 'me', senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Yeah, I should be free after 3pm.', time: '10:40 AM' },
  //     { id: 7, sender: 'other', senderName: foundFriend?.name, senderAvatar: foundFriend?.avatar, text: 'Perfect, let\'s do 3:30pm then?', time: '10:42 AM' },
  //     { id: 8, sender: 'me', senderName: 'John Dev', senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Works for me! Talk to you then.', time: '10:45 AM' },
  //   ];
    
  //   setMessages(mockMessages);
  // }, [id]);

  // Handle sending a message
//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (messageInput.trim() === '') return;
    
//     // In a real app, you would send this message to your backend
//     const newMessage = {
//       id: messages.length + 1,
//       sender: 'me',
//       senderName: 'John Dev',
//       senderAvatar: 'https://randomuser.me/api/portraits/men/44.jpg',
//       text: messageInput,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
    
//     setMessages([...messages, newMessage]);
    
//     // Clear the input field
//     setMessageInput('');
//   };


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
    if (Math.abs(diffDays) === 1 || diffDays==0) {
      return "Tomorrow";
    }
    return `${Math.abs(diffDays)} days from now`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${diffDays} days ago`;
}

      useEffect(() => {
        if(!Cookies.get("token"))navigate("/login");
      },[]);
  if (!id) {
    // return <div className="loading">Loading chat...</div>;
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
              <img src={recepentImage} alt={Receipt} className="chat-avatar" />
              <div className="chat-header-details">
                <h3>{recipient}</h3>
                <span className="chat-status">
                  {/* Last seen {friend.lastSeen} */}
                </span>
              </div>
            </div>
          </div>
          
          <div className="messages-container" ref={chatContainerRef}>
          <div ref={messagesEndRef}></div>
            {chatMessages.map(message => (
              <div  key={message.id} className={`message ${message.sender === Cookies.get("userName") ? 'message-sent' : 'message-received'}`}>
                <img 
                  src={message.sender==Cookies.get("userName")? Cookies.get("image"):recepentImage}
                  // src = "https://www.redditstatic.com/avatars/avatar_default_02_C18D42.png" 
                  // alt={message.senderName} 
                  className="message-avatar" 
                />
                <div className="message-content">
                  <p>{message.message}</p>
                  <span className="message-time">{formatMessageTime(message.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <form className="message-input-container"  onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message} onChange={(e) => setMessage(e.target.value)}
              // value={messageInput}
              // onChange={(e) => setMessageInput(e.target.value)}
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

export default PrivateChat;