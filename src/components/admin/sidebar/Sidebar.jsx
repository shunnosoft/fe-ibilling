import { useState } from "react";
import React from "react";
import "./sidebar.css";
import { TitleColor, FontColor, FourGround } from "../../../assets/js/theme";
import {
  List,
  ArrowLeft,
  CaretDownFill,
  Coin,
  CaretRightFill,
  // Coin,
  // CaretRightFill,
  // CaretDownFill,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { AllRoutes } from "../../../routes/router";
import activeClass from "../../../assets/css/active.module.css";
import { billData } from "./billData";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const userRole=useSelector(state=>state.auth.currentUser?.user.role)
   
  const [isDown, setIsDown] = useState(false);

  // addSidebar
  const addSidebar = () => {
    document.querySelector(".sidebar").classList.add("toggleSidebar");
  };

  // remove sidebar
  const removeSidebar = () => {
    document.querySelector(".sidebar").classList.remove("toggleSidebar");
  };

  // sub bill toggle
  const toggleSubBillingHandle = () => {
    setIsDown(!isDown);
    document
      .getElementById("toggleSubBilling")
      .classList.toggle("hideSubBilling");
  };

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
                ড্যাশবোর্ড
              </NavLink>
              <span className="HideSidebar" onClick={removeSidebar}></span>
            </h2>

            <ul className="sidebarUl">
              {AllRoutes.map((val, key) => {
                return (
                  <NavLink
                    key={key}
                    to={val.link}
                    className={(navInfo) =>
                      navInfo.isActive ? activeClass.active : ""
                    }
                  >
                    <FontColor>
                      <li
                        className="sidebarItems"
                        id={
                          window.location.pathname === val.link ? "active" : ""
                        }
                      >
                        <div className="sidebarIcon">{val.icon}</div>
                        <span className="sidebarLinksName">{val.title}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                );
              })}

              {/* bill */}
              {
                (userRole==="manager") || (userRole==="collector") ?(

                  <div onClick={toggleSubBillingHandle}>
                <FontColor>
                  <li className="sidebarItems">
                    <div className="sidebarIcon">
                      <Coin />
                    </div>
                    <span className="sidebarLinksName">বিল</span>
                    <span className="arrowRightFillStyle">
                      {isDown ? <CaretDownFill /> : <CaretRightFill />}
                    </span>
                  </li>
                </FontColor>
              </div>
                ):<></>
              }
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
