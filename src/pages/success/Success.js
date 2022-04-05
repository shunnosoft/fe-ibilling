import React from "react";
import "./success.css";
import { NavLink } from "react-router-dom";

export default function Success() {
  return (
    <div className="customcontainer successMessage">
      <h2 className="successTitle">আপনার পেমেন্ট সফল হয়েছে </h2>
      <p className="successText">
        বাংলাদেশের অন্যতম ISP বিলিং সফটওয়্যার নেটফির সাথে থাকার জন্য আপনাকে
        আন্তরিক ধন্যবাদ।
      </p>
      <NavLink to="/" className="successButton">
        হোম এ যান
      </NavLink>
    </div>
  );
}
