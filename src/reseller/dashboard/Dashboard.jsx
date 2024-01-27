import React from "react";
import "./dashboard.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import useISPowner from "../../hooks/useISPOwner";
import ResellerDashboard from "../Home/ResellerDashboard";
import CollectorDashboard from "../Home/CollectorDashboard";

const Dashboard = () => {
  // get user & current user data form useISPOwner hooks
  const { role } = useISPowner();

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied dashboardField">
          {role === "reseller" ? <ResellerDashboard /> : <CollectorDashboard />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
