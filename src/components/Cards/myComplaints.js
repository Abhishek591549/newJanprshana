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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading complaints...
        </div>
      </div>
    );

  if (complaints.length === 0)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No complaints found.
          </h2>
          <p className="text-gray-500 text-sm">
            You haven't submitted any complaints yet.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blueGray-800 mb-8 text-center">
          📝 My Complaints
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {complaints.map((comp) => (
            <div
              key={comp.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-blueGray-700">
                    {comp.category}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full 
                      ${
                        comp.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : comp.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {comp.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3 min-h-[72px]">
                  {comp.description}
                </p>

                {comp.image && (
                  <img
                    src={comp.image}
                    alt="Complaint"
                    className="w-full h-40 object-cover rounded-lg mb-4 shadow"
                  />
                )}

                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-600">
                      🧭 Ward:
                    </span>{" "}
                    {comp.ward_number}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">📍 Location:</span>{" "}
                    {comp.live_location}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">📅 Date:</span>{" "}
                    {new Date(comp.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
