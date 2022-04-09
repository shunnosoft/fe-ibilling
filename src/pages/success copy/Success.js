import React from "react";
import "./success.css";
import { NavLink } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="customcontainer successMessage">
      <h2 className="successTitle2">আপনার পেমেন্ট বাতিল হয়েছে </h2>
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
