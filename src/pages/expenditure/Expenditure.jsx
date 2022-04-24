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
import "../collector/collector.css";
import "./expenditure.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
// import Loader from "../../components/common/Loader";
import Pagination from "../../components/Pagination";

import TdLoader from "../../components/common/TdLoader";

import { getAllExpenditure, getCollector } from "../../features/apiCalls";
import CreateExpenditure from "./CreateExpenditure";

export default function Expenditure() {
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const [collSearch, setCollSearch] = useState("");
  const expenditures = useSelector(
    (state) => state.expenditure.allExpenditures
  );
  console.log(expenditures);
  let serial = 0;
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = expenditures.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );
  const role = useSelector((state) => state.persistedReducer.auth.role);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getAllExpenditure(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

  useEffect(() => {
    const keys = ["amount", "expenditurePurpose", "email"];
    if (collSearch !== "") {
      setCollector(
        expenditures.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setCollector(expenditures);
    }
  }, [collSearch, expenditures]);

  const searchHandler = (e) => {
    setCollSearch(e.toLowerCase());
  };

  const getTotalExpenditure = () => {};
  return (
    <>
      <CreateExpenditure></CreateExpenditure>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <h2 className="collectorTitle">খরচ</h2>

              {/* modals */}

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
                              data-bs-target="#createExpenditure"
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
                          মোট খরচ:
                          <span>{getTotalExpenditure() || ""}</span>
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
                          <th>খরচের খাত</th>
                          <th>পরিমান</th>
                          <th>তারিখ</th>
                          <th className="centeringTD">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenditures?.length === undefined ? (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        ) : (
                          allCollector?.map((val, key) => (
                            <tr key={key}>
                              <td>{++serial}</td>
                              <td>{val.expenditurePurpose}</td>
                              <td>{val.amount}</td>
                              <td>{val.createdAt}</td>
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
                                      //   getSpecificCollector(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">বিস্তারিত</p>
                                      </div>
                                    </div>
                                  </li>
                                  {/* {permission?.collectorEdit ||
                                  role === "ispOwner" ? (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#collectorEditModal"
                                      onClick={() => {
                                        // getSpecificCollector(val.id);
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
                                  )} */}
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
                      totalCustomers={expenditures.length}
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
