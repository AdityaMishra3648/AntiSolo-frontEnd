// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import '../CssFiles/PostProject.css';
import React, { use, useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import Dropdown from './Dropdown';
import Cookies from "js-cookie";

const PostProject = () => {
  const navigate = useNavigate();
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [technology, setTechnology] = useState("");
  const [tag, setTag] = useState("");
  // const [teamSize, setTeamSize] = useState(2);
  // const [domain, setDomain] = useState("");
  const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
      // const navigate = useNavigate();
  const [domain,setDomain] = useState("");
  const [tittle,setTittle] = useState("");
  const [description,setDescription] = useState("");
  const [teamSize,setTeamSize] = useState(2);
  const [technologies,setTechnologies] = useState([]);
  const [tags,setTags] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const showToast = (message, type) => {
        console.log(message+" "+type);
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage("");
            setToastType("");
        }, 3000);
      };
  

  const addTechnology = (tech) => {
    // console.log("adding technology = "+tech)
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
      setTechnology("");
    }
  };

  const removeTechnology = (tech) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const addTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTag("");
    }
  };

    useEffect(() => {
      if(!Cookies.get("token"))navigate("/login");
    },[]);
    const postProject = async (e) =>{
          e.preventDefault();
            // if (password !== confirmPassword) {
            //     showToast("Passwords do not match!", "error");
            //     return;
            // }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/project/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("token")}`
                    },
                    body: JSON.stringify({
                      "teamSize": teamSize,
                      "filled": 1,
                      "domain": domain,
                      "tags": tags,
                      "image": "https://example.com/project-image.jpg",
                      "title": tittle,
                      "description": description,
                      "technologies": technologies,
                      "applicants":[]
                      ,"members": []
                    }),
            });
            
              const data = await response.text();
              console.log("data = "+data);
              if(data=="Saved successfully"){
                  showToast("Project posted successfully!", "success");
                  navigate("/home");
              }
              else{ 
                showToast(data, "error");
              }
            } catch (error) {
              showToast("some error Occured! Try again", "error");
              console.error("Error:", error);
            }
        }
  // Domain options
  const projectDomains = [
    "Web Development", "Mobile App Development", "Frontend Development",
        "Backend Development", "Full Stack Development", "Machine Learning",
        "Artificial Intelligence", "Data Science", "Cloud Computing",
        "Cybersecurity", "Blockchain", "Internet of Things (IoT)",
        "Game Development", "Virtual Reality (VR) & Augmented Reality (AR)",
        "Embedded Systems", "DevOps & Automation", "Big Data & Analytics",
        "Networking & Security", "Software Engineering & Development",
        "Database Management", "Computer Vision", "Natural Language Processing (NLP)",
        "Autonomous Systems", "HealthTech", "FinTech", "EdTech", "Robotics"
  ].slice().sort();

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


  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <div className="post-project-pagePostProjectclass">
      <div className="post-project-containerPostProjectclass">
        <h2 className="post-project-titlePostProjectclass">Post a New Project</h2>
        <form onSubmit={handleSubmit} className="post-project-formPostProjectclass">
          <div className="form-fieldPostProjectclass">
            <label htmlFor="teamSize">Team Size</label>
            <input
              type="number"
              id="teamSize"
              min="2"
              value={teamSize}
              onChange={(e) => setTeamSize(Math.max(2, parseInt(e.target.value)))}
              className ={ errors.teamSize ? "error" : ""  }
            />
            {errors.teamSize && <div className="error-messagePostProjectclass">{errors.teamSize}</div>}
          </div>

          <div className="form-fieldPostProjectclass">
            <label htmlFor="domain">Project Domain</label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={errors.domain ? "error" : ""}
            >
              <option value="" disabled>Select domain</option>
              {/* Add domain options here */}
                {projectDomains.map((d,index) => (
                 <option key={index} value={d}>{d}</option>
               ))}
            </select>
            {errors.domain && <div className="error-messagePostProjectclass">{errors.domain}</div>}
          </div>

          <div className="form-fieldPostProjectclass">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter project title"
              maxLength={25}
              value={tittle}
              onChange={(e) => setTittle(e.target.value)}
              className={errors.tittle ? "error" : ""}
            />
            <div className="character-countPostProjectclass">{tittle.length}/25</div>
            {errors.tittle && <div className="error-messagePostProjectclass">{errors.tittle}</div>}
          </div>

          <div className="form-fieldPostProjectclass">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              placeholder="Describe your project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="form-fieldPostProjectclass">
            <label>Technologies</label>
            <div className="select-with-addPostProjectclass">
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
              >
                <option value="" disabled>Select technologies</option>
                {/* Add technology options here */}
                 {technologyArray.map((tech,index) => (
                  <option key={index} value={tech}>{tech}</option>
                ))}
              </select>
              <button
                type="button"
                className="add-buttonPostProjectclass"
                onClick={() => addTechnology(technology)}
              >
                Add
              </button>
            </div>
            {technologies.length > 0 && (
              <div className="selected-itemsPostProjectclass">
                {technologies.map((tech,index) => (
                  <div key={index} className="selected-itemPostProjectclass">
                    <span>{tech}</span>
                    <button
                      type="button"
                      className="remove-buttonPostProjectclass"
                      onClick={() => removeTechnology(tech)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-fieldPostProjectclass">
            <label>Tags</label>
            <div className="select-with-addPostProjectclass">
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="" disabled>Select tags</option>
                {/* Add tag options here */}
                {tagsArray.map((t,index) => (
                  <option key={index} value={t}>{t}</option>
                ))}
              </select>
              <button
                type="button"
                className="add-buttonPostProjectclass"
                onClick={() => addTag(tag)}
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="selected-itemsPostProjectclass">
                {tags.map((t,index) => (
                  <div key={index} className="selected-itemPostProjectclass">
                    <span>{t}</span>
                    <button
                      type="button"
                      className="remove-buttonPostProjectclass"
                      onClick={() => removeTag(t)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actionsPostProjectclass">
            <button type="submit"  onClick={postProject} className="submit-buttonPostProjectclass">
              Post Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Search, Home, BellRing, Mail, Plus, User, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
// import '../CssFiles/PostProject.css';

// // Add cn utility function directly in this file
// function cn(...inputs) {
//   return inputs.filter(Boolean).join(" ");
// }

// const PostProject = () => {
//   const navigate = useNavigate();
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [selectedTechnologies, setSelectedTechnologies] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [technology, setTechnology] = useState("");
//   const [tag, setTag] = useState("");
//   const [teamSize, setTeamSize] = useState(2);
//   const [domain, setDomain] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [errors, setErrors] = useState({});

//   // Toggle mobile search
//   const toggleMobileSearch = () => {
//     setShowMobileSearch(!showMobileSearch);
//   };

//   // Add technology to the list
//   const addTechnology = (tech) => {
//     if (tech && !selectedTechnologies.includes(tech)) {
//       setSelectedTechnologies([...selectedTechnologies, tech]);
//       setTechnology("");
//     }
//   };

//   // Remove technology from the list
//   const removeTechnology = (tech) => {
//     setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
//   };

//   // Add tag to the list
//   const addTag = (newTag) => {
//     if (newTag && !selectedTags.includes(newTag)) {
//       setSelectedTags([...selectedTags, newTag]);
//       setTag("");
//     }
//   };

//   // Remove tag from the list
//   const removeTag = (tagToRemove) => {
//     setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!title.trim()) {
//       newErrors.title = "Title is required";
//     } else if (title.length > 25) {
//       newErrors.title = "Title cannot be longer than 25 characters";
//     }
    
//     if (!domain) {
//       newErrors.domain = "Domain is required";
//     }
    
//     if (teamSize < 2) {
//       newErrors.teamSize = "Team size must be at least 2";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       const projectData = {
//         teamSize,
//         domain,
//         title,
//         description,
//         technologies: selectedTechnologies,
//         tags: selectedTags,
//       };

//       console.log("Project data:", projectData);
//       // Here you would normally send the data to your backend
      
//       // Navigate to home or show success message
//       // navigate('/');
//     }
//   };

//   // Domain options
//   const domains = [
//     "Web Development",
//     "Mobile Development",
//     "AI/Machine Learning",
//     "Data Science",
//     "DevOps",
//     "Cybersecurity",
//     "Blockchain",
//     "Game Development",
//     "IoT",
//     "Other"
//   ];

//   // Technology options
//   const technologies = [
//     "React",
//     "Angular",
//     "Vue",
//     "Node.js",
//     "Express",
//     "Django",
//     "Flask",
//     "Spring Boot",
//     "Laravel",
//     "TensorFlow",
//     "PyTorch",
//     "JavaScript",
//     "TypeScript",
//     "Python",
//     "Java",
//     "C#",
//     "Go",
//     "Rust",
//     "Swift",
//     "Kotlin"
//   ];

//   // Tag options
//   const tags = [
//     "Frontend",
//     "Backend",
//     "Full Stack",
//     "UI/UX",
//     "Database",
//     "API",
//     "Microservices",
//     "Mobile",
//     "Web",
//     "Cloud",
//     "Serverless",
//     "Testing",
//     "CI/CD",
//     "Agile",
//     "Scrum"
//   ];

//   return (
//     <div className="post-project-page">
//       {/* Post Project Form */}
//       <div className="post-project-container">
//         <h2 className="post-project-title">Post a New Project</h2>
        
//         <form onSubmit={handleSubmit} className="post-project-form">
//           {/* Team Size */}
//           <div className="form-field">
//             <label htmlFor="teamSize">Team Size</label>
//             <input
//               type="number"
//               id="teamSize"
//               min="2"
//               value={teamSize}
//               onChange={(e) => {
//                 const value = parseInt(e.target.value);
//                 setTeamSize(value < 2 ? 2 : value);
//               }}
//               className={errors.teamSize ? "error" : ""}
//             />
//             {errors.teamSize && <div className="error-message">{errors.teamSize}</div>}
//           </div>

//           {/* Domain */}
//           <div className="form-field">
//             <label htmlFor="domain">Project Domain</label>
//             <select 
//               id="domain" 
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               className={errors.domain ? "error" : ""}
//             >
//               <option value="" disabled>Select domain</option>
//               {domains.map((d) => (
//                 <option key={d} value={d}>{d}</option>
//               ))}
//             </select>
//             {errors.domain && <div className="error-message">{errors.domain}</div>}
//           </div>

//           {/* Title */}
//           <div className="form-field">
//             <label htmlFor="title">Project Title</label>
//             <input
//               type="text"
//               id="title"
//               placeholder="Enter project title"
//               maxLength={25}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className={errors.title ? "error" : ""}
//             />
//             <div className="character-count">
//               {title.length}/25
//             </div>
//             {errors.title && <div className="error-message">{errors.title}</div>}
//           </div>

//           {/* Description */}
//           <div className="form-field">
//             <label htmlFor="description">Project Description</label>
//             <textarea
//               id="description"
//               placeholder="Describe your project..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={5}
//               className="resize-none"
//             />
//           </div>

//           {/* Technologies */}
//           <div className="form-field">
//             <label>Technologies</label>
//             <div className="select-with-add">
//               <select 
//                 value={technology} 
//                 onChange={(e) => setTechnology(e.target.value)}
//               >
//                 <option value="" disabled>Select technologies</option>
//                 {technologies.map((tech) => (
//                   <option key={tech} value={tech}>{tech}</option>
//                 ))}
//               </select>
//               <button 
//                 type="button" 
//                 className="add-button"
//                 onClick={() => addTechnology(technology)}
//               >
//                 Add
//               </button>
//             </div>
//             {selectedTechnologies.length > 0 && (
//               <div className="selected-items">
//                 {selectedTechnologies.map((tech) => (
//                   <div key={tech} className="selected-item">
//                     <span>{tech}</span>
//                     <button 
//                       type="button"
//                       onClick={() => removeTechnology(tech)} 
//                       className="remove-button"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Tags */}
//           <div className="form-field">
//             <label>Tags</label>
//             <div className="select-with-add">
//               <select 
//                 value={tag} 
//                 onChange={(e) => setTag(e.target.value)}
//               >
//                 <option value="" disabled>Select tags</option>
                // {tags.map((t) => (
                //   <option key={t} value={t}>{t}</option>
                // ))}
//               </select>
//               <button 
//                 type="button" 
//                 className="add-button"
//                 onClick={() => addTag(tag)}
//               >
//                 Add
//               </button>
//             </div>
//             {selectedTags.length > 0 && (
//               <div className="selected-items">
//                 {selectedTags.map((t) => (
//                   <div key={t} className="selected-item">
//                     <span>{t}</span>
//                     <button 
//                       type="button"
//                       onClick={() => removeTag(t)} 
//                       className="remove-button"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="form-actions">
//             <button type="submit" className="submit-button">
//               Post Project
//             </button>
//           </div>
//         </form>
//       </div>

//     </div>
//   );
// };

// export default PostProject;