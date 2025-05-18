import React from "react";
import "./dashboard.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import Home from "../Home/Home";
import { ToastContainer } from "react-toastify";

export default function AdminDashboard() {
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <Home />
          </div>
        </div>
      </div>
    </>
  );
}
