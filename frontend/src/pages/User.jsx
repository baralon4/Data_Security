import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getFromLocalStorage } from "../utils/services.js";
import "./User.css";

function User() {
  const navigate = useNavigate();
  
  //role is user ?
  useEffect(() => {
    const user = getFromLocalStorage("userData");
    if (!user || user.role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  //logout
  const handleLogout = () => {
    logout();             
    navigate("/login");   
  };

  return (
    <div className="user-page">
      <h1>Welcome, User!</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default User;

