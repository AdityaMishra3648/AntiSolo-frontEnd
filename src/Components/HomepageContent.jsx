import { Link,useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, Upload, LogOut, Filter, Home } from 'lucide-react';
 // Import your CSS file for styling
 import './HomePageCompleted.css';
 import Cookies from "js-cookie";
 import React, { useState, useEffect, useRef } from "react";
//  import {  } from "react-router-dom";
 import { useGlobalState } from "../Utility/GlobalStateProvider";
 import axios from "axios";


const HomepageContent = () => {
  // Sample user data

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
  

  const [isGuest, setIsGuest] = useState(false);
  const userData = {
    name: isGuest ? 'Guest' : 'John Doe',
    profileImage: isGuest 
      ? "https://ohsobserver.com/wp-content/uploads/2022/12/Guest-user.png" 
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcauUs8R0kv2QxC66jCMgDWM1P4OVSDK7KsQnsDPGewdmNzgN0huSYTCHzhqkAGNPxV3o&usqp=CAU"
  };

  // Sample projects data
  // const projects = [
  //   {
  //     id: 1,
  //     title: "AI Powered Task Manager",
  //     domain: "Web Application",
  //     image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  //     teamSize: 8,
  //     teamPicked: 5,
  //     status: "Actively Recruiting",
  //     technologies: ["React", "Node.js", "MongoDB", "Express", "Python", "TensorFlow", "AWS", "Docker", "Redux", "TypeScript"]
  //   },
  //   {
  //     id: 2,
  //     title: "Mobile Game Development",
  //     domain: "Game Development",
  //     image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  //     teamSize: 6,
  //     teamPicked: 3,
  //     status: "Working",
  //     technologies: ["Unity", "C#", "Blender", "Photoshop", "Firebase", "GitLab", "3D Modeling"]
  //   },
  //   {
  //     id: 3,
  //     title: "E-Commerce Platform",
  //     domain: "Web Development",
  //     image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  //     teamSize: 5,
  //     teamPicked: 4,
  //     status: "Actively Recruiting",
  //     technologies: ["Vue.js", "Django", "PostgreSQL", "AWS", "Redis", "Stripe API", "Docker"]
  //   },
  //   {
  //     id: 4,
  //     title: "Smart Home IoT System",
  //     domain: "IoT",
  //     image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  //     teamSize: 7,
  //     teamPicked: 2,
  //     status: "Working",
  //     technologies: ["Arduino", "Raspberry Pi", "Python", "MQTT", "React Native", "Node.js", "AWS IoT"]
  //   },
  //   {
  //     id: 5,
  //     title: "AR Fitness App",
  //     domain: "Mobile App",
  //     image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  //     teamSize: 4,
  //     teamPicked: 2,
  //     status: "Actively Recruiting",
  //     technologies: ["Swift", "ARKit", "Firebase", "Core ML", "UI Kit", "HealthKit"]
  //   },
  //   {
  //     id: 6,
  //     title: "Blockchain Voting System",
  //     domain: "Blockchain",
  //     image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  //     teamSize: 6,
  //     teamPicked: 1,
  //     status: "Actively Recruiting",
  //     technologies: ["Solidity", "Ethereum", "Web3.js", "React", "Node.js", "MongoDB"]
  //   }
  // ];

  // // Sample technologies for filter
  const allTechnologies = [
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
  ].slice().sort();;

  // State for filter functionality
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  
  // State for mobile search bar
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Toggle filter dropdown
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Add technology to filter
  const addTechnology = (tech) => {
    if (!selectedTechnologies.includes(tech)) {
      setSelectedTechnologies([...selectedTechnologies, tech]);
      setHasMore(true);
      setProjects([]);
    }
    setIsFilterOpen(false);
  };

  // Remove technology from filter
  const removeTechnology = (tech) => {
    setHasMore(true);
    setProjects([]);
    setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
  };

  
  const fetchProjectsWithTags = async () => {


    // console.log("fetching projects with tags hasmore = "+hasMore+" loading = "+loading);
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
        const tagsParam = selectedTechnologies.map(tag => encodeURIComponent(tag)).join(","); // Convert array to a comma-separated string
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
  
  const fetchProjects = async () => {
    if (!hasMore) return;
    if(loading)return;
    if(selectedTechnologies.length>0){
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

          const response = await fetch(`${import.meta.env.VITE_API_URL}/project/randomPaginated?limit=8&excludeIds=${encodeURIComponent(excludeIds)}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          });
          const data = await response.json(); 
        // console.log("received total "+response.data.length+" projects");
        // console.log("received total "+data.length+" projects");
        // if (response.data.length < 2) {
        //   setHasMore(false);
        // }
        if (data.length < 8) {
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
      useEffect(() => {
        console.log("States updated! filterTags:", selectedTechnologies, "projects:", projects, "hasMore:", hasMore);
        fetchProjects();
      }, [selectedTechnologies]);



  // Clear all selected technologies
  const clearAllTechnologies = () => {
    setSelectedTechnologies([]);
    setHasMore(true);
    setProjects([]);
  };

  // useEffect(() => {
  //   const fetchUserInfo =  async () => {
  //     if(notification){
  //       showToast(notification,"success");
  //       setNotification("");
  //     }
  //     console.log("token stored in cookies");
  //     // setUsername(Cookies.get("username"));

  //     // if(Cookies.get("token")=="")return;
  //     if(!document.cookie.includes("token=")){
  //       return;
  //     }
  //     setToken(Cookies.get("token"));
  //     // console.log("token in cokei from Homepage = "+Cookies.get("token"));
  //     // console.log("token in cokei from Homepage = "+Cookies.get("token")+" or in state it is =  "+token);
  //             try{
  //                 const response = await fetch("http://localhost:7000/User/userInfo",{
  //                     method: "GET",
  //                     headers: {
  //                       "Content-Type": "application/json",
  //                       "Authorization": `Bearer ${Cookies.get("token")}`
  //                     },
  //                 });
  //                 // console.log("response "+response+" status = "+response.status);
  //                 if(response.ok){ 
  //                   const data = await response.json();
  //                   // console.log("data " +data);
  //                   // setUserName(data.userName);
  //                   // setImage(data.profileImageUrl);
  //                   // setUserName(data.userName);
  //                   // setImage(data.profileImageUrl);
  //                   Cookies.set("userName", data.userName, { expires: 7, secure: true, sameSite: "Strict" });
  //                   Cookies.set("image", data.profileImageUrl, { expires: 7, secure: true, sameSite: "Strict" });
  //                 }
  //             }catch(error){
  //                 console.error("some error occured Error:", error);
  //             }

  //     console.log(Cookies.get("token"));
  //   }
  //   // fetchProjects();
  //   if(Cookies.get("token")!=""){
  //     const verifyToken = async () => {
  //       try {
  //         const response = await fetch(`http://localhost:7000/login/checkToken/${Cookies.get("token")}`,{
  //           method: "GET" });
  //         if (!response.ok) {
  //           return false;
  //         }
  //         let result  = await response.json();
  //         if(result==true){
  //           setGuestMode(false);
  //           fetchUserInfo();
  //         }else{
  //           Cookies.remove("token");
  //           Cookies.remove("userName");
  //           Cookies.remove("image");
  //         }
  //       } catch (error) {
  //         return false;
  //       }
  //     }
  //     verifyToken();
  //   }
  // }, [trigger])
  // Filter projects based on selected technologies

  function getDaysAgo(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
  
    // Calculate the difference in time (milliseconds)
    const timeDiff = currentDate - createdDate;
  
    // Convert milliseconds to days
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
    return daysAgo;
  }

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

  // const filteredProjects = selectedTechnologies.length > 0
  //   ? projects.filter(project => 
  //       project.technologies.some(tech => 
  //         selectedTechnologies.includes(tech)
  //       )
  //     )
  //   : projects;

  // Handle login redirect for guest users
  const handleGuestAction = (e) => {
    if (isGuest) {
      e.preventDefault();
      alert("Please log in to access this feature");
      // In a real app, redirect to login page
      // window.location.href = "/login";
    }
  };



  
  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Infinite scroll loading state
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Want to join new projects to work on and enhance your skills?</h1>
            <p>Here are some relevant projects compiled for you!</p>
          </div>
          <div className="hero-image">
            <img 
              // src="https://mir-s3-cdn-cf.behance.net/project_modules/source/06f21a161921919.63cd7887d0a70.gif" 
              src="https://res.cloudinary.com/dx7bcuxjn/image/upload/v1745088126/06f21a161921919.63cd7887d0a70_beyvti.gif" 
              alt="Geek coding"
            />
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="filter-dropdown">
          <button className="filter-btn" onClick={toggleFilter}>
            <Filter size={18} />
            Filter by Technology
          </button>
          
          {isFilterOpen && (
            <div className="dropdown-content">
              {allTechnologies.map((tech, index) => (
                <div 
                  key={index} 
                  className={`dropdown-item ${selectedTechnologies.includes(tech) ? 'selected' : ''}`}
                  onClick={() => addTechnology(tech)}
                >
                  {tech}
                  {selectedTechnologies.includes(tech) && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedTechnologies.length > 0 && (
          <div className="selected-technologies">
            {selectedTechnologies.map((tech, index) => (
              <div key={index} className="selected-tech-tag">
                {tech}
                <button onClick={() => removeTechnology(tech)}>×</button>
              </div>
            ))}
            
            <button className="clear-all-btn" onClick={clearAllTechnologies}>
              Clear All
            </button>
          </div>
        )}
      </section>
    
      {/* Projects Grid */}
      <section className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project,index) => (
            <div key={project.id} className="project-card" ref={index === projects.length - 1 ? lastProjectRef : null}>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-title-overlay">
                  <h3>{project.title}</h3>
                </div>
              </div>
              
              <div className="project-details">
                <div className="project-owner">
                  <span>By {project.author}</span>
                </div>
                
                <div className="project-domain">
                  <span>{project.domain}</span>
                </div>
                
                <div className="project-tech-tags">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="more-tech">+{project.technologies.length - 3} more</span>
                  )}
                </div>
                
                <div className="project-footer">
                  <div className="team-info">
                    <div className="team-members">
                      <div className="member-avatars">
                      {project.members.slice(0, 3).map((item, index) => (
                        <img
                            key={index}
                            src={item.imageUrl}
                            alt=""
                            className="avatar"
                            // style={{ zIndex: project.teamMembers.length - index }}
                          />
                        ))}
                        {project.members.length<1 && <div className="avatar"></div>}
                        {project.members.length<2 && <div className="avatar"></div>}
                        {project.members.length<3 && <div className="avatar"></div>}
                      </div>
                      <span>{project.filled}/{project.teamSize} Members</span>
                    </div>
                    <span className="days-ago">{getDaysAgo(project.createdAt)} days ago</span>
                  </div>
                  
                  <div className="project-actions">
                    <span className={`status-badge ${project.status === "Working" ? "working" : "recruiting"}`}>
                      {project.status}
                    </span>
                    <button className="view-project-btn" onClick={()=>navigate(`/home/project/${project.id}`)}>View Project</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <h2>No projects match your filter criteria</h2>
            <p>Try selecting different technologies or clear all filters to see all available projects.</p>
            <button className="clear-filters-btn" onClick={clearAllTechnologies}>Clear All Filters</button>
          </div>
        )}
      </section>

      {/* Loading Indicator for Infinite Scroll */}
      {loading && (
        <div className="loading-container">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default HomepageContent;