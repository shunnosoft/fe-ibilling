import React from "react";
import { PersonPlusFill } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";

import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AddCustomer from "./customerOperation/AddCustomer";
const HotspotCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

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
                    <h2>{t("customer")}</h2>
                    {/* <div className="reloadBtn">
                      {customerLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise onClick={reloadHandler} />
                      )}
                    </div> */}
                  </div>
                  {/* customer page header area  */}

                  <div className="d-flex justify-content-center align-items-center">
                    {(permission?.customerAdd || role === "ispOwner") && (
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#AddHotspotCustomer"
                          title={t("newCustomer")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
      <AddCustomer />
    </>
  );
};

export default HotspotCustomer;
