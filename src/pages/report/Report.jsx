import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import {
  ArchiveFill,
  ArrowDownUp,
  PenFill,
  PersonFill,
  PersonPlusFill,
  ThreeDots,
  Wallet,
} from "react-bootstrap-icons";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
import { useDispatch } from "react-redux";
import { getAllBills } from "../../features/apiCalls";
import { useSelector } from "react-redux";

export default function Report() {
  const allArea = useSelector((state) => state.area.area);
  const allCollector = useSelector((state) => state.collector.collector);
  console.log(allArea);
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  console.log(today, firstDay);

  const allBills = useSelector((state) => state.payment.allBills);

  const [singleArea, setArea] = useState({});

  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  const [mainData, setMainData] = useState([]);
  const [collectorID, setCollectorID] = "";
  const ispOwnerId = useSelector((state) => state.auth?.ispOwnerId);

  const dispatch = useDispatch();

  // const filterdByDate = (start, end) => {
  //   const filteredByDate = mainData.filter(
  //     (item) =>
  //       Date.parse(item.createdAt) >= Date.parse(start) &&
  //       Date.parse(item.createdAt) <= Date.parse(end)
  //   );
  //   setMainData(filteredByDate);
  // };

  useEffect(() => {
    getAllBills(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

  useEffect(() => {
    setMainData(
      allBills.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(dateStart) &&
          Date.parse(item.createdAt) <= Date.parse(dateEnd)
      )
    );
  }, [dateStart, dateEnd, allBills]);

  

  console.log("main", mainData);
  

  const handleFilterForArea = (selectVal) => {
    setArea(allArea.find((item) => item.name === selectVal));
  };
  const handleFilterForCollector = (selectVal) => {
    if(selectVal===null){
      setMainData(allBills)
    }
    setMainData(allBills.filter((item) => item.collectorId === selectVal));

  };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">বিল রিপোর্ট </h2>
              </FourGround>

              {/* Model start */}

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <select
                        className="form-select"
                        onChange={(e) => handleFilterForArea(e.target.value)}
                      >
                        <option value="" defaultValue>
                          সকল এরিয়া{" "}
                        </option>
                        {allArea.map((area) => (
                          <option value={area.name}>{area.name}</option>
                        ))}
                      </select>
                      <select className="form-select" onChange={() => {}}>
                        <option value="" defaultValue>
                          সকল সাব এরিয়া{" "}
                        </option>
                        {singleArea?.subAreas?.map((sub) => (
                          <option value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                      <select
                        className="form-select"
                        onChange={(e) =>
                          handleFilterForCollector(e.target.value)
                        }
                      >
                        <option value="" defaultValue>
                          সকল কালেক্টর{" "}
                        </option>
                        {allCollector?.map((c) => (
                          <option value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      <div className="dateDiv">
                        <label for="start">শুরুর তারিখ</label>
                        <input
                          type="date"
                          id="start"
                          name="trip-start"
                          value={dateStart}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                          }}
                          // value="2018-07-22"

                          // min="2018-01-01"
                          // max="2018-12-31"
                        />
                      </div>
                      <div className="dateDiv">
                        <label for="end">শেষের তারিখ</label>
                        <input
                          type="date"
                          id="end"
                          name="trip-start"
                          value={dateEnd}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                          }}

                          // value="2018-07-22"

                          // min="2018-01-01"
                          // max="2018-12-31"
                        />
                      </div>
                    </div>
                    <div className="submitdiv d-grid gap-2">
                      <button
                        className="btn fs-5 fw-bold btn-success w-100"
                        type="button"
                      >
                        সাবমিট
                      </button>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          বিলঃ<span className="allCollectorSpan">{0} টাকা</span>
                          আদায়ঃ
                          <span className="allCollectorSpan">{10} টাকা</span>
                          বকেয়াঃ
                          <span className="allCollectorSpan">{10} টাকা</span>
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
                  </div>
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr className="spetialSortingRow">
                          <th
                            // onClick={() => toggleSort("customerId")}
                            scope="col"
                          >
                            আইডি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            //   onClick={() => toggleSort("name")}
                            scope="col"
                          >
                            গ্রাহক
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            //    onClick={() => toggleSort("mobile")}
                            scope="col"
                          >
                            bill
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th
                            // onClick={() => toggleSort("pppoe.profile")}
                            scope="col"
                          >
                            তারিখ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {false ? (
                          <tr>
                            <TdLoader colspan={9} />
                          </tr>
                        ) : mainData?.length === undefined ? (
                          ""
                        ) : (
                          mainData.map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td>{val.customer.customerId}</td>
                              <td>{val.customer.name}</td>
                              <td>{val.amount}</td>
                              <td>
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
                                    data-bs-target="#showCustomerDetails"
                                    onClick={() => {
                                      //   getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">প্রোফাইল</p>
                                      </div>
                                    </div>
                                  </li>
                                  {7 === "ispOwner" ? (
                                    ""
                                  ) : (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#collectCustomerBillModal"
                                      onClick={() => {
                                        // getSpecificCustomer(val.id);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <Wallet />
                                          <p className="actionP">বিল গ্রহণ</p>
                                        </div>
                                      </div>
                                    </li>
                                  )}

                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#customerEditModal"
                                    onClick={() => {
                                      //   getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PenFill />
                                        <p className="actionP">এডিট</p>
                                      </div>
                                    </div>
                                  </li>

                                  <li
                                    onClick={() => {
                                      //   deleteCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item actionManager">
                                      <div className="customerAction">
                                        <ArchiveFill />
                                        <p className="actionP">ডিলিট</p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>

                                {/* end */}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="paginationSection">
                      <select
                        className="form-select paginationFormSelect"
                        aria-label="Default select example"
                        // onChange={(e) => setCustomerPerPage(e.target.value)}
                      >
                        <option value="5">৫ জন</option>
                        <option value="10">১০ জন</option>
                        <option value="100">১০০ জন</option>
                        <option value="200">২০০ জন</option>
                        <option value="500">৫০০ জন</option>
                        <option value="1000">১০০০ জন</option>
                      </select>
                      <Pagination
                      // customerPerPage={customerPerPage}
                      // totalCustomers={Customers.length}
                      // paginate={paginate}
                      />
                    </div>
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
