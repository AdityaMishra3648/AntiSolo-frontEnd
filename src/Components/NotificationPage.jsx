import React, { useEffect,useState } from "react";
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";

const NotificationPage = () => {
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notification?page=${page}&size=2`, {
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
            navigate(`/profile/${notification.userName}`);
        }else if(notification.type == 2){
            navigate(`/projectInfo/${notification.projectId}`);       
        }
    }

    return (
        <>
        <h1>Hiii guys</h1>
        {
            notifications.map((notification,index) => (
                <div onClick={()=>notificationClickHandler(notification)} key={index}>
                    <h3>{notification.type}</h3>
                    <p>{notification.message}</p>
                </div>
            ))
        }
        <button onClick={fetchNextPage} disabled={loading}> .. &darr; ..</button>
        </>
      );
};

export default NotificationPage;