import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    //check if the passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    //send a request to reset the password and handle the response
    try {
      const response = await fetch(`${BASE_URL}/users/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        navigate("/login");
      } else {
        alert(data.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="reset-page-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
