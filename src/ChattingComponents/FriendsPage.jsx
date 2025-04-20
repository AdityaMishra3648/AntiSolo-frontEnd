import React, { useState,useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../Components/LoadingPage';

const FriendsPage = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState({});
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
          } catch (err) {
            console.log(err.message);
          }
        };

        fetchUser();
  }, []);

  if(Object.keys(user).length === 0) return <><LoadingPage/></>;
  return (
    <div>
      <h1>Friends Page</h1>
      <h2>Buddies to chat with</h2>
        <ul>{user.buddies.length ? user.buddies.map((buddy, index) =>
         <li key={index} onClick={()=>navigate(`/chat/${buddy.name}`)}>
            {buddy.name}
            <img src={buddy.imageUrl} alt="buddy image" style={{ width: "50px", height: "50px", objectFit: "cover" }} /> </li>)
             : <li>No buddies added</li>}
        </ul>
        {/* <button onClick={()=>navigate("/project")}></button> */}
    </div>
  );
}

export default FriendsPage;