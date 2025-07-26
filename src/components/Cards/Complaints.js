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

  // Automatically get geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, live_location: location }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Optionally notify user here if needed
        }
      );
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file input
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submit
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
          // Don't set Content-Type header with FormData; browser does it automatically
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
        // Backend returns {'error': '...'}, so check for that:
        Swal.fire("Error", result.error || "Submission failed", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-center text-xl font-bold mb-6">Submit Complaint</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="category">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue"
              rows="4"
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="ward_number">
              Ward Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="ward_number"
              name="ward_number"
              value={formData.ward_number}
              onChange={handleChange}
              placeholder="Enter ward number"
              required
              min={1}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="image">
              Image (optional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="live_location">
              Live Location
            </label>
            <input
              type="text"
              id="live_location"
              name="live_location"
              value={formData.live_location}
              readOnly
              placeholder="Fetching location..."
              className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}
