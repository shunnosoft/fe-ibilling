import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import { useEffect } from "react";
import {
  getMikrotik,
  getStaticActiveCustomer,
} from "../../features/apiCallReseller";
import { useDispatch, useSelector } from "react-redux";

const ActiveStaticCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);
  console.log(role);
  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);
  console.log(mikrotik[0]?.id);

  // loading state
  const [isLoading, setIsLoading] = useState();

  // mikrotikId state
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  useEffect(() => {
    if (role === "reseller") {
      getMikrotik(dispatch, resellerId);
      getStaticActiveCustomer(
        dispatch,
        ispOwnerId,
        resellerId,
        mikrotik[0]?.id,
        setIsLoading
      );
    }
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("activeStaticCustomer")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                        // onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      <div className="selectFiltering allFilter"></div>
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

export default ActiveStaticCustomer;
