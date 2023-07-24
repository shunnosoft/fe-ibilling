import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { useEffect } from "react";
import { onlinePaymentCustomer } from "../../../features/resellerDataApi";

const OnlinePayment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  // get reseller id
  const { resellerId } = useParams();
  console.log(resellerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resellerId) {
      onlinePaymentCustomer(dispatch, resellerId, setIsLoading);
    }
  }, [resellerId]);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div
                      className="pe-2 text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="arrowLeftSize" />
                    </div>
                    <div>{/* {reseller?.name} {t("summary")} */}</div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="d-md-flex justify-content-between"></div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlinePayment;
