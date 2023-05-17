import React, { useEffect } from "react";
import "./dashboard.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import Home from "../Home/Home";
import ManagerDashboard from "../Home/ManagerDashboard";
import { useSelector } from "react-redux";
import CollectorDashboard from "../Home/CollectorDashboard";

export default function Dashboard() {
  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied dashboardField">
          {role === "manager" ? (
            <ManagerDashboard />
          ) : role === "collector" ? (
            <CollectorDashboard />
          ) : (
            <Home />
          )}
        </div>
      </div>
    </>
  );
}
