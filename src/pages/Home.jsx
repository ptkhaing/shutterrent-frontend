import React from 'react';
import heroImage from '../assets/hero.jpg';

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[400px] mb-6">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover rounded-b-3xl shadow-lg" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold">Capture Moments</h1>
          <p className="text-lg sm:text-xl mt-2">Rent premium cameras at affordable prices</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 lg:space-x-8">
        <div className="flex-1">
          {/* Welcome */}
          <section className="mb-12 text-center px-2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Welcome to ShutterRent</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Your trusted camera rental platform for professionals and enthusiasts.
            </p>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">How It Works</h3>
            <div className="grid gap-6 text-center sm:grid-cols-2 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                <h4 className="text-lg font-semibold mb-2">1. Browse Listings</h4>
                <p className="text-gray-600 text-sm sm:text-base">Explore various camera options with detailed descriptions and photos.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                <h4 className="text-lg font-semibold mb-2">2. Book & Pay</h4>
                <p className="text-gray-600 text-sm sm:text-base">Choose your dates, confirm availability, and pay securely online.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                <h4 className="text-lg font-semibold mb-2">3. Pick Up or Deliver</h4>
                <p className="text-gray-600 text-sm sm:text-base">Get your gear on time, either by delivery or pickup at your convenience.</p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-16">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Why Choose Us</h3>
            <ul className="list-disc max-w-xl mx-auto text-gray-700 space-y-2 px-4 sm:px-6 text-sm sm:text-base">
              <li>Affordable daily rental rates for all camera types</li>
              <li>Trusted platform with secure payments and verified users</li>
              <li>Convenient pickup & return options</li>
              <li>Easy-to-use website with real-time availability</li>
            </ul>
          </section>

          {/* Newsletter */}
          <section className="mb-20 text-center px-4">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Stay Updated</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thanks for subscribing!');
              }}
              className="flex flex-col sm:flex-row justify-center gap-2"
            >
              <input type="email" placeholder="Enter your email" className="px-4 py-2 border rounded w-full sm:w-72" required />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Subscribe
              </button>
            </form>
          </section>

          {/* FAQ */}
          <section className="mb-16 max-w-2xl mx-auto px-4">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">FAQ</h3>
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold">How do I rent a camera?</h4>
                <p className="text-gray-600">Sign in, browse listings, select your date, and book securely online.</p>
              </div>
              <div>
                <h4 className="font-semibold">Can I cancel my booking?</h4>
                <p className="text-gray-600">Yes, bookings can be canceled anytime from your profile page.</p>
              </div>
              <div>
                <h4 className="font-semibold">Do I need to pay in advance?</h4>
                <p className="text-gray-600">Yes, full payment is required during booking.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Ads */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-20 space-y-6">
            <div className="bg-white p-4 rounded shadow text-center">
              <h4 className="text-lg font-semibold mb-2">Sponsored Ad</h4>
              <img src="/ad1.jpg" alt="Ad 1" className="w-full h-40 object-cover rounded" />
              <p className="text-sm text-gray-600 mt-2">Ad 1</p>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <h4 className="text-lg font-semibold mb-2">Sponsored Ad</h4>
              <img src="/ad2.jpg" alt="Ad 2" className="w-full h-40 object-cover rounded" />
              <p className="text-sm text-gray-600 mt-2">Ad 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-6 text-center text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} ShutterRent. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;