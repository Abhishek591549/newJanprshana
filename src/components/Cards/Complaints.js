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
    <div className="container mx-auto px-4 h-full flex content-center items-center justify-center">
      <div className="w-full lg:w-5/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t mb-0 px-6 py-6 text-center">
            <h6 className="text-blueGray-500 text-sm font-bold">Submit Complaint</h6>
            <hr className="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Category Dropdown */}
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="border-0 px-3 py-3 bg-white text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue"
                  rows="4"
                  required
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                ></textarea>
              </div>

              {/* Ward Number */}
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Ward Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="ward_number"
                  value={formData.ward_number}
                  onChange={handleChange}
                  min={1}
                  placeholder="Enter ward number"
                  required
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                />
              </div>

              {/* Image Upload */}
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-0 w-full text-sm"
                />
              </div>

              {/* Live Location */}
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Live Location
                </label>
                <input
                  type="text"
                  name="live_location"
                  value={formData.live_location}
                  readOnly
                  className="border-0 px-3 py-3 bg-gray-100 text-blueGray-600 rounded text-sm shadow w-full cursor-not-allowed"
                  placeholder="Fetching location..."
                />
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
