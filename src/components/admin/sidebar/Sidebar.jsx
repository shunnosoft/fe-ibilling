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
  Basket2Fill,
  CartFill,
  Bag,
  Award,
} from "react-bootstrap-icons";
import { NavLink, Router } from "react-router-dom";
import activeClass from "../../../assets/css/active.module.css";
// import { billData } from "./billData";
import { useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
// the hook
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  const user = useSelector((state) => state.persistedReducer.auth?.currentUser);
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );
  const getIspOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );
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
  const location = window.location.pathname;

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
  }, [location]);

  const handleActiveAccordian = (key) => {
    if (key === activeKey) {
      setActiveKey("");
    } else {
      setActiveKey(key);
      localStorage.setItem("active-key", key);
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
          {!["admin", "superadmin"].includes(userRole) && (
            <FourGround>
              <div className="name companyDiv text-center">
                {/* <div className="company_logo">
                <img src="./assets/img/logo.png" alt="" />
              </div> */}
                <NavLink to="/" className="adminDashboardTitle">
                  {/* <ArrowLeft className="GotoHomeFromDashboard" /> */}
                  <span className="companyName">
                    {getIspOwnerData?.company}
                  </span>
                </NavLink>
                <br />
                {(userRole === "ispOwner" || userRole === "manager") && (
                  <>
                    <span className="role-section">
                      {t("ID")}: {getIspOwnerData?.netFeeId}
                    </span>
                    <br />
                  </>
                )}

                <span className="role-section">
                  {userRole === "manager" && t("roleManager")}
                  {userRole === "collector" && t("roleCollector")}
                  {userRole === "ispOwner" && t("roleAdmin")}
                  {userRole === "reseller" && t("roleReseller")}
                </span>
                <span className="HideSidebar" onClick={removeSidebar}></span>
              </div>

              <ul className="sidebarUl">
                <NavLink
                  to={
                    userRole === "reseller" ||
                    (userRole === "collector" && user.collector.reseller)
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
                        (userRole === "reseller" ? "/reseller/home" : "/home")
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<HouseDoorFill />}</div>
                      <span className="sidebarLinksName">{t("dashboard")}</span>
                    </li>
                  </FontColor>
                </NavLink>

                {userRole === "manager" ||
                userRole === "collector" ||
                userRole === "reseller" ? (
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

                {!getIspOwnerData?.bpSettings?.hasMikrotik &&
                (userRole === "ispOwner" || userRole === "manager") ? (
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
                {userRole === "ispOwner" &&
                getIspOwnerData?.bpSettings?.hasMikrotik ? (
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
                              userRole === "reseller" ||
                              (userRole === "collector" &&
                                user.collector.reseller)
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
                                  (userRole === "reseller"
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
                            {getIspOwnerData?.bpSettings?.hasMikrotik && (
                              <NavLink
                                key={66}
                                to={
                                  userRole === "reseller" ||
                                  (userRole === "collector" &&
                                    user.collector.reseller)
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
                                      (userRole === "reseller"
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
                                userRole === "reseller" ||
                                (userRole === "collector" &&
                                  user.collector.reseller)
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
                                    (userRole === "reseller"
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

                            {getIspOwnerData?.bpSettings?.hasMikrotik &&
                            (userRole === "ispOwner" ||
                              userRole === "manager" ||
                              userRole === "reseller" ||
                              (userRole === "collector" &&
                                !user.collector.reseller)) ? (
                              <NavLink
                                key={61}
                                to={
                                  userRole === "reseller" ||
                                  (userRole === "collector" &&
                                    user.collector.reseller)
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
                                      (userRole === "reseller"
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
                            ) : (
                              ""
                            )}
                          </>
                        )}
                        {userRole === "ispOwner" &&
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
                            userRole === "reseller" ||
                            (userRole === "collector" &&
                              user.collector.reseller)
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
                                (userRole === "reseller"
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

                        <NavLink
                          key={7}
                          to={
                            userRole === "reseller" ||
                            (userRole === "collector" &&
                              user.collector.reseller)
                              ? "/reseller/diposit"
                              : "/diposit"
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
                                (userRole === "reseller"
                                  ? "/reseller/diposit"
                                  : "/diposit")
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">{<CashCoin />}</div>
                              <span className="sidebarLinksName">
                                {t("diposit")}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>

                        {userRole === "reseller" && (
                          <NavLink
                            key={123}
                            to={userRole === "reseller" && "/reseller/summary"}
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

                        {(userRole === "ispOwner" ||
                          userRole === "manager") && (
                          <NavLink
                            key={10}
                            to={"/due/customer"}
                            className={(navInfo) =>
                              navInfo.isActive ? activeClass.active : ""
                            }
                          >
                            <FontColor>
                              <li
                                className="sidebarItems"
                                id={
                                  window.location.pathname === "/due/customer"
                                    ? "active"
                                    : ""
                                }
                              >
                                <div className="sidebarIcon">
                                  {<PersonDash />}
                                </div>
                                <span className="sidebarLinksName">
                                  {t("dueCustomer")}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                    {/* স্টাফ */}
                    {userRole !== "collector" && (
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
                          {userRole === "ispOwner" ? (
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
                          {userRole === "manager" ||
                          userRole === "ispOwner" ||
                          userRole === "reseller" ? (
                            <NavLink
                              key={4}
                              to={
                                userRole === "reseller"
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
                                    (userRole === "reseller"
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

                          {userRole === "ispOwner" && (
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
                    {userRole === "ispOwner" && (
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
                          {bpSettings?.hasReseller &&
                          userRole === "ispOwner" ? (
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
                                  <div className="sidebarIcon">
                                    {<People />}
                                  </div>
                                  <span className="sidebarLinksName">
                                    {t("reseller")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          ) : (
                            ""
                          )}

                          {(userRole === "ispOwner" &&
                            bpSettings?.hasReseller) ||
                          userRole === "reseller" ? (
                            <NavLink
                              key={70}
                              to={
                                userRole === "reseller"
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
                                    (userRole === "reseller"
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
                          ) : (
                            ""
                          )}

                          {userRole === "ispOwner" ? (
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
                          ) : (
                            ""
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    )}
                    {/* মেসেজ */}
                    {userRole !== "collector" && (
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
                          {userRole === "ispOwner" ||
                          userRole === "manager" ||
                          userRole === "reseller" ? (
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
                            /*(userRole === "ispOwner" && bpSettings?.hasReseller) ||*/
                            userRole === "reseller" ? (
                              <NavLink
                                key={71}
                                to={
                                  userRole === "reseller"
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
                                      (userRole === "reseller"
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
                                      {t("message")}
                                    </span>
                                  </li>
                                </FontColor>
                              </NavLink>
                            ) : (
                              ""
                            )
                          }
                          {userRole === "ispOwner" ||
                          userRole === "reseller" ? (
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
                          {(userRole === "ispOwner" ||
                            (userRole === "manager" &&
                              permission?.readMessageLog)) && (
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
                          {userRole === "reseller" && (
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
                    {/* একাউন্টস */}
                    {(userRole === "ispOwner" || userRole === "manager") && (
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
                                    window.location.pathname === "/expenditure"
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
                          </Accordion.Body>
                        </Accordion.Item>
                        {/* <Accordion.Item eventKey="6">
                          <Accordion.Header
                            onClick={() => handleActiveAccordian("6")}
                          >
                            <div className="sidebarIcon">{<CartFill />}</div>
                            <span className="sidebarLinksName">
                              {t("inventory")}
                            </span>
                          </Accordion.Header>
                          <Accordion.Body>
                            <NavLink
                              key={309}
                              to={"/stock"}
                              className={(navInfo) =>
                                navInfo.isActive ? activeClass.active : ""
                              }
                            >
                              <FontColor>
                                <li
                                  className="sidebarItems"
                                  id={
                                    window.location.pathname === "/stock"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">{<Shop />}</div>
                                  <span className="sidebarLinksName">
                                    {t("stock")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>

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
                          </Accordion.Body>
                        </Accordion.Item> */}
                      </>
                    )}
                    {/* {(userRole === "ispOwner" ||
                      userRole === "collector" ||
                      userRole === "manager" ||
                      userRole === "reseller") &&
                      !user.collector?.reseller && ( */}
                    <>
                      <Accordion.Item eventKey="7">
                        <Accordion.Header
                          onClick={() => handleActiveAccordian("7")}
                        >
                          <div className="sidebarIcon">{<WalletFill />}</div>
                          <span className="sidebarLinksName">
                            {t("support")}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <NavLink
                            key={11}
                            to={
                              userRole === "reseller" ||
                              (userRole === "collector" &&
                                user.collector?.reseller)
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
                                  (userRole === "reseller" ||
                                  (userRole === "collector" &&
                                    user.collector?.reseller)
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
                          {userRole !== "collector" && (
                            <NavLink
                              key={12}
                              to={
                                userRole === "reseller"
                                  ? "/reseller/netFee/support"
                                  : "/netFee/support"
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
                                    (userRole === "reseller" &&
                                    userRole !== "collector"
                                      ? "/reseller/netFee/support"
                                      : "/netFee/support")
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <div className="sidebarIcon">{<Award />}</div>
                                  <span className="sidebarLinksName">
                                    {t("netFeeSupport")}
                                  </span>
                                </li>
                              </FontColor>
                            </NavLink>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </>
                    {/* )} */}
                  </Accordion>
                </div>
              </ul>
            </FourGround>
          )}

          {/* Admin/Superadmin Sidebar */}
          {["admin", "superadmin"].includes(userRole) && (
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
                <span className="role-section">{userRole}</span>
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

                {["admin", "superadmin"].includes(userRole) && (
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
              </ul>
            </FourGround>
          )}
        </div>
        {/* <span className="unblock"></span> */}
      </div>
    </TitleColor>
  );
}
