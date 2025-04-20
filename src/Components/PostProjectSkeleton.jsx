import React, { use, useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import Cookies from "js-cookie";

function PostProjectSkeleton(){
    const navigate = useNavigate();
    const [domain,setDomain] = useState("");
    const [tittle,setTittle] = useState("");
    const [description,setDescription] = useState("");
    const [teamsize,setTeamSize] = useState(2);
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
    const technologyArray = ["Java", "Python", "JavaScript", "C#", "C++", "Ruby", "Go", "Swift", "Kotlin", "PHP", "TypeScript", "Rust", "Dart",
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
            "Webpack", "Babel", "ESLint", "Prettier", "Gulp", "Grunt", "Three.js", "D3.js"]
    const projectDomains = [ "Web Development", "Mobile App Development", "Frontend Development",
        "Backend Development", "Full Stack Development", "Machine Learning",
        "Artificial Intelligence", "Data Science", "Cloud Computing",
        "Cybersecurity", "Blockchain", "Internet of Things (IoT)",
        "Game Development", "Virtual Reality (VR) & Augmented Reality (AR)",
        "Embedded Systems", "DevOps & Automation", "Big Data & Analytics",
        "Networking & Security", "Software Engineering & Development",
        "Database Management", "Computer Vision", "Natural Language Processing (NLP)",
        "Autonomous Systems", "HealthTech", "FinTech", "EdTech", "Robotics"];
      useEffect(() => {
        if(!Cookies.get("token"))navigate("/login");
      },[]);
    const postProject = async () =>{
      // e.preventDefault();
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
                  "teamSize": teamsize,
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
              navigate("/homepage");
          }
          else{ 
            showToast(data, "error");
          }
        } catch (error) {
          showToast("some error Occured! Try again", "error");
          console.error("Error:", error);
        }
    }
    const handleDomainFill = (value) => {
        setDomain(value);
    }
    const handleTechnologyFill = (value) => {
        if(technologies.includes(value))return;
        setTechnologies([...technologies,value]);
    }
    const handleTagsFill = (value) => {
        if(tags.includes(value))return;
        setTags([...tags,value]);
    }
    //useless function just for testing
    const sayHii = async () =>{
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/project/test`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("token")}`
          },
          body: JSON.stringify({
            userName: "Aditya Mishra",
            password : "12345"
          }),
      });
  
      const data = await response.text();
      console.log("data = "+data);
     }
      catch (error) {
        console.log("error");
      }
    }
    return (
      <div>
        <h1>this page is used to post projects by you</h1>
        <h2>There you go bro fill this form and submit your project</h2>
        <br />
        Size of team
        <input type="number" min="2" value={teamsize} onChange={(e)=>setTeamSize(e.target.value)} />
        <br />
        <h3>choose Domain of your project</h3>

        <Dropdown options={projectDomains} onSelect={handleDomainFill} />
        chosen domain is = {domain}
        <br />
        <input type="text" value={tittle}  maxLength={23} onChange={(e)=>setTittle(e.target.value)}/>
        tittle = {tittle}
        <br />
        <br />
        <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        description = {description}
        <br />
        <br />
        <h2>Choose major technologies </h2>
        <Dropdown options={technologyArray} onSelect={handleTechnologyFill} />

        <br />
        <h3>Your selected Technologies are</h3>
        <br />
        {technologies.map((tag, index) => (
          <p key={index}>{tag}</p>
        ))}
        <br />
        <br />
        <h2>Choose tags relevant to your project </h2>
        <Dropdown options={tagsArray} onSelect={handleTagsFill} />

        <br />
        <br />
        <h3>Your selected tags are</h3>
        <br />
        {tags.map((tag, index) => (
          <p key={index}>{tag}</p>
        ))}
        <button onClick={postProject}>submit</button>
        <br />
        <br />
        <br />
        <button onClick={()=>navigate("/homepage")}>cancel</button>
        <br />
        <br />
        {toastMessage && <div className={`toast ${toastType} `}>{toastMessage}</div>}
      </div>
    );
}
export default PostProjectSkeleton;