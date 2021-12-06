import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./landing.css";

export default function Landing() {
  const { isAuth } = useSelector((state) => state.auth);

  console.log("From Landing: ", isAuth);

  // const isAuth = false;
  return (
    <>
      <div className="landingWrapper">
        <div className="container-fluide">
          {/* <video src="img/v3.mp4" muted loop autoplay type="mp4"></video> */}
          <div className="textBox">
            <div className="landingMain">
              <h2 className="LandingTitle">শূন্য সফটওয়্যার </h2>
              <p className="landingText">
                আমরা বাংলায় ওয়েব ডেডলপমেন্ট নিয়ে কাজ করতে গিয়ে প্রথম যে
                সমস্যাটার মুখোমুখি হই, সেটা হলো, বাংলা ডেমো টেক্সট। ইংরেজির জন্য
                lorem ipsum তো আছে । বাংলার জন্য কি আছে? সেই ধারনা থেকেই বাংলা
                ডেমো টেক্সট তৈরীর চেষ্টা।
              </p>
              <br />
              {isAuth ? (
                <NavLink to="/home" className="landingSubscribeBtn custom-btn">
                  ড্যাশবোর্ড
                </NavLink>
              ) : (
                <NavLink
                  to="/register"
                  className="landingSubscribeBtn custom-btn"
                >
                  সাবস্ক্রাইব
                </NavLink>
              )}
            </div>
          </div>
        </div>

        <div className="landingFooter">
          <span>@copyright 2021 sunnosoft</span>
        </div>
      </div>
    </>
  );
}
