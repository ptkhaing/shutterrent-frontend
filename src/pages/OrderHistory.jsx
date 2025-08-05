import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ visible: false, bookingId: null });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setConfirmModal({ visible: false, bookingId: null });
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setConfirmModal({ visible: false, bookingId: null });
    }
  };

  return (
    <div className="p-8 relative">
      <h2 className="text-3xl font-bold mb-6 text-center">My Booking History</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no past bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{booking.listing?.title}</h3>
              <p><span className="font-medium">From:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
              <p><span className="font-medium">To:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
              <p className="text-gray-600 text-sm mt-2">{booking.listing?.description}</p>
              <p className="text-blue-600 font-semibold mt-2">{booking.listing?.pricePerDay.toLocaleString()}Ks per day</p>
              <p><span className="font-medium">Status:</span>{" "}
                <span className={
                  booking.status === "Confirmed"
                    ? "text-green-600 font-semibold"
                    : "text-gray-500 font-semibold"
                }>
                  {booking.status}
                </span>
              </p>
              <p><span className="font-medium">Payment:</span> {booking.paymentMethod || "Cash on Delivery"}</p>
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setConfirmModal({ visible: true, bookingId: booking._id })}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Cancel Booking?</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setConfirmModal({ visible: false, bookingId: null })}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleCancel(confirmModal.bookingId)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;