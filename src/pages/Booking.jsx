import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    api.get(`/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(() => setMessage('Failed to load listing'))
  }, [id, navigate])

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await api.post(`/bookings`, {
        listingId: id,
        startDate,
        endDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMessage('✅ Booking successful!')
      setTimeout(() => navigate('/profile'), 2000)
    } catch (err) {
      setMessage('❌ Booking failed')
    }
  }

  if (!listing) return <p className="text-center mt-12 text-gray-600">Loading listing...</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{listing.title}</h2>

      <div className="flex justify-center mb-6">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${listing.image}`}
          alt={listing.title}
          className="max-w-xs md:max-w-md lg:max-w-lg w-full h-auto rounded shadow"
        />
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (!agree) {
          setMessage("❌ Please agree to pay on delivery");
          return;
        }
        setShowConfirm(true);
      }} className="space-y-4">
        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <div className="w-full border p-2 rounded bg-gray-100 text-gray-700">
            💵 Cash on Delivery (Pay upon receiving the item)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I agree to pay in cash when the item is delivered
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Confirm Booking
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-3">Confirm Booking</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to book this item and pay in cash upon delivery?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Yes, Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mt-4 text-center px-4 py-2 rounded ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default Booking