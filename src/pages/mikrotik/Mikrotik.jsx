import React from "react";
import "./mikrotik.css";
import { GearFill, PlugFill } from "react-bootstrap-icons";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";

export default function Mikrotik() {
  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{ backgroundColor: "#992c0c", color: "white" }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <MikrotikPost />
              {/* modals */}
              <FourGround>
                <h2 className="collectorTitle">মাইক্রোটিক</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>মাইক্রোটিক কনফিগারেশন</p>
                      <div className="addAndSettingIcon">
                        <GearFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#MikrotikModal"
                        />
                        <PlugFill
                          className="addcutmButton"
                          //   data-bs-toggle="modal"
                          //   data-bs-target="#exampleModal"
                        />
                      </div>
                      <div className="mikrotikDetails mt-5">
                        <p>
                          আইপিঃ <b>103.121.61.228</b>
                        </p>
                        <p>
                          ইউজারনেমঃ <b>admin</b>
                        </p>
                        <p>
                          পোর্টঃ <b>8728</b>
                        </p>
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          PPPoE প্যাকেজ: <span>1</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="Search"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">নাম</th>
                          <th scope="col">এড্রেস</th>
                          <th scope="col">ইমেইল</th>
                          <th scope="col">মোবাইল</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Data 1</td>
                          <td>Data 2</td>
                          <td>Data 3</td>
                          <td>Data 4</td>
                          <td style={{ textAlign: "center" }}>Data 5</td>
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
