import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "./collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import CollectorPost from "./collectorCRUD/CollectorPost";
// import Loader from "../../components/common/Loader";
import Pagination from "../../components/Pagination";

import TdLoader from "../../components/common/TdLoader";
import CollectorDetails from "./collectorCRUD/CollectorDetails";
import CollectorEdit from "./collectorCRUD/CollectorEdit";
import { getCollector } from "../../features/apiCalls";

export default function Collector() {
  const dispatch = useDispatch();
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector((state) => state.collector.collector);

  let serial = 0;
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = collector.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const permission = useSelector((state) => state.auth?.userData?.permissions);
  const role = useSelector((state) => state.auth.role);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getCollector(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

  const [singleCollector, setSingleCollector] = useState("");
  const getSpecificCollector = (id) => {
    if (collector.length !== undefined) {
      const temp = collector.find((val) => {
        return val.id === id;
      });
      setSingleCollector(temp);
    }
  };

  // DELETE collector
  // const deleteCollectorHandler = async (ID) => {
  //   const IDs = { ispOwnerId, collectorId: ID };
  //   deleteCollector(dispatch, IDs, setIsDeleting);
  // };
  // console.log(allCollector)

  
  useEffect(() => {
    const keys = ["name", "mobile", "email"];
    if (collSearch !== "") {
      setCollector(
        collector.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setCollector(collector);
    }
  }, [collSearch,collector]);

  const searchHandler = (e) => {
    setCollSearch(e.toLowerCase())
  };
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">কালেক্টর</h2>

              {/* modals */}
              <CollectorPost />
              <CollectorDetails single={singleCollector} />
              <CollectorEdit single={singleCollector} />

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <div className="displexFlexSys">
                        <div className="addAndSettingIcon">
                          {permission?.collectorAdd || role === "ispOwner" ? (
                            <PersonPlusFill
                              className="addcutmButton"
                              data-bs-toggle="modal"
                              data-bs-target="#collectorModal"
                            />
                          ) : (
                            ""
                          )}
                          {/* <GearFill
                            className="addcutmButton"
                            // data-bs-toggle="modal"
                            // data-bs-target="#exampleModal"
                          /> */}
                        </div>
                      </div>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট কালেক্টর:
                          <span>{collector?.length || ""}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম লিখুন"
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
                          <th>মোবাইল</th>
                          <th>ইমেইল</th>
                          <th className="centeringTD">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collector?.length === undefined ? (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        ) : (
                          allCollector?.map((val, key) => (
                            <tr key={key}>
                              <td>{++serial}</td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{val.email}</td>
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
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#showCollectorDetails"
                                    onClick={() => {
                                      getSpecificCollector(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">প্রোফাইল</p>
                                      </div>
                                    </div>
                                  </li>
                                  {permission?.collectorEdit ||
                                  role === "ispOwner" ? (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#collectorEditModal"
                                      onClick={() => {
                                        getSpecificCollector(val.id);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <PenFill />
                                          <p className="actionP">এডিট</p>
                                        </div>
                                      </div>
                                    </li>
                                  ) : (
                                    ""
                                  )}
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
                  <div className="paginationSection">
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
