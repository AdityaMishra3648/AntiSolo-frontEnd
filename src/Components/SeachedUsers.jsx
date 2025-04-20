import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../Utility/GlobalStateProvider";
import axios from "axios";
import Dropdown from "./Dropdown";
import { useParams } from "react-router-dom";


const SearchedUsers = () =>{

    const navigate = useNavigate();
    const { prefix } = useParams();

    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log("useEffect called with prefix = "+prefix);
        const fetchUsers = async () => {
            console.log("fetch users called with prefix = "+prefix);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login/searchUser/${prefix}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log(data);
            setUsers(data);
        };
        fetchUsers();
    },[prefix]);
    return (
        <div className="friends-page">
            {/* <h1>Users</h1>
            <div>
                {users.map((user) => (
                    <div key={user.userName} onClick={() => navigate(`/profile/${user.userName}`)}>
                        <h3>{user.userName}</h3>
                        <h3>{user.email}</h3>
                    </div>
                ))}
            </div> */}
            <div className="friends-list">
            {users.map((user) => (
          <div key={user.userName} className="friend-card">
            <div className="friend-info" onClick={()=>navigate(`/home/profile/${user.userName}`)}>
              <div className="friend-image-container">
                <img src={user.profileImageUrl} alt={user.userName} className="friend-image" />
              </div>
              <h3 className="friend-username1">{user.userName}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}

export default SearchedUsers;