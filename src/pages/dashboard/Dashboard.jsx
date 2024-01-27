import React from "react";
import "./dashboard.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import ManagerDashboard from "../Home/ManagerDashboard";
import CollectorDashboard from "../Home/CollectorDashboard";
import IspOwnerDashboard from "../Home/IspOwnerDashboard";
import useISPowner from "../../hooks/useISPOwner";

const Dashboard = () => {
  // get user & current user data form useISPOwner hooks
  const { role } = useISPowner();

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied dashboardField">
          {role === "ispOwner" ? (
            <IspOwnerDashboard />
          ) : role === "manager" ? (
            <ManagerDashboard />
          ) : (
            <CollectorDashboard />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
