import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', pricePerDay: '', image: null });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.isAdmin) return navigate("/");

        const [listingsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/listings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setListings(listingsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Error loading admin data:", err);
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error("Failed to delete listing");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user");
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setForm({ title: listing.title, description: listing.description, pricePerDay: listing.pricePerDay, image: null });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', description: '', pricePerDay: '', image: null });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("pricePerDay", form.pricePerDay);
    if (form.image) data.append("image", form.image);

    try {
      const res = await axios.put(`http://localhost:5000/api/admin/listings/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => prev.map(l => l._id === id ? res.data.listing : l));
      handleCancelEdit();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("pricePerDay", form.pricePerDay);
    if (form.image) data.append("image", form.image);

    try {
      const res = await axios.post("http://localhost:5000/api/listings", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(prev => [res.data, ...prev]);
      setCreating(false);
      setForm({ title: '', description: '', pricePerDay: '', image: null });
    } catch (err) {
      console.error("Creation failed", err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error("Failed to update booking status", err);
    }
  };

  return (
<div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">📊 Admin Dashboard</h1>

      <section className="mb-10">
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">📷 Listings</h2>
          <button onClick={() => setCreating(true)} className="bg-green-600 text-white px-3 py-1 rounded">+ New Listing</button>
        </div>
        {creating && (
          <div className="border p-4 rounded mb-6">
            <input type="text" placeholder="Title" className="w-full mb-2 p-1 border" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="Description" className="w-full mb-2 p-1 border" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input type="number" placeholder="Price/Day" className="w-full mb-2 p-1 border" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} />
            <input type="file" className="w-full mb-2" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
              <button onClick={() => setCreating(false)} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
            </div>
          </div>
        )}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(listing => (
            <div key={listing._id} className="p-4 border rounded shadow">
              {editingId === listing._id ? (
                <>
                  <input type="text" value={form.title} className="w-full mb-2 p-1 border" onChange={e => setForm({ ...form, title: e.target.value })} />
                  <textarea value={form.description} className="w-full mb-2 p-1 border" onChange={e => setForm({ ...form, description: e.target.value })} />
                  <input type="number" value={form.pricePerDay} className="w-full mb-2 p-1 border" onChange={e => setForm({ ...form, pricePerDay: e.target.value })} />
                  <input type="file" className="w-full mb-2" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(listing._id)} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                    <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <img src={`http://localhost:5000/${listing.image}`} alt={listing.title} className="h-40 w-full object-contain mb-2 rounded" />
                  <h3 className="font-bold">{listing.title}</h3>
                  <p>{listing.description}</p>
                  <p className="text-blue-600 font-semibold">{listing.pricePerDay.toLocaleString()}Ks / day</p>
                  <p className="text-sm text-gray-600 mt-1">Category: {listing.category} | Created: {new Date(listing.createdAt).toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEdit(listing)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDeleteListing(listing._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">👥 Users</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user._id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{user.name} ({user.email})</p>
                <p className="text-sm text-gray-600">{user.isAdmin ? 'Admin' : 'User'}</p>
              </div>
<div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

{showUserModal && selectedUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl text-center">
      <h2 className="text-xl font-bold text-blue-700 mb-4">👤 User Details</h2>
      
<img
  src={selectedUser.profileImage
    ? `http://localhost:5000/uploads/${selectedUser.profileImage}`
    : "https://via.placeholder.com/96"}
  alt="Profile"
  className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border shadow"
/>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
            <p><strong>Address:</strong> {selectedUser.address || "N/A"}</p>
            <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            <p><strong>Role:</strong> {selectedUser.isAdmin ? "Admin" : "User"}</p>

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

<section className="mt-10">
  <h2 className="text-xl font-semibold mb-4">📅 Bookings</h2>
  <ul className="space-y-4">
    {bookings.map(booking => (
      <li key={booking._id} className="border p-4 rounded shadow">
        <p><strong>User:</strong> {booking.user?.name} ({booking.user?.email})</p>
        <p><strong>Listing:</strong> {booking.listing?.title}</p>
        <p><strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Payment:</strong> Cash on Delivery</p> {/* ← ✅ ADD THIS LINE */}
        <p className="text-sm text-gray-500">Booked at: {new Date(booking.createdAt).toLocaleString()}</p>

        <p className={`mt-1 font-semibold ${booking.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'}`}>
          Status: {booking.status}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <label className="font-semibold">Change Status:</label>
          <select
            value={booking.status}
            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </li>
    ))}
  </ul>
</section>
    </div>
  );
}

export default AdminDashboard;