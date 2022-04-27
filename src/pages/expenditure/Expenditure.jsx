import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
  GearFill,
  PlusCircleDotted,
  PlusCircleFill,
  GearWide,
  Tools,
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

import {
  getAllExpenditure,
  getCollector,
  getExpenditureSectors,
} from "../../features/apiCalls";
import CreateExpenditure from "./CreateExpenditure";
import CreatePourpose from "./Createpourpose";
import moment from "moment";
import EditExpenditure from "./ExpenditureEdit";
import EditPourpose from "./EditPourpose";

export default function Expenditure() {
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const [collSearch, setCollSearch] = useState("");
  const expenditures = useSelector(
    (state) => state.expenditure.allExpenditures
  );
  const expenditurePurpose = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  let serial = 0;
  let seriall = 0;
  // pagination
  const [initialExp, setInitialExp] = useState(expenditures);
  const [currentPage, setCurrentPage] = useState(1);
  const [expenditurePage, setExpenditurePage] = useState(5);
  const [singleExp, setSingleExp] = useState({});
  const [singlePurpose, setSinglePurpose] = useState({});
  const lastIndex = currentPage * expenditurePage;
  const [purpose, setPurpose] = useState(expenditurePurpose);
  const firstIndex = lastIndex - expenditurePage;
  const currentExpenditure = initialExp.slice(firstIndex, lastIndex);
  const [allExpenditures, setallExpenditure] = useState(currentExpenditure);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );
  const role = useSelector((state) => state.persistedReducer.auth.role);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useLayoutEffect(() => {
    setPurpose(expenditurePurpose);
    const temp = [];
    expenditures?.map((e) => {
      expenditurePurpose?.map((ep) => {
        if (ep.id === e.expenditurePurpose) {
          // console.log({ ...e, namee: ep.name });
          temp.push({
            ...e,
            expenditureName: ep.name,
          });
        }
        return temp;
      });
      return temp;
    });
    // console.log(temp);
    setInitialExp(temp);
  }, [expenditures, expenditurePurpose]);
  useEffect(() => {
    getAllExpenditure(dispatch, ispOwnerId);
    getExpenditureSectors(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

  useEffect(() => {
    const keys = ["amount", "expenditureName", "createdAt"];
    if (collSearch !== "") {
      setallExpenditure(
        initialExp?.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toString().toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setallExpenditure(initialExp);
    }
  }, [collSearch, initialExp]);

  const searchPurpose = (e) => {
    const keys = ["name"];
    if (e !== "") {
      setPurpose(
        expenditurePurpose?.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toString().toLowerCase().includes(e)
              : item[key].toString().includes(e)
          )
        )
      );
    } else {
      setPurpose(expenditurePurpose);
    }
  };

  const searchHandler = (e) => {
    setCollSearch(e.toString().toLowerCase());
  };

  const getTotalExpenditure = () => {
    const total = allExpenditures.reduce((pre, curr) => pre + curr.amount, 0);
    return total;
  };

  const paginationHandler = (e) => {
    setExpenditurePage(e.target.value);
    setallExpenditure(currentExpenditure);
  };
  return (
    <>
      <CreateExpenditure></CreateExpenditure>
      <CreatePourpose></CreatePourpose>
      <EditExpenditure singleExp={singleExp}></EditExpenditure>
      <EditPourpose singlePurpose={singlePurpose}></EditPourpose>
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
                        <div
                          style={{ display: "flex" }}
                          className="addAndSettingIcon"
                        >
                          <div title="খরচ অ্যাড ">
                            <PlusCircleDotted
                              className="addcutmButton"
                              data-bs-toggle="modal"
                              data-bs-target="#createExpenditure"
                            />
                          </div>

                          <div title="খরচের খাত অ্যাড">
                            <PlusCircleFill
                              className="addcutmButton"
                              data-bs-toggle="modal"
                              data-bs-target="#createPourpose"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allExpenditures">
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
                  <div
                    style={{ height: "500px", overflow: "scroll" }}
                    className="table-responsive-lg"
                  >
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
                          allExpenditures?.map((val, key) => (
                            <tr key={key}>
                              <td>{++serial}</td>
                              <td>{val.expenditureName}</td>
                              <td>{val.amount}</td>
                              <td>
                                {" "}
                                {moment(val.createdAt).format("DD-MM-YYYY")}
                              </td>
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
                                    data-bs-target="#editExpenditure"
                                    onClick={() => {
                                      setSingleExp(val);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <Tools />
                                        <p className="actionP">এডিট</p>
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
                  <div className="row searchCollector">
                    <div className="col-sm-8">
                      <h4 className="allExpenditures">
                        মোট:
                        <span>{purpose.length || ""}</span>
                      </h4>
                    </div>

                    <div className="col-sm-4">
                      <div className=" collectorSearch">
                        <input
                          type="text"
                          className="search"
                          placeholder="সার্চ এর জন্য নাম লিখুন"
                          onChange={(e) => searchPurpose(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ height: "500px", overflow: "scroll" }}
                    className="table-responsive-lg"
                  >
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th>সিরিয়াল</th>
                          <th>খরচের খাত</th>
                          <th>তারিখ</th>
                          <th className="centeringTD">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purpose?.length === undefined ? (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        ) : (
                          purpose?.map((val, key) => (
                            <tr key={key}>
                              <td>{++seriall}</td>
                              <td>{val.name}</td>
                              <td>
                                {" "}
                                {moment(val.createdAt).format("DD-MM-YYYY")}
                              </td>
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
                                    data-bs-target="#editPurpose"
                                    onClick={() => {
                                      setSinglePurpose(val);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <Tools />
                                        <p className="actionP">এডিট</p>
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
