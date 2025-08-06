import React from "react";

// components

export default function CardSettings() {
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-blue-100 px-4">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden">

        {/* Left: Complaint Form */}
        <div className="w-full lg:w-2/3 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Submit Complaint</h2>
          <p className="text-gray-500 text-sm mb-6">Your issue will be resolved shortly.</p>

          <form className="space-y-5">

            {/* Complaint Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Complaint Category</label>
              <select
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Category --</option>
                <option>Electricity</option>
                <option>Water</option>
                <option>Garbage</option>
                <option>Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Describe the issue..."
              />
            </div>

            {/* Ward Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ward Number</label>
              <input
                type="number"
                min="1"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter ward number"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Live Location</label>
              <input
                type="text"
                value="17.652177019916333, 75.2830447706575"
                readOnly
                className="w-full border border-gray-200 bg-gray-100 text-sm text-gray-700 rounded-md px-4 py-2 shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right: Instructions Panel */}
        <div className="hidden lg:flex w-full lg:w-1/3 items-center justify-center bg-blue-50 p-8 relative">
          <div className="absolute inset-0 bg-blue-300 opacity-10 blur-lg rounded-xl"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Instructions</h3>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li>• Select the correct complaint category.</li>
              <li>• Describe your issue clearly and briefly.</li>
              <li>• Ensure your ward number is accurate.</li>
              <li>• Upload an image to support your complaint.</li>
              <li>• Allow location access for accurate assistance.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
