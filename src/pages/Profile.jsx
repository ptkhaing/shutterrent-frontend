import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', profileImage: null });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);
        setForm({
          name: userRes.data.name || '',
          phone: userRes.data.phone || '',
          address: userRes.data.address || '',
          profileImage: null
        });
      } catch (err) {
        console.error('Error loading profile data', err);
      }
    };

    fetchData();
  }, []);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem('token');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setSuccessMessage("❌ New passwords do not match!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/auth/change-password", passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPasswordForm(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccessMessage("✅ Password updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Password update failed", err);
      setSuccessMessage("❌ Failed to update password");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("address", form.address);
    if (form.profileImage) data.append("profileImage", form.profileImage);

    try {
      const res = await axios.put("http://localhost:5000/api/user/update", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!user) return <p className="text-center mt-12 text-gray-500">Loading profile...</p>;

  return (
    <div className="flex justify-center px-4 mt-12">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          {user.profileImage ? (
            <img
              src={`http://localhost:5000/uploads/${user.profileImage}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 shadow-md">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">👤 User Profile</h2>

          {editing ? (
            <div className="space-y-3">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input type="text" placeholder="Phone" className="w-full p-2 border rounded" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input type="text" placeholder="Address" className="w-full p-2 border rounded" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              <input type="file" onChange={e => setForm({ ...form, profileImage: e.target.files[0] })} className="w-full" />
              <div className="flex gap-4 pt-2">
                <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setEditing(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-lg">
              <p><span className="font-semibold">👤 Name:</span> {user.name}</p>
              <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
              <p><span className="font-semibold">📞 Phone:</span> {user.phone || "Not set"}</p>
              <p><span className="font-semibold">🏡 Address:</span> {user.address || "Not set"}</p>
              <p><span className="font-semibold">🔐 Role:</span> {user.isAdmin ? "Admin" : "User"}</p>
              <p><span className="font-bold">📅 Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>

              <div className="flex gap-4 mt-4">
                <button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">Edit Profile</button>
                <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow">Change Password</button>
              </div>
              {successMessage && (
  <p className={`mt-2 text-sm font-medium ${successMessage.includes("✅") ? "text-green-600" : "text-red-600"}`}>
    {successMessage}
  </p>
)}

{showPasswordForm && (
  <div className="mt-4 w-full space-y-2">
    {["currentPassword", "newPassword", "confirmPassword"].map((field, i) => {
      const label = ["Current Password", "New Password", "Confirm New Password"][i];
      const key = ["current", "new", "confirm"][i];
      return (
<div className="relative" key={key}>
  <label className="block text-sm font-medium mb-1">{label}</label>
  <input
    type={showPassword[key] ? "text" : "password"}
    placeholder={label}
    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none pr-16"
    value={passwords[field]}
    onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
  />
  <button
    type="button"
    onClick={() => togglePassword(key)}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm hover:underline"
  >
    {showPassword[key] ? "Hide" : "Show"}
  </button>
</div>
      );
    })}

    <div className="flex gap-4 pt-2">
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
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;