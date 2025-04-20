import React, { use, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { toast } from 'sonner';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  
  const [projectReports, setProjectReports] = useState([]);

  const [userReports, setUserReports] = useState([]);

  const [projectPage, setProjectPage] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const handleNavigateToReporter = (report) => {
    // console.log(`Navigating to reporter profile with ID: ${reporterId}`);
    // toast.info(`Navigating to reporter profile with ID: ${reporterId}`);
    // navigate(`/user/${reporterId}`);

  };

  const handleNavigateToReportedUser = (report) => {
    // console.log(`Navigating to reported user profile with ID: ${userId}`);
    // toast.info(`Navigating to reported user profile with ID: ${userId}`);
    // navigate(`/user/${userId}`);
  };

  const handleWarnUser = async (report) => {
    // console.log(`Sending warning email to ${user.email}`);
    // toast.success(`Warning email sent to ${user.email}`);
    
    // if (isProjectReport) {
    //   setProjectReports(projectReports.filter(report => 
    //     !(report.reportedUser.id === user.id && report.projectId === user.projectId)
    //   ));
    // } else {
    //   setUserReports(userReports.filter(report => report.userId !== user.userId));
    // }
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/warnUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get("token")}`
          },
          body: JSON.stringify(report),
        });
    } catch (error) {
      console.error("Error in warning :", error);
    }
  };

  const handleRemoveProject = async (report) => {
    // console.log(`Removing project with ID: ${projectId}`);
    // toast.success(`Project ID ${projectId} has been removed`);
    
    // setProjectReports(projectReports.filter(report => report.id !== reportId));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/deleteProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify(report),
      });
  } catch (error) {
    console.error("Error in warning :", error);
  }
  };

  const handleTerminateProfile = async (report) => {
    // console.log(`Terminating user profile with ID: ${userId}`);
    // toast.success(`User profile ID ${userId} has been terminated`);
    
    // setUserReports(userReports.filter(report => report.id !== reportId));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/deleteUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify(report),
      });
  } catch (error) {
    console.error("Error in warning :", error);
  }
  };

  const loadMoreProjects = async () => {

    if(!hasMoreProjects) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reports?type=0&page=${projectPage}&size=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
      });
      if (!response.ok) {
        console.log("Failed to fetch more project reports");
        setHasMoreProjects(false);
        return;
      }
      const data = await response.json();
      console.log("project reports loaded data = ",data.content);

      if(data.last  ||  data.content.length < 10) {
        setHasMoreProjects(false);
      }
      // setProjectReports([...projectReports, ...data.content]);
      setProjectReports(prevReports => [...prevReports, ...data.content]);
      setProjectPage(prev => prev + 1);
      
    } catch (error) {
      console.error("Error loading more projects:", error);
      
    }

    // setProjectPage(prev => prev + 1);
    // if (projectPage >= 2) {
    //   setHasMoreProjects(false);
    // }
    // toast.info("Loading more project reports...");
  };
  
  const loadMoreUsers = async () => {
    if(!hasMoreProjects) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reports?type=1&page=${projectPage}&size=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
      });
      if (!response.ok) {
        console.log("Failed to fetch more project reports");
        setHasMoreUsers(false);
        return;
      }
      const data = await response.json();
      if(data.last || data.content.length < 10 ) {
        setHasMoreUsers(false);
      }
      // console.log("user reports loaded data = ",data," size = "+data.size);
      setUserReports(prevReports => [...prevReports, ...data.content]);
      setUserPage(prev => prev + 1);

    } catch (error) {
      console.error("Error loading more projects:", error);
      
    }
    // setUserPage(prev => prev + 1);
    // if (userPage >= 2) {
    //   setHasMoreUsers(false);
    // }
    // toast.info("Loading more user reports...");
  };

  useEffect(() => {
    loadMoreProjects();
    loadMoreUsers();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Review and manage reported projects and users</p>
      </header>

      <section className="reports-section">
        <h2>Project Reports</h2>
        <div className="reports-list">
          {projectReports.length === 0 ? (
            <div className="no-reports">No project reports to display</div>
          ) : (
            projectReports.map(report => (
              <div className="report-card" key={report.id}>
                <div className="report-header">
                  <h3 
                    className="reported-item" 
                    onClick={() => navigate('/home/project/' + report.projectId)}
                  >
                    {report.projectId}
                  </h3>
                </div>
                <div className="report-content">
                  <p>{report.message}</p>
                  <p 
                    className="reporter-name" 
                    onClick={() => navigate(`/home/profile/${report.reportFrom}`)}
                  >
                    Reported by: {report.reportFrom}
                  </p>
                </div>
                <div className="report-actions">
                  <button 
                    className="warn-button"
                    onClick={() => handleWarnUser(report)}
                  >
                    Warn User
                  </button>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveProject(report)}
                  >
                    Remove Project
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {hasMoreProjects && (
          <div className="load-more-container">
            <button 
              className="load-more-button"
              onClick={loadMoreProjects}
            >
              Load More Projects
            </button>
          </div>
        )}
      </section>

      <section className="reports-section">
        <h2>User Reports</h2>
        <div className="reports-list">
          {userReports.length === 0 ? (
            <div className="no-reports">No user reports to display</div>
          ) : (
            userReports.map(report => (
              <div className="report-card" key={report.id}>
                <div className="report-header">
                  <h3 
                    className="reported-item" 
                    onClick={() => navigate(`/home/profile/${report.userName}`)}
                  >
                    {report.userName}
                  </h3>
                </div>
                <div className="report-content">
                  <p>{report.message}</p>
                  <p 
                    className="reporter-name" 
                    onClick={() => navigate(`/home/profile/${report.reportFrom}`)}
                  >
                    Reported by: {report.reportFrom}
                  </p>
                </div>
                <div className="report-actions">
                  <button 
                    className="warn-button"
                    onClick={() => handleWarnUser(report)}
                  >
                    Warn User
                  </button>
                  <button 
                    className="terminate-button"
                    onClick={() => handleTerminateProfile(report)}
                  >
                    Terminate Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {hasMoreUsers && (
          <div className="load-more-container">
            <button 
              className="load-more-button"
              onClick={loadMoreUsers}
            >
              Load More Users
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;