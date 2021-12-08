import React from "react";
import "./sidebar.css";
import { TitleColor, FontColor, FourGround } from "../../../assets/js/theme";
import { List, XCircleFill } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { AllRoutes } from "../../../routes/router";
import activeClass from "../../../assets/css/active.module.css";

export default function Sidebar() {
  // addSidebar
  const addSidebar = () => {
    document.querySelector(".sidebar").classList.add("toggleSidebar");
  };

  // remove sidebar
  const removeSidebar = () => {
    document.querySelector(".sidebar").classList.remove("toggleSidebar");
  };

  return (
    <TitleColor>
      <div>
        <div className="container menuIcon">
          <List onClick={addSidebar} className="ListIcon" />
        </div>
        <div className="sidebar">
          <FourGround>
            <h2 className="adminDashboardTitle">
              Admin Dashboard
              <XCircleFill className="removeSidebar" onClick={removeSidebar} />
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
                        <span>{val.title}</span>
                      </li>
                    </FontColor>
                  </NavLink>
                );
              })}
            </ul>
          </FourGround>
        </div>
        {/* <span className="unblock"></span> */}
      </div>
    </TitleColor>
  );
}
