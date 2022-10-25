import React from "react";
import "./success.css";
import { NavLink } from "react-router-dom";

export default function Failed() {
  return (
    <div className="customcontainer successMessage">
      <h2 className="successTitle3">দুঃখিত আপনার পেমেন্ট সফল হয়নি</h2>

      <NavLink to="/" className="successButton">
        হোম এ যান
      </NavLink>
    </div>
  );
}
