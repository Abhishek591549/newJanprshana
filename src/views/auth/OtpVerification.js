import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";

function OtpVerification(props) {
  const [otp, setOtp] = useState("");

  // 🌐 Get email from state or localStorage
  const email = props.location.state?.email || localStorage.getItem("otp_email");

  useEffect(() => {
    if (!email) {
      Swal.fire("Error", "Invalid access. Please register first.", "error");
      props.history.push("/auth/register");
    }
  }, [email, props.history]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", data.message || "OTP Verified!", "success");
        localStorage.removeItem("otp_email");
        props.history.push("/auth/login");
      } else {
        Swal.fire("Error", data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  if (!email) return null; // Don’t render form if no email

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t mb-0 px-6 py-6 text-center">
              <h6 className="text-blueGray-500 text-sm font-bold">
                OTP Verification
              </h6>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleOtpSubmit}>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Enter OTP sent to {email}
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  />
                </div>

                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                    type="submit"
                  >
                    Verify OTP
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

export default withRouter(OtpVerification);
