import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../Utility/GlobalStateProvider";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(0);
  const [token,setToken] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [notification, setNotification] = useGlobalState();
  const [userName, setUserName] = useState(""); 
  const [image, setImage] = useState("");
  const [guestMode, setGuestMode] = useState(true);


  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
        setToastMessage("");
        setToastType("");
    }, 3000);
};


  
    // Function to fetch random projects
    const fetchProjects = async () => {
      if (!hasMore) return;
      console.log("fetching projects");
      setLoading(true);
      try {
          // const excludeIds = projects.map(p => p.id); // Collect already loaded project IDs
          // const response = await axios.get("http://localhost:7000/project/randomPaginated", {
          //     params: {
          //         limit: 2,
          //         excludeIds: excludeIds
          //     }
          // });
          const excludeIds = projects.map(p => p.id).join(","); 

            const response = await fetch(`http://localhost:7000/project/randomPaginated?limit=2&excludeIds=${encodeURIComponent(excludeIds)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json(); 
          // console.log("received total "+response.data.length+" projects");
          console.log("received total "+data.length+" projects");
          // if (response.data.length < 2) {
          //   setHasMore(false);
          // }
          if (data.length < 2) {
            setHasMore(false);
          }
          
          // if (response.data.length > 0) {
          if (data.length > 0) {
              // setProjects(prevProjects => [...prevProjects, ...response.data]);
              setProjects(prevProjects => [...prevProjects, ...data]);
          } else {
              setHasMore(false); // Stop fetching when no more projects are available
          }
      } catch (error) {
          console.error("Error fetching projects:", error);
      }
      setLoading(false);
  };

  const lastProjectRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    console.log("lastProjectRef called");
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            fetchProjects();
        }
    });

    if (node) observer.current.observe(node);
};


  useEffect(() => {
    const fetchUserInfo =  async () => {
      if(notification){
        showToast(notification,"success");
        setNotification("");
      }
      console.log("token stored in cookies");
      // setUsername(Cookies.get("username"));

      // if(Cookies.get("token")=="")return;
      if(!document.cookie.includes("token=")){
        return;
      }
      setToken(Cookies.get("token"));
      // console.log("token in cokei from Homepage = "+Cookies.get("token"));
      // console.log("token in cokei from Homepage = "+Cookies.get("token")+" or in state it is =  "+token);
              try{
                  const response = await fetch("http://localhost:7000/User/userInfo",{
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("token")}`
                      },
                  });
                  // console.log("response "+response+" status = "+response.status);
                  if(response.ok){ 
                    const data = await response.json();
                    // console.log("data " +data);
                    // setUserName(data.userName);
                    // setImage(data.profileImageUrl);
                    setUserName(data.userName);
                    setImage(data.profileImageUrl);
                    Cookies.set("userName", data.userName, { expires: 7, secure: true, sameSite: "Strict" });
                    Cookies.set("image", data.profileImageUrl, { expires: 7, secure: true, sameSite: "Strict" });
                  }
              }catch(error){
                  console.error("some error occured Error:", error);
              }

      console.log(Cookies.get("token"));
    }
    fetchProjects();
    if(Cookies.get("token")!=""){
      const verifyToken = async () => {
        try {
          const response = await fetch(`http://localhost:7000/login/checkToken/${Cookies.get("token")}`,{
            method: "GET" });
          if (!response.ok) {
            return false;
          }
          let result  = await response.json();
          if(result==true){
            setGuestMode(false);
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
  }, [trigger])

  function savePost(){
    //to write savePost logic here 

    // Updating the state forces useEffect to run
    setTrigger(prev => prev + 1);
  }

  function logout() {
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("image");
    // Cookies.remove("username");
    // Cookies.remove("password");
    navigate("/");
  }
  

  if(guestMode){
    return(
      <div>
      <h1>Welcome Guest User</h1>
      <img src="https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png" alt="profile image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
      <p>This is the home page of our website.</p>
      
      <br />
      <br />
      <br />

      <button onClick={()=>navigate("/")}>Signup Or LogIn</button>
      {toastMessage && <div className={`login_toast ${toastType}`}>{toastMessage}</div>}

      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>Random Projects</h2>
            <div>
                {projects.map((project, index) => (
                    <div key={project.id} ref={index === projects.length - 1 ? lastProjectRef : null} 
                         style={{ padding: "10px", borderBottom: "1px solid #ddd" }} onClick={()=>navigate(`/projectInfo/${project.id}`)}>
                        <img src={project.image} alt="project image" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
            {loading && <p>Loading more projects...</p>}
    </div>
    );
  }

  return (
    <div>
      <h1>Welcome to HomePage {document.cookie.includes("token=")?userName:"Guest"} your token is {token}</h1>
      <img src={image==""?"https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png":image} alt="profile image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
      <p>This is the home page of our website.</p>
      
      <br />
      <br />
      <button onClick={()=>navigate("/postproject")}>Post a project</button>
      <br />
      <br />
      <button onClick={()=>navigate(`/profile/${userName}`)}>my Profile</button>
      <br />
      <button onClick={logout}>LogOut</button>
      {toastMessage && <div className={`login_toast ${toastType}`}>{toastMessage}</div>}

      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>Random Projects</h2>
            <div>
                {projects.map((project, index) => (
                    <div key={project.id} ref={index === projects.length - 1 ? lastProjectRef : null} 
                         style={{ padding: "10px", borderBottom: "1px solid #ddd" }} onClick={()=>navigate(`/projectInfo/${project.id}`)}>
                        <img src={project.image} alt="project image" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
            {loading && <p>Loading more projects...</p>}
    </div>
  );
}
export default HomePage;