import React from "react";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";

export default function Customer() {
  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <h2>From Customer</h2>
      </div>
    </>
  );
}
