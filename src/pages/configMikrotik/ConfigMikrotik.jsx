import React, { useEffect, useMemo, useState } from "react";
import "../collector/collector.css";
import "./configmikrotik.css";
import { PlugFill, PencilFill, ArrowLeftShort } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "react-bootstrap";

// internal imports
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ConfigMikrotikModal from "./configMikrotikModals/ConfigMikrotikModal";
import Loader from "../../components/common/Loader";
import { fetchMikrotik } from "../../features/apiCalls";
import apiLink from "../../api/apiLink";
import PPPoE from "./pppoe/PPPoE";
import Hotspot from "./hotspot/Hotspot";
import Static from "./static/Static";
import FireWallFilter from "./FireWallQueue/FireWallFilter";

const ConfigMikrotik = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get params from url
  const { ispOwner, mikrotikId } = useParams();

  // get ispOwner bpSetting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all mikrotik from redux store
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get pppoe package from redux store
  const pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // single mikrotik find
  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // check mikrotik connection
  const [isChecking, setIsChecking] = useState(false);

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  //get Reseller
  useEffect(() => {
    fetchMikrotik(dispatch, ispOwner, setIsloading);
  }, []);

  // check zero rate
  useEffect(() => {
    const zeroRate = pppoePackage.filter(
      (i) =>
        i.rate === 0 && i.name !== "default-encryption" && i.name !== "default"
    );
    if (zeroRate.length !== 0) {
      toast.warn(`${zeroRate[0].name}  ${t("updateMikrotikRate")}`);
    }
  }, [pppoePackage]);

  // fetch Active user
  const gotoAllMiktorik = () => {
    navigate("/mikrotik");
  };

  // check mikrotik connection test
  const MikrotikConnectionTest = async () => {
    setIsChecking(true);

    await apiLink({
      method: "GET",
      url: `/mikrotik/testConnection/${ispOwner}/${mikrotikId}`,
    })
      .then(() => {
        setIsChecking(false);
        toast.success(`${singleMik?.name} এর কানেকশন ঠিক আছে`);
      })
      .catch(() => {
        setIsChecking(false);

        toast.error(`দুঃখিত, ${singleMik?.name} এর কানেকশন ঠিক নেই!`);
      });
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

                  <div className="mx-auto"> {t("mikrotikConfiguration")} </div>
                  <div className="addAndSettingIcon">
                    <button
                      title={t("checkConnection")}
                      className="btn btn-outline-light"
                      onClick={MikrotikConnectionTest}
                    >
                      {isChecking ? <Loader /> : t("checkConnection")}
                      <PlugFill className="rotating" />
                    </button>
                    <button
                      title={t("editMkrotik")}
                      className="btn btn-outline-light ms-2 me-2"
                      onClick={() => {
                        setModalStatus("mikrotikEdit");
                        setShow(true);
                      }}
                    >
                      {t("edit")} <PencilFill />
                    </button>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper p-3">
                  <Tabs>
                    {bpSettings?.customerType &&
                      bpSettings?.customerType.map(
                        (type) =>
                          (type === "pppoe" && (
                            <Tab eventKey="pppoe" title={t("pppoe")}>
                              <PPPoE />
                            </Tab>
                          )) ||
                          (type === "static" && (
                            <Tab eventKey="static" title={t("static")}>
                              <Static />
                            </Tab>
                          )) ||
                          (type === "hotspot" && (
                            <Tab eventKey="hotspot" title={t("hotspot")}>
                              <Hotspot />
                            </Tab>
                          ))
                      )}

                    {/* {bpSettings?.customerType.map(
                      (type) =>
                        type === "static" &&
                        (bpSettings?.queueType === "core-queue" ||
                          bpSettings?.queueType === "simple-queue") && (
                          <Tab
                            eventKey="fireWallFilter"
                            title={t("fireWllFilter")}
                          >
                            <FireWallFilter />
                          </Tab>
                        )
                    )} */}
                  </Tabs>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* config mikrotik modal */}
      {modalStatus === "mikrotikEdit" && (
        <ConfigMikrotikModal
          show={show}
          setShow={setShow}
          singleMik={singleMik}
        />
      )}
    </>
  );
};

export default ConfigMikrotik;
