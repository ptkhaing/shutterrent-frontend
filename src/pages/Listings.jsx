import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  const fetchCategories = async () => {
    try {
const res = await axios.get('https://shutterrent-backend.onrender.com/api/listings/categories');
      setCategories(res.data);
    } catch (err) {
      console.log('Failed to fetch categories');
    }
  };

  const fetchListings = async (category = '') => {
    try {
const res = await axios.get('https://shutterrent-backend.onrender.com/api/listings', {
        params: category ? { category } : {},
      });
      setListings(res.data);
    } catch (err) {
      console.log('Failed to fetch listings');
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchListings(category);
  };

  const handleBookClick = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate(`/book/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Browse Camera Listings</h2>

      <div className="mb-8 flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => handleCategoryClick('')}
          className={`px-4 py-2 rounded-full border ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white p-4 rounded shadow hover:shadow-lg">
            <img
src={`https://shutterrent-backend.onrender.com/${listing.image}`}
              alt={listing.title}
              className="w-full h-48 object-contain rounded mb-4"
            />
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p className="text-gray-600">{listing.description}</p>
            <p className="mt-2 font-medium">{listing.pricePerDay.toLocaleString()}Ks / day</p>
            <button
              onClick={() => handleBookClick(listing._id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;