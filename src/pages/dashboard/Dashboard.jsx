import React from "react";
import "./dashboard.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import Home from "../Home/Home";
import { useSelector } from "react-redux";
// import ManagerDashboard from "../manager/ManagerDashboard";

export default function Dashboard() {
  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);
  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied dashboardField">
          {/* {role === "manager" ? <ManagerDashboard /> : <Home />} */}
          <Home />
        </div>
      </div>
    </>
  );
}
