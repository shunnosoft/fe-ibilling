import React from "react";
import "../pages/success/success.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SuccessPaymentSuccess() {
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  return (
    <div className="customcontainer successMessage">
      <h2 className="successTitle">আপনার পেমেন্ট সফল হয়েছে </h2>
      <NavLink to="/" className="successButton">
        হোম এ যান
      </NavLink>
    </div>
  );
}
