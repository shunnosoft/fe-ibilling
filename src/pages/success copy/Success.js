import React from "react";
import "./success.css";
import { NavLink } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="customcontainer successMessage">
      <h2 className="successTitle2">আপনার পেমেন্ট বাতিল হয়েছে </h2>

      <NavLink to="/" className="successButton">
        হোম এ যান
      </NavLink>
    </div>
  );
}
