import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Project.css';
import Cookies from "js-cookie";
import { set } from 'react-hook-form';
import LoadingPage from '../Components/LoadingPage';

const Project = () => {
  const navigate = useNavigate();
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState(false);
    const [applyInProgress, setApplyInProgress] = useState(false);
   const [appliedAlready, setAppliedAlready] = useState(false);
    const [toggle, setToggle] = useState(0);
    const [member, setMember] = useState(false);


    
      const ApplyToggle = async () => {
        if(!Cookies.get("userName"))navigate("/login");
        setApplyInProgress(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/project/ApplyToggleInProject/${projectId}`, {
                                  method: "POST",
                                 headers: {
                                   "Content-Type": "application/json",
                                   "Authorization": `Bearer ${Cookies.get("token")}`
                                 },
          });
          
          if (!response.ok) {
            console.log("failed to apply for the project "+response.status);
            setApplyInProgress(false);
            return;
          }
          if(!appliedAlready){
            setShowSuccessMessage(true);
            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 3000);
          }
          const data = await response.json();
          console.log("applied for the project "+data);
          setApplyInProgress(false);
          setToggle(toggle+1);
        } catch (err) {
          console.log("failed to apply for the project  with error "+err.message);
          setApplyInProgress(false);
        }
      }
    
      // const reportProject = async () =>{
      //   try {
      //     const response = await fetch(`http://localhost:7000/project/reportProject/${projectId}`, {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         "Authorization": `Bearer ${Cookies.get("token")}`
      //       },
      //     });
      //     if(response.ok){
      //       // const data = await response.json();
      //       console.log("reported successfully "+response.status);
      //     }else console.log("failed to report the project "+response.status);
      //   } catch (error) {
      //     console.error("some error occured Error:", error.message);
      //   }
      // }
    
      const AcceptApplicant = async (username) => {
        setApplyInProgress(true);
        console.log("accepting applicant for user = "+username);
        try {
          console.log("got inside try catch block");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/project/AcceptApplicant?projectId=${projectId}&applicantUsername=${username}`,{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${Cookies.get("token")}`
                },
            });
            console.log("response "+response);
            if (!response.ok) {
               console.log("Failed to fetch project data "+response.status);
            }
            let data = await response.json();
            console.log("saved successfully "+data);
            setToggle(toggle+1);
            setApplyInProgress(false);
        } catch (error) {
          console.error("some error occured Error:", error.message);
          setApplyInProgress(false);
        }
      }
    
      function isEmptyObject(obj) {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          !Array.isArray(obj) &&
          Object.keys(obj).length === 0
        );
      }

      useEffect(() => {
        const fetchProject = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getProject/${projectId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch project data "+response.status);
            }
            const data = await response.json();
            if(!isEmptyObject(data)){ 
              console.log("project data "+data);
              setProject(data);
            }
            if(Cookies.get("userName")==data.author){
              setOwner(true);
            }
            for(let app of data.members){
              // console.log(app.name)
              if(app.name==Cookies.get("userName")){
                setMember(true);
              } 
            }
            for(let app of data.members){
              // console.log(app.name)
              if(app.name==Cookies.get("userName")){
                setMember(true);
                return;
              } 
            }
            for(let app of data.applicants){
              // console.log(app.name)
              if(app.name==Cookies.get("userName")){
                setAppliedAlready(true);
                return;
              } 
            }
            setAppliedAlready(false);
          } catch (err) {
            setError(err.message);
          }
        };
    
        fetchProject();
      }, [projectId,toggle]);
    
      const handleReport = async (e) => {
        e.preventDefault();
        if(!Cookies.get("userName")){
          alert("Please login to report a project.");
          return;
        }
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/project/reportProject`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("token")}`
            },body: JSON.stringify({
              projectId: projectId,
              message : reportReason,
              reportFrom : Cookies.get("userName")
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to report project "+response.status);
          }
          const data = await response.json();
          console.log(data.message);
        } catch (err) {
          console.error(err.message);
        }
        setShowReportForm(false);
        setReportReason('');
      }
    
    

  // Sample project data with additional members
  // const project = {
  //   id: 1,
  //   title: "AI-Powered Chat Application",
  //   description: "Building a real-time chat application with AI capabilities that can translate messages, summarize conversations, and suggest responses. The application will be built using React for the frontend and Node.js for the backend. We're looking for team members passionate about AI and web development.",
  //   image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  //   teamSize: 5,
  //   currentMembers: 5,
  //   domain: "Web Development & AI",
  //   tags: ["ReactJS", "Node.js", "AI", "WebSockets", "MongoDB"],
  //   technologies: "React, Node.js, Socket.io, MongoDB, TensorFlow.js, Express, Redis, GraphQL, OAuth, JWT, WebRTC, Firebase...",
  //   postDate: "2025-03-15",
  //   status: "Recruiting", // or "Working"
  //   author: {
  //     id: 101,
  //     name: "Alex Chen",
  //     profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  //   },
  //   members: [
  //     {
  //       id: 101,
  //       name: "Alex Chen",
  //       profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  //     },
  //     {
  //       id: 102,
  //       name: "Maya Rodriguez",
  //       profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
  //     },
  //     {
  //       id: 103,
  //       name: "James Wilson",
  //       profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
  //     },
  //     {
  //       id: 104,
  //       name: "Sophia Kim",
  //       profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  //     },
  //     {
  //       id: 105,
  //       name: "Raj Patel",
  //       profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  //     }
  //   ],
  //   applicants: [
  //     {
  //       id: 201,
  //       name: "Kai Johnson",
  //       profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  //     },
  //     {
  //       id: 202,
  //       name: "Zoe Williams",
  //       profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
  //     },
  //     {
  //       id: 203,
  //       name: "Tyler Smith",
  //       profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  //     }
  //   ]
  // };

  const [isApplied, setIsApplied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const is_author = true; // For demo purposes, set to true to show delete button
  
  const handleApply = () => {
    setIsApplied(true);
    setShowSuccessMessage(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // const handleReport = (e) => {
  //   e.preventDefault();
  //   setShowReportForm(false);
  //   alert(`Project reported: ${reportReason}`);
  //   setReportReason('');
  // };

  const handleDeleteProject = () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      alert("Project deleted successfully!");
      // Here you would typically redirect to projects list or home page
    }
  };

  // Animation for the thinking emoji
  useEffect(() => {
    
    const interval = setInterval(() => {
      const thinkingEmoji = document.querySelector('.Project_Page_Class-thinking-emoji');
      // const dot = document.querySelector('.Project_Page_Class-status-dot');
      if (thinkingEmoji) {
        thinkingEmoji.classList.toggle('pulse');
      }
      // if (dot) {
      //   dot.classList.toggle('pulse');
      // }
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!project || project==null)   return <><LoadingPage/></>;



  return (
    <div className="Project_Page_Class-project-container">
      <div className="Project_Page_Class-project-content">
        <div className="Project_Page_Class-project-header">
          <div className="Project_Page_Class-project-image-container">
            <img src={project.image} alt={project.title} className="Project_Page_Class-project-image" />
          </div>
          <div className="Project_Page_Class-project-info">
            <h1 className="Project_Page_Class-project-title">{project.title}</h1>
            {project.author==Cookies.get("userName") && (
              <button className="edit-button" onClick={()=>navigate(`/home/EditProject`, {
                state: {
                  p:project
                },
                },)}>
                <span className="edit-icon">✏️</span>
                Edit
              </button>
            )}
            <div className="Project_Page_Class-project-meta">
              <div className="Project_Page_Class-project-author">
                <img src={project.authorImage} alt={project.author} className="Project_Page_Class-author-image" />
                <span>by <Link to={`/home/profile/${project.author}`} className="Project_Page_Class-author-name">{project.author}</Link></span>
              </div>
              <div className="Project_Page_Class-project-date">
                <span className="Project_Page_Class-date-icon">📅</span>
                <span>Posted on {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="Project_Page_Class-project-status">
              <div className={`Project_Page_Class-status-indicator ${project.status.toLowerCase()}`}>
                <span className="Project_Page_Class-status-dot"></span>
                {project.status}
              </div>
            </div>
          </div>
        </div>

        <div className="Project_Page_Class-project-details">
          <div className="Project_Page_Class-project-stats">
            <div className="Project_Page_Class-stat-item Project_Page_Class-domain">
              <span className="Project_Page_Class-stat-icon">🌐</span>
              <div>
                <h3>Domain</h3>
                <p>{project.domain}</p>
              </div>
            </div>
            <div className="Project_Page_Class-stat-item Project_Page_Class-team-size">
              <span className="Project_Page_Class-stat-icon">👥</span>
              <div>
                <h3>Team Size</h3>
                <p>{project.filled} / {project.teamSize}</p>
              </div>
            </div>
            <div className="Project_Page_Class-stat-item Project_Page_Class-technologies-preview">
              <span className="Project_Page_Class-stat-icon">💻</span>
              <div>
                <h3>Technologies</h3>
                {project.technologies.length>0 && <span>{project.technologies[0]}</span>}
                {project.technologies.length>1 && <span>, {project.technologies[1]}</span>}
                {project.technologies.length>2 && <span>, {project.technologies[2]}...</span>}
              </div>
            </div>
          </div>

          <div className="Project_Page_Class-project-description-section">
            <h2 className="Project_Page_Class-section-title">Project Description</h2>
            <p className="Project_Page_Class-project-description">{project.description}</p>
          </div>

          <div className="Project_Page_Class-project-technologies-section">
            <h2 className="Project_Page_Class-section-title">Technologies Used</h2>
            <div className="Project_Page_Class-project-technologies">
              {project.technologies.map((tech, index) => (
                <span key={index} className="Project_Page_Class-tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="Project_Page_Class-project-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="Project_Page_Class-tag">{tag}</span>
            ))}
          </div>

          <div className="Project_Page_Class-action-buttons">
            <button 
              className={`Project_Page_Class-apply-button ${appliedAlready ? 'applied' : ''}`} 
              style={{ display: (owner || member) ? "none" : "block" }}  disabled={applyInProgress} onClick={ApplyToggle}
            >
              {applyInProgress?"Loading":(appliedAlready ? 'Applied ✓' : 'Apply to Join')}
            </button>
            { member && <button className="Project_Page_Class-chat-button" onClick={() => navigate(`/group/${project.id}`)} >
              <span className="Project_Page_Class-chat-icon">💬</span>
              Project Chat
            </button> }
            <button className="Project_Page_Class-report-button" onClick={() => setShowReportForm(true)}>
              Report Project
            </button>
            {/* {project.author==Cookies.get("userName") && (
              <button className="Project_Page_Class-delete-button" onClick={handleDeleteProject}>
                <span className="Project_Page_Class-delete-icon">🗑️</span>
                Delete Project
              </button>
            )} */}
          </div>

          {showSuccessMessage && (
            <div className="Project_Page_Class-success-message">
              <span className="Project_Page_Class-success-icon">✓</span>
              Application sent successfully! The project owner will review your application.
            </div>
          )}

          {showReportForm && (
            <div className="Project_Page_Class-report-overlay">
              <div className="Project_Page_Class-report-form">
                <h3>Report Project</h3>
                <p>Please tell us why you're reporting this project:</p>
                <form onSubmit={handleReport}>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe the issue..."
                    required
                  ></textarea>
                  <div className="Project_Page_Class-report-actions">
                    <button type="submit" className="Project_Page_Class-submit-report" >Submit Report</button>
                    <button type="button" className="Project_Page_Class-cancel-report" onClick={() => setShowReportForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="Project_Page_Class-project-team">
            <h2 className="Project_Page_Class-section-title">
              <span className="Project_Page_Class-thinking-emoji">🤔</span> 
              <span className="Project_Page_Class-team-title-text">Project Team</span>
            </h2>
            <div className="Project_Page_Class-team-section">
              <div className="Project_Page_Class-current-members">
                <h3>Current Members</h3>
                <div className="Project_Page_Class-members-list">
                  {project.members.map(member => (
                    <Link key={member.name} to={`/home/profile/${member.name}`} className="Project_Page_Class-member-item">
                      <img src={member.imageUrl} alt={member.name} className="Project_Page_Class-member-image" />
                      <span className="Project_Page_Class-member-name">{member.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="Project_Page_Class-applicants">
                <h3>Applicants</h3>
                <div className="Project_Page_Class-applicants-list">
                  {project.applicants.map(applicant => (
                    <div className="applicants-list">
                    {/* // <div className="Project_Page_Class-applicants-list"> */}

                    <Link key={applicant.name} to={`/home/profile/${applicant.name}`} className="Project_Page_Class-applicant-item">
                      <img src={applicant.imageUrl} alt={applicant.name} className="Project_Page_Class-applicant-image" />
                      <span className="Project_Page_Class-applicant-name">{applicant.name}</span>
                    </Link>
                    {project.author==Cookies.get("userName") && (
                        <button 
                          className="accept-applicant-button" 
                          onClick={() => AcceptApplicant(applicant.name)}
                          disabled={applyInProgress}
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
