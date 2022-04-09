import React from "react";
import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
import FooterLink from "./FooterLink";
import "./netfee.css";

export default function Terms() {
  // const currentUser = useSelector(state => state.auth.currentUser);

  // console.log("From Landing: ", currentUser);

  // const currentUser = false;
  return (
    <div className="mainlanding">
      <div className="landingWrapper">
        <div className="container-fluide">
          {/* <video src="img/v3.mp4" muted loop autoplay type="mp4"></video> */}
          <div className="textBox">
            <div className="landingMain">
              <img className="landingLogo" src="./assets/img/logo.png" alt="" />
              <p className="landingText"></p>

              <NavLink to="/register">
                <p className="goToLoginPage custom-btn"> সাইন আপ</p>
              </NavLink>
              {/* <h2 className="LandingTitle">নেটফি</h2> */}
            </div>
          </div>
          <div className="textBox2">
            <p style={{ height: "50px" }}></p>

            <div class="intro1">
              <h2>Return and Refund Policy</h2>

              <hr />
              <p>
                Shunno Software is working as a service provider. So Shunno
                Software have not provided anything return or refund, It is a
                non-return & non-refundable product.
              </p>
            </div>
            <br />

            <p style={{ height: "50%" }}></p>

            <FooterLink />
          </div>
        </div>
      </div>
    </div>
  );
}
