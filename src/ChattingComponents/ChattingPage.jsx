import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, BellRing, Mail, Plus, User, X } from 'lucide-react';
import './ChattingPage.css';
import Cookies from "js-cookie";
import LoadingPage from '../Components/LoadingPage';

const ChattingPage = () => {
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [activeTab, setActiveTab] = useState('friends');
    const navigate = useNavigate();
    const [user,setUser] = useState({});
    const [projects,setProjects] = useState([]);
    const fetchProject = async (pid) => {
      console.log("pid = "+pid);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getProject/${pid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data "+response.status);
        }
        const data = await response.json();
        setProjects((prevProjects) => [...prevProjects, data]);
      } catch (err) {
        console.log(err.message);
      }
    };


  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Switch between friends and teams tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Navigate to chat
  const goToChat = (id, type) => {
    if (type === 'friend') {
      navigate(`/private/${id}`);
    } else {
      navigate(`/group/${id}`);
    }
  };
      useEffect(() => {
          const fetchUser = async () => {
          const userId = Cookies.get("userName");
          if(userId==undefined)navigate("/login");
          try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/login/userInfo/${userId}`, {
                                      method: "GET",
                                     headers: {
                                       "Content-Type": "application/json"
                                      //  "Authorization": `Bearer ${Cookies.get("token")}`
                                     },
              });
  
              if (!response.ok) {
                console.log("Failed to fetch user data");
                navigate("/login");
              }
              const data = await response.json();
              setUser(data);
              // console.log(data.teams)
              for(let i = 0;i<data.teams.length;i++){
                console.log("from data one of the teams pid = "+data.teams[i]);
                fetchProject(data.teams[i]);
              }
            } catch (err) {
              console.log(err.message);
            }
          };
  

          fetchUser();
    }, []);
  
    if(Object.keys(user).length === 0) return <><LoadingPage/></>;

  // Mock data for friends
  // const friends = [
  //   { id: 1, name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', lastMessage: 'Hey, how are you?', lastSeen: '2h ago', unread: 3 },
  //   { id: 2, name: 'Samantha Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', lastMessage: 'Did you check the project?', lastSeen: '1h ago', unread: 0 },
  //   { id: 3, name: 'Mike Chen', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', lastMessage: 'Let\'s meet tomorrow', lastSeen: '3h ago', unread: 1 },
  //   { id: 4, name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', lastMessage: 'Thanks for your help!', lastSeen: '5h ago', unread: 0 },
  //   { id: 5, name: 'Jason Smith', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', lastMessage: 'The code looks great', lastSeen: 'Just now', unread: 2 },
  // ];

  // // Mock data for team projects
  // const teams = [
  //   { id: 101, name: 'Web Portfolio App', avatar: 'https://picsum.photos/id/180/200', lastMessage: 'Meeting at 3pm', members: 5, lastActivity: '30m ago', unread: 4 },
  //   { id: 102, name: 'Mobile Game Dev', avatar: 'https://picsum.photos/id/160/200', lastMessage: 'Sprint review tomorrow', members: 4, lastActivity: '1h ago', unread: 0 },
  //   { id: 103, name: 'AI Research Project', avatar: 'https://picsum.photos/id/190/200', lastMessage: 'Check the new model results', members: 7, lastActivity: '2h ago', unread: 8 },
  //   { id: 104, name: 'E-commerce Platform', avatar: 'https://picsum.photos/id/20/200', lastMessage: 'Backend deployed successfully', members: 3, lastActivity: '5h ago', unread: 0 },
  // ];

  return (
    <div className="chatting-page">
      {/* Navbar - Same as homepage and other pages */}

      {/* Main Content */}
      <div className="chatting-container">
        <div className="chats-list-container">
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`} 
              onClick={() => switchTab('friends')}
            >
              Friends
            </button>
            <button 
              className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`} 
              onClick={() => switchTab('teams')}
            >
              Teams
            </button>
          </div>
          
          <div className="chats-list">
            {activeTab === 'friends' ? (
              <div className="friends-list">
                {user.buddies.map((friend,index) => (
                  <div 
                    key={friend.name} 
                    className="chat-item" 
                    onClick={() => goToChat(friend.name, 'friend')}
                  >
                    <img src={friend.imageUrl} alt={friend.name} className="chat-avatar" />
                    <div className="chat-details">
                      <div className="chat-top-line">
                        <h3 className="chat-name">{friend.name}</h3>
                        {/* <span className="chat-time">ADMIN</span> */}
                      </div>
                      <div className="chat-bottom-line">
                        {friend.name == "Adityamishra3648" && <p className="chat-last-message">Admin</p> }
                        {/* <span className="unread-badge"></span> */}
                        {/* {friend.unread > 0 && (
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="teams-list">
                {projects.map((team,index) => (
                  <div 
                    key={index} 
                    className="chat-item" 
                    onClick={() => goToChat(team.id, 'team')}
                  >
                    <img src={team.image} alt={team.title} className="chat-avatar" />
                    <div className="chat-details">
                      <div className="chat-top-line">
                        <h3 className="chat-name">{team.title}</h3>
                        {/* <h3 className="chat-name">{team.name}</h3> */}
                        {/* <span className="chat-time">{team.lastActivity}</span> */}
                      </div>
                      <div className="chat-bottom-line">
                        <p className="chat-last-message">
                          <span className="team-members">{team.filled} members</span>
                           {/* • {team.lastMessage} */}
                        </p>
                        {/* {team.unread > 0 && (
                          <span className="unread-badge">{team.unread}</span>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar - Same as other pages */}
    </div>
  );
};

export default ChattingPage;