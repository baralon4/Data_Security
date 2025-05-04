import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getFromLocalStorage } from "../utils/services.js";
import { BASE_URL } from "../utils/constants";
import "./User.css";

function User() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    credit_card_number: "",
    valid_date: "",
    cvc: "",
  });

  const [errorMessages, setErrorMessages] = useState({});

  //role is user ?
  useEffect(() => {
    const user = getFromLocalStorage("userData");
    if (!user || user.role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: "" });
  };

  //logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //Save credit card details
  const handleSaveCard = async (e) => {
    e.preventDefault();
    setErrorMessages({});
    const newErrors = {};

    //validation
    if (!/^\d{16}$/.test(formData.credit_card_number)) {
      newErrors.credit_card_number =
        "Credit card number must be exactly 16 digits.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.valid_date)) {
      newErrors.valid_date = "Valid date must be in MM/YY format.";
    }

    if (!/^\d{3}$/.test(formData.cvc)) {
      newErrors.cvc = "CVC must be exactly 3 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorMessages(newErrors);
      return;
    }
    try {
      const user = getFromLocalStorage("userData");

      const response = await fetch(`${BASE_URL}/users/save-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          ...formData,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Credit card saved successfully!");
        setFormData({
          credit_card_number: "",
          valid_date: "",
          cvc: "",
        });
        navigate("/user");
      } else {
        alert(data.error || "Saving failed.");
      }
    } catch (error) {
      console.error("Save card error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="user-page">
      <h1>Welcome, User!</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <div className="credit-card-form">
        <h2>Enter Credit Card Details</h2>
        <form onSubmit={handleSaveCard}>
          <input
            type="text"
            name="credit_card_number"
            placeholder="Credit Card Number"
            value={formData.credit_card_number}
            onChange={handleChange}
            required
          />
          {errorMessages.credit_card_number && (
            <p className="error">{errorMessages.credit_card_number}</p>
          )}

          <input
            type="text"
            name="valid_date"
            placeholder="Valid Date (MM/YY)"
            value={formData.valid_date}
            onChange={handleChange}
            required
          />
          {errorMessages.valid_date && (
            <p className="error">{errorMessages.valid_date}</p>
          )}

          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={formData.cvc}
            onChange={handleChange}
            required
          />
          {errorMessages.cvc && <p className="error">{errorMessages.cvc}</p>}

          {errorMessages.general && (
            <p className="error">{errorMessages.general}</p>
          )}

          <button type="submit" className="submit-button">
            Save Credit Card
          </button>
        </form>
      </div>
    </div>
  );
}

export default User;
