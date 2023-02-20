import React from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { useParams } from "react-router-dom";

const NetFeeIspOwnerSupport = () => {
  const { ispOwnerId } = useParams();
  console.log(ispOwnerId);
  return (
    <>
      <FontColor>
        <Sidebar />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <h2 className="dashboardTitle text-center">
                  All NetFee Support
                </h2>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </FontColor>
    </>
  );
};

export default NetFeeIspOwnerSupport;
