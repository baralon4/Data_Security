import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getFromLocalStorage } from "../utils/services.js";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const [users, setUser] = useState([]);

  //role is admin ?
  useEffect(() => {
    const user = getFromLocalStorage("userData");
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users/all-users");
      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //Credit card
  const formatCreditCard = (number) => {
    if (!number) return "--";
    return number.replace(/\d{4}(?=.)/g, "$& ");
  };

  return (
    <div className="admin-page">
      <h1>Welcome, Admin!</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <table className="users-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>ID</th>
            <th>Credit Card Nuber</th>
            <th>valid Data</th>
            <th>CVC</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.id}</td>
              <td>{formatCreditCard(user.credit_card_number)}</td>
              <td>{user.valid_date || "--"}</td>
              <td>{user.cvc || "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
