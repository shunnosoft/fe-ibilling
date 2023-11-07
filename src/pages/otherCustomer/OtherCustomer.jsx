import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Card, Collapse, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FiletypeCsv,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";

// internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import NewCustomer from "../newCustomer/NewCustomer";
import InactiveCustomer from "../inactiveCustomer/InactiveCustomer";
import Footer from "../../components/admin/footer/Footer";
import Loader from "../../components/common/Loader";
import {
  fetchMikrotik,
  getAllPackages,
  getArea,
  getDueCustomer,
  getInactiveCustomer,
  getNewCustomer,
  getPPPoEPackage,
} from "../../features/apiCalls";
import DueCustomer from "../dueCustomer/DueCustomer";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import { getHotspotPackage } from "../../features/hotspotApi";
import { getSubAreasApi } from "../../features/actions/customerApiCall";

const OtherCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const csvLink = useRef();
  const componentRef = useRef();

  //get current date
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //loading state
  const [isNewLoading, setIsNewLoading] = useState(false);
  const [isInactiveLoading, setIsInactiveLoading] = useState(false);
  const [isDueLoading, setIsDueLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);

  // modal handler
  const [show, setShow] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // tabs state
  const [otherTabs, setOtherTabs] = useState("newCustomer");

  // reload handler
  const reloadHandler = () => {
    if (otherTabs === "newCustomer") {
      getNewCustomer(dispatch, ispOwner, year, month, setIsNewLoading);
    }
    if (otherTabs === "inactiveCustomer") {
      getInactiveCustomer(
        dispatch,
        ispOwner,
        year,
        month,
        setIsInactiveLoading
      );
    }
    if (otherTabs === "dueCustomer") {
      getDueCustomer(dispatch, ispOwner, month, year, setIsDueLoading);
    }
  };

  // multiple tabs control
  const changeTab = (key) => {
    setOtherTabs(key);
  };

  useEffect(() => {
    // fatch mikrotik
    fetchMikrotik(dispatch, ispOwner, setPackageLoading);

    //get all customer package
    getAllPackages(dispatch, ispOwner, setPackageLoading);

    // get pppoe package api call
    getPPPoEPackage(dispatch, ispOwner, setPackageLoading);

    // get hotspot package api call
    getHotspotPackage(dispatch, ispOwner, setPackageLoading);

    // get area api
    getArea(dispatch, ispOwner, setPackageLoading);

    // get sub area api
    getSubAreasApi(dispatch, ispOwner);

    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("otherCustomer")}</div>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title={t("filter")}
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

                    <div className="reloadBtn">
                      {isNewLoading || isInactiveLoading || isDueLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={reloadHandler}
                        />
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            <div
                              className="addAndSettingIcon"
                              onClick={() => csvLink.current.link.click()}
                            >
                              <FiletypeCsv className="addcutmButton" />
                            </div>

                            <div className="addAndSettingIcon">
                              <PrinterFill
                                title={t("print")}
                                className="addcutmButton"
                                onClick={() => setShow(true)}
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Collapse>

                    {!open && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}

                    {open && (
                      <ArrowBarRight
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <Tabs
                  defaultActiveKey={"newCustomer"}
                  id="uncontrolled-tab-example"
                  onSelect={(eventKey) => changeTab(eventKey)}
                >
                  <Tab eventKey={"newCustomer"} title={t("newCustomer")}>
                    {otherTabs === "newCustomer" && (
                      <NewCustomer
                        isNewLoading={isNewLoading}
                        setIsNewLoading={setIsNewLoading}
                        activeKeys={activeKeys}
                        csvLinkDown={csvLink}
                        modal={show}
                        setModal={setShow}
                      />
                    )}
                  </Tab>
                  <Tab
                    eventKey={"inactiveCustomer"}
                    title={t("inactiveCustomer")}
                  >
                    {otherTabs === "inactiveCustomer" && (
                      <InactiveCustomer
                        isInactiveLoading={isInactiveLoading}
                        setIsInactiveLoading={setIsInactiveLoading}
                        activeKeys={activeKeys}
                        csvLinkDown={csvLink}
                        modal={show}
                        setModal={setShow}
                      />
                    )}
                  </Tab>
                  <Tab eventKey={"dueCustomer"} title={t("dueCustomer")}>
                    {otherTabs === "dueCustomer" && (
                      <DueCustomer
                        isDueLoading={isDueLoading}
                        setIsDueLoading={setIsDueLoading}
                        activeKeys={activeKeys}
                        csvLinkDown={csvLink}
                        modal={show}
                        setModal={setShow}
                      />
                    )}
                  </Tab>
                </Tabs>

                {(butPermission?.allPage || butPermission?.othersCustomer) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherCustomer;
