import React, { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "/Jan frontend/notus-react-main/src/views/auth/config.js";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTools,
  FaArrowRight,
} from "react-icons/fa";

function AdminComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedWard, setSelectedWard] = useState("all");
  const accessToken = localStorage.getItem("access_token");

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Working", value: "working" },
    { label: "Resolved", value: "resolved" },
    { label: "Rejected", value: "rejected" },
  ];

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <FaHourglassHalf className="text-yellow-500" />,
      color: "bg-yellow-100 text-yellow-800",
    },
    working: {
      label: "Working",
      icon: <FaTools className="text-blue-500" />,
      color: "bg-blue-100 text-blue-800",
    },
    resolved: {
      label: "Resolved",
      icon: <FaCheckCircle className="text-green-500" />,
      color: "bg-green-100 text-green-800",
    },
    rejected: {
      label: "Rejected",
      icon: <FaTimesCircle className="text-red-500" />,
      color: "bg-red-100 text-red-800",
    },
  };

  const fetchComplaints = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/complaints/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComplaints(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch complaints", "error");
    }
  }, [accessToken]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/auth/complaints/${complaintId}/status/`,
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
      Swal.fire("Error", "Could not update complaint status", "error");
    }
  };

  const openComplaintModal = (complaint) => {
    const statusOptionsHtml = statusOptions
      .map(
        (s) =>
          `<option value="${s.value}" ${
            s.value === complaint.status ? "selected" : ""
          }>${s.label}</option>`
      )
      .join("");

    Swal.fire({
      title: `<strong>${complaint.full_name}</strong>`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>📍 Ward:</strong> ${complaint.ward_number}</p>
          <p><strong>📌 Location:</strong> ${complaint.live_location}</p>
          <p><strong>📂 Category:</strong> ${complaint.category}</p>
          <p><strong>📝 Description:</strong> ${complaint.description}</p>
          ${
            complaint.image
              ? `<img src="${BACKEND_URL}${complaint.image}" class="w-full mt-3 rounded-lg shadow" style="max-height: 200px; object-fit: cover;" />`
              : ""
          }
          <div class="mt-4 text-left">
            <label><strong>Update Status</strong></label>
            <select id="statusSelect" class="swal2-select" style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
              ${statusOptionsHtml}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update Status",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const newStatus = document.getElementById("statusSelect").value;
        if (newStatus !== complaint.status) {
          return handleStatusUpdate(complaint.id, newStatus);
        }
      },
      width: "600px",
    });
  };

  const filteredComplaints =
    selectedWard === "all"
      ? complaints
      : complaints.filter((c) => String(c.ward_number) === selectedWard);

  return (
    <div className="page">
      <h2 className="title">🛠️ Complaints Management</h2>

      {/* Ward Filter */}
      <div className="flex justify-end mb-8">
        <select
          className="border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
        >
          <option value="all">All Wards</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              Ward {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Complaint Cards */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-box">
          <h2>No complaints found for selected ward.</h2>
        </div>
      ) : (
        <div className="card-container">
          {filteredComplaints.map((complaint) => {
            const status = statusConfig[complaint.status] || {
              label: complaint.status,
              icon: null,
              color: "bg-gray-100 text-gray-700",
            };

            return (
              <div key={complaint.id} className="card hover-card">
                {complaint.image && (
                  <div className="w-full h-44 rounded-xl overflow-hidden mb-3">
                    <img
                      src={`${BACKEND_URL}${complaint.image}`}
                      alt="Complaint"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="text-lg font-bold text-slate-800 text-center">
                  {complaint.category}
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>

                <button
                  onClick={() => openComplaintModal(complaint)}
                  className="mt-5 card-button card-button-blue"
                >
                  View Complaint <FaArrowRight className="ml-2 inline-block text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminComplaintsDashboard;
