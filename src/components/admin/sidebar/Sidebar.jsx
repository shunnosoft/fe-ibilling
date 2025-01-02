import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { TitleColor, FontColor, FourGround } from "../../../assets/js/theme";
import {
  List,
  HouseDoorFill,
  People,
  PeopleFill,
  WalletFill,
  GraphUpArrow,
  Messenger,
  PersonLinesFill,
  Cash,
  Gear,
  PersonCheck,
  Envelope,
  ChatDots,
  Person,
  PersonVideo,
  BarChartFill,
  CashCoin,
  PersonBadgeFill,
  PersonCircle,
  ChatSquareDots,
  ReceiptCutoff,
  Basket3Fill,
  GeoAltFill,
  EjectFill,
  EnvelopeOpen,
  PersonDash,
  Shop,
  Award,
  PhoneVibrate,
  ArrowRepeat,
  TelephoneFill,
  BookmarksFill,
  BellFill,
  Headset,
  Wallet2,
  AppIndicator,
  SendCheck,
  CameraVideoFill,
  HddRackFill,
  BroadcastPin,
  Diagram3Fill,
  ClockHistory,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import activeClass from "../../../assets/css/active.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
// the hook
import { useTranslation } from "react-i18next";
import { getIspOwnerData } from "../../../features/apiCalls";

// custom hooks
import useISPowner from "../../../hooks/useISPOwner";

export default function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const {
    role,
    ispOwnerData,
    ispOwnerId,
    bpSettings,
    permissions,
    currentUser,
  } = useISPowner();

  // const hasReseller= true
  // addSidebar
  const addSidebar = () => {
    document.querySelector(".sidebar").classList.add("toggleSidebar");
  };

  // remove sidebar
  const removeSidebar = () => {
    document.querySelector(".sidebar").classList.remove("toggleSidebar");
  };

  const [activeKey, setActiveKey] = useState();
  const [childActiveKey, setChildActiveKey] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const location = window.location.pathname;

  useEffect(() => {
    // get ispOwner data api
    Object.keys(ispOwnerData)?.length === 0 &&
      getIspOwnerData(dispatch, ispOwnerId, setIsLoading);
  }, []);

  useEffect(() => {
    switch (location) {
      case "/home":
        localStorage.removeItem("active-key");
        break;
      case "/area":
        localStorage.removeItem("active-key");
        break;
      case "/mikrotik":
        localStorage.removeItem("active-key");
        break;
      default:
        break;
    }
    setActiveKey(localStorage.getItem("active-key"));
    setChildActiveKey(localStorage.getItem("child-active-key"));
  }, [location]);

  const handleActiveAccordian = (key) => {
    if (key === activeKey) {
      setActiveKey("");
      setChildActiveKey("");
    } else {
      setActiveKey(key);
      localStorage.setItem("active-key", key);
    }
  };

  const handleChildActiveAccordian = (key) => {
    if (key === childActiveKey) {
      setChildActiveKey("");
    } else {
      setChildActiveKey(key);
      localStorage.setItem("child-active-key", key);
    }
  };

  const hasCustomerType = bpSettings?.customerType
    ? bpSettings.customerType
    : [];
  return (
    <TitleColor>
      <div>
        <div className="container menuIcon">
          <List onClick={addSidebar} className="ListIcon" />
        </div>
        <div className="sidebar">
          {!["admin", "superadmin"].includes(role) && (
            <FourGround>
              <div className="name companyDiv text-center">
                {/* <div className="company_logo">
                <img src="./assets/img/logo.png" alt="" />
              </div> */}
                <NavLink to="/" className="adminDashboardTitle">
                  {/* <ArrowLeft className="GotoHomeFromDashboard" /> */}
                  <span className="companyName">{ispOwnerData?.company}</span>
                </NavLink>
                <br />
                {(role === "ispOwner" || role === "manager") && (
                  <>
                    <span className="role-section">
                      {t("ID")}: {ispOwnerData?.netFeeId}
                    </span>
                    <br />
                  </>
                )}

                <span className="role-section">
                  {role === "manager" && t("roleManager")}
                  {role === "collector" && t("roleCollector")}
                  {role === "ispOwner" && t("roleAdmin")}
                  {role === "reseller" && t("roleReseller")}
                </span>
                <span className="HideSidebar" onClick={removeSidebar}></span>
              </div>

              <ul className="sidebarUl">
                <NavLink
                  to={
                    role === "reseller" ||
                    (role === "collector" && currentUser.collector.reseller)
                      ? "/reseller/home"
                      : "/home"
                  }
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname ===
                        (role === "reseller" ? "/reseller/home" : "/home")
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<HouseDoorFill />}</div>
                      <span className="sidebarLinksName">{t("dashboard")}</span>
                    </li>
                  </FontColor>
                </NavLink>

                {role === "manager" ||
                role === "collector" ||
                role === "reseller" ? (
                  ""
                ) : (
                  <NavLink
                    to={"/area"}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === "/area" ? "active" : ""
                        }
                      >
                        <div className="sidebarIcon">{<GeoAltFill />}</div>
                        <span className="sidebarLinksName">{t("area")}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                )}

                {!ispOwnerData?.bpSettings?.hasMikrotik &&
                (role === "ispOwner" || role === "manager") ? (
                  <NavLink
                    key={55}
                    to={"/package"}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === "/package"
                            ? "active"
                            : ""
                        }
                      >
                        <div className="sidebarIcon">{<EjectFill />}</div>
                        <span className="sidebarLinksName">{t("package")}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                ) : (
                  ""
                )}
                {role === "ispOwner" &&
                ispOwnerData?.bpSettings?.hasMikrotik ? (
                  <NavLink
                    key={5}
                    to={"/mikrotik"}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === "/mikrotik"
                            ? "active"
                            : ""
                        }
                      >
                        <div className="sidebarIcon">{<Basket3Fill />}</div>
                        <span className="sidebarLinksName">
                          {t("mikrotik")}
                        </span>
                      </li>
                    </FontColor>
                  </NavLink>
                ) : (
                  ""
                )}

                {/* গ্রাহক */}
                <div className="sideBar_accordian">
                  <Accordion activeKey={activeKey}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header
                        onClick={() => handleActiveAccordian("0")}
                      >
                        <div className="sidebarIcon">{<PeopleFill />}</div>
                        <span className="sidebarLinksName">
                          {t("customer")}
                        </span>
                      </Accordion.Header>
                      <Accordion.Body>
                        {hasCustomerType.includes("pppoe") && (
                          <NavLink
                            key={6}
                            to={
                              role === "reseller" ||
                              (role === "collector" &&
                                currentUser.collector.reseller)
                                ? "/reseller/customer"
                                : "/customer"
                            }
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  (role === "reseller"
                                    ? "/reseller/customer"
                                    : "/customer")
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<People />}</div>
                                <span className="sidebarLinksName">
                                  {t("PPPoE")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}
                        {hasCustomerType.includes("pppoe") && (
                          <>
                            {ispOwnerData?.bpSettings?.hasMikrotik && (
                              <NavLink
                                key={66}
                                to={
                                  role === "reseller" ||
                                  (role === "collector" &&
                                    currentUser.collector.reseller)
                                    ? "/reseller/activeCustomer"
                                    : "/activeCustomer"
                                }
                                className={(navInfo) =>
                                  navInfo.isActive ? activeClass.active : ""
                                }
                              >
                                <FontColor>
                                  <li
                                    className="sidebarItems"
                                    id={
                                      window.location.pathname ===
                                      (role === "reseller"
                                        ? "/reseller/activeCustomer"
                                        : "/activeCustomer")
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <div className="sidebarIcon">
                                      {<PersonCheck />}
                                    </div>
                                    <span className="sidebarLinksName">
                                      {t("active PPPoE")}
                                    </span>
                                  </li>
                                </FontColor>
                              </NavLink>
                            )}
                          </>
                        )}
                        {hasCustomerType.includes("static") && (
                          <>
                            <NavLink
                              key={60}
                              to={
                                role === "reseller" ||
                                (role === "collector" &&
                                  currentUser.collector.reseller)
                                  ? "/reseller/staticCustomer"
                                  : "/staticCustomer"
                              }
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    (role === "reseller"
                                      ? "/reseller/staticCustomer"
                                      : "/staticCustomer")
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<PersonVideo />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("static")}
                                  </span>
                                </li>
                              </FontColor>
                              {/* <FontColor>
                            <li
                              className="sidebarItems"
                              id={
                                window.location.pathname === "/staticCustomer"
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">
                                {<PersonVideo />}
                              </div>
                              <span className="sidebarLinksName">
                                {t("static")}
                              </span>
                            </li>
                          </FontColor> */}
                            </NavLink>

                            {ispOwnerData?.bpSettings?.hasMikrotik && (
                              <NavLink
                                key={61}
                                to={
                                  role === "reseller" ||
                                  (role === "collector" &&
                                    currentUser.collector.reseller)
                                    ? "/reseller/staticActiveCustomer"
                                    : "/staticActiveCustomer"
                                }
                                className={(navInfo) =>
                                  navInfo.isActive ? activeClass.active : ""
                                }
                              >
                                <FontColor>
                                  <li
                                    className="sidebarItems"
                                    id={
                                      window.location.pathname ===
                                      (role === "reseller" ||
                                      (role === "collector" &&
                                        currentUser.collector.reseller)
                                        ? "/reseller/staticActiveCustomer"
                                        : "/staticActiveCustomer")
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <div className="sidebarIcon">
                                      {<PersonCheck />}
                                    </div>
                                    <span className="sidebarLinksName">
                                      {t("active static")}
                                    </span>
                                  </li>
                                </FontColor>
                              </NavLink>
                            )}
                          </>
                        )}
                        {(role === "ispOwner" ||
                          role === "manager" ||
                          (role === "collector" &&
                            !currentUser.collector?.reseller)) &&
                          bpSettings?.hasMikrotik &&
                          hasCustomerType.includes("hotspot") && (
                            <NavLink
                              key={120}
                              to={"/hotspot/customer"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    "/hotspot/customer"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<People />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("hotspot")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}

                        {/* <NavLink
                          key={121}
                          to={"/active/hotspot/customer"}
                          className={(navInfo) =>
                            navInfo.isActive ? activeClass.active : ""
                          }
                        >
                          <FontColor>
                            <li
                              className="sidebarItems"
                              id={
                                window.location.pathname ===
                                "/active/hotspot/customer"
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">{<People />}</div>
                              <span className="sidebarLinksName">
                                {t("activeHotspot")}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink> */}

                        <NavLink
                          key={126}
                          to={"/other/customer"}
                          className={(navInfo) =>
                            navInfo.isActive ? activeClass.active : ""
                          }
                        >
                          <FontColor>
                            <li
                              className="sidebarItems"
                              id={
                                window.location.pathname === "/other/customer"
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">{<People />}</div>
                              <span className="sidebarLinksName">
                                {t("otherCustomer")}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      </Accordion.Body>

                      {/* রিপোর্ট */}
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header
                        onClick={() => handleActiveAccordian("1")}
                      >
                        <div className="sidebarIcon">{<BarChartFill />}</div>
                        <span className="sidebarLinksName">{t("report")}</span>
                      </Accordion.Header>
                      <Accordion.Body>
                        <NavLink
                          key={8}
                          to={
                            role === "reseller" ||
                            (role === "collector" &&
                              currentUser.collector.reseller)
                              ? "/reseller/report"
                              : "/report"
                          }
                          className={(navInfo) =>
                            navInfo.isActive ? activeClass.active : ""
                          }
                        >
                          <FontColor>
                            <li
                              className="sidebarItems"
                              id={
                                window.location.pathname ===
                                (role === "reseller"
                                  ? "/reseller/report"
                                  : "/report")
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">
                                {<GraphUpArrow />}
                              </div>
                              <span className="sidebarLinksName">
                                {t("collection")}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>

                        {role === "ispOwner" && bpSettings?.hasReseller && (
                          <NavLink
                            key={125}
                            to={
                              role === "ispOwner" &&
                              "/reseller/collection/report"
                            }
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/reseller/collection/report"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<People />}</div>
                                <span className="sidebarLinksName">
                                  {t("resellerCollection")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}

                        {(role === "ispOwner" || role === "manager") && (
                          <NavLink
                            key={138}
                            to={"/webhook/message"}
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/webhook/message"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">
                                  {<SendCheck />}
                                </div>
                                <span className="sidebarLinksName">
                                  {t("webhookMessage")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}

                        <NavLink
                          key={7}
                          to={
                            role === "reseller" ||
                            (role === "collector" &&
                              currentUser.collector.reseller)
                              ? "/reseller/diposit"
                              : "/deposit"
                          }
                          className={(navInfo) =>
                            navInfo.isActive ? activeClass.active : ""
                          }
                        >
                          <FontColor>
                            <li
                              className="sidebarItems"
                              id={
                                window.location.pathname ===
                                (role === "reseller"
                                  ? "/reseller/diposit"
                                  : "/deposit")
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">{<CashCoin />}</div>
                              <span className="sidebarLinksName">
                                {t("deposit")}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>

                        {role === "reseller" && (
                          <NavLink
                            key={127}
                            to="/reseller/summary"
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/reseller/summary"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<People />}</div>
                                <span className="sidebarLinksName">
                                  {t("summary")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}

                        {((role === "ispOwner" &&
                          bpSettings?.customerInvoice) ||
                          (role === "manager" &&
                            permissions?.customerInvoice)) && (
                          <NavLink
                            key={125}
                            to={"/customer/invoice"}
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/customer/invoice"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<People />}</div>
                                <span className="sidebarLinksName">
                                  {t("invoice")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}

                        {role === "reseller" && (
                          <NavLink
                            key={123}
                            to={
                              role === "reseller" &&
                              "/reseller/recharge-history"
                            }
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/reseller/recharge-history"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<Cash />}</div>
                                <span className="sidebarLinksName">
                                  {t("rechargeHistory")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                    {/* স্টাফ */}
                    {role !== "collector" && (
                      <Accordion.Item eventKey="2">
                        <Accordion.Header
                          onClick={() => handleActiveAccordian("2")}
                        >
                          <div className="sidebarIcon">
                            {<PersonLinesFill />}
                          </div>
                          <span className="sidebarLinksName">{t("staff")}</span>
                        </Accordion.Header>
                        <Accordion.Body>
                          {role === "ispOwner" ? (
                            <NavLink
                              key={3}
                              to={"/manager"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname === "/manager"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<Person />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("manager")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          ) : (
                            ""
                          )}
                          {role === "manager" ||
                          role === "ispOwner" ||
                          role === "reseller" ? (
                            <NavLink
                              key={4}
                              to={
                                role === "reseller"
                                  ? "/reseller/collector"
                                  : "/collector"
                              }
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    (role === "reseller"
                                      ? "/reseller/collector"
                                      : "/collector")
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<People />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("collector")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          ) : (
                            ""
                          )}

                          {(role === "ispOwner" ||
                            (role === "manager" &&
                              permissions?.staffSalary)) && (
                            <NavLink
                              key={330}
                              to={"/staff"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname === "/staff"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<PersonBadgeFill />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("labors")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                    {/* রিসেলার */}
                    {role === "ispOwner" && bpSettings?.hasReseller && (
                      <Accordion.Item eventKey="3">
                        <Accordion.Header
                          onClick={() => handleActiveAccordian("3")}
                        >
                          <div className="sidebarIcon">{<PersonCircle />}</div>
                          <span className="sidebarLinksName">
                            {t("reseller")}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <NavLink
                            key={33}
                            to={"/reseller"}
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname === "/reseller"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<People />}</div>
                                <span className="sidebarLinksName">
                                  {t("reseller")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>

                          <NavLink
                            key={70}
                            to={
                              role === "reseller"
                                ? "/reseller/recharge"
                                : "/recharge"
                            }
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  (role === "reseller"
                                    ? "/reseller/recharge"
                                    : "/recharge")
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<Cash />}</div>
                                <span className="sidebarLinksName">
                                  {t("recharge history")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>

                          <NavLink
                            key={91}
                            to={"/message-request"}
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/message-request"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">
                                  {<ChatSquareDots />}
                                </div>
                                <span className="sidebarLinksName">
                                  {t("message request")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>

                          <NavLink
                            key={92}
                            to={"/withdrawal-request"}
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  "/withdrawal-request"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<Wallet2 />}</div>
                                <span className="sidebarLinksName">
                                  {t("withdrawal request")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        </Accordion.Body>
                      </Accordion.Item>
                    )}

                    {/* মেসেজ */}
                    {role !== "collector" && (
                      <Accordion.Item eventKey="4">
                        <Accordion.Header
                          onClick={() => handleActiveAccordian("4")}
                        >
                          <div className="sidebarIcon">{<Messenger />}</div>
                          <span className="sidebarLinksName">
                            {t("message")}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          {role === "ispOwner" ||
                          role === "manager" ||
                          role === "reseller" ? (
                            <NavLink
                              key={99}
                              to={"/message"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname === "/message"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<ChatDots />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("bulk message")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          ) : (
                            ""
                          )}

                          {
                            /*(role === "ispOwner" && bpSettings?.hasReseller) ||*/
                            role === "reseller" ? (
                              <NavLink
                                key={71}
                                to={
                                  role === "reseller"
                                    ? "/reseller/sms-receharge"
                                    : "/recharge"
                                }
                                className={(navInfo) =>
                                  navInfo.isActive ? activeClass.active : ""
                                }
                              >
                                <FontColor>
                                  <li
                                    className="sidebarItems"
                                    id={
                                      window.location.pathname ===
                                      (role === "reseller"
                                        ? "/reseller/sms-receharge"
                                        : "/recharge")
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <div className="sidebarIcon">
                                      {<Envelope />}
                                    </div>
                                    <span className="sidebarLinksName">
                                      {t("messageInvoice")}
                                    </span>
                                  </li>
                                </FontColor>
                              </NavLink>
                            ) : (
                              ""
                            )
                          }
                          {role === "ispOwner" || role === "reseller" ? (
                            <NavLink
                              key={337}
                              to={"/settings"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname === "/settings"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">{<Gear />}</div>
                                  <span className="sidebarLinksName">
                                    {t("message setting")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          ) : (
                            ""
                          )}
                          {(role === "ispOwner" ||
                            (role === "manager" &&
                              permissions?.readMessageLog)) && (
                            <NavLink
                              key={338}
                              to={"/message/log"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname === "/message/log"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<EnvelopeOpen />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("messageLog")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}
                          {role === "reseller" && (
                            <NavLink
                              key={339}
                              to={"/reseller/message/log"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    "/reseller/message/log"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<EnvelopeOpen />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("messageLog")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    )}

                    {/* network diagram */}
                    {((bpSettings?.networkDiagram && role === "ispOwner") ||
                      role === "manager" ||
                      role === "reseller") && (
                      <>
                        <Accordion.Item eventKey="14">
                          <Accordion.Header
                            onClick={() => handleActiveAccordian("14")}
                          >
                            <div className="sidebarIcon">
                              {<BroadcastPin />}
                            </div>
                            <span className="sidebarLinksName">
                              {t("network")}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            <NavLink key={400} to="/network/device">
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    "/network/device"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<HddRackFill />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("device")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>

                            <NavLink key={400} to="/network/diagram">
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    "/network/diagram"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<Diagram3Fill />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("diagram")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          </Accordion.Body>
                        </Accordion.Item>
                      </>
                    )}

                    {/* একাউন্টস */}
                    {(role === "ispOwner" ||
                      role === "manager" ||
                      (role === "collector" && permissions.expenditure)) && (
                      <>
                        <Accordion.Item eventKey="5">
                          <Accordion.Header
                            onClick={() => handleActiveAccordian("5")}
                          >
                            <div className="sidebarIcon">{<WalletFill />}</div>
                            <span className="sidebarLinksName">
                              {t("account")}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            {(role === "ispOwner" ||
                              role === "manager" ||
                              (role === "collector" &&
                                permissions.expenditure)) && (
                              <NavLink
                                key={309}
                                to={"/expenditure"}
                                className={(navInfo) =>
                                  navInfo.isActive ? activeClass.active : ""
                                }
                              >
                                <FontColor>
                                  <li
                                    className="sidebarItems"
                                    id={
                                      window.location.pathname ===
                                      "/expenditure"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <div className="sidebarIcon">
                                      {<CashCoin />}
                                    </div>
                                    <span className="sidebarLinksName">
                                      {t("cost")}
                                    </span>
                                  </li>
                                </FontColor>
                              </NavLink>
                            )}
                            {role !== "collector" && (
                              <NavLink
                                key={300}
                                to={"/invoice"}
                                className={(navInfo) =>
                                  navInfo.isActive ? activeClass.active : ""
                                }
                              >
                                <FontColor>
                                  <li
                                    className="sidebarItems"
                                    id={
                                      window.location.pathname === "/invoice"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <div className="sidebarIcon">
                                      {<ReceiptCutoff />}
                                    </div>
                                    <span className="sidebarLinksName">
                                      {t("invoice")}
                                    </span>
                                  </li>
                                </FontColor>
                              </NavLink>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>

                        {bpSettings?.inventory && role !== "collector" && (
                          <a
                            href={"https://old.hisabnikashbd.com"}
                            target="_blank"
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname === "/inventory"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">{<Shop />}</div>
                                <span className="sidebarLinksName">
                                  {t("inventory")}
                                </span>
                              </li>
                            </FontColor>
                          </a>
                        )}
                      </>
                    )}
                    {/* {(role === "ispOwner" ||
                      role === "collector" ||
                      role === "manager" ||
                      role === "reseller") &&
                      !currentUser.collector?.reseller && ( */}
                    <>
                      <Accordion.Item eventKey="7">
                        <Accordion.Header
                          onClick={() => handleActiveAccordian("7")}
                        >
                          <div className="sidebarIcon">{<Headset />}</div>
                          <span className="sidebarLinksName">
                            {t("support")}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <NavLink
                            key={11}
                            to={
                              role === "reseller" ||
                              (role === "collector" &&
                                currentUser.collector?.reseller)
                                ? "/reseller/support/ticket"
                                : "/support/ticket"
                            }
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname ===
                                  (role === "reseller" ||
                                  (role === "collector" &&
                                    currentUser.collector?.reseller)
                                    ? "/reseller/support/ticket"
                                    : "/support/ticket")
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">
                                  {<PersonDash />}
                                </div>
                                <span className="sidebarLinksName">
                                  {t("supportTicket")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>

                          {role === "ispOwner" && (
                            <NavLink
                              key={13}
                              to="/netFee/supportNumber"
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    "/netFee/supportNumber"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    <PhoneVibrate />
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("supportNumbers")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}

                          {(role === "ispOwner" || role === "reseller") && (
                            <NavLink
                              key={14}
                              to={
                                role === "reseller"
                                  ? "/reseller/customer/package/changes"
                                  : "/netFee/packageChange"
                              }
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    (role === "reseller"
                                      ? "/reseller/customer/package/changes"
                                      : "/netFee/packageChange")
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    <ArrowRepeat />
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("packageChange")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </>
                    {(role === "ispOwner" ||
                      role === "manager" ||
                      role === "reseller" ||
                      role === "collector") && (
                      <NavLink
                        key={14}
                        to="/activity"
                        className={(navInfo) =>
                          navInfo.isActive ? activeClass.active : ""
                        }
                      >
                        <FontColor>
                          <li
                            className="sidebarItems"
                            id={window.location.pathname === "/activity"}
                          >
                            <div className="sidebarIcon">
                              <ClockHistory />
                            </div>
                            <span className="sidebarLinksName">
                              {t("activityLog")}
                            </span>
                          </li>
                        </FontColor>
                      </NavLink>
                    )}

                    {/* )} */}
                    {(role === "ispOwner" || role === "manager") && (
                      <>
                        <Accordion.Item eventKey="8">
                          <Accordion.Header
                            onClick={() => handleActiveAccordian("8")}
                          >
                            <div className="sidebarIcon">{<BellFill />}</div>
                            <span className="sidebarLinksName">
                              {t("netFeeSupport")}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            <a
                              href={`https://support.shunnoit.com/support-ticket/create?&netfeeID=${ispOwnerData?.netFeeId}`}
                              target="_blank"
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname ===
                                    "/support-ticket"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">
                                    {<BookmarksFill />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("supportTicket")}
                                  </span>
                                </li>
                              </FontColor>
                            </a>
                            {/* <NavLink
                              key={19}
                              to={"/reseller/support/ticket"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li className="sidebarItems">
                                  <div className="sidebarIcon">
                                    {<Whatsapp />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("whatsAppLive")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink> */}
                            <NavLink
                              key={16}
                              to={"/netFee/support/numbers"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  title={t("netFeeSupportTeam")}
                                >
                                  <div className="sidebarIcon">
                                    {<TelephoneFill />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("supportNumbers")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          </Accordion.Body>
                        </Accordion.Item>
                      </>
                    )}

                    <NavLink
                      key={16}
                      to={"/netFee/tutorial"}
                      className={(navInfo) =>
                        navInfo.isActive ? activeClass.active : ""
                      }
                    >
                      <FontColor>
                        <li
                          className="sidebarItems"
                          title={t("netFeeSupportTeam")}
                        >
                          <div className="sidebarIcon">
                            {<CameraVideoFill />}
                          </div>
                          <span className="sidebarLinksName">
                            {t("tutorial")}
                          </span>
                        </li>
                      </FontColor>
                    </NavLink>
                  </Accordion>
                </div>
              </ul>
            </FourGround>
          )}

          {/* Admin/Superadmin Sidebar */}
          {["admin", "superadmin"].includes(role) && (
            <FourGround>
              <div className="name companyDiv text-center">
                {/* <div className="company_logo">
                <img src="./assets/img/logo.png" alt="" />
              </div> */}
                <NavLink to="/" className="adminDashboardTitle">
                  {/* <ArrowLeft className="GotoHomeFromDashboard" /> */}
                  <span className="companyName">{`Admin Panel`}</span>
                </NavLink>
                <br />
                <span className="role-section">{role}</span>
                <span className="HideSidebar" onClick={removeSidebar}></span>
              </div>

              <ul className="sidebarUl">
                <NavLink
                  to={"/admin/home"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/admin/home"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<HouseDoorFill />}</div>
                      <span className="sidebarLinksName">{t("dashboard")}</span>
                    </li>
                  </FontColor>
                </NavLink>

                <NavLink
                  to={"/admin/all-comments"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/admin/all-comments"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<ChatDots />}</div>
                      <span className="sidebarLinksName">Comments</span>
                    </li>
                  </FontColor>
                </NavLink>

                {["admin", "superadmin"].includes(role) && (
                  <NavLink
                    to={"/admin/invoices"}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === "/admin/invoices"
                            ? "active"
                            : ""
                        }
                      >
                        <div className="sidebarIcon">{<Cash />}</div>
                        <span className="sidebarLinksName">Invoice</span>
                      </li>
                    </FontColor>
                  </NavLink>
                )}

                <NavLink
                  to={"/admin/support"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/admin/support"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<Award />}</div>
                      <span className="sidebarLinksName">Support</span>
                    </li>
                  </FontColor>
                </NavLink>

                {role === "superadmin" && (
                  <NavLink
                    to={"/admin/netFee/bulletin"}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === "/admin/netFee/bulletin"
                            ? "active"
                            : ""
                        }
                      >
                        <div className="sidebarIcon">{<AppIndicator />}</div>
                        <span className="sidebarLinksName">Bulletin</span>
                      </li>
                    </FontColor>
                  </NavLink>
                )}

                <NavLink
                  to={"/admin/netFee/numbers"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/admin/netFee/numbers"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<PhoneVibrate />}</div>
                      <span className="sidebarLinksName">Support Number</span>
                    </li>
                  </FontColor>
                </NavLink>
              </ul>
            </FourGround>
          )}
        </div>
        {/* <span className="unblock"></span> */}
      </div>
      {/* <SupportCall isOpen={isOpen} /> */}
    </TitleColor>
  );
}
