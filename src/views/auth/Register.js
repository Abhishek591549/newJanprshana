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
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
    <div className="container mx-auto mt-1 -mb-6 px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-9">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-0 py-2 text-center">
              <h6 className="text-blueGray-500 text-sm  font-bold">Register</h6>
              <hr className="mt-2 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-2 lg:px-10 py-2 pt-0">
              <form onSubmit={handleRegister}>
               <div className="grid grid-cols-1 gap-6">
  {/* Full Name - Single line */}
  <div className="w-full">
    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
      Full Name
    </label>
    <input
      type="text"
      name="full_name"
      value={form.full_name}
      onChange={handleChange}
      required
      className="w-full border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
      placeholder="Full Name"
    />
  </div>

  {/* Email - Single line */}
  <div className="w-full">
    <label className="block uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2">
      Email
    </label>
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      required
      className="w-full border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
      placeholder="Email"
    />
  </div>

  {/* Mobile Number + Gender */}
  <div className="flex">
    <div className="w-1/2 pr-3">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2">
        Mobile Number
      </label>
      <input
        type="text"
        name="mobile_number"
        value={form.mobile_number}
        onChange={handleChange}
        required
        className="w-full border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
        placeholder="Mobile Number"
      />
    </div>
    <div className="w-1/2 pl-3">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2">
        Gender
      </label>
      <select
  name="gender"
  value={form.gender}
  onChange={handleChange}
  required
  className="w-full border-0 px-3 py-2 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
>
  <option value="">Select Gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="other">Other</option>
</select>

    </div>
  </div>

  {/* Home Number + Ward Number */}
  <div className="flex">
    <div className="w-1/2 pr-3">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2">
        Home Number
      </label>
      <input
        type="text"
        name="home_number"
        value={form.home_number}
        onChange={handleChange}
        required
        className="w-full border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
        placeholder="Home Number"
      />
    </div>
    <div className="w-1/2 pl-3">
      <label className="block uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2">
        Ward Number
      </label>
      <input
        type="text"
        name="ward_number"
        value={form.ward_number}
        onChange={handleChange}
        required
        className="w-full border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
        placeholder="Ward Number"
      />
    </div>
  </div>

{/* Password Field (Always Visible) */}
<div className="relative w-full mb-5">
  <label className="uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2 block">
    Password
  </label>
  <div className="relative">
    <input
      type="text" // 👈 Always visible
      name="password"
      value={form.password}
      onChange={handleChange}
      required
      className="w-full border-0 px-3 py-2 pr-10 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
      placeholder="Password"
    />
  </div>
</div>

{/* Confirm Password Field (With Toggle Icon) */}
<div className="relative w-full mb-5">
  <label className="uppercase text-blueGray-600 text-xs font-bold mt-2 mb-2 block">
    Confirm Password
  </label>
  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirm_password"
      value={form.confirm_password}
      onChange={handleChange}
      required
      placeholder="Confirm Password"
      className="w-full border-0 px-3 py-2 pr-10 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring"
    />
    <span
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
    >
      
    </span>
  </div>
</div>






</div>


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