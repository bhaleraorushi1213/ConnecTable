import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/useAuthStore.js";

import { Camera, ArrowLeft, Check, X } from "lucide-react";

import Avatar from "../../../assets/default-avatar.png";

const ProfilePageView = (props) => {
  const {
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    imagePreview,
    handleImageChange,
    handleSave,
    handleCancel
  } = props;

  const { authUser, isUpdatingProfile, deleteAccount } = useAuthStore();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const renderDeleteAccountField = () => {
    return (
      <div className="mt-8 border border-red-500/20 rounded-xl p-4">
        <h3 className="text-red-400 text-sm font-bold mb-3">Danger Zone</h3>
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
              try {
                await deleteAccount();
                navigate("/login");
              } catch (error) {
                console.error("Failed to delete account:", error);
              }
            }
          }}
          className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          Delete Account
        </button>
      </div>
    )
  };

  const renderAccountStatusField = () => {
    return (
      <div className="bg-base-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-base-content/60 uppercase tracking-wider mb-1">
            Account Status
          </p>
          <p className="text-base-content text-sm">Active</p>
        </div>
        <span className="size-3 bg-green-500 rounded-full" />
      </div>
    )
  };

  const renderMemberSinceField = () => {
    return (
      <div className="bg-base-200 rounded-xl p-4">
        <p className="text-xs text-base-content/60 uppercase tracking-wider mb-2">
          Member Since
        </p>
        <p className="text-base-content text-sm">
          {new Date(authUser?.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    )
  };

  const renderEmailField = () => {
    return (
      <div className="bg-base-200 rounded-xl p-4">
        <p className="text-xs text-base-content/60 uppercase tracking-wider mb-2">
          Email
        </p>
        <p className="text-base-content/60 text-sm">{authUser?.email}</p>
      </div>
    )
  };

  const renderBioField = () => {
    return (
      <div className="bg-base-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-base-content/60 uppercase tracking-wider">
            Bio
          </p>
          {isEditing && (
            <span className={`text-xs ${formData.bio.length > 130 ? "text-red-400" : "text-base-content/40"}`}>
              {formData.bio.length}/150
            </span>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                setFormData({ ...formData, bio: e.target.value });
              }
            }}
            className="w-full bg-transparent text-base-content outline-none text-sm resize-none border-b border-slate-600 pb-1 focus:border-primary transition-colors"
            placeholder="Write something about yourself..."
            rows={3}
          />
        ) : (
          <p className="text-base-content text-sm">
            {authUser?.bio || (
              <span className="text-base-content/40 italic">No bio yet</span>
            )}
          </p>
        )}
      </div>
    )
  };

  const renderUsernameField = () => {
    return (
      <div className="bg-base-200 rounded-xl p-4">
        <p className="text-xs text-base-content/60 uppercase tracking-wider mb-2">
          Username
        </p>
        {isEditing ? (
          <div className="flex items-center gap-1 border-b border-slate-600 pb-1 focus-within:border-primary transition-colors">
            <span className="text-base-content/60 text-sm">@</span>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="flex-1 bg-transparent text-base-content outline-none text-sm"
              placeholder="username"
            />
          </div>
        ) : (
          <p className="text-base-content text-sm">@{authUser?.userName}</p>
        )}
      </div>
    )
  };

  const renderFullNameField = () => {
    return (
      <div className="bg-base-200 rounded-xl p-4">
        <p className="text-xs text-base-content/60 uppercase tracking-wider mb-2">
          Full Name
        </p>
        {isEditing ? (
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full bg-transparent text-base-content outline-none text-sm border-b border-slate-600 pb-1 focus:border-primary transition-colors"
            placeholder="Your full name"
          />
        ) : (
          <p className="text-base-content text-sm">{authUser?.fullName}</p>
        )}
      </div>
    )
  };

  const renderAvatar = () => {
    return (
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={imagePreview || authUser?.profilePicture || Avatar}
            alt="Profile"
            className="size-28 rounded-full object-cover border-4 border-primary/30"
          />
          {isEditing && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 size-9 bg-primary rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors shadow-lg"
              >
                <Camera className="size-5 text-base-content" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        {!isEditing && (
          <div className="mt-4 text-center">
            <h2 className="text-base-content text-xl font-bold">
              {authUser?.fullName}
            </h2>
            <p className="text-base-content/60 text-sm">@{authUser?.userName}</p>
          </div>
        )}
      </div>
    )
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-200 bg-base-200 fixed w-full z-10">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle btn-sm text-base-content/60"
        >
          <ArrowLeft className="size-5 text-base-content" />
        </button>
        <h1 className="text-base-content font-bold text-lg">Profile</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="btn btn-ghost btn-circle btn-sm text-base-content/60"
            >
              <X className="size-5" />
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdatingProfile}
              className="btn btn-ghost btn-circle btn-sm text-primary"
            >
              {isUpdatingProfile
                ? <span className="loading loading-spinner loading-xs" />
                : <Check className="size-5" />
              }
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary text-sm font-medium"
          >
            Edit
          </button>
        )}
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-base-100 mt-16">

      {renderHeader()}

      <div className="max-w-lg mx-auto px-4 pb-8 pt-20">

        {renderAvatar()}

        <div className="flex flex-col gap-4">

          {renderFullNameField()}

          {renderUsernameField()}

          {renderBioField()}

          {renderEmailField()}

          {renderMemberSinceField()}

          {renderAccountStatusField()}

        </div>
        {renderDeleteAccountField()}
      </div>
    </div>
  );
};

export default ProfilePageView;