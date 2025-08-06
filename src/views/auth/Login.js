import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import img1 from "../../assets/img/profile.jpg";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("is_superuser", data.is_superuser);
        localStorage.setItem("is_staff", data.is_staff);
        localStorage.setItem("isLoggedIn", "true");

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        Swal.fire("Success", data.message || "Login successful!", "success");

        if (data.is_superuser || data.is_staff) {
          props.history.push("/admin/admindashboard");
        } else {
          props.history.push("/admin/dashboard");
        }
      } else {
        Swal.fire("Error", data.detail || data.error || "Invalid credentials", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-blueGray-900">
    <div className="w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] p-6 ">
      <div className="flex w-full h-full">
        {/* LEFT: Form Section */}
        <div className="w-1/2 h-[100%] flex flex-col justify-center px-6">
          <div className="relative flex flex-col w-full shadow-lg rounded-lg bg-blueGray-200 border-0 h-full">
            <div className="rounded-t px-6 py-4">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">Sign In</h6>
              </div>
              <hr className="mt-3 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-6 py-4 overflow-y-auto">
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-blueGray-600 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded shadow text-sm text-blueGray-600 bg-white"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-blueGray-600 text-xs font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded shadow text-sm text-blueGray-600 bg-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4">
                  <button
                    className="bg-blueGray-800 text-white text-sm font-bold uppercase w-full py-2 rounded shadow hover:shadow-lg"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
            <div className="flex px-6 pb-2 pt-1 text-xs justify-between text-blueGray-400">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
              <Link to="/auth/register">Create new account</Link>
            </div>
          </div>
        </div>

        {/* RIGHT: Image Section */}
        <div className="w-1/2 h-full hidden md:block">
          <img
            src={img1}
            alt="Login visual"
            className="w-full h-full object-cover rounded-r-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

}

export default withRouter(Login);