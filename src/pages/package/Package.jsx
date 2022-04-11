import React, { useEffect, useState } from "react";
import { ThreeDots, PersonFill, PenFill, PlusLg } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
// import Loader from "../../components/common/Loader";
import Pagination from "../../components/Pagination";

import TdLoader from "../../components/common/TdLoader";
import { getPackagewithoutmikrotik } from "../../features/apiCalls";
import CreatePackage from "./CreatePackageModal";
import EditPackage from "./EditPackageModal";

// import { getCollector, getSubAreas } from "../../features/apiCallReseller";

export default function Package() {
  const packages=useSelector(state=>state.package.packages)
  console.log(packages)
  const dispatch = useDispatch();
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  let serial = 0;
 
  
  
  const role = useSelector((state) => state.persistedReducer.auth.role);
  

  useEffect(() => {
    getPackagewithoutmikrotik(ispOwnerId, dispatch);
  }, [ispOwnerId, dispatch]);

  const [singlePackage, setSinglePackage] = useState("");

  const getSpecificPackage = (val) => {
    console.log(val)
    setSinglePackage(val)
    }
  

  // DELETE collector
  // const deleteCollectorHandler = async (ID) => {
  //   const IDs = { ispOwnerId, collectorId: ID };
  //   deleteCollector(dispatch, IDs, setIsDeleting);
  // };
  // console.log(allCollector)

  // useEffect(() => {
  //   const keys = ["name", "mobile", "email"];
  //   if (collSearch !== "") {
  //     setCollector(
  //       collector.filter((item) =>
  //         keys.some((key) =>
  //           typeof item[key] === "string"
  //             ? item[key].toLowerCase().includes(collSearch)
  //             : item[key].toString().includes(collSearch)
  //         )
  //       )
  //     );
  //   } else {
  //     setCollector(collector);
  //   }
  // }, [collSearch, collector]);

  const searchHandler = (e) => {
    setCollSearch(e.toLowerCase());
  };
  return (
    <>
      <CreatePackage></CreatePackage>
      <EditPackage package={singlePackage}></EditPackage>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">প্যাকেজ</h2>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <div className="displexFlexSys">
                        <div className="addAndSettingIcon">
                          {
                            <PlusLg
                              className="addcutmButton"
                              data-bs-toggle="modal"
                              data-bs-target="#createPackage"
                            />
                          }
                        </div>
                      </div>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট প্যাকেজ:
                          <span>{packages?.length || ""}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ করুন"
                            onChange={(e) => searchHandler(e.target.value)}
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
                          <th>সিরিয়াল</th>
                          <th>নাম</th>
                          <th>প্যাকেজ রেট</th>
                          
                          <th className="centeringTD">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collector?.length === undefined ? (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        ) : (
                          packages?.map((val, key) => (
                            <tr key={key}>
                              <td>{++serial}</td>
                              <td>{val.name}</td>
                              <td>{val.rate}</td>
                               
                              <td className="centeringTD">
                                <ThreeDots
                                  className="dropdown-toggle ActionDots"
                                  id="customerDrop"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                />

                                {/* modal */}
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="customerDrop"
                                >
                                  {
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#editPackage"
                                      
                                      onClick={() => {
                                        getSpecificPackage(val);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <PenFill />
                                          <p className="actionP">এডিট</p>
                                        </div>
                                      </div>
                                    </li>
                                  }
                                  {/* {role==="ispOwner"? <li
                                      onClick={() => {
                                        deleteCollectorHandler(val.id);
                                      }}
                                    >
                                      <div className="dropdown-item actionManager">
                                        <div className="customerAction">
                                          <ArchiveFill />
                                          <p className="actionP">ডিলিট</p>
                                        </div>
                                      </div>
                                    </li>:""} */}
                                </ul>

                                {/* end */}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {/* <div className="paginationSection">
                    <select
                      className="form-select paginationFormSelect"
                      aria-label="Default select example"
                      onChange={(e) => setCollectorPerPage(e.target.value)}
                    >
                      <option value="5">৫ জন</option>
                      <option value="10">১০ জন</option>
                      <option value="100">১০০ জন</option>
                    </select>
                    <Pagination
                      customerPerPage={collectorPerPage}
                      totalCustomers={collector.length}
                      paginate={paginate}
                    />
                  </div> */}
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
