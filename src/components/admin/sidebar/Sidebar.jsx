import React, { useEffect, useLayoutEffect, useState } from "react";
import "./sidebar.css";

import { TitleColor, FontColor, FourGround } from "../../../assets/js/theme";
import {
  List,
  ArrowLeft,
  HouseDoorFill,
  Wallet2,
  People,
  PeopleFill,
  GeoAlt,
  Wifi,
  WalletFill,
  GraphUpArrow,
  Messenger,
  PersonLinesFill,
  PersonBoundingBox,
  Cash,
  Gear,
  PersonCheck,
  CashStack,
  Envelope,
  ChatDots,
  Person,
  PersonVideo,
  PersonVideo2,
  PersonVideo3,
  BarChartFill,
  CashCoin,
  PersonBadgeFill,
  PersonSquare,
  PersonCircle,
  PersonWorkspace,
  EnvelopeOpen,
  ChatSquareDots,
  Bag,
  ReceiptCutoff,
  Basket3Fill,
  GeoAltFill,
  EjectFill,
} from "react-bootstrap-icons";
import { NavLink, Router } from "react-router-dom";
import activeClass from "../../../assets/css/active.module.css";
// import { billData } from "./billData";
import { useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";

export default function Sidebar() {
  const userRole = useSelector((state) => state?.persistedReducer?.auth?.role);
  const user = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );
  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );
  const getIspOwnerData = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerData
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

  // sub bill toggle
  // const toggleSubBillingHandle = () => {
  //   setIsDown(!isDown);
  //   document
  //     .getElementById("toggleSubBilling")
  //     .classList.toggle("hideSubBilling");
  // };

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

  return (
    <TitleColor>
      <div>
        <div className="container menuIcon">
          <List onClick={addSidebar} className="ListIcon" />
        </div>
        <div className="sidebar">
          <FourGround>
            <div className="name companyDiv">
              <NavLink to="/" className="adminDashboardTitle">
                <ArrowLeft className="GotoHomeFromDashboard" />
                নেট ফি {userRole === "manager" ? " (ম্যানেজার)" : ""}
                {userRole === "collector" ? " (কালেক্টর)" : ""}
                {userRole === "ispOwner" ? " (এডমিন)" : ""}
                {userRole === "reseller" ? " (রিসেলার)" : ""}
              </NavLink>
              <br />
              <div className="companyName">{getIspOwnerData?.company}</div>
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
                    <span className="sidebarLinksName">{"ড্যাশবোর্ড"}</span>
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
                      id={window.location.pathname === "/area" ? "active" : ""}
                    >
                      <div className="sidebarIcon">{<GeoAltFill />}</div>
                      <span className="sidebarLinksName">{"এরিয়া "}</span>
                    </li>
                  </FontColor>
                </NavLink>
              )}

              {!bpSettings?.hasMikrotik &&
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
                        window.location.pathname === "/package" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<EjectFill />}</div>
                      <span className="sidebarLinksName">{"প্যাকেজ"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}
              {userRole === "ispOwner" && bpSettings?.hasMikrotik ? (
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
                        window.location.pathname === "/mikrotik" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<Basket3Fill />}</div>
                      <span className="sidebarLinksName">{"মাইক্রোটিক"}</span>
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
                      <span className="sidebarLinksName">গ্রাহক</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <NavLink
                        key={6}
                        to={
                          userRole === "reseller" ||
                          (userRole === "collector" && user.collector.reseller)
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
                            <span className="sidebarLinksName">{"PPPoE"}</span>
                          </li>
                        </FontColor>
                      </NavLink>

                      {bpSettings?.hasMikrotik &&
                      (userRole === "ispOwner" ||
                        userRole === "manager" ||
                        userRole === "reseller" ||
                        (userRole === "collector" &&
                          user.collector.reseller)) ? (
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
                                {"এক্টিভ PPPoE"}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      ) : (
                        ""
                      )}
                      {userRole === "ispOwner" ||
                      userRole === "manager" ||
                      userRole === "collector" ? (
                        <NavLink
                          key={60}
                          to={"/staticCustomer"}
                          className={(navInfo) =>
                            navInfo.isActive ? activeClass.active : ""
                          }
                        >
                          <FontColor>
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
                                {"স্ট্যাটিক"}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      ) : (
                        ""
                      )}
                      {bpSettings?.hasMikrotik &&
                      (userRole === "ispOwner" || userRole === "manager") ? (
                        <NavLink
                          key={61}
                          to={"/staticActiveCustomer"}
                          className={(navInfo) =>
                            navInfo.isActive ? activeClass.active : ""
                          }
                        >
                          <FontColor>
                            <li
                              className="sidebarItems"
                              id={
                                window.location.pathname ===
                                "/staticActiveCustomer"
                                  ? "active"
                                  : ""
                              }
                            >
                              <div className="sidebarIcon">
                                {<PersonCheck />}
                              </div>
                              <span className="sidebarLinksName">
                                {"এক্টিভ স্ট্যাটিক"}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </Accordion.Body>

                    {/* রিপোর্ট */}
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header
                      onClick={() => handleActiveAccordian("1")}
                    >
                      <div className="sidebarIcon">{<BarChartFill />}</div>
                      <span className="sidebarLinksName">রিপোর্ট</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <NavLink
                        key={8}
                        to={
                          userRole === "reseller" ||
                          (userRole === "collector" && user.collector.reseller)
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
                              {"কালেকশন"}
                            </span>
                          </li>
                        </FontColor>
                      </NavLink>

                      <NavLink
                        key={7}
                        to={
                          userRole === "reseller" ||
                          (userRole === "collector" && user.collector.reseller)
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
                              {"ডিপোজিট"}
                            </span>
                          </li>
                        </FontColor>
                      </NavLink>
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* স্টাফ */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header
                      onClick={() => handleActiveAccordian("2")}
                    >
                      <div className="sidebarIcon">{<PersonLinesFill />}</div>
                      <span className="sidebarLinksName">স্টাফ</span>
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
                              <div className="sidebarIcon">{<Person />}</div>
                              <span className="sidebarLinksName">
                                {"ম্যানেজার"}
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
                              <div className="sidebarIcon">{<People />}</div>
                              <span className="sidebarLinksName">
                                {"কালেক্টর"}
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
                                {"কর্মী"}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* রিসেলার */}
                  {userRole === "ispOwner" && (
                    <Accordion.Item eventKey="3">
                      <Accordion.Header
                        onClick={() => handleActiveAccordian("3")}
                      >
                        <div className="sidebarIcon">{<PersonCircle />}</div>
                        <span className="sidebarLinksName">রিসেলার</span>
                      </Accordion.Header>
                      <Accordion.Body>
                        {bpSettings?.hasReseller &&
                        bpSettings?.hasMikrotik &&
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
                                <div className="sidebarIcon">{<People />}</div>
                                <span className="sidebarLinksName">
                                  {"রিসেলার"}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        ) : (
                          ""
                        )}

                        {(userRole === "ispOwner" && bpSettings?.hasReseller) ||
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
                                  {"রিচার্জ হিস্ট্রি"}
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
                                  {"মেসেজ রিকোয়েস্ট"}
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
                  <Accordion.Item eventKey="4">
                    <Accordion.Header
                      onClick={() => handleActiveAccordian("4")}
                    >
                      <div className="sidebarIcon">{<Messenger />}</div>
                      <span className="sidebarLinksName">মেসেজ</span>
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
                              <div className="sidebarIcon">{<ChatDots />}</div>
                              <span className="sidebarLinksName">
                                {"বাল্ক মেসেজ"}
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
                                  {"মেসেজ"}
                                </span>
                              </li>
                            </FontColor>
                          </NavLink>
                        ) : (
                          ""
                        )
                      }
                      {userRole === "ispOwner" || userRole === "reseller" ? (
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
                                {"মেসেজ সেটিংস"}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* একাউন্টস */}
                  {userRole === "ispOwner" || userRole === "manager" ? (
                    <Accordion.Item eventKey="5">
                      <Accordion.Header
                        onClick={() => handleActiveAccordian("5")}
                      >
                        <div className="sidebarIcon">{<WalletFill />}</div>
                        <span className="sidebarLinksName">একাউন্টস</span>
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
                              <div className="sidebarIcon">{<CashCoin />}</div>
                              <span className="sidebarLinksName">{"খরচ"}</span>
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
                                {"ইনভয়েস"}
                              </span>
                            </li>
                          </FontColor>
                        </NavLink>
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : (
                    ""
                  )}
                </Accordion>
              </div>
            </ul>
          </FourGround>
        </div>
        {/* <span className="unblock"></span> */}
      </div>
    </TitleColor>
  );
}
