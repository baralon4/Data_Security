import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getFromLocalStorage } from "../utils/services.js";
import "./Admin.css";

function Admin() {

  const navigate = useNavigate();

  //role is admin ?
  useEffect(() => {
    const user = getFromLocalStorage("userData");
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  //logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <h1>Welcome, Admin!</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Admin;
