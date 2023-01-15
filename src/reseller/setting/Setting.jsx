import React from "react";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { getResellerData } from "../../features/apiCallReseller";
import { useSelector } from "react-redux";

const Setting = () => {
  const { t } = useTranslation();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get reseller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );
  console.log(resellerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getResellerData(ispOwnerId, resellerId, setIsLoading);
  }, []);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle"> {t("setting")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper"></div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
