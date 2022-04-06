import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./landing.css";

export default function Landing() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  // console.log("From Landing: ", currentUser);

  // const currentUser = false;
  return (
    <div className="mainlanding">
      <div className="landingWrapper">
        <div className="container-fluide">
          {/* <video src="img/v3.mp4" muted loop autoplay type="mp4"></video> */}
          <div className="textBox">
            <div className="landingMain">
              <h2 className="LandingTitle">নেটফি</h2>
              <p className="landingText">
                 
              </p>

              
              
                <NavLink
                  to="/register"
                   
                >
                  
                  <p className="goToLoginPage custom-btn"> সাবস্ক্রাইব</p>
                 
                </NavLink>
              
            </div>
          </div>
        </div>

        <div className="landingFooter">
          <span>@copyright 2021 sunnosoft</span>
        </div>
      </div>
    </div>
  );
}
