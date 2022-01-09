import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { PersonPlusFill, GearFill, ThreeDots } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerModal from "./CustomerModal";
import { fetchCustomer, getCustomer } from "../../features/customerSlice";

export default function Customer() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [cusSearch, setCusSearch] = useState("");
  let serial = 0;

  let Customers = [];
  Customers = useSelector(getCustomer);

  useEffect(() => {
    const { ispOwner } = auth;
    dispatch(fetchCustomer(ispOwner.id));
  }, [auth, dispatch]);

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
              <FourGround>
                <h2 className="collectorTitle">কাস্টমার</h2>
              </FourGround>

              {/* Model start */}
              <CustomerModal />
              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>নতুন কাস্টমার অ্যাড করুন </p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
                        />
                        <GearFill
                          className="addcutmButton"
                          // data-bs-toggle="modal"
                          // data-bs-target=""
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট কাস্টমার : <span>{Customers.length}</span>{" "}
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          {/* <Search className="serchingIcon" /> */}
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম লিখুন"
                            onChange={(e) => setCusSearch(e.target.value)}
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
                          <th scope="col">মোবাইল</th>
                          <th scope="col">এড্রেস</th>
                          <th scope="col">স্ট্যাটাস</th>
                          <th scope="col" className="centeringTD">
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Customers.length === undefined ? (
                          <tr>
                            <td>Loading...</td>
                          </tr>
                        ) : (
                          Customers.filter((val) => {
                            return val.name
                              .toLowerCase()
                              .includes(cusSearch.toLowerCase());
                          }).map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td style={{ paddingLeft: "30px" }}>
                                {++serial}
                              </td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{val.address}</td>
                              <td>{val.status}</td>
                              <td className="centeringTD">
                                <ThreeDots className="ActionDots" />
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
