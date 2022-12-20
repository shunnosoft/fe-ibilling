import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Footer from "../../../components/admin/footer/Footer";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Loader from "../../../components/common/Loader";
import useDash from "../../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { fetchMikrotik } from "../../../features/apiCalls";
import { useDispatch } from "react-redux";
import { getHotspotActiveCustomer } from "../../../features/hotspotApi";

const ActiveHotspotCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // hotspot acive loading
  const [hotspotActiveLoading, setHotspotActiveLoading] = useState(false);

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // customer state
  //   let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // api call for get update static customer
  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
    if (mikrotikId) {
      getHotspotActiveCustomer(
        dispatch,
        ispOwnerId,
        mikrotikId,
        setHotspotActiveLoading
      );
    }
  }, [mikrotikId]);

  // set mikrotik and customer into state
  useEffect(() => {
    setMikrotikId(mikrotik[0]?.id);
  }, [mikrotik]);

  // user

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("activeCustomer")}</div>
                    <div className="reloadBtn">
                      {hotspotActiveLoading ? (
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

              <FourGround>
                <div className="collectorWrapper mt-2 pt-4">
                  {/* <div className="d-flex justify-content-center">
                  <div className="mikrotik-filter">
                    <h6 className="mb-0"> {t("selectMikrotik")} </h6>
                    <select
                      id="selectMikrotikOption"
                      onChange={mikrotiSelectionHandler}
                      className="form-select mt-0"
                    >
                      {mikrotik.map((item) => (
                        <option value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mikrotik-filter ms-4">
                    <h6 className="mb-0"> {t("selectCustomer")} </h6>
                    <select
                      id="selectMikrotikOption"
                      onChange={filterIt}
                      className="form-select mt-0"
                    >
                      <option
                        selected={loading === true}
                        value={"allCustomer"}
                      >
                        {t("sokolCustomer")}
                      </option>
                      <option value={"true"}>{t("online")}</option>
                      <option value={"false"}>{t("ofline")}</option>
                    </select>
                  </div>
                  
                </div> */}

                  {/* Active PPPoE users */}
                  <div className="table-section">
                    {/* <Table
                    isLoading={mtkLoading}
                    columns={columns}
                    data={allUsers}
                  ></Table> */}
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveHotspotCustomer;
