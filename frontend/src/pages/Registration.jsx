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
    last_name: "",
  });

  const [errorMessages, setErrorMessages] = useState({});

  //default role - user
  const dataToSend = {
    ...formData,
    role: "user",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    //validation
    const { first_name, last_name, username, id, password, email } = formData;
    const newErrors = {};

    if (!/^\d{9}$/.test(id)) {
      newErrors.id = "ID must be exactly 9 digits.";
    }

    if (username.length < 2) {
      newErrors.username = "Username must be at least 2 characters.";
    }
    if (!/^[a-zA-Z]+$/i.test(username)) {
      newErrors.username = "Username must contain only letters (a-z).";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters.";
    }
    if (!/^[a-zA-Z]+$/i.test(first_name)) {
      newErrors.first_name = "First name must contain only letters (a-z).";
    }

    if (last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters.";
    }
    if (!/^[a-zA-Z\s]+$/i.test(last_name)) {
      newErrors.last_name = "Last name must contain only letters (a-z).";
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
        setErrorMessages({ general: data.error || "Registration failed" });
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
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            required
          />
          {errorMessages.id && <p className="error">{errorMessages.id}</p>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errorMessages.username && (
            <p className="error">{errorMessages.username}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errorMessages.password && (
            <p className="error">{errorMessages.password}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errorMessages.email && (
            <p className="error">{errorMessages.email}</p>
          )}

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          {errorMessages.first_name && (
            <p className="error">{errorMessages.first_name}</p>
          )}

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          {errorMessages.last_name && (
            <p className="error">{errorMessages.last_name}</p>
          )}

          {errorMessages.general && (
            <p className="error">{errorMessages.general}</p>
          )}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
