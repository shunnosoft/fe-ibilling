import React from "react";
import "./notfound.css";
import { useNavigate } from "react-router";
import { EmojiFrown, ArrowLeft } from "react-bootstrap-icons";

export default function NotFound() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="Notfound">
      <EmojiFrown className="NotfoundEmoji" />
      <h1>404</h1>
      <h2>Page not found!</h2>
      <ArrowLeft className="goBackIcon" onClick={goBack} />
    </div>
  );
}
