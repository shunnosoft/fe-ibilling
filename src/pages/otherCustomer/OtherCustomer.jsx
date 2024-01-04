import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Card, Collapse, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FiletypeCsv,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";

// custom hook import
import useISPowner from "../../hooks/useISPOwner";

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
import {
  getResellerDueCustomer,
  getResellerInactiveCustomer,
  getResellerNewCustomer,
} from "../../features/resellerCustomerAdminApi";
import { getMikrotik, getSubAreas } from "../../features/apiCallReseller";

const OtherCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const csvLink = useRef();

  //get current date
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, userData } = useISPowner();

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

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // reload handler
  const reloadHandler = () => {
    if (otherTabs === "newCustomer") {
      if (role === "reseller" || (role === "collector" && userData.reseller)) {
        getResellerNewCustomer(
          dispatch,
          resellerId,
          year,
          month,
          setIsNewLoading
        );
      } else {
        getNewCustomer(dispatch, ispOwnerId, year, month, setIsNewLoading);
      }
    }
    if (otherTabs === "inactiveCustomer") {
      if (role === "reseller" || (role === "collector" && userData.reseller)) {
        getResellerInactiveCustomer(
          dispatch,
          resellerId,
          year,
          month,
          setIsInactiveLoading
        );
      } else {
        getInactiveCustomer(
          dispatch,
          ispOwnerId,
          year,
          month,
          setIsInactiveLoading
        );
      }
    }
    if (otherTabs === "dueCustomer") {
      if (role === "reseller" || (role === "collector" && userData.reseller)) {
        getResellerDueCustomer(
          dispatch,
          resellerId,
          year,
          month,
          setIsInactiveLoading
        );
      } else {
        getDueCustomer(dispatch, ispOwnerId, month, year, setIsDueLoading);
      }
    }
  };

  // multiple tabs control
  const changeTab = (key) => {
    setOtherTabs(key);
  };

  useEffect(() => {
    // fatch mikrotik
    if (role === "ispOwner") {
      fetchMikrotik(dispatch, ispOwnerId, setPackageLoading);
    } else {
      getMikrotik(dispatch, resellerId);
    }

    // withMikrotik & withOut Mikrotik package get api
    if (role === "ispOwner") {
      // get pppoe package api call
      getPPPoEPackage(dispatch, ispOwnerId, setPackageLoading);

      // get hotspot package api call
      getHotspotPackage(dispatch, ispOwnerId, setPackageLoading);
    }

    //get all customer package
    getAllPackages(dispatch, ispOwnerId, setPackageLoading);

    // get area api
    if (role === "ispOwner") getArea(dispatch, ispOwnerId, setPackageLoading);

    // get sub area api
    if (role === "ispOwner") {
      getSubAreasApi(dispatch, ispOwnerId);
    } else {
      getSubAreas(dispatch, resellerId);
    }

    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, [role]);

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
