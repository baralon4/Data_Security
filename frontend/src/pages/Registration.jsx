import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

import "./Registration.css";

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: ""
  });

  const [errorMessages, setErrorMessages] = useState({});  

  //default role - user
  const dataToSend = {
    ...formData,
    role: "user"
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: "" }); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    //validation
    const { first_name, last_name, username, id } = formData;
    const newErrors = {};

    if (first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters.";
    }

    if (last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters.";
    }

    if (username.length < 2) {
      newErrors.username = "Username must be at least 2 characters.";
    }

    if (!/^\d{9}$/.test(id)) {
      newErrors.id = "ID must be exactly 9 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),

      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="registration-page-container">
      <div className="registration-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>

          <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
          {errorMessages.id && <p className="error">{errorMessages.id}</p>}

          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          {errorMessages.username && <p className="error">{errorMessages.username}</p>}

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          {errorMessages.first_name && <p className="error">{errorMessages.first_name}</p>}

          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          {errorMessages.last_name && <p className="error">{errorMessages.last_name}</p>}

          {errorMessages.general && <p className="error">{errorMessages.general}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
