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
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const allBills = useSelector((state) => state.payment.allBills);
  const [dateStart, setMinDate] = useState(firstDay);
  const [dateEnd, setMaxDate] = useState(today);
  const [mainData, setMainData] = useState(allBills);

  const ispOwnerId = useSelector((state) => state.auth?.ispOwnerId);

  const dispatch = useDispatch();

  const filterdByData = (start, end) => {
    const filteredByDate = mainData.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(start) &&
        Date.parse(item.createdAt) <= Date.parse(end)
    );
    setMainData(filteredByDate);
  };

  useEffect(() => {
    getAllBills(dispatch, ispOwnerId);
    setMainData(
      allBills.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(dateStart) &&
          Date.parse(item.createdAt) <= Date.parse(dateEnd)
      )
    );
  }, [ispOwnerId, dispatch, dateStart, dateEnd,allBills]);

  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{
          backgroundColor: "#677078",
          fontWeight: "500",
          color: "white",
        }}
      />

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
                      <select className="form-select" onChange={() => {}}>
                        <option value="" defaultValue>
                          ফিল্টার করুন{" "}
                        </option>
                        <option value="status.active">একটিভ</option>
                        <option value="status.inactive">ইনএকটিভ</option>
                        <option value="paymentStatus.unpaid">বকেয়া</option>
                        <option value="paymentStatus.paid">পরিশোধ</option>
                      </select>
                      <select className="form-select" onChange={() => {}}>
                        <option value="" defaultValue>
                          ফিল্টার করুন{" "}
                        </option>
                        <option value="status.active">একটিভ</option>
                        <option value="status.inactive">ইনএকটিভ</option>
                        <option value="paymentStatus.unpaid">বকেয়া</option>
                        <option value="paymentStatus.paid">পরিশোধ</option>
                      </select>
                      <select className="form-select" onChange={() => {}}>
                        <option value="" defaultValue>
                          ফিল্টার করুন{" "}
                        </option>
                        <option value="status.active">একটিভ</option>
                        <option value="status.inactive">ইনএকটিভ</option>
                        <option value="paymentStatus.unpaid">বকেয়া</option>
                        <option value="paymentStatus.paid">পরিশোধ</option>
                      </select>

                      <select className="form-select" onChange={() => {}}>
                        <option value="" defaultValue>
                          ফিল্টার করুন{" "}
                        </option>
                        <option value="status.active">একটিভ</option>
                        <option value="status.inactive">ইনএকটিভ</option>
                        <option value="paymentStatus.unpaid">বকেয়া</option>
                        <option value="paymentStatus.paid">পরিশোধ</option>
                      </select>
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
