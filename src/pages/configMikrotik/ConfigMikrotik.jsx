import React, { useEffect, useMemo, useState } from "react";
import "../collector/collector.css";
import "./configmikrotik.css";
import { PlugFill, PencilFill, ArrowLeftShort } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ConfigMikrotikModal from "./configMikrotikModals/ConfigMikrotikModal";

import Loader from "../../components/common/Loader";
import { fetchMikrotik } from "../../features/apiCalls";
import apiLink from "../../api/apiLink";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "react-bootstrap";
import PPPoE from "./pppoe/PPPoE";
import Hotspot from "./hotspot/Hotspot";
import Static from "./static/Static";
import FireWallFilter from "./FireWallQueue/FireWallFilter";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { ispOwner, mikrotikId } = useParams();

  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

  // get ispOwner bpSetting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  let pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  const [isChecking, setIsChecking] = useState(false);

  const [isLoading, setIsloading] = useState(false);

  const dispatch = useDispatch();

  //get Reseller
  useEffect(() => {
    fetchMikrotik(dispatch, ispOwner, setIsloading);
  }, []);

  // fetch single mikrotik

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
                      {isChecking ? <Loader /> : t("checkConnection")}{" "}
                      <PlugFill className="rotating" />
                    </button>
                    <button
                      title={t("editMkrotik")}
                      data-bs-toggle="modal"
                      data-bs-target="#configMikrotikModal"
                      className="btn btn-outline-light ms-2 me-2"
                    >
                      {t("edit")} <PencilFill />
                    </button>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <Tabs id="uncontrolled-tab-example" className="mb-3">
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

                  {bpSettings?.customerType.map(
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
                  )}
                </Tabs>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      {/* Modals */}
      <ConfigMikrotikModal mik={singleMik} />
    </>
  );
}
