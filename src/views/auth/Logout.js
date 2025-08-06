// src/components/auth/Logout.js

import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export default function Logout() {
  const history = useHistory();

  useEffect(() => {
    const logoutUser = async () => {
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
          localStorage.clear();
          Swal.fire("Logged Out", "You have been logged out successfully.", "success");
          history.push("/login");
        } else {
          Swal.fire("Error", "Logout failed. Try again.", "error");
        }
      } catch (error) {
        console.error("Logout error:", error);
        Swal.fire("Error", "Something went wrong!", "error");
      }
    };

    // Show confirmation before logout
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
      } else {
        history.goBack(); // Stay on previous page if canceled
      }
    });
  }, [history]);

  return null; // No visible UI
}
