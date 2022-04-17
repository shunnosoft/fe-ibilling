import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <div>
      <div className="footer">
        <p> &copy; শূন্য আইটি - {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
