import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EditProject.css';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

const EditProject = () => {

  const location = useLocation();
  const p = location.state?.p;
  const navigate = useNavigate();
  
  // Technology options
  const technologyArray = [
    "Java", "Python", "JavaScript", "C#", "C++", "Ruby", "Go", "Swift", "Kotlin", "PHP", "TypeScript", "Rust", "Dart",
            // Front-End Frameworks and Libraries
            "React", "Angular", "Vue.js", "Svelte", "jQuery", "Bootstrap", "Tailwind CSS", "Foundation",
            // Back-End Frameworks and Libraries
            "Node.js", "Express.js", "Django", "Flask", "Ruby on Rails", "Spring Boot", "ASP.NET Core", "Laravel", "Symfony",
            // Mobile Development
            "React Native", "Flutter", "SwiftUI", "Kotlin Multiplatform Mobile", "Xamarin", "Ionic",
            // Databases
            "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase", "Oracle Database", "Microsoft SQL Server", "Redis", "Cassandra",
            // DevOps and CI/CD Tools
            "Docker", "Kubernetes", "Jenkins", "Travis CI", "CircleCI", "GitHub Actions", "GitLab CI", "Terraform", "Ansible", "Puppet",
            // Cloud Platforms
            "Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", "IBM Cloud", "Oracle Cloud", "DigitalOcean", "Heroku", "Netlify", "Vercel",
            // Machine Learning and Data Science
            "TensorFlow", "PyTorch", "Keras", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "NLTK", "OpenCV",
            // Testing Frameworks
            "JUnit", "Selenium", "Cypress", "Mocha", "Jest", "RSpec",
            // Package Managers
            "npm", "Yarn", "pip", "Composer", "NuGet",
            // Version Control
            "Git", "Subversion (SVN)", "Mercurial",
            // APIs and Protocols
            "GraphQL", "REST", "gRPC", "SOAP",
            // Content Management Systems (CMS)
            "WordPress", "Drupal", "Joomla", "Magento", "Shopify",
            // Miscellaneous
            "Webpack", "Babel", "ESLint", "Prettier", "Gulp", "Grunt", "Three.js", "D3.js"
  ].slice().sort();

  // Tag options
  const tagsArray = [
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
  ].slice().sort();


  // Sample project data for initial state
  const initialProject = {
    id: 1,
    title: "AI-Powered Chat Application",
    description: "Building a real-time chat application with AI capabilities that can translate messages, summarize conversations, and suggest responses. The application will be built using React for the frontend and Node.js for the backend. We're looking for team members passionate about AI and web development.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    teamSize: 5,
    currentMembers: 5,
    domain: "Web Development & AI",
    tags: ["ReactJS", "Node.js", "AI", "WebSockets", "MongoDB"],
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "TensorFlow.js", "Express", "Redis", "GraphQL", "OAuth", "JWT", "WebRTC", "Firebase"],
    postDate: "2025-03-15",
    status: "Recruiting", // or "Working"
    author: {
      id: 101,
      name: "Alex Chen",
      profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    members: [
      {
        id: 101,
        name: "Alex Chen",
        profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
      },
      {
        id: 102,
        name: "Maya Rodriguez",
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
      },
      {
        id: 103,
        name: "James Wilson",
        profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
      },
      {
        id: 104,
        name: "Sophia Kim",
        profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
      },
      {
        id: 105,
        name: "Raj Patel",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      },
      {
        id: 106,
        name: "Emma Thompson",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      },
      {
        id: 107,
        name: "David Johnson",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
      },
      {
        id: 108,
        name: "Olivia Martinez",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    ],
    applicants: [
      {
        id: 201,
        name: "Kai Johnson",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      },
      {
        id: 202,
        name: "Zoe Williams",
        profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
      },
      {
        id: 203,
        name: "Tyler Smith",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      }
    ]
  };

  // State for form fields
  const [project, setProject] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [newTech, setNewTech] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showFormError, setShowFormError] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle team size changes
  const handleTeamSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (newSize >= project.filled) {
      setProject(prev => ({
        ...prev,
        teamSize: newSize
      }));
    } else {
      alert("Team size cannot be less than current members count!");
    }
  };

  // Toggle project status
  const toggleStatus = () => {
    setProject(prev => ({
      ...prev,
      status: prev.status === "Recruiting" ? "Working" : "Recruiting"
    }));
  };

  // Add new tag
  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() !== '' && !project.tags.includes(newTag.trim())) {
      setProject(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');

      // Add animation to the latest tag
      setTimeout(() => {
        const tags = document.querySelectorAll('.edit-tag');
        const newTagElement = tags[tags.length - 1];
        if (newTagElement) {
          newTagElement.classList.add('tag-added');
          setTimeout(() => {
            newTagElement.classList.remove('tag-added');
          }, 500);
        }
      }, 10);
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add new technology
  const addTechnology = (e) => {
    e.preventDefault();
    if (newTech.trim() !== '' && !project.technologies.includes(newTech.trim())) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');

      // Add animation to the latest technology
      setTimeout(() => {
        const techs = document.querySelectorAll('.edit-tech-tag');
        const newTechElement = techs[techs.length - 1];
        if (newTechElement) {
          newTechElement.classList.add('tech-added');
          setTimeout(() => {
            newTechElement.classList.remove('tech-added');
          }, 500);
        }
      }, 10);
    }
  };

  // Remove technology
  const removeTechnology = (techToRemove) => {
    setProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  // Remove member
  const removeMember = (memberName) => {
    if (memberName === project.author) {
      alert("Cannot remove the project author!");
      return;
    }
    
    setProject(prev => ({
      ...prev,
      members: prev.members.filter(member => member.name !== memberName),
      filled: prev.filled - 1
    }));
  };

  // Remove applicant
  const removeApplicant = (applicantName) => {
    setProject(prev => ({
      ...prev,
      applicants: prev.applicants.filter(applicant => applicant.name !== applicantName)
    }));
  };

  // Accept applicant
  const acceptApplicant = (applicant) => {
    // if (project.currentMembers >= project.teamSize) {

      // alert("Team is already full! Increase team size to add more members.");
    //   return;
    // }

    // Add to members and remove from applicants
    setProject(prev => ({
      ...prev,
      teamSize: prev.filled<prev.teamSize?prev.teamSize:prev.teamSize + 1,
      members: [...prev.members, applicant],
      applicants: prev.applicants.filter(a => a.name !== applicant.name),
      filled: prev.filled + 1
    }));

    // Show success message
    setSuccessMessage(`${applicant.name} has been added to the team!`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Handle drag start
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type });
  };

  // Handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOver(index);
  };

  // Handle drop
  const handleDrop = (e, dropIndex, type) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.type !== type) return;
    
    const { item: dragItem } = draggedItem;
    
    if (type === 'tag') {
      const newTags = [...project.tags];
      const dragIndex = newTags.indexOf(dragItem);
      
      if (dragIndex !== -1) {
        newTags.splice(dragIndex, 1);
        newTags.splice(dropIndex, 0, dragItem);
        setProject(prev => ({ ...prev, tags: newTags }));
      }
    } else if (type === 'tech') {
      const newTech = [...project.technologies];
      const dragIndex = newTech.indexOf(dragItem);
      
      if (dragIndex !== -1) {
        newTech.splice(dragIndex, 1);
        newTech.splice(dropIndex, 0, dragItem);
        setProject(prev => ({ ...prev, technologies: newTech }));
      }
    } else if (type === 'member') {
      const newMembers = [...project.members];
      const dragIndex = newMembers.findIndex(member => member.name === dragItem.name);
      
      if (dragIndex !== -1) {
        newMembers.splice(dragIndex, 1);
        newMembers.splice(dropIndex, 0, dragItem);
        setProject(prev => ({ ...prev, members: newMembers }));
      }
    }
    
    setDraggedItem(null);
    setDragOver(null);
  };

  // Handle image change
  const handleImageChange = () => {
    setShowImageUpload(true);
  };

  // Submit new image URL
  const submitNewImage = (e) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setProject(prev => ({
        ...prev,
        image: newImageUrl.trim()
      }));
      setShowImageUpload(false);
      setNewImageUrl('');
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!project.title.trim()) errors.title = "Project title is required";
    if (!project.description.trim()) errors.description = "Project description is required";
    if (project.technologies.length === 0) errors.technologies = "At least one technology is required";
    if (project.tags.length === 0) errors.tags = "At least one tag is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowFormError(true);
      setTimeout(() => {
        setShowFormError(false);
      }, 5000);
      return;
    }
    
    // Here, you would typically send data to your backend API
    // console.log("Saving project:", project);
    console.log(JSON.stringify({
      "id" : project.id,
      "teamSize": project.teamSize,
      "filled": project.filled,
      "domain": project.domain,
      "tags": project.tags,
      "image": "https://example.com/project-image.jpg",
      "title": "",
      "description": project.description,
      "technologies": project.technologies,
      "applicants":project.applicants
      ,"members": project.members
    }));
                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/project/editProject`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookies.get("token")}`
                        },
                        body: JSON.stringify({
                          "id" : project.id,
                          "teamSize": project.teamSize,
                          "filled": project.filled,
                          "domain": project.domain,
                          "tags": project.tags,
                          "image": "https://example.com/project-image.jpg",
                          "title": "",
                          "description": project.description,
                          "technologies": project.technologies,
                          "applicants":project.applicants
                          ,"members": project.members,
                          "status":project.status
                        }),
                });
                
                  const data = await response.text();
                  // console.log("data = "+data);
                  if(response.ok){
                      // showToast("Project posted successfully!", "success");
                      // navigate("/homepage");
                      console.log("Project posted successfully!");
                      // navigate(`/home/project/${project.id}`);
                      setSuccessMessage("Project updated successfully!");
                      setTimeout(() => {
                        setSuccessMessage('');
                        // Navigate back to project view page after saving
                        navigate(`/home/project/${project.id}`);
                      }, 1500);
                  }
                  else{ 
                    console.log("error in saving edited project");
                    // showToast(data, "error");
                  }
                } catch (error) {
                  // showToast("some error Occured! Try again", "error");
                  console.error("Error:", error);
                }


    // Show success message
  };

  // Handle project deletion
  const handleDeleteProject = () => {
    setConfirmDeleteModal(true);
  };

  // Confirm project deletion
  const confirmDeleteProject = async () => {
    console.log("Project deleted:", project.id);
    setConfirmDeleteModal(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/project/deleteProject/${project.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        }
        // body: JSON.stringify({ id: project.id })
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

    } catch (error) {
      console.log("Error deleting project:", error);
    }
    setSuccessMessage("Project deleted successfully!");
    setTimeout(() => {
      setSuccessMessage('');
      // Navigate back to home after deletion
      navigate('/home');
    }, 1500);
  };

  // Cancel project deletion
  const cancelDeleteProject = () => {
    setConfirmDeleteModal(false);
  };

  // Floating animation effect for editing indicator
  // if(!project)return 
  useEffect(() => {
    if(!p)navigate("/home"); 
    setProject(p);
    const interval = setInterval(() => {
      const editingIndicator = document.querySelector('.editing-mode-indicator');
      if (editingIndicator) {
        editingIndicator.classList.toggle('pulse');
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  if (!project) return <p>Loading...</p>;

  return (
    <div className="edit-project-container">
      <div className="edit-project-content">
        <form onSubmit={handleSubmit}>
          {/* Project Header Section */}
          <div className="edit-project-header">
            <div className="edit-project-image-container">
              <img src={project.image} alt={project.title} className="edit-project-image" />
            </div>
            
            <div className="edit-project-info">
              <input 
                type="text" 
                name="title" 
                value={project.title} 
                onChange={handleChange} 
                className="edit-project-title" 
                placeholder="Project Title"
              />
              
              <div className="edit-project-meta">
                <div className="edit-project-author">
                  <img src={project.authorImage} alt={project.author} className="author-image" />
                  <span>by <Link to={`/home/profile/${project.author}`} className="author-name">{project.author}</Link></span>
                </div>
                <div className="edit-project-date">
                  <span className="date-icon">📅</span>
                  <span>Posted on {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="edit-project-status">
                <label>Project Status:</label>
                <button 
                  type="button"
                  className={`status-button ${project.status.toLowerCase()}`}
                  onClick={toggleStatus}
                >
                  <div className="status-icon">
                    {project.status === "Recruiting" ? "🔍" : "🚀"}
                  </div>
                  <div className="status-content">
                    <span className="status-label">Status</span>
                    <span className="status-value">{project.status}</span>
                  </div>
                  <div className="status-change-indicator">Click to change</div>
                </button>
              </div>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="edit-project-details">
            <div className="edit-project-stats">
              <div className="edit-stat-item domain">
                <span className="stat-icon">🌐</span>
                <div>
                  <h3>Domain</h3>
                  <div className="domain-display">{project.domain}</div>
                </div>
              </div>
              
              <div className="edit-stat-item team-size">
                <span className="stat-icon">👥</span>
                <div>
                  <h3>Team Size</h3>
                  <div className="team-size-control">
                    <input 
                      type="number" 
                      min={project.filled}
                      value={project.teamSize} 
                      onChange={handleTeamSizeChange}
                      className="edit-team-size-input"
                    />
                    <span className="current-members-count">{project.filled} current</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-project-description-section">
              <h2 className="edit-section-title">Project Description</h2>
              <textarea 
                name="description" 
                value={project.description} 
                onChange={handleChange}
                className="edit-project-description" 
                placeholder="Describe your project in detail..."
                rows={6}
              ></textarea>
            </div>

            <div className="edit-project-technologies-section">
              <h2 className="edit-section-title">Technologies Used</h2>
              <div className="edit-tech-form">
                {/* <input 
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="edit-tech-input"
                  placeholder="Add a technology..."
                  /> */}
                {/* <div> */}

                <select
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                className="edit-tech-input"
                >
                <option value="" disabled>Select technologies</option>
                {/* Add technology options here */}
                 {technologyArray.map((tech,index) => (
                   <option key={index} value={tech}>{tech}</option>
                  ))}
                </select>
                {/* </div> */}
                
                <button 
                  onClick={addTechnology}
                  className="add-tech-button"
                  type="button"
                >
                  
                  Add</button>
              </div>
              <div className="edit-project-technologies">
                {project.technologies.map((tech, index) => (
                  <div 
                    key={index}
                    className={`edit-tech-tag ${dragOver === index ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tech, 'tech')}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index, 'tech')}
                    onDragEnd={() => setDragOver(null)}
                  >
                    <span className="tech-text">{tech}</span>
                    <button 
                      type="button" 
                      className="remove-tech"
                      onClick={() => removeTechnology(tech)}
                    >×</button>
                  </div>
                ))}
              </div>
              {formErrors.technologies && (
                <span className="form-error">{formErrors.technologies}</span>
              )}
            </div>

            <div className="edit-project-tags-section">
              <h2 className="edit-section-title">Project Tags</h2>
              <div className="edit-tag-form">
                {/* <input 
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="edit-tag-input"
                  placeholder="Add a tag..."
                  /> */}
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="edit-tag-input"
                  >
                  <option value="" disabled>Select tags</option>
                  {/* Add tag options here */}
                  {tagsArray.map((t,index) => (
                    <option key={index} value={t}>{t}</option>
                  ))}
                </select>
                <button 
                  onClick={addTag}
                  className="add-tag-button"
                  type="button"
                >Add</button>
              </div>
              <div className="edit-project-tags">
                {project.tags.map((tag, index) => (
                  <div 
                    key={index}
                    className={`edit-tag ${dragOver === index ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tag, 'tag')}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index, 'tag')}
                    onDragEnd={() => setDragOver(null)}
                  >
                    <span className="tag-text">{tag}</span>
                    <button 
                      type="button" 
                      className="remove-tag"
                      onClick={() => removeTag(tag)}
                    >×</button>
                  </div>
                ))}
              </div>
              {formErrors.tags && (
                <span className="form-error">{formErrors.tags}</span>
              )}
            </div>

            <div className="edit-project-team">
              <h2 className="edit-section-title">Project Team</h2>
              <div className="edit-team-section">
                <div className="edit-current-members">
                  <h3>Current Members</h3>
                  <div className="edit-members-list">
                    {project.members.map((member, index) => (
                      <div 
                        key={member.name}
                        className={`edit-member-container ${dragOver === index ? 'drag-over' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, member, 'member')}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index, 'member')}
                        onDragEnd={() => setDragOver(null)}
                      >
                        <div className="edit-member-item">
                          <img src={member.imageUrl} alt={member.name} className="edit-member-image" />
                          <span className="edit-member-name">{member.name}</span>
                        </div>
                        {member.name !== project.author && (
                          <button 
                            type="button" 
                            className="remove-member-button"
                            onClick={() => removeMember(member.name)}
                          >Remove</button>
                        )}
                        {member.name == project.author && (
                          <div className="author-badge">Owner</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="edit-applicants">
                  <h3>Applicants</h3>
                  <div className="edit-applicants-list">
                    {project.applicants.length > 0 ? (
                      project.applicants.map(applicant => (
                        <div key={applicant.id} className="edit-applicant-container">
                          <div className="edit-applicant-item">
                            <img src={applicant.imageUrl} alt={applicant.name} className="edit-applicant-image" />
                            <span className="edit-applicant-name">{applicant.name}</span>
                          </div>
                          <div className="edit-applicant-actions">
                            <button 
                              type="button" 
                              className="accept-applicant-button"
                              onClick={() => acceptApplicant(applicant)}
                            >Accept</button>
                            <button 
                              type="button" 
                              className="remove-applicant-button"
                              onClick={() => removeApplicant(applicant.name)}
                            >Decline</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-applicants-message">
                        No pending applicants
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-form-actions">
              <button type="submit" className="save-project-button">
                Save Changes
              </button>
              <button type="button" className="cancel-edit-button" onClick={() => navigate(`/home/project/${project.id}`)}>
                Cancel
              </button>
              <button type="button" className="delete-project-button" onClick={handleDeleteProject}>
                Delete Project
              </button>
            </div>
          </div>
        </form>
        
        {showFormError && (
          <div className="form-error-message">
            <span className="error-icon">⚠️</span>
            Please fix the highlighted errors before submitting
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            {successMessage}
          </div>
        )}
        
        {showImageUpload && (
          <div className="modal-overlay">
            <div className="image-upload-modal">
              <h3>Change Project Image</h3>
              <form onSubmit={submitNewImage}>
                <input 
                  type="text" 
                  value={newImageUrl} 
                  onChange={(e) => setNewImageUrl(e.target.value)} 
                  placeholder="Enter image URL..."
                  className="image-url-input"
                  required
                />
                <div className="modal-actions">
                  <button type="submit" className="confirm-image-button">Update Image</button>
                  <button 
                    type="button" 
                    className="cancel-image-button" 
                    onClick={() => setShowImageUpload(false)}
                  >Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {confirmDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-confirmation-modal">
              <h3>Delete Project</h3>
              <p>Are you sure you want to delete this project? This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="confirm-delete-button" 
                  onClick={confirmDeleteProject}
                >Delete Project</button>
                <button 
                  className="cancel-delete-button" 
                  onClick={cancelDeleteProject}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProject;