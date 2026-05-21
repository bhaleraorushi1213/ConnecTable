import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import ProfilePageView from "./ProfilePageView";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    userName: authUser?.userName || "",
    bio: authUser?.bio || "",
  });
  const [imagePreview, setImagePreview] = useState(null);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        ...formData,
        profilePicture: imagePreview || undefined,
      });
      setIsEditing(false);
      setImagePreview(null);
    } catch (error) {
      console.log("Error saving profile", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    setFormData({
      fullName: authUser?.fullName || "",
      userName: authUser?.userName || "",
      bio: authUser?.bio || "",
    });
  };

  return (
    <ProfilePageView {...{
      isEditing,
      setIsEditing,
      formData,
      setFormData,
      imagePreview,
      setImagePreview,
      handleImageChange,
      handleSave, 
      handleCancel
    }} />
  )
}

export default ProfilePage;