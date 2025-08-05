import React, { useEffect, useState } from "react";
import api from "../api";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingImage, setEditingImage] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Error fetching admin profile", err);
      }
    };

    fetchAdmin();
  }, []);

  const handleImageSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      const res = await api.put("/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
      setEditingImage(false);
      setPreviewImage(null);
    } catch (err) {
      console.error("Failed to update profile image", err);
    }
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem("token");

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await api.put("/auth/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Failed to change password", err);
      alert("Password update failed");
    }
  };

  if (!admin) return <p className="text-center mt-12 text-gray-500">Loading...</p>;

  return (
    <div className="flex justify-center px-4 mt-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">👑 Admin Profile</h2>

        {admin.profileImage ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/uploads/${admin.profileImage}`}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 shadow-md">
            {admin.name?.slice(0, 2).toUpperCase()}
          </div>
        )}

        <p className="mt-4 text-lg font-semibold">👤 {admin.name}</p>
        <p className="text-gray-600">📧 {admin.email}</p>

        {editingImage && (
          <div className="mt-4 space-y-2">
            <input
              type="file"
              onChange={(e) => {
                setProfileImage(e.target.files[0]);
                setPreviewImage(URL.createObjectURL(e.target.files[0]));
              }}
              className="w-full"
            />
            {previewImage && (
              <img
                src={previewImage}
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
            )}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleImageSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingImage(false);
                  setPreviewImage(null);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setEditingImage(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit Profile Photo
          </button>
          <button
            onClick={() => setShowPasswordForm(true)}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-4 w-full space-y-2 text-left">
            {["current", "new", "confirm"].map((field, idx) => (
              <div key={idx} className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  placeholder={
                    field === "current"
                      ? "Current Password"
                      : field === "new"
                      ? "New Password"
                      : "Confirm New Password"
                  }
                  className="w-full p-2 border rounded pr-10"
                  value={passwords[field + "Password"] ?? passwords[field]}
                  onChange={(e) =>
                    setPasswords({ ...passwords, [field + "Password"]: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, [field]: !showPassword[field] })
                  }
                  className="absolute right-2 top-2 text-sm text-gray-500"
                >
                  {showPassword[field] ? "Hide" : "Show"}
                </button>
              </div>
            ))}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handlePasswordChange}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;