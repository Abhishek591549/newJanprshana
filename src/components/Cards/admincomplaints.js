import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUsers, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

function AdminComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Working", value: "working" },
    { label: "Resolved", value: "resolved" },
    { label: "Rejected", value: "rejected" },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    working: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/complaints/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Swal.fire("Error", "Failed to fetch complaints", "error");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint || complaint.status === newStatus) return;

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/auth/complaints/${complaintId}/status/`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Swal.fire("Updated!", "Complaint status updated successfully", "success");
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error", "Could not update complaint status", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
        <FaUsers className="inline-block mr-2" />
        Complaints Management
      </h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {complaints.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No complaints found.</p>
        )}

        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white shadow-xl rounded-2xl p-5 hover:shadow-indigo-300 transition duration-300"
          >
            <div className="mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{complaint.full_name}</h3>
              <p className="text-sm text-gray-500">Ward No: {complaint.ward_no}</p>
            </div>

            <p className="text-gray-700 mb-2">
              <span className="font-medium">Category:</span> {complaint.category}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">Description:</span> {complaint.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[complaint.status]}`}
              >
                {complaint.status.toUpperCase()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Update Status:
              </label>
              <select
                value={complaint.status}
                onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminComplaintsDashboard;
