// external imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import moment from "moment";
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
            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th width="5%">সিরিয়াল</th>
                  <th width="10%">নাম</th>
                  <th width="10%">মোবাইল</th>
                  <th width="10%">ইমেইল</th>
                  <th width="10%">কোম্পানি</th>
                  <th width="10%">ঠিকানা</th>
                  <th width="10%">প্যাকেজ</th>
                  <th width="10%">রিসেলার</th>
                  <th width="10%">মাইক্রোটিক</th>
                  <th width="10%">তারিখ</th>
                  <th width="5%"></th>
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
                      <td>
                        {moment(val.createdAt).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      <td>...</td>
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
