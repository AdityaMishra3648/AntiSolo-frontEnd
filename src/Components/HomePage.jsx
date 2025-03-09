import Cookies from "js-cookie";
import react, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../Utility/GlobalStateProvider";
function HomePage() {
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(0);
  const [token,setToken] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [notification, setNotification] = useGlobalState();
  
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
        setToastMessage("");
        setToastType("");
    }, 3000);
};

  useEffect(() => {
    return () => {
      if(notification){
        showToast(notification,"success");
        setNotification("");
      }
      console.log("token stored in cookies");
      // setUsername(Cookies.get("username"));
      setToken(Cookies.get("token"));
      console.log(Cookies.get("token"));
    }
  }, [trigger])

  function savePost(){
    //to write savePost logic here 

    // Updating the state forces useEffect to run
    setTrigger(prev => prev + 1);
  }

  function logout() {
    Cookies.remove("token");
    // Cookies.remove("username");
    // Cookies.remove("password");
    navigate("/");
  }
  

  return (
    <div>
      <h1>Welcome to the Home Page your token is {token}</h1>
      <p>This is the home page of our website.</p>
      <br />
      <br />
      <button onClick={()=>navigate("/postproject")}>Post a project</button>
      <br />
      <br />
      <button onClick={logout}>LogOut</button>
      {toastMessage && <div className={`login_toast ${toastType}`}>{toastMessage}</div>}
    </div>
  );
}
export default HomePage;