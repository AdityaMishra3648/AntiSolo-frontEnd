import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

var stomp = null;

const ProjectChat = () => {
    const navigate = useNavigate();
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
          

          const sendMessage = () => {
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

            const showMessage = (messageObj) => {
                setChatMessages((prevMessages) => [messageObj,...prevMessages]);
            };

        useEffect(() => {
          connect();
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
                        // data.reverse();
                        setChatMessages([...chatMessages,...data]);
                        setCursorCreatedAt(data[data.length-1].createdAt); // Update cursor
                        console.log("cursorCreatedAt = "+data[data.length-1].createdAt +" hence = "+cursorCreatedAt);
                      }
                      setLoadingMessages(false);
              };

//   if (!project) return <p>Loading...</p>;

  return (
    <div>
         <h2>WebSocket Chat {projectId}</h2>

            <label>Message:</label>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter message" />
            <br />
            <br />

            <button onClick={connect}>Connect & Subscribe</button>
            <button onClick={sendMessage}>Send Message</button>
            <button onClick={fetchMessages}>load more </button>
            <h3>Chat Messages</h3>
            <div style={{ border: "1px solid black", padding: "10px", width: "50%", height: "300px", overflowY: "auto" }}>
              <div>

                {chatMessages.map((msg, index) => (
                  <p key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </p>
                ))}
              
              </div>
            </div>
            <br />
    </div>
  );
};

export default ProjectChat;
