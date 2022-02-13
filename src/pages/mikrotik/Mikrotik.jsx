import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./mikrotik.css";
import { Plus, ArrowRightShort } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";
// import { fetchMikrotik } from "../../features/mikrotikSlice";
// import { getMikrotik } from "../../features/mikrotikSlice";
import TdLoader from "../../components/common/TdLoader";
import { fetchMikrotik } from "../../features/apiCalls";

export default function Mikrotik() {
  let serial = 0;
  const auth = useSelector((state) => state.auth.currentUser);
  const [msearch, setMsearch] = useState("");
  const dispatch = useDispatch();
  let allmikrotiks = [];
  allmikrotiks = useSelector(state=>state.mikrotik.mikrotik);

  useEffect(() => {
    const { ispOwner } = auth;
    fetchMikrotik(dispatch,ispOwner.id)
  }, [auth, dispatch]);

  return (
    <>
      <Sidebar />
      <ToastContainer
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
                      <p>মাইক্রোটিক অ্যাড</p>
                      <div className="addAndSettingIcon">
                        <Plus
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#MikrotikModal"
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট মাইক্রোটিক:{" "}
                          <span>{allmikrotiks.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম টাইপ করুন"
                            onChange={(e) => setMsearch(e.target.value)}
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
                          <th scope="col">সিরিয়াল</th>
                          <th scope="col">নাম</th>
                          <th scope="col">হোস্ট</th>
                          <th scope="col">পোর্ট</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allmikrotiks.length === undefined ? (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        ) : (
                          allmikrotiks
                            .filter((val) => {
                              return val.name
                                .toLowerCase()
                                .includes(msearch.toLowerCase());
                            })
                            .map((val, key) => (
                              <tr key={key}>
                                <td style={{ paddingLeft: "30px" }}>
                                  {++serial}
                                </td>
                                <td>{val.name}</td>
                                <td>{val.host}</td>
                                <td>{val.port}</td>
                                <td className="mikrotikConfigure">
                                  <Link
                                    to={`/mikrotik/${val.ispOwner}/${val.id}`}
                                    className="mikrotikConfigureButtom"
                                  >
                                    কনফিগার{" "}
                                    <ArrowRightShort
                                      style={{ fontSize: "19px" }}
                                    />
                                  </Link>
                                </td>
                              </tr>
                            ))
                        )}
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
