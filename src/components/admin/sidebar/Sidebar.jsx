import React from "react";
import "./sidebar.css";

import { TitleColor, FontColor, FourGround } from "../../../assets/js/theme";
import {
  List,
  ArrowLeft,
  HouseDoorFill,
  Wallet2,
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
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import activeClass from "../../../assets/css/active.module.css";
// import { billData } from "./billData";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const user = useSelector((state) => state.persistedReducer.auth.currentUser);
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.userData?.bpSettings
  );
  const getIspOwnerData = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
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
                      <div className="sidebarIcon">{<GeoAlt />}</div>
                      <span className="sidebarLinksName">{"এরিয়া "}</span>
                    </li>
                  </FontColor>
                </NavLink>
              )}

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
                        window.location.pathname === "/reseller" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<PersonLinesFill />}</div>
                      <span className="sidebarLinksName">{"রিসেলার"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
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
                      <div className="sidebarIcon">{<PersonBoundingBox />}</div>
                      <span className="sidebarLinksName">{"ম্যানেজার"}</span>
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
                    <div className="sidebarIcon">{<PeopleFill />}</div>
                    <span className="sidebarLinksName">{"গ্রাহক"}</span>
                  </li>
                </FontColor>
              </NavLink>

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
                    <div className="sidebarIcon">{<PeopleFill />}</div>
                    <span className="sidebarLinksName">
                      {"স্ট্যাটিক গ্রাহক"}
                    </span>
                  </li>
                </FontColor>
              </NavLink>

              {bpSettings?.hasMikrotik &&
              (userRole === "ispOwner" || userRole === "manager") ? (
                <NavLink
                  key={66}
                  to={"/activeCustomer"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/activeCustomer"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<PersonCheck />}</div>
                      <span className="sidebarLinksName">
                        {"এক্টিভ গ্রাহক"}
                      </span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}

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
                      (userRole === "reseller" ? "/reseller/report" : "/report")
                        ? "active"
                        : ""
                    }
                  >
                    <div className="sidebarIcon">{<GraphUpArrow />}</div>
                    <span className="sidebarLinksName">{"রিপোর্ট"}</span>
                  </li>
                </FontColor>
              </NavLink>

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
                      <div className="sidebarIcon">{<Wifi />}</div>
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
                    <div className="sidebarIcon">{<WalletFill />}</div>
                    <span className="sidebarLinksName">{"ডিপোজিট"}</span>
                  </li>
                </FontColor>
              </NavLink>

              {(userRole === "ispOwner" && bpSettings?.hasReseller) ||
              userRole === "reseller" ? (
                <NavLink
                  key={70}
                  to={
                    userRole === "reseller" ? "/reseller/recharge" : "/recharge"
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
                        <div className="sidebarIcon">{<Envelope />}</div>
                        <span className="sidebarLinksName">{"মেসেজ"}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                ) : (
                  ""
                )
              }

              {userRole === "ispOwner" ? (
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
                        window.location.pathname === "/message" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<Messenger />}</div>
                      <span className="sidebarLinksName">{"মেসেজ"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}

              {userRole === "ispOwner" ? (
                <NavLink
                  key={99}
                  to={"/message-request"}
                  className={(navInfo) =>
                    navInfo.isActive ? activeClass.active : ""
                  }
                >
                  <FontColor>
                    <li
                      className="sidebarItems"
                      id={
                        window.location.pathname === "/message-request"
                          ? "active"
                          : ""
                      }
                    >
                      <div className="sidebarIcon">{<Messenger />}</div>
                      <span className="sidebarLinksName">
                        {"মেসেজ রিকোয়েস্ট"}
                      </span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}

              {userRole === "ispOwner" ? (
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
                        window.location.pathname === "/invoice" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<PersonBoundingBox />}</div>
                      <span className="sidebarLinksName">{"ইনভয়েস"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}

              {userRole === "ispOwner" || userRole === "reseller" ? (
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
                      <div className="sidebarIcon">{<CashStack />}</div>
                      <span className="sidebarLinksName">{"খরচ"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              ) : (
                ""
              )}
              {userRole === "ispOwner" ? (
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
                        window.location.pathname === "/settings" ? "active" : ""
                      }
                    >
                      <div className="sidebarIcon">{<Gear />}</div>
                      <span className="sidebarLinksName">{"সেটিংস"}</span>
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
                      id={window.location.pathname === "/staff" ? "active" : ""}
                    >
                      <div className="sidebarIcon">{<PeopleFill />}</div>
                      <span className="sidebarLinksName">{"কর্মী"}</span>
                    </li>
                  </FontColor>
                </NavLink>
              )}

              {/* bill sub links */}
              {/* <div id="toggleSubBilling">
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
              </div> */}
            </ul>
          </FourGround>
        </div>
        {/* <span className="unblock"></span> */}
      </div>
    </TitleColor>
  );
}
