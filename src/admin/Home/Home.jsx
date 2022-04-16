// external imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ThreeDotsVertical } from "react-bootstrap-icons";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { cardData, monthsName } from "./homeData";

import { useDispatch, useSelector } from "react-redux";
import { getIspOwners } from "../../features/apiCallAdmin";

export default function Home() {
  const ispOwners = useSelector((state) => state.admin.ispOwners);
  const dispatch = useDispatch();

  useEffect(() => {
    getIspOwners(dispatch);
  }, [dispatch]);

  console.log(ispOwners);

  return (
    <div className="container homeWrapper">
      <ToastContainer position="top-right" theme="colored" />
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            <h2 className="dashboardTitle">AdMIN ড্যাশবোর্ড</h2>
          </div>
          <br />
          <div className="table-responsive-lg">
            <table className="table table-striped ">
              <thead>
                <tr>
                  <th>সিরিয়াল</th>
                  <th>নাম</th>
                  <th>মোবাইল</th>
                  <th>ইমেইল</th>
                  <th>কোম্পানি</th>
                  <th>ঠিকানা</th>
                  <th>প্যাকেজ</th>
                  <th>রিসেলার</th>
                  <th>মাইক্রোটিক</th>
                </tr>
              </thead>
              <tbody>
                {ispOwners?.length === undefined ? (
                  <tr></tr>
                ) : (
                  ispOwners?.map((val, i) => (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{val.name}</td>
                      <td>{val.mobile}</td>
                      <td>{val.email}</td>
                      <td>{val.company}</td>
                      <td>{val.address}</td>
                      <td>
                        {val.bpSettings.pack} - {val.bpSettings.packType}
                      </td>
                      <td>{val.bpSettings.hasReseller ? "YES" : "NO"}</td>
                      <td>{val.bpSettings.hasMikrotik ? "YES" : "NO"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FontColor>
    </div>
  );
}
