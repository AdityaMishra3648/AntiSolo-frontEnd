import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function EditProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state || {};
    if(typeof user === "undefined"){
        navigate("/");
        return <h1>Log in first...</h1>
    }

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(user.profileImageUrl);
    const [uploading, setUploading] = useState(false);

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before uploading
    }
  };

const uploadImage = async () => {
        if (!image) {
          alert("Please select an image first.");
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
            alert("Image uploaded successfully!");
            navigate("/profile/"+user.userName);
            console.log("Uploaded Image URL:", data.url);
          } else {
            alert("Failed to upload image");
            console.error("Error:", data);
          }
        } catch (error) {
          setUploading(false);
          alert("Error uploading image");
          console.error(error);
        }
};
  useEffect(() => {
    if(!Cookies.get("token"))navigate("/login");
  });

  return (
    <div>
      <h1>Edit Profile Page</h1>
      <br />
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {preview && <img src={preview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
      <br />
      <br />
      <button onClick={uploadImage} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
      <br />
      <br />
      <button onClick={()=>navigate(`/profile/${user.userName}`)}>back</button>
    </div>
  );
}

export default EditProfilePage;