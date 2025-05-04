import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Admin from "./pages/Admin";
import User from "./pages/User";
import ForgotPassword from "./pages/ForgotPassword";
import { getFromLocalStorage } from "./utils/services";
import ResetPassword from "./pages/ResetPassword";



function App() {
  const [user, setUser] = useState(() => getFromLocalStorage("userData"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/register" element={<Registration />} />

        <Route
          path="/admin"
          element={
            user?.role === "admin" ? <Admin /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/user"
          element={
            user?.role === "user" ? <User /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
