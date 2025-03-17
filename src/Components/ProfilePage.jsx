import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
   const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [projects,setProjects] = useState([]);
  const [teams,setTeams] = useState([]);
  const [applied,setApplied] = useState([]);
  const [alreadyBuddy,setAlreadyBuddy] = useState(false);
  const [requestSent,setRequestSent] = useState(false);
  const [sendingRequest,setSendingRequest] = useState(false);
  const [trigger, setTrigger] = useState(0);
  
    const SendOrWidrawRequest = async () =>{
      setSendingRequest(true);
        try {
          const response = await fetch(`http://localhost:7000/User/sendFriendRequest/${userId}`, {
                                  method: "POST",
                                 headers: {
                                   "Content-Type": "application/json",
                                   "Authorization": `Bearer ${Cookies.get("token")}`
                                 },
            });
          
          if (!response.ok) {
            console.log("failed to send friend request "+response.status);
            setSendingRequest(false);
            return;
          }
          const data = await response.json();
          console.log("sent friend request "+data);
          // setRequestSent(!requestSent);
          // setRequestSent(false);
          // for(let buddy of user.friendRequest){
          //   if(buddy.name==Cookies.get("userName")){
          //     console.log("setting request sent to true");
          //     setRequestSent(true);
          //     break;
          //   }
          // }
        } catch (err) {
          console.log(err.message);
        }
        setSendingRequest(false);
        setTrigger(trigger+1);
      }
  useEffect(() => {

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:7000/login/userInfo/${userId}`, {
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
        setUser(data);
        for(let buddy of data.buddies){
          if(buddy.name==Cookies.get("userName")){
            setAlreadyBuddy(true);
            break;
          }
        }
        setRequestSent(false);
        for(let buddy of data.friendRequest){
          if(buddy.name==Cookies.get("userName")){
            setRequestSent(true);
            break;
          }
        }
        // extractProjectData();
      } catch (err) {
        setError(err.message);
      }
      // console.log("from link received userId is = "+userId+" and username stored in cookies is "+Cookies.get("userName"));
    };

    fetchUser();
  }, [trigger]);
  useEffect(() => {
    if (user!=null) {
      setProjects([]);
      setTeams([]);
      setApplied([]);
      extractProjectData();
      extractTeamProjectData();
      extractAppliedProjectData();
    }
  }, [user]);

  const extractProjectData = async () => {
    // console.log("user structure is "+user.projects+" and length is "+user.projects.length);
    for(let project of user.projects){
      try {

        console.log("id for one of project is "+project);
        const response = await fetch(`http://localhost:7000/project/getProject/${project}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data "+response.status);
        }
        const data = await response.json();
        // console.log("data cam out for "+project+" it is "+data);
        setProjects(prevProjects => [...prevProjects, data]);
        console.log("updated projects are "+projects);
        // console.log(JSON.stringify(, null, 2)); 
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      }
    }
  } 
  const extractTeamProjectData = async () => {
    for(let project of user.teams){
      try {
        const response = await fetch(`http://localhost:7000/project/getProject/${project}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data "+response.status);
        }
        const data = await response.json();
        setTeams(prevProjects => [...prevProjects, data]);
      } catch (err) {
        setError(err.message);
      }
    }
  } 
  const extractAppliedProjectData = async () => {
    for(let project of user.applied){
      try {
        const response = await fetch(`http://localhost:7000/project/getProject/${project}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data "+response.status);
        }
        const data = await response.json();
        setApplied(prevProjects => [...prevProjects, data]);
      } catch (err) {
        setError(err.message);
      }
    }
  } 

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.userName} <img src={user.profileImageUrl} alt="" style={{ width: "50px", height: "50px", objectFit: "cover" }} /></h1>
      {userId==Cookies.get("userName") && <button onClick={()=>navigate("/editProfile", { state: { user: user } })}>Edit Profile</button>}

      <p>Email: {user.email}</p>
      <p>Bio: {user.bio || "No bio available"}</p>
      <p>Account Created: {new Date(user.accountCreationDate).toLocaleDateString()}</p>
      <p>Average Rating: {user.averageRating} ({user.totalRaters} ratings)</p>
      
      <h2>Skills</h2>
      <ul>{user.skills.length ? user.skills.map((skill, index) => <li key={index}>{skill}</li>) : <li>No skills added</li>}</ul>
      
      <h2>Interests</h2>
      <ul>{user.interests.length ? user.interests.map((interest, index) => <li key={index}>{interest}</li>) : <li>No interests added</li>}</ul>
      
      <h2>Social Links</h2>
      <ul>
        {Object.keys(user.socialLinks).length ? (
          Object.entries(user.socialLinks).map(([platform, link], index) => (
            <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{platform}</a></li>
          ))
        ) : (
          <li>No social links available</li>
        )}
      </ul>
      
      <h2>Projects</h2>
      <ul>{user.projects.length ? projects.map((project, index) => 
        <li key={index}  onClick={()=>navigate(`/projectInfo/${project.id}`)}> {project.title} <img src={project.image} alt="project image" style={{ width: "50px", height: "50px", objectFit: "contain" }} /></li>) : <li>No projects added</li>}</ul>

      <h2>Part of Teams</h2>
      <ul>{user.teams.length ? teams.map((project, index) => 
        <li key={index} onClick={()=>navigate(`/projectInfo/${project.id}`)}>{project.title} <img src={project.image} alt="project image" style={{ width: "50px", height: "50px", objectFit: "contain" }} /></li>) : <li>No teams added</li>}</ul>

      <h2>Applied for Projects</h2>
      <ul>{user.applied.length ? applied.map((project, index) => 
        <li key={index} onClick={()=>navigate(`/projectInfo/${project.id}`)} >{project.title} <img src={project.image} alt="project image" style={{ width: "50px", height: "50px", objectFit: "contain" }} /></li>) : <li>No Active Applications</li>}</ul>
      
      <h2>Notifications</h2>
      <ul>{user.notifications.length ? user.notifications.map((note, index) => <li key={index}>{note}</li>) : <li>No notifications</li>}</ul>
      
      <h2>Buddies</h2>
      <ul>{user.buddies.length ? user.buddies.map((buddy, index) => <li key={index} onClick={()=>navigate(`/profile/${buddy.name}`)}>{buddy.name} <img src={buddy.imageUrl} alt="buddy image" style={{ width: "50px", height: "50px", objectFit: "cover" }} /> </li>) : <li>No buddies added</li>}</ul>

      {!alreadyBuddy && userId!=Cookies.get("userName") && <button disabled={sendingRequest} onClick={SendOrWidrawRequest}>{requestSent?"Widraw Friend Request":"Add Friend"}</button>}
    </div>
  );
};


export default ProfilePage;