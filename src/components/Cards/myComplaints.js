import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-xl font-semibold text-blueGray-700 animate-pulse">
          Loading complaints...
        </div>
      </div>
    );

  if (complaints.length === 0)
    return (
      <div className="flex justify-center items-center h-48 text-gray-400 text-lg">
        No complaints submitted yet.
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <h2 className="text-3xl font-extrabold mb-8 text-blueGray-900 tracking-wide">
        My Complaints
      </h2>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((comp) => (
          <div
            key={comp.id}
            className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-blueGray-800">{comp.category}</h3>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full 
                    ${
                      comp.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : comp.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {comp.status}
                </span>
              </div>

              <p className="text-gray-700 mb-4 min-h-[72px]">{comp.description}</p>

              {comp.image && (
                <img
                  src={comp.image}
                  alt="Complaint"
                  className="w-full h-40 object-cover rounded-lg mb-4 shadow-sm"
                />
              )}

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-semibold text-gray-600">Ward Number:</span>{" "}
                  {comp.ward_number}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Location:</span>{" "}
                  {comp.live_location}
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Submitted At:</span>{" "}
                  {comp.created_at}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
