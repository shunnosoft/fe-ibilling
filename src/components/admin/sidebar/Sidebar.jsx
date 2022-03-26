import React from "react";
import "./sidebar.css";

import { TitleColor, FontColor, FourGround } from "../../../assets/js/theme";
import {
  List,
  ArrowLeft,
  HouseDoorFill,
  Wallet2,
  PeopleFill,
  PersonPlus,
  GeoAlt,
  Wifi,
  WalletFill,
  GraphUpArrow,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import activeClass from "../../../assets/css/active.module.css";
import { billData } from "./billData";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const userRole = useSelector((state) => state.auth.role);

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

  return (
    <TitleColor>
      <div>
        <div className="container menuIcon">
          <List onClick={addSidebar} className="ListIcon" />
        </div>
        <div className="sidebar">
          <FourGround>
            <h2>
              <NavLink to="/" className="adminDashboardTitle">
                <ArrowLeft className="GotoHomeFromDashboard" />
                নেট ফি {userRole === "manager" ? " (ম্যানেজার)" : ""}
                {userRole === "collector" ? " (কালেক্টর)" : ""}
                {userRole === "ispOwner" ? " (অ্যাডমিন)" : ""}
              </NavLink>
              <span className="HideSidebar" onClick={removeSidebar}></span>
            </h2>

            <ul className="sidebarUl">
              <NavLink
                to={"/home"}
                className={(navInfo) =>
                  navInfo.isActive ? activeClass.active : ""
                }
              >
                <FontColor>
                  <li
                    className="sidebarItems"
                    id={window.location.pathname === "/home" ? "active" : ""}
                  >
                    <div className="sidebarIcon">{<HouseDoorFill />}</div>
                    <span className="sidebarLinksName">{"ড্যাশবোর্ড"}</span>
                  </li>
                </FontColor>
              </NavLink>

              {userRole === "manager" || userRole === "collector" ? (
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
                      <div className="sidebarIcon">{<GeoAlt />}</div>
                      <span className="sidebarLinksName">{"এরিয়া "}</span>
                    </li>
                  </FontColor>
                </NavLink>
              )}

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
                        window.location.pathname === "/manager" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<PersonPlus />}</div>
                      <span className="sidebarLinksName">{"ম্যানেজার"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}
              {userRole === "manager" || userRole === "ispOwner" ? (
                <NavLink
                  key={4}
                  to={"/collector"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/collector"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<Wallet2 />}</div>
                      <span className="sidebarLinksName">{"কালেক্টর"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}

              <NavLink
                key={6}
                to={"/customer"}
                className={(navInfo) =>
                  navInfo.isActive ? activeClass.active : ""
                }
              >
                <FontColor>
                  <li
                    className="sidebarItems"
                    id={
                      window.location.pathname === "/customer" ? "active" : ""
                    }
                  >
                    <div className="sidebarIcon">{<PeopleFill />}</div>
                    <span className="sidebarLinksName">{"গ্রাহক"}</span>
                  </li>
                </FontColor>
              </NavLink>

              <NavLink
                key={8}
                to={"/report"}
                className={(navInfo) =>
                  navInfo.isActive ? activeClass.active : ""
                }
              >
                <FontColor>
                  <li
                    className="sidebarItems"
                    id={window.location.pathname === "/report" ? "active" : ""}
                  >
                    <div className="sidebarIcon">{<GraphUpArrow />}</div>
                    <span className="sidebarLinksName">{"রিপোর্ট"}</span>
                  </li>
                </FontColor>
              </NavLink>

              {userRole === "ispOwner" ? (
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
                      <div className="sidebarIcon">{<Wifi />}</div>
                      <span className="sidebarLinksName">{"মাইক্রোটিক"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}

              {/* bill
              {userRole === "manager" || userRole === "collector" ? (
                <>
                  <NavLink
                    key={7}
                    to={"/bill"}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === "/bill" ? "active" : ""
                        }
                      >
                        <div className="sidebarIcon">{<Coin />}</div>
                        <span className="sidebarLinksName">{"বিল"}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                </>
              ) : (
                <></>
              )} */}
              <NavLink
                key={7}
                to={"/diposit"}
                className={(navInfo) =>
                  navInfo.isActive ? activeClass.active : ""
                }
              >
                <FontColor>
                  <li
                    className="sidebarItems"
                    id={window.location.pathname === "/diposit" ? "active" : ""}
                  >
                    <div className="sidebarIcon">{<WalletFill />}</div>
                    <span className="sidebarLinksName">{"ডিপোজিট"}</span>
                  </li>
                </FontColor>
              </NavLink>
              {/* bill sub links */}
              <div id="toggleSubBilling">
                {billData.map((val, key) => (
                  <NavLink to={val.link} key={key}>
                    <FontColor>
                      <li
                        className="sidebarItems billingSidebarItems"
                        id={
                          window.location.pathname === val.link ? "active" : ""
                        }
                      >
                        <div className="sidebarIcon">{val.icon}</div>
                        <span className="sidebarLinksName">{val.title}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                ))}
              </div>
            </ul>
          </FourGround>
        </div>
        {/* <span className="unblock"></span> */}
      </div>
    </TitleColor>
  );
}
