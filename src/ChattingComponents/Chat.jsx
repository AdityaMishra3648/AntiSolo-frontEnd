import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

var stomp = null;

const Chat = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [token, setToken] = useState("");
    const [sender, setSender] = useState("");
    const [recipient, setRecipient] = useState("");
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
        const recepient = userId;
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
      
      useEffect(() => {
        if(userId==undefined)navigate("/login");
      if(userId==Cookies.get("userName"))navigate("/frindschat");
      setToken(Cookies.get("token"));
      setSender(Cookies.get("userName"));
      setRecipient(userId);
      // const token = Cookies.get("token");
      // const sender = Cookies.get("userName");
      // const recepient = userId;
      // const chatId = generateChatId(sender, recepient);
      // setChatId(chatId);
        fetchMessages();
        connect();
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [userId]);
      
      const fetchMessages = async () => {
        if(loadingMessages)return;

      setLoadingMessages(true);
      const token = Cookies.get("token");
      const sender = Cookies.get("userName");
      const recepient = userId;
      const chatId = generateChatId(sender, recepient);
      console.log("chatId = "+chatId);
      console.log("fetching messages called");
      const url = cursorCreatedAt 
          ? `${import.meta.env.VITE_API_URL}/api/messages/${chatId}?cursorCreatedAt=${cursorCreatedAt}&pageSize=15`
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
                // data.reverse();
                setChatMessages([...chatMessages,...data]);
                setCursorCreatedAt(data[data.length-1].createdAt); // Update cursor
                console.log("cursorCreatedAt = "+data[data.length-1].createdAt +" hence = "+cursorCreatedAt);
              }
              setLoadingMessages(false);
      };
            
    const sendMessage = () => {
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
        setChatMessages((prevMessages) => [messageObj,...prevMessages]);
    };

    return (
        <div>
            <h2>WebSocket Chat {userId}</h2>
            <label>Token:</label>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter JWT Token" />
            <br />
            <br />

            <label>Sender:</label>
            <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Enter your username" />
            <br />
            <br />

            <label>Receiver:</label>
            <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter receiver username" />
            <br />
            <br />

            <label>Message:</label>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter message" />
            <br />
            <br />

            <button onClick={connect}>Connect & Subscribe</button>
            <button onClick={sendMessage}>Send Message</button>

            <h3>Chat Messages</h3>
            <div ref={chatContainerRef} style={{ border: "1px solid black", padding: "10px", width: "50%", height: "300px", overflowY: "auto" }}>
                <div ref={messagesEndRef}>Mai aaya hu to aur message load karunga</div>
              <div style={{ display: "flex", flexDirection: "column-reverse", minHeight: '260px'}}>

                {chatMessages.map((msg, index) => (
                  <p key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </p>
                ))}
              
              </div>
            </div>
            <br />
            <button onClick={fetchMessages} disabled = {loadingMessages}>load more</button>
        </div>
    );
};

export default Chat;


//I need to investigate why below code is not working like above is doing the same thing but with a CDN link and the down one is with import statements

// import React, { useState, useEffect, useRef, useId } from "react";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import SockJS from "sockjs-client";
// import Stomp from "stompjs";
// var stomp = null;
// const Chat = () => {
//     const navigate = useNavigate();
//     const { userId } = useParams();
//     const [token, setToken] = useState("");
//     const [sender, setSender] = useState("");
//     const [recipient, setRecipient] = useState("");
//     const [message, setMessage] = useState("");
//     const [chatMessages, setChatMessages] = useState([]);
//     const [stompClient, setStompClient] = useState(null);
  
//     const connect = () => {
//       const token = Cookies.get("token");
//       const sender = Cookies.get("userName");

//       if (!token || !sender) {
//         alert("Token and sender username are required!");
//         return;
//       }
  
//       let socket = new SockJS("http://localhost:7000/chat");
//       console.log("SockJS instance created:", socket);
//       socket.onopen = () => console.log("Connected to WebSocket!");
//       socket.onerror = (error) => console.error("WebSocket Error:", error);
//       socket.onclose = () => console.log("WebSocket Closed");
// //       const socket = new WebSocket("http://localhost:7000/chat");
// // socket.onopen = () => console.log("WebSocket connection opened!");
// // socket.onerror = (error) => console.error("WebSocket error:", error);
// // socket.onclose = () => console.log("WebSocket connection closed.");
//       stomp = Stomp.over(socket);
//       console.log("stomp instance created:", stomp);
//       console.log(`sending header =  Bearer ${Cookies.get("token")}`);
//       stomp.connect({ Authorization: `Bearer ${Cookies.get("token")}` }, (frame) => {
//         console.log("Connected: ", frame);
//         console.log("Subscribing to "+`/user/${Cookies.get("userName")}/queue/private`);
//         stomp.subscribe(
//           `/user/${Cookies.get("userName")}/queue/private`,
//           (message) => {
//             showMessage(JSON.parse(message.body));
//           },
//           { Authorization: `Bearer ${Cookies.get("token")}` }
//         );
  
//         alert(`Connected and Subscribed to ${Cookies.get("userName")}`);
//       }, (error) => {
//         alert("Error connecting: " + error);
//       });
  
//       setStompClient(stomp);
//     };
//     useEffect(()=>{
//       setToken(Cookies.get("token"));
//       // if(!token){
//       //   navigate("/login");
//       // }
//       setSender(Cookies.get("userName"));
//       setRecipient(userId);
//       console.log("token in cookin = "+Cookies.get("token")+" sender = "+Cookies.get("userName")+" inside token variable = "+token+" sender in userstate = "+sender);
//       // connect();
//     },[userId]);
  
//     const sendMessage = () => {
//       if (!token || !sender || !recipient || !message) {
//         alert("All fields are required!");
//         return;
//       }
  
//       let messageObj = { sender, recipient, message };
      
//       if (stompClient) {
//         stompClient.send("/app/private-message", { Authorization: `Bearer ${token}` }, JSON.stringify(messageObj));
//         setMessage("");
//       }
//     };
  
//     const showMessage = (messageObj) => {
//       setChatMessages((prevMessages) => [...prevMessages, messageObj]);
//     };
  
//     return (
//       <div>
//         <h2>WebSocket Chat {userId}</h2>
//         <label>Token:</label>
//         <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter JWT Token" /><br /><br />
  
//         <label>Sender:</label>
//         <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Enter your username" /><br /><br />
  
//         <label>Receiver:</label>
//         <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Enter receiver username" /><br /><br />
  
//         <label>Message:</label>
//         <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter message" /><br /><br />
  
//         <button onClick={connect}>Connect & Subscribe</button>
//         <button onClick={sendMessage}>Send Message</button>
  
//         <h3>Chat Messages</h3>
//         <div style={{ border: "1px solid black", padding: "10px", width: "50%", height: "300px", overflowY: "scroll" }}>
//           {chatMessages.map((msg, index) => (
//             <p key={index}><strong>{msg.sender}:</strong> {msg.message}</p>
//           ))}
//         </div>
//       </div>
//     );
//   };

// export default Chat;