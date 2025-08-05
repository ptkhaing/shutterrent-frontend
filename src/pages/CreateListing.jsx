import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CreateListing() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('pricePerDay', pricePerDay)
      if (image) formData.append('image', image)

      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/listings', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      navigate('/listings')
    } catch (err) {
      setError('Failed to create listing. Make sure you are logged in.')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Create a New Camera Listing</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Camera Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price per day (USD)"
          className="w-full border p-2 rounded"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Listing
        </button>
      </form>
    </div>
  )
}

export default CreateListing