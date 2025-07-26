import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // ✅ React Router v5
import Swal from "sweetalert2";

export default function Register() {
  const history = useHistory(); // ✅ For navigation in React Router v5

  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    mobile_number: "",
    email: "",
    home_number: "",
    ward_number: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", data.message || "Registration successful", "success");

        localStorage.setItem("otp_email", form.email); // Store for fallback

        // ✅ Navigate with state in React Router v5
        history.push({
          pathname: "/auth/otp-verification",
          state: { email: form.email },
        });
      } else {
        const firstError = Object.values(data)[0];
        Swal.fire("Error", firstError || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6 text-center">
              <h6 className="text-blueGray-500 text-sm font-bold">Register</h6>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleRegister}>
                {[
                  { label: "Full Name", name: "full_name", type: "text" },
                  { label: "Mobile Number", name: "mobile_number", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Home Number", name: "home_number", type: "text" },
                  { label: "Ward Number", name: "ward_number", type: "text" },
                  { label: "Gender", name: "gender", type: "text" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Confirm Password", name: "confirm_password", type: "password" },
                ].map(({ label, name, type }) => (
                  <div className="relative w-full mb-3" key={name}>
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      placeholder={label}
                    />
                  </div>
                ))}

                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                    type="submit"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
