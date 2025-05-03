import React from "react";
import { ArrowLeftShort } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";

// Internal import
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import { Tab, Tabs } from "react-bootstrap";
import NetFeeCustomer from "./netFeeCustomer/NetFeeCustomer";
import MikrotikCustomer from "./mikrotikCustomer/MikrotikCustomer";
import AllCustomer from "./allCustomer/AllCustomer";

const Customers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const gotoAllMiktorik = () => {
    navigate("/mikrotik");
  };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="d-flex collectorTitle px-4">
                  <div className="AllMikrotik mt-1" onClick={gotoAllMiktorik}>
                    <ArrowLeftShort className="arrowLeftSize" />
                    <span style={{ marginLeft: "3px" }}> {t("mikrotik")} </span>
                  </div>

                  <div className="mx-auto"> {t("crossCustomer")} </div>
                </div>
              </FourGround>
              <FourGround>
                <Tabs id="uncontrolled-tab-example" className="mt-2 p-2">
                  <Tab eventKey="allUsers" title={t("allUsers")}>
                    <AllCustomer />
                  </Tab>
                  <Tab eventKey="extraNetFeeUsers" title={t("extraNetFeeUser")}>
                    <NetFeeCustomer />
                  </Tab>
                  <Tab
                    eventKey="extraMikrotikUsers"
                    title={t("extraMikrotikUsers")}
                  >
                    <MikrotikCustomer />
                  </Tab>
                </Tabs>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
