import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import './UserProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;
  


  // Sample user data (same as UserProfile)
  const [userData, setUserData] = useState(null);
  // const [userData, setUserData] = useState({
  //   username: "CartoonDev",
  //   profileImage: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
  //   userBio: "Full-stack developer passionate about creating collaborative projects. Always looking for new opportunities to learn and grow with fellow developers.",
  //   creationDate: "January 15, 2023",
  //   averageRating: 8.2,
  //   totalRatings: 57,
  //   skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "CSS", "UI/UX Design", "Python"],
  //   interests: ["Web Development", "Mobile Apps", "AI/ML", "Game Development", "Blockchain"],
  //   socialLinks: [
  //     { platform: "LinkedIn", url: "https://linkedin.com/in/cartoondev" },
  //     { platform: "Instagram", url: "https://instagram.com/cartoondev" },
  //     { platform: "GitHub", url: "https://github.com/cartoondev" },
  //     { platform: "Twitter", url: "https://twitter.com/cartoondev" }
  //   ]
  // });

  // State for form controls
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Handle bio change
  const handleBioChange = (e) => {
    setUserData({
      ...userData,
      bio: e.target.value
    });
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() !== '' && !userData.skills.includes(newSkill.trim())) {
      setUserData({
        ...userData,
        skills: [...userData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Handle adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim() !== '' && !userData.interests.includes(newInterest.trim())) {
      setUserData({
        ...userData,
        interests: [...userData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  // Handle removing an interest
  const handleRemoveInterest = (interestToRemove) => {
    setUserData({
      ...userData,
      interests: userData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  // Handle adding a new social link
  const handleAddSocialLink = () => {
    if (newSocialPlatform.trim() !== '' && newSocialUrl.trim() !== '') {
      setUserData({
        ...userData,
        socialLinks: {...userData.socialLinks, 
          [newSocialPlatform.trim()]:newSocialUrl.trim()
        }
      });
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
  };

  // Handle removing a social link
  const handleRemoveSocialLink = (key) => {
    const updated = { ...userData.socialLinks };
    delete updated[key];
    setUserData({
      ...userData,
      socialLinks: updated
    });
  };

  // Handle key press events for inputs
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    // Here you would send the updated data to your backend
    console.log("Saving changes:", userData);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/User/editUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        console.log('Failed to save changes');
      }
      // const data = await response.json();
      // console.log("Changes saved:", data);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
    navigate('/home/profile/'+userData.userName);
  };

  // Handle cancellation
  const handleCancel = () => {
    navigate('/home/profile/'+userData.userName);
  };

  useEffect(() => {
    if (!user) {
      navigate('/home');
      return;
    }
    setUserData(user);
  },[user]);

  if(!userData)return <h1>Loading...</h1>;

  return (
    <div className="user-profile-containerUserProfilePageCss edit-profile-containerUserProfilePageCss">
      <h1 className="edit-profile-titleUserProfilePageCss">Edit Profile</h1>

      <div className="edit-profile-sectionUserProfilePageCss">
        <div className="edit-profile-headerUserProfilePageCss">
          <div className="profile-image-previewUserProfilePageCss">
            <img src={userData.profileImageUrl} alt={userData.userName} className="profile-imageUserProfilePageCss" />
          </div>
          <div className="profile-basic-infoUserProfilePageCss">
            <h2 className="usernameUserProfilePageCss">{userData.userName}</h2>
            {/* <p className="creation-dateUserProfilePageCss">Member since: {userData.creationDate}</p> */}
          </div>
        </div>

        <div className="edit-sectionUserProfilePageCss">
          <h3 className="edit-section-titleUserProfilePageCss">Bio</h3>
          <textarea 
            className="bio-inputUserProfilePageCss"
            value={userData.bio}
            onChange={handleBioChange}
            placeholder="Write something about yourself..."
            rows={4}
          />
        </div>

        <div className="edit-sectionUserProfilePageCss">
          <h3 className="edit-section-titleUserProfilePageCss">Skills</h3>
          <div className="edit-tags-containerUserProfilePageCss">
            {userData.skills.map((skill, index) => (
              <div key={index} className="editable-tagUserProfilePageCss skill-tagUserProfilePageCss">
                {skill}
                <button className="remove-tagUserProfilePageCss" onClick={() => handleRemoveSkill(skill)}>×</button>
              </div>
            ))}
          </div>
          <div className="add-tag-containerUserProfilePageCss">
            <input
              type="text"
              className="tag-inputUserProfilePageCss"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
              placeholder="Add a skill..."
            />
            <button className="add-tag-buttonUserProfilePageCss" onClick={handleAddSkill}>+</button>
          </div>
        </div>

        <div className="edit-sectionUserProfilePageCss">
          <h3 className="edit-section-titleUserProfilePageCss">Interests</h3>
          <div className="edit-tags-containerUserProfilePageCss">
            {userData.interests.map((interest, index) => (
              <div key={index} className="editable-tagUserProfilePageCss interest-tagUserProfilePageCss">
                {interest}
                <button className="remove-tagUserProfilePageCss" onClick={() => handleRemoveInterest(interest)}>×</button>
              </div>
            ))}
          </div>
          <div className="add-tag-containerUserProfilePageCss">
            <input
              type="text"
              className="tag-inputUserProfilePageCss"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddInterest)}
              placeholder="Add an interest..."
            />
            <button className="add-tag-buttonUserProfilePageCss" onClick={handleAddInterest}>+</button>
          </div>
        </div>

        <div className="edit-sectionUserProfilePageCss">
          <h3 className="edit-section-titleUserProfilePageCss">Social Links</h3>
          <div className="social-links-editorUserProfilePageCss">
            {/* {userData.socialLinks.map((link, index) => ( */}
            {Object.entries(userData.socialLinks).map(([key, value]) => (
              <div key={key} className="editable-social-linkUserProfilePageCss">
                <span className="social-platformUserProfilePageCss">{key}:</span>
                <span className="social-urlUserProfilePageCss">{value}</span>
                <button className="remove-socialUserProfilePageCss" onClick={() => handleRemoveSocialLink(key)}>×</button>
              </div>
            ))}
          </div>
          <div className="add-social-containerUserProfilePageCss">
            <input
              type="text"
              className="social-platform-inputUserProfilePageCss"
              value={newSocialPlatform}
              onChange={(e) => setNewSocialPlatform(e.target.value)}
              placeholder="Platform (e.g. Twitter)"
            />
            <input
              type="text"
              className="social-url-inputUserProfilePageCss"
              value={newSocialUrl}
              onChange={(e) => setNewSocialUrl(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddSocialLink)}
              placeholder="URL (e.g. https://twitter.com/username)"
            />
            <button className="add-social-buttonUserProfilePageCss" onClick={handleAddSocialLink}>+</button>
          </div>
        </div>
      </div>

      <div className="edit-profile-actionsUserProfilePageCss">
        <button className="action-buttonUserProfilePageCss cancel-buttonUserProfilePageCss" onClick={handleCancel}>Cancel</button>
        <button className="action-buttonUserProfilePageCss save-buttonUserProfilePageCss" onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProfile;