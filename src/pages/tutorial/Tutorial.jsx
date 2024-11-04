import React from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { tutorialLink } from "./tutorialLink";
import { useSelector } from "react-redux";

const Tutorial = () => {
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <div className="displayGrid3">
              {tutorialLink?.map((item) => {
                return (
                  (userRole === item.role || item.role === "") && (
                    <div className="embed-responsive">
                      <iframe
                        width="400"
                        height="250"
                        src={item.link}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen=""
                        title="Embedded youtube"
                        className="embed-responsive-item"
                      />
                      <label className="form-label" htmlFor="">
                        {item.title}
                      </label>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
