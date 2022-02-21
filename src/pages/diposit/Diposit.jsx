import { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

// internal import
import "./diposit.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";

export default function Diposit() {
  return (
    <>
      <Sidebar />
      <ToastContainer
        className="bg-green"
        toastStyle={{
          backgroundColor: "#677078",
          color: "white",
          fontWeight: "500",
        }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">ডিপোজিট</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="row searchCollector">
                    <div className="col-sm-8">
                      <h4 className="allCollector">
                        মোট ডিপোজিট: <span>NULL</span>
                      </h4>
                    </div>

                    <div className="col-sm-4">
                      <div className=" collectorSearch">
                        {/* <Search className="serchingIcon" /> */}
                        <input
                          type="text"
                          className="search"
                          placeholder="সার্চ"
                          // onChange={(e) => setCusSearch(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <td>নাম (কালেক্টর)</td>
                          <td>মোট</td>
                          <td className="textAlignCenter">অ্যাকশন</td>
                          <td>তারিখ</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Md. Rakib Hasan</td>
                          <td>৳ {500}</td>
                          <td>
                            <div className="AcceptRejectBtn">
                              <button>Accept</button>
                              <button>Reject</button>
                            </div>
                          </td>
                          <td>31/01/2022 07:25 PM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
