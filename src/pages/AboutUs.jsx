import React from 'react';

function AboutUs() {
  return (
<div className="min-h-screen bg-gray-50 px-4 pt-6 pb-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">About ShutterRent</h1>
        <p className="text-gray-700 mb-4">
          At <strong>ShutterRent</strong>, we are passionate about making premium photography accessible to everyone.
          Whether you're a professional photographer, a traveler, or a content creator, our platform helps you rent
          top-quality cameras easily and affordably.
        </p>
        <p className="text-gray-700 mb-4">
          Founded in 2025, ShutterRent bridges the gap between equipment owners and creatives in need of gear—saving
          money, reducing waste, and encouraging collaboration. We offer a simple, secure, and efficient camera rental
          experience with a growing selection of DSLRs, mirrorless cameras, and more.
        </p>
        <p className="text-gray-700 mb-4">
          We’re here to empower visual storytellers to focus on what they do best—<em>capturing beautiful moments</em>.
        </p>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-600">📧 aamirptk95@gmail.com</p>
          <p className="text-gray-600">📍 Yangon, Myanmar</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;