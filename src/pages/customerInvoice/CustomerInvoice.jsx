import React from "react";
import { useTranslation } from "react-i18next";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import useDash from "../../assets/css/dash.module.css";
import { useState } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";

const CustomerInvoice = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("invoice")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                        //   onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerInvoice;
