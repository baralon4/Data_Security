import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { saveToLocalStorage } from "../utils/services";
import "./Login.css";

function Login({ setUser }) {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    //login request
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        saveToLocalStorage("userData", data.userData);
        setUser(data.userData);

        //navigate based on user role 
        if (data.userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    }
  };
  //navigate to the registration page
  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?
          <button type="button" onClick={handleGoToRegister} style={{
            background: "none",
            border: "none",
            color: "#00e0ff",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "14px",
          }}>
            Register
          </button>
        </p>
        <p>
          Forgot your password?
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              color: "#00e0ff",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "5px",
            }}
          >
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
