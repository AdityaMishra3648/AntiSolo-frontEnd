import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../Utility/GlobalStateProvider";
import axios from "axios";
import Dropdown from "./Dropdown";

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
  const [filtertags, setFilterTags] = useState([]);
  const [searchPrefix, setSearchPrefix] = useState("");


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


const tagsArray = [  
  // Programming Languages
  "Java", "Python", "JavaScript", "C#", "C++", "Ruby", "Go", "Swift", "Kotlin", "PHP", "TypeScript", "Rust", "Dart", "Scala", "Perl", "Objective-C", "Haskell", "Lua", "MATLAB", "R",
  // Web Development
  "HTML", "CSS", "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "jQuery", "Bootstrap", "Tailwind CSS", "Sass", "LESS", "Webpack", "Parcel", "Grunt", "Gulp",
  // Backend Frameworks
  "Spring Boot", "Django", "Flask", "Express.js", "NestJS", "Ruby on Rails", "Laravel", "ASP.NET Core", "Koa.js", "Gin", "Fiber", "Phoenix", "Play Framework",
  // Mobile Development
  "React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Xamarin", "Ionic", "Cordova", "NativeScript",
  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "SQLite", "MariaDB", "Oracle Database", "Microsoft SQL Server", "Firebase Realtime Database", "Cassandra", "Redis", "CouchDB", "DynamoDB", "Neo4j", "Elasticsearch",
  // DevOps & CI/CD
  "Docker", "Kubernetes", "Jenkins", "Travis CI", "CircleCI", "GitLab CI", "GitHub Actions", "Ansible", "Puppet", "Chef", "Terraform", "Vagrant", "Bamboo", "TeamCity",
  // Cloud Platforms
  "AWS", "Azure", "Google Cloud Platform (GCP)", "IBM Cloud", "Oracle Cloud", "DigitalOcean", "Heroku", "Netlify", "Vercel", "Firebase", "Linode",
  // Machine Learning & Data Science
  "TensorFlow", "Keras", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "NLTK", "OpenCV", "XGBoost", "LightGBM", "Hugging Face Transformers", "Apache Spark", "Dask", "RapidMiner",
  // Testing Frameworks
  "JUnit", "Mockito", "Selenium", "Cypress", "Jest", "Mocha", "Chai", "RSpec", "PyTest", "Robot Framework", "TestNG", "Cucumber", "Appium",
  // Version Control
  "Git", "SVN", "Mercurial", "Perforce",
  // Project Management & Collaboration
  "JIRA", "Trello", "Asana", "Slack", "Confluence", "Notion", "Basecamp", "Monday.com", "ClickUp",
  // Security
  "OWASP", "Metasploit", "Nmap", "Wireshark", "Burp Suite", "Snort", "Nessus", "Kali Linux",
  // Miscellaneous
  "GraphQL", "REST", "gRPC", "SOAP", "WebSockets", "Microservices", "Serverless", "Progressive Web Apps (PWA)", "Single Page Applications (SPA)", "Jamstack", "Headless CMS", "Contentful", "Strapi", "WordPress", "Drupal", "Magento", "Shopify", "WooCommerce", "Salesforce", "SAP", "Oracle ERP", "Power BI", "Tableau", "QlikView", "Apache Kafka", "RabbitMQ", "ActiveMQ", "ZeroMQ", "Unity", "Unreal Engine", "Blender", "Figma", "Adobe XD", "Sketch", "InVision", "Zeplin", "Canva", "MATLAB", "Simulink", "LabVIEW", "AutoCAD", "SolidWorks", "ANSYS", "MATHEMATICA", "SPSS", "SAS"
]

    const fetchProjectsWithTags = async () => {
      console.log("fetching projects with tags hasmore = "+hasMore+" loading = "+loading);
      if (!hasMore) return;
      if(loading)return;
      setLoading(true);
      console.log("fetching projects with tags"); 
      try {
          // const excludeIds = projects.map(p => p.id); // Collect already loaded project IDs
          // const response = await axios.get("http://localhost:7000/project/randomPaginated", {
          //     params: {
          //         limit: 2,
          //         excludeIds: excludeIds
          //     }
          // });
          const excludeIds = projects.map(p => p.id).join(","); 
          console.log("excludeIds = "+excludeIds);
          const tagsParam = filtertags.map(tag => encodeURIComponent(tag)).join(","); // Convert array to a comma-separated string
            const response = await fetch(`${import.meta.env.VITE_API_URL}/project/RandomPagesWithTags?limit=2&excludeIds=${encodeURIComponent(excludeIds)}&tags=${tagsParam}`, {
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

    }

    const changeTagsArray =async (value) => {
      console.log("selected tag = "+value);
      setHasMore(true);
      setProjects([]);
        let temp = [...filtertags];

        if(temp.includes(value)){
          temp = temp.filter(item => item != value);
          console.log("removed tag = "+value+" from tags array = "+temp);
        }else{
          temp.push(value);
        }

        setFilterTags(temp);
        console.log("tags array = "+filtertags+" projects = "+projects);
      }
      
      useEffect(() => {
        console.log("States updated! filterTags:", filtertags, "projects:", projects, "hasMore:", hasMore);
        fetchProjects();
      }, [filtertags]);
    // Function to fetch random projects
    const fetchProjects = async () => {
      if (!hasMore) return;
      if(loading)return;
      if(filtertags.length>0){
        fetchProjectsWithTags();
        return;
      }
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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/project/randomPaginated?limit=2&excludeIds=${encodeURIComponent(excludeIds)}`, {
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
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/User/userInfo`,{
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
                    // Cookies.set("userName", data.userName, { expires: 7, secure: true, sameSite: "Strict" });
                    // Cookies.set("image", data.profileImageUrl, { expires: 7, secure: true, sameSite: "Strict" });
                    Cookies.set("userName", data.userName, { expires: 7});
                    Cookies.set("image", data.profileImageUrl, { expires: 7});
                  }
              }catch(error){
                  console.error("some error occured Error:", error);
              }

      console.log(Cookies.get("token"));
    }
    // fetchProjects();
    if(Cookies.get("token")!=""){
      const verifyToken = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/login/checkToken/${Cookies.get("token")}`,{
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
  

  // if(guestMode){
  //   return(
  //     <div>
  //     <h1>Welcome Guest User</h1>
  //     <img src="https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png" alt="profile image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
  //     <p>This is the home page of our website.</p>
      
  //     <br />
  //     <br />
  //     <br />

  //     <button onClick={()=>navigate("/")}>Signup Or LogIn</button>
  //     {toastMessage && <div className={`login_toast ${toastType}`}>{toastMessage}</div>}

  //     <br />
  //     <br />
  //     <br />
  //     <br />
  //     <br />
  //     <h2>Random Projects</h2>
  //           <div>
  //               {projects.map((project, index) => (
  //                   <div key={project.id} ref={index === projects.length - 1 ? lastProjectRef : null} 
  //                        style={{ padding: "10px", borderBottom: "1px solid #ddd" }} onClick={()=>navigate(`/projectInfo/${project.id}`)}>
  //                       <img src={project.image} alt="project image" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
  //                       <h3>{project.title}</h3>
  //                       <p>{project.description}</p>
  //                   </div>
  //               ))}
  //           </div>
  //           {loading && <p>Loading more projects...</p>}
  //   </div>
  //   );
  // }

  return (
    <div>
      <h1>Welcome to HomePage {document.cookie.includes("token=")?userName:"Guest"} your token is {Cookies.get("token")}</h1>
      <img src={image==""?"https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png":image} alt="profile image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
      <p>This is the home page of our website.</p>
      
      <br />
      <br />
      <br />
      <button onClick={()=>{guestMode?navigate("/login"):navigate("/postproject")}}>Post a project</button>
      <br />
      <br />
      <button onClick={()=>{guestMode?navigate("/login"):navigate(`/profile/${userName}`)}}>my Profile</button>
      <br />
      <button onClick={logout}>LogOut</button>
      {toastMessage && <div className={`login_toast ${toastType}`}>{toastMessage}</div>}

      <br />
      <input type="text" value={searchPrefix} onChange={(e)=>setSearchPrefix(e.target.value)}/>
      <button onClick={()=>navigate(`/searchuser/${searchPrefix}`)}>search user</button>
      <br />
      <br />
      <button onClick={()=>{guestMode?navigate("/login"):navigate("/notifications")}}>notifications</button>
      <br />
      <br />
      <button onClick={()=>{guestMode?navigate("/login"):navigate("/friendschat")}}>Chat with friends</button>
      <br />
      <br />
      <Dropdown options={tagsArray} onSelect={changeTagsArray} />
      <br />
      <h1>Tags Selected for filter are : </h1>
      <br />
      <div>
      {
       filtertags.map((selectedTag, index) => (
         <div key={selectedTag} onClick={() => changeTagsArray(selectedTag)}>
           {selectedTag}
         </div>
       ))
      }
      </div>
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