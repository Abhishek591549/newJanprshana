import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    ward_number: "",
    live_location: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, live_location: location }));
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      Swal.fire("Unauthorized", "Please login first", "error");
      return;
    }

    const data = new FormData();
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("ward_number", formData.ward_number);
    data.append("live_location", formData.live_location);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/complaints/submit/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Success", "Complaint submitted successfully", "success");
        setFormData({
          category: "",
          description: "",
          ward_number: "",
          live_location: "",
        });
        setImage(null);
      } else {
        Swal.fire("Error", result.error || "Submission failed", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-blueGray-200 px-4 py-10">
  <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden border border-blueGray-300">

    {/* 🚀 Left - Complaint Form */}
    <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 bg-white">
      <h2 className="text-2xl font-bold text-blueGray-700 mb-2 text-center">Submit Complaint</h2>
      <p className="text-xs text-blueGray-500 mb-6 text-center">Your issue will be resolved shortly</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-blueGray-600 mb-1">Complaint Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border-0 px-3 py-2 bg-white rounded shadow focus:outline-none focus:ring text-sm text-blueGray-700"
          >
            <option value="">-- Select Category --</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Garbage">Garbage</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-blueGray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            className="w-full border-0 px-3 py-2 bg-white rounded shadow text-sm text-blueGray-700 focus:outline-none focus:ring"
          />
        </div>

        {/* Ward Number */}
        <div>
          <label className="block text-xs font-bold text-blueGray-600 mb-1">Ward Number</label>
          <input
            type="number"
            name="ward_number"
            value={formData.ward_number}
            onChange={handleChange}
            min={1}
            required
            className="w-full border-0 px-3 py-2 bg-white rounded shadow text-sm text-blueGray-700 focus:outline-none focus:ring"
          />
        </div>

        {/* Upload Image */}
        <div>
          <label className="block text-xs font-bold text-blueGray-600 mb-1">Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-blueGray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blueGray-100 file:text-blueGray-700 hover:file:bg-blueGray-200"
          />
        </div>

        {/* Live Location */}
        <div>
          <label className="block text-xs font-bold text-blueGray-600 mb-1">Live Location</label>
          <input
            type="text"
            name="live_location"
            value={formData.live_location}
            readOnly
            className="w-full px-3 py-2 rounded bg-blueGray-100 text-sm text-blueGray-600 border-0 shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-lightBlue-600 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg transition"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>

    {/* 📋 Right - Instructions */}
    <div className="w-full md:w-1/2 p-8 bg-white border-l border-blueGray-200">
      <div className="rounded p-6 bg-blueGray-100 shadow-inner h-full">
        <h2 className="text-2xl font-bold text-blueGray-700 mb-2">📋 Instructions</h2>
        <p className="text-xs text-blueGray-500 mb-4">Please follow these steps before submitting</p>
        <hr className="border-blueGray-300 mb-6" />

        <ul className="space-y-4 text-sm text-blueGray-700">
          <li className="flex items-start gap-2">
            <span className="text-xl">✅</span>
            <span>Select the correct <strong>complaint category</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">📝</span>
            <span>Describe your <strong>issue clearly</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">🏷️</span>
            <span>Provide an <strong>accurate ward number</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">📸</span>
            <span>Upload an <strong>image if available</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-xl">📍</span>
            <span>Enable <strong>location access</strong> for better support.</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</div>


  );
}
