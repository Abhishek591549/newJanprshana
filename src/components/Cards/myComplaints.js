import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaArrowRight, FaHourglassStart, FaCheckCircle, FaTimesCircle, FaTools } from "react-icons/fa";
import "assets/styles/tailwind.css"; // Ensure Tailwind is included

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    Resolved: {
      label: "Resolved",
      icon: <FaCheckCircle />,
      color: "status-green",
    },
    Pending: {
      label: "Pending",
      icon: <FaHourglassStart />,
      color: "status-yellow",
    },
    Rejected: {
      label: "Rejected",
      icon: <FaTimesCircle />,
      color: "status-red",
    },
    Working: {
      label: "Working",
      icon: <FaTools />,
      color: "status-blue",
    },
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire("Unauthorized", "Please login first", "error");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/mine/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setComplaints(data);
        } else {
          Swal.fire("Error", "Failed to fetch complaints", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      }
      setLoading(false);
    };

    fetchComplaints();
  }, []);

  const openComplaintModal = (comp) => {
    const normalizedStatus = comp.status
      ? comp.status.charAt(0).toUpperCase() + comp.status.slice(1).toLowerCase()
      : "";
    const status = statusConfig[normalizedStatus] || {
      label: comp.status,
      icon: "?",
    };

    Swal.fire({
      title: `<strong>${comp.category}</strong>`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>📍 Ward:</strong> ${comp.ward_number}</p>
          <p><strong>📌 Location:</strong> ${comp.live_location}</p>
          <p><strong>🗕️ Date:</strong> ${new Date(comp.created_at).toLocaleString()}</p>
          <p><strong>📝 Description:</strong> ${comp.description}</p>
          <p><strong>Status:</strong> ${status.label}</p>
          ${comp.image ? `<img src="${comp.image}" class="modal-image" loading="lazy"/>` : ""}
        </div>
      `,
      confirmButtonText: "Close",
      width: "600px",
    });
  };

  if (loading)
    return <div className="loading">Loading complaints...</div>;

  if (complaints.length === 0)
    return (
      <div className="empty">
        <div className="empty-box">
          <h2>No Complaints Found</h2>
          <p>You haven't submitted any complaints yet.</p>
        </div>
      </div>
    );

  return (
    <div className="page">
      <h2 className="title">📝 My Complaints</h2>
      <div className="card-container">
        {complaints.map((comp) => {
          const normalizedStatus = comp.status
            ? comp.status.charAt(0).toUpperCase() + comp.status.slice(1).toLowerCase()
            : "";
          const status = statusConfig[normalizedStatus] || {
            label: comp.status,
            icon: "?",
            color: "status-default",
          };

          return (
            <div key={comp.id} className="card hover-card">
              <div className={`card-status ${status.color}`}>
                <span className="status-icon">{status.icon}</span>
                <span>{status.label}</span>
              </div>
              <div className="card-category">{comp.category}</div>
              <button
                className="card-button card-button-blue"
                onClick={() => openComplaintModal(comp)}
              >
                Read More <FaArrowRight className="arrow" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}