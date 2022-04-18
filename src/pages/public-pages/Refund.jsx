import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import FooterLink from "./FooterLink";
import "./netfee.css";

export default function Landing() {
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  return (
    <div className="mainlanding">
      <div className="landingWrapper">
        <div className="container-fluide landingContainer">
          {/* <video src="img/v3.mp4" muted loop autoplay type="mp4"></video> */}
          {!currentUser ? (
            <div className="textBox">
              <div className="landingMain">
                <div className="landinglogodiv">
                  <img
                    className="landingLogonew"
                    src="./assets/img/logo.png"
                    alt=""
                  />
                </div>

                <div className="buttons">
                  <NavLink to="/login">
                    <p className="goToLoginPage custom-btn">লগইন</p>
                  </NavLink>
                  <NavLink to="/register">
                    <p className="goToLoginPage custom-btn"> সাইন আপ</p>
                  </NavLink>
                </div>
                {/* <h2 className="LandingTitle">নেটফি</h2> */}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={currentUser ? "textboxwithUser" : "textBox2"}>
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
