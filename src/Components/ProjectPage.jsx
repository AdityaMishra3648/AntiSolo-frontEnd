import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(false);
  const [applyInProgress, setApplyInProgress] = useState(false);
 const [appliedAlready, setAppliedAlready] = useState(false);
  const [toggle, setToggle] = useState(0);
  const ApplyToggle = async () => {
    setApplyInProgress(true);
    try {
      const response = await fetch(`http://localhost:7000/project/ApplyToggleInProject/${projectId}`, {
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
      const data = await response.json();
      console.log("applied for the project "+data);
      setApplyInProgress(false);
      setToggle(toggle+1);
    } catch (err) {
      console.log("failed to apply for the project  with error "+err.message);
      setApplyInProgress(false);
    }
  }

  const AcceptApplicant = async (username) => {
    setApplyInProgress(true);
    console.log("accepting applicant for user = "+username);
    try {
      console.log("got inside try catch block");
        const response = await fetch(`http://localhost:7000/project/AcceptApplicant?projectId=${projectId}&applicantUsername=${username}`,{
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:7000/project/getProject/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data "+response.status);
        }
        const data = await response.json();
        setProject(data);
        if(Cookies.get("userName")==data.author){
          setOwner(true);
        }
        for(let app of data.applicants){
          console.log(app.name)
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

  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>Loading...</p>;

  return (
    <div>
        <img src={project.image} alt={project.title} style={{ width: "200px", height: "200px", objectFit: "contain" }} />
      <h1>{project.title}</h1>
      <p onClick={()=>navigate(`/profile/${project.author}`)}>Author: {project.author}</p>
      <img src={project.authorImage} alt={project.author} style={{ width: "50px", height: "50px", objectFit: "cover" }} onClick={()=>navigate(`/profile/${project.author}`)} />
      <p>Domain: {project.domain}</p>
      <p>Description: {project.description}</p>
      <p>Team Size: {project.teamSize}</p>
      <p>Filled: {project.filled}</p>
      <p>Status: {project.status}</p>
      <p>Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
      
      <h2>Technologies</h2>
      <ul>{project.technologies.map((tech, index) => <li key={index}>{tech}</li>)}</ul>
      
      <h2>Tags</h2>
      <ul>{Array.from(project.tags).map((tag, index) => <li key={index}>{tag}</li>)}</ul>
      
      <h2>Members</h2>
      <ul>
        {project.members.map((member, index) => (
          <li key={index} onClick={()=>navigate(`/profile/${member.name}`)}>
            {member.name} <img src={member.imageUrl} alt={member.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
          </li>
        ))}
      </ul>
      
      <h2>Applicants</h2>
      <ul>
        {project.applicants.map((applicant, index) => (
          <li key={index} >
            <div onClick={()=>navigate(`/profile/${applicant.name}`)}>{applicant.name} <img src={applicant.imageUrl} alt={applicant.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} /> </div>
            <button style={{ display: owner ? "block" : "none" }} disabled={applyInProgress} onClick={()=>AcceptApplicant(applicant.name)}>Accept</button>
          </li>
        ))}
      </ul>
    <br />
    <br />
         <button style={{ display: owner ? "none" : "block" }}  disabled={applyInProgress} onClick={ApplyToggle}>{appliedAlready?"Widraw":"Apply"}</button> 
    <br />
    <br />

    </div>
  );
};

export default ProjectPage;
