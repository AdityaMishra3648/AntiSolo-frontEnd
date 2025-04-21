import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './UserProfile.css';
import { set } from "react-hook-form";
import { Search, Bell, MessageSquare, Upload, LogOut, Filter, Home,MessageCircle } from 'lucide-react';
import LoadingPage from "../Components/LoadingPage";


const UserProfile = () => {
  
  const navigate = useNavigate();
  const { userId } = useParams();
 const [user, setUser] = useState(null);
 const [error, setError] = useState(null);
 const [projects,setProjects] = useState([]);
 const [teams,setTeams] = useState([]);
 const [applied,setApplied] = useState([]);
 const [alreadyBuddy,setAlreadyBuddy] = useState(false);
 const [requestSent,setRequestSent] = useState(false);
 const [sendingRequest,setSendingRequest] = useState(false);
 const [trigger, setTrigger] = useState(0);
 const [receivedFriendRequest,setReceivedFriendRequest] = useState(false);
 const [shareProject,setShareProject] = useState(false);

 const [alreadyRated,setAlreadyRated] = useState(false);
 const [previousRating,setPreviousRating] = useState(0);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);


 
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);




   // State for profile control
   const [is_author,setIs_author] = useState(false);  // For development, always true as requested
  
   // State for modals
   const [showRatingModal, setShowRatingModal] = useState(false);
   const [showProfileImageModal, setShowProfileImageModal] = useState(false);
   const [userRating, setUserRating] = useState(0);
   const [ratingSubmitted, setRatingSubmitted] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);
   const [previewImage, setPreviewImage] = useState(null);

 

       function logout() {
         Cookies.remove("token");
         Cookies.remove("userName");
         Cookies.remove("image");
         // Cookies.remove("username");
         // Cookies.remove("password");
          navigate("/");
        }

     // Function to handle report submission
  const handleReportSubmit = async () => {
    if (reportReason.trim()) {
      setReportSubmitted(true);
      // Here you would implement the actual report submission

              if(!Cookies.get("userName")){
                alert("Please login to report.");
                return;
              }
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/User/reportUser`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                  },body: JSON.stringify({
                    reported: userId,
                    message : reportReason,
                    reportFrom : Cookies.get("userName")
                  }),
                });
                if (!response.ok) {
                  console.log("Failed to report project "+response.status);
                }
                console.log(data.message);
              } catch (err) {
                console.error(err.message);
              }

      console.log("Report submitted:", reportReason);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
        setReportReason('');
      }, 2000);
    }
  };


   const checkShareProject = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/doTheyShareProject/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setShareProject(data);
        // console.log("Share project status: ", data);
      } 
      } catch (error) {
        console.error("Error checking share project status:", error.message);
      }
   }

   const checkRatingStatus = async (data) =>{
     console.log("already rated is "+alreadyRated+" and previous rating is "+previousRating);
    //  if(user==null)return;
      for(let rater of data.raters){
        if(rater.userName==Cookies.get("userName")){
          setAlreadyRated(true);
          setPreviousRating(rater.rating);
          setUserRating(rater.rating);
          break;
        }
      }
      // setUserRating(9);
      // setAlreadyRated(true);
      // setPreviousRating(9);
      console.log("already rated is "+alreadyRated+" and previous rating is "+previousRating);
   } 



   const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before uploading
    }
  };
  
  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setSelectedImage(e.target.files[0]);
  //     setPreviewImage(URL.createObjectURL(e.target.files[0]));
  //   }
  // };
  const uploadImage = async () => {
          if (!image) {
            // alert("Please select an image first.");
            return;
          }
      
          const formData = new FormData();
          formData.append("image", image);
      
          setUploading(true);
      
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/User/saveImage`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`, // Replace with actual token handling
              },
              body: formData, // FormData handles `Content-Type` automatically
            });
      
            const data = await response.json();
            setUploading(false);
      
            if (response.ok) {
              // alert("Image uploaded successfully!");
              // navigate("/home/profile/"+user.userName);
                  setShowProfileImageModal(false);
                  setImage(null);
                  setPreview(null);
                  setTrigger(trigger+1);
              console.log("Uploaded Image URL:", data.url);
            } else {
              // alert("Failed to upload image");
              console.error("Error:", data);
              setUploading(false);
            }
          } catch (error) {
            setUploading(false);
            // alert("Error uploading image");
            console.error(error);
          }
  };



   const AcceptRequest = async () => {
     console.log("accept request called");
     setSendingRequest(true);
     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/User/confirmRequest/${userId}`, {
                               method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${Cookies.get("token")}`
                              },
         });
       
       if (!response.ok) {
         console.log("failed to Accept friend request "+response.status);
         setSendingRequest(false);
         return;
       }
       const data = await response.json();
       console.log("accepted friend request "+data);
       // setRequestSent(!requestSent);
       // setRequestSent(false);
       // for(let buddy of user.friendRequest){
       //   if(buddy.name==Cookies.get("userName")){
       //     console.log("setting request sent to true");
       //     setRequestSent(true);
       //     break;
       //   }
       // }
     } catch (err) {
       console.log(err.message);
     }
     setSendingRequest(false);
     setTrigger(trigger+1);
    }

   const SendOrWidrawRequest = async () =>{
     setSendingRequest(true);
       try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/User/sendFriendRequest/${userId}`, {
                                 method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "Authorization": `Bearer ${Cookies.get("token")}`
                                },
           });
         
         if (!response.ok) {
           console.log("failed to send friend request "+response.status);
           setSendingRequest(false);
           return;
         }
         const data = await response.json();
         console.log("sent friend request "+data);
         // setRequestSent(!requestSent);
         // setRequestSent(false);
         // for(let buddy of user.friendRequest){
         //   if(buddy.name==Cookies.get("userName")){
         //     console.log("setting request sent to true");
         //     setRequestSent(true);
         //     break;
         //   }
         // }
       } catch (err) {
         console.log(err.message);
       }
       setSendingRequest(false);
       setTrigger(trigger+1);
     }
 useEffect(() => {

   const fetchUser = async () => {
     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/login/userInfo/${userId}`, {
                               method: "GET",
                              headers: {
                                "Content-Type": "application/json"
                               //  "Authorization": `Bearer ${Cookies.get("token")}`
                              },
       });
       
       if (!response.ok) {
         throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setPreview(data.profileImageUrl);
        if(data.userName==Cookies.get("userName")){
          setIs_author(true);
        }
       setUser(data);
       for(let buddy of data.buddies){
         if(buddy.name==Cookies.get("userName")){
           setAlreadyBuddy(true);
           break;
          }
        }
        setRequestSent(false);
        for(let buddy of data.friendRequest){
          if(buddy.name==Cookies.get("userName")){
            setRequestSent(true);
            break;
          }
        }
        // setTimeout(() => {
          checkRatingStatus(data);
        // }, 2000);
        // extractProjectData();
     } catch (err) {
       setError(err.message);
     }
     if(userId==Cookies.get("userName") || alreadyBuddy || requestSent)return;
     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/login/userInfo/${Cookies.get("userName")}`, {
                               method: "GET",
                              headers: {
                                "Content-Type": "application/json"
                               //  "Authorization": `Bearer ${Cookies.get("token")}`
                              },
       });
       
       if (!response.ok) {
         throw new Error("Failed to fetch user data");
       }
       const data = await response.json();
       for(let buddy of data.friendRequest){
         if(buddy.name==userId){
           setReceivedFriendRequest(true);
           break;
         }
       }
       // extractProjectData();
     } catch (err) {
       console.log(err.message);
     }
     // console.log("from link received userId is = "+userId+" and username stored in cookies is "+Cookies.get("userName"));
   };

     fetchUser();
     checkShareProject();

 }, [trigger,userId]);
 useEffect(() => {
   if (user!=null) {
     setProjects([]);
     setTeams([]);
     setApplied([]);
     extractProjectData();
     extractTeamProjectData();
     extractAppliedProjectData();
   }
 }, [user,userId]);

 const extractProjectData = async () => {
   // console.log("user structure is "+user.projects+" and length is "+user.projects.length);
   for(let project of user.projects){
     try {

       console.log("id for one of project is "+project);
       const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getProject/${project}`);
       if (!response.ok) {
         throw new Error("Failed to fetch project data "+response.status);
       }
       const data = await response.json();
       // console.log("data cam out for "+project+" it is "+data);
       setProjects(prevProjects => [...prevProjects, data]);
       console.log("updated projects are "+projects);
       // console.log(JSON.stringify(, null, 2)); 
     } catch (err) {
       console.log(err.message);
       setError(err.message);
     }
   }
 } 
 const extractTeamProjectData = async () => {
   for(let project of user.teams){
     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getProject/${project}`);
       if (!response.ok) {
         throw new Error("Failed to fetch project data "+response.status);
       }
       const data = await response.json();
       setTeams(prevProjects => [...prevProjects, data]);
     } catch (err) {
       setError(err.message);
     }
   }
 } 
 const unFriend = async (buddy) =>{
   try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/User/removeFriend/${buddy}`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${Cookies.get("token")}`
       },
     });
     // if (!response.ok) {
     //   throw new Error("Failed to fetch project data "+response.status);
     // }
     // const data = await response.json();
     // setTeams(prevProjects => [...prevProjects, data]);
   } catch (err) {
     setError(err.message);
   }
   setTrigger(trigger+1);
 }


 const extractAppliedProjectData = async () => {
   for(let project of user.applied){
     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/project/getProject/${project}`);
       if (!response.ok) {
         throw new Error("Failed to fetch project data "+response.status);
       }
       const data = await response.json();
       setApplied(prevProjects => [...prevProjects, data]);
     } catch (err) {
       setError(err.message);
     }
   }
 } 


 function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

  // Function to determine emoji based on rating
  const getRatingEmoji = (rating) => {
    if (rating < 5) return "😢";
    if (rating >= 5 && rating <= 7) return "😐";
    return "😄";
  };

  // Function to handle rating submission
  const handleRatingSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify(
          { userName : userId,
            rating: userRating 
          }
        )
      });
      if (!response.ok) {
        // throw new Error("Failed to submit rating "+response.status);
        console.log("Failed to submit rating "+response.status);

      }
      // const data = await response.json();
      // console.log("Rating submitted:", data);
      // setAlreadyRated(true);
      // setPreviousRating(userRating);
      // setUserRating(userRating);
      setTrigger(trigger+1);
    } catch (error) {
      console.error("Error submitting rating:", error.message);
      
    }
    setRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingModal(false);
      setRatingSubmitted(false);
    }, 2000);
  };

  // Function to handle project click
  const handleProjectClick = (projectId) => {
    console.log(`Navigating to project ${projectId}`);
    // Navigation would be implemented here
    navigate(`/home/project/${projectId}`);
  };

  // Function to handle profile image click
  const handleProfileImageClick = () => {
    if (is_author) {
      setShowProfileImageModal(true);
    }
  };

  const handleUsserFriendsImage = () => {
    navigate('/home/friends' ,{
      state: {
        user:user
      },
      },);
  };

  // Function to handle image selection

  // Function to submit new profile image
  const handleImageSubmit = () => {
    // Here you would implement the actual image upload
    console.log("Submit new profile image:", selectedImage);
    setShowProfileImageModal(false);
    // Reset selected image and preview
    setSelectedImage(null);
    setPreviewImage(null);
  };

  // Function to cancel image upload
  const handleImageCancel = () => {
    setShowProfileImageModal(false);
    setImage(null);
    setPreview(null);
  };

  // Function to navigate to edit profile page
  const handleEditProfile = () => {
    navigate('/home/editProfile' ,{
      state: {
        user:user
      },
      },);
  };

  if (error) return <p>Error: {error}</p>;
  if (!user) return <><LoadingPage/></>;

  
  return (
    <div className="user-profile-containerUserProfilePageCss">
      <div className="profile-headerUserProfilePageCss">
        <div className="profile-image-container-div">
        <div 
          className={`profile-image-containerUserProfilePageCss ${is_author ? 'editableUserProfilePageCss' : ''}`}
          onClick={handleProfileImageClick}
          title={is_author ? "Click to change profile image" : ""}
        >
          <img src={user.profileImageUrl} alt={user.userName} className="profile-imageUserProfilePageCss" />
          {is_author && <div className="edit-overlayUserProfilePageCss"><span>Edit</span></div>}
        </div>
          {is_author && <span className=" myclass rating-valueUserProfilePageCss" onClick={handleProfileImageClick}>Edit Image</span>}
          </div>
        <div className="profile-infoUserProfilePageCss">
          <h1 className="usernameUserProfilePageCss">{user.userName}</h1>
          <p className="bioUserProfilePageCss">{user.bio}</p>
          <div className="account-detailsUserProfilePageCss">
            <span className="creation-dateUserProfilePageCss">Member since: {formatDate(user.accountCreationDate)}</span>
            <div className="rating-containerUserProfilePageCss">
              <span className="rating-labelUserProfilePageCss">Rating: </span>
              <span className="rating-valueUserProfilePageCss">{user.averageRating}/10</span>
              <span className="rating-countUserProfilePageCss">({user.totalRaters} ratings)</span>
              <span className="rating-emojiUserProfilePageCss bounceUserProfilePageCss" title={`${user.averageRating} out of 10`}>
                {getRatingEmoji(user.averageRating)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actionsUserProfilePageCss">
          <>
            {is_author && <button className="action-buttonUserProfilePageCss friends-buttonUserProfilePageCss slide-in-leftUserProfilePageCss" onClick={handleUsserFriendsImage}>
              View Friends
            </button>}
            {!alreadyBuddy && !is_author && !receivedFriendRequest && <button className="action-buttonUserProfilePageCss friends-buttonUserProfilePageCss slide-in-leftUserProfilePageCss" disabled={sendingRequest} onClick={SendOrWidrawRequest}>
              { requestSent ? "Cancel Request" : "Send Friend Request"}
            </button>}
            {!alreadyBuddy && !is_author && receivedFriendRequest && <button className="action-buttonUserProfilePageCss friends-buttonUserProfilePageCss slide-in-leftUserProfilePageCss" disabled={sendingRequest} onClick={AcceptRequest}>
              {"Accept"}
            </button>}
            {is_author && <button className="edit-profile-buttonUserProfilePageCss slide-in-rightUserProfilePageCss" onClick={handleEditProfile}>
              Edit Profile
            </button>}
          </>
      </div>

      <div className="profile-bodyUserProfilePageCss">
        <div className="profile-sectionUserProfilePageCss fade-inUserProfilePageCss">
          <h2 className="section-titleUserProfilePageCss">Skills</h2>
          <div className="tags-containerUserProfilePageCss">
            {user.skills.map((skill, index) => (
              <span key={index} className="skill-tagUserProfilePageCss pop-inUserProfilePageCss" style={{animationDelay: `${index * 0.1}s`}}>{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-sectionUserProfilePageCss fade-inUserProfilePageCss" style={{animationDelay: '0.2s'}}>
          <h2 className="section-titleUserProfilePageCss">Interests</h2>
          <div className="tags-containerUserProfilePageCss">
            {user.interests.map((interest, index) => (
              <span key={index} className="interest-tagUserProfilePageCss pop-inUserProfilePageCss" style={{animationDelay: `${index * 0.1 + 0.3}s`}}>{interest}</span>
            ))}
          </div>
        </div>

        <div className="profile-sectionUserProfilePageCss fade-inUserProfilePageCss" style={{animationDelay: '0.4s'}}>
          <h2 className="section-titleUserProfilePageCss">Social Links</h2>
          <div className="social-linksUserProfilePageCss">
            {Object.entries(user.socialLinks).map(([key, value], index) => (
              <a 
                key={index} 
                href={value} 
                className="social-linkUserProfilePageCss floatUserProfilePageCss" 
                style={{animationDelay: `${index * 0.15}s`}} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {key}
              </a>
            ))}
          </div>
        </div>

        <div className="projects-containerUserProfilePageCss">
          <div className="profile-sectionUserProfilePageCss fade-inUserProfilePageCss" style={{animationDelay: '0.6s'}}>
            <h2 className="section-titleUserProfilePageCss">Shared Projects</h2>
            <div className="projects-gridUserProfilePageCss">
              {projects.map((project, index) =>(
                <div
                  key={project.id}
                  className="project-cardUserProfilePageCss slide-upUserProfilePageCss"
                  style={{animationDelay: `${index * 0.2 + 0.7}s`}}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="project-image-containerUserProfilePageCss">
                    <img src={project.image} alt={project.title} className="project-imageUserProfilePageCss" />
                  </div>
                  <h3 className="project-titleUserProfilePageCss">{project.title}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-sectionUserProfilePageCss fade-inUserProfilePageCss" style={{animationDelay: '0.8s'}}>
            <h2 className="section-titleUserProfilePageCss">Member Projects</h2>
            <div className="projects-gridUserProfilePageCss">
              {teams.map((project, index) => (
                <div
                  key={project.id}
                  className="project-cardUserProfilePageCss slide-upUserProfilePageCss"
                  style={{animationDelay: `${index * 0.2 + 1}s`}}
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="project-image-containerUserProfilePageCss">
                    <img src={project.image} alt={project.title} className="project-imageUserProfilePageCss" />
                  </div>
                  <h3 className="project-titleUserProfilePageCss">{project.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="actions-containerUserProfilePageCss">
        {!is_author && shareProject &&  <button className="action-buttonUserProfilePageCss rate-buttonUserProfilePageCss" onClick={() => setShowRatingModal(true)}>
            {alreadyRated ? "Edit Rating" : "Rate User"}
          </button> }
          {!is_author && <button className="action-buttonUserProfilePageCss report-button" onClick={() => setShowReportModal(true)}>
            Report User
          </button>}
          {is_author && <button className="action-buttonUserProfilePageCss report-button" onClick={logout}>
            <span>Logout</span>
          </button>}
          {is_author && user.role=="ADMIN" && <button className="action-buttonUserProfilePageCss rate-buttonUserProfilePageCss" onClick={()=>navigate("/home/admin")}>
            <span>Admin Panel</span>
          </button>}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlayUserProfilePageCss">
          <div className="modalUserProfilePageCss rating-modalUserProfilePageCss">
            <h2>Rate {user.userName}</h2>
            {!ratingSubmitted ? (
              <>
                <div className="rating-starsUserProfilePageCss">
                  {[...Array(10)].map((_, index) => (
                    <span
                      key={index}
                      className={`rating-starUserProfilePageCss ${index < userRating ? 'activeUserProfilePageCss' : ''}`}
                      onClick={() => setUserRating(index + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="selected-ratingUserProfilePageCss">
                  {userRating > 0 ? `${userRating}/10` : 'Select a rating'}
                </div>
                <div className="modal-buttonsUserProfilePageCss">
                  <button className="modal-buttonUserProfilePageCss cancelUserProfilePageCss" onClick={() => setShowRatingModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="modal-buttonUserProfilePageCss submitUserProfilePageCss"
                    onClick={handleRatingSubmit}
                    disabled={userRating === 0}
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <div className="rating-successUserProfilePageCss">
                <div className="success-emojiUserProfilePageCss">✅</div>
                <p>Rating submitted successfully!</p>
              </div>
            )}
          </div>
        </div>
      )}


        {/* Report Modal */}
        {showReportModal && (
        <div className="modal-overlayUserProfilePageCss">
          <div className="modalUserProfilePageCss report-modal">
            <h2>Report {user.username}</h2>
            {!reportSubmitted ? (
              <>
                <div className="report-content">
                  <textarea
                    className="report-input"
                    placeholder="Please describe your concern about this user..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="modal-buttonsUserProfilePageCss">
                  <button 
                    className="modal-buttonUserProfilePageCss cancelUserProfilePageCss"
                    onClick={() => {
                      setShowReportModal(false);
                      setReportReason('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-buttonUserProfilePageCss submitUserProfilePageCss"
                    onClick={handleReportSubmit}
                    disabled={!reportReason.trim()}
                  >
                    Submit Report
                  </button>
                </div>
              </>
            ) : (
              <div className="report-success">
                <div className="success-emojiUserProfilePageCss">✅</div>
                <p>Report submitted successfully!</p>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Profile Image Modal */}
      {showProfileImageModal && (
        <div className="modal-overlayUserProfilePageCss">
          <div className="modalUserProfilePageCss profile-image-modalUserProfilePageCss">
            <h2>Change Profile Picture</h2>
            <div className="image-upload-containerUserProfilePageCss">
              <div className="image-upload-areaUserProfilePageCss">
                <label htmlFor="profile-image-upload" className="upload-labelUserProfilePageCss">
                  <div className="upload-iconUserProfilePageCss">📁</div>
                  <span>Choose image</span>
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-inputUserProfilePageCss"
                />
              </div>
              
              {preview && (
                <div className="image-preview-containerUserProfilePageCss">
                  <h3>Preview:</h3>
                  <div className="preview-image-wrapperUserProfilePageCss">
                    <img src={preview} alt="Preview" className="preview-imageUserProfilePageCss" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-buttonsUserProfilePageCss">
              <button className="modal-buttonUserProfilePageCss cancelUserProfilePageCss" onClick={handleImageCancel}>
                Cancel
              </button>
              <button
                className="modal-buttonUserProfilePageCss submitUserProfilePageCss"
                onClick={uploadImage}
                disabled={!image}
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
