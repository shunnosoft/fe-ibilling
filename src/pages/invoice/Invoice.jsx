import React, { useEffect, useState } from "react";
import "../Customer/customer.css";
import "./invoice.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  PersonPlusFill,
  Wallet,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  ArrowDownUp,
  CashStack,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";

import Loader from "../../components/common/Loader";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";

import { getInvoices, initiatePayment } from "../../features/apiCalls";
import { showModal } from "../../features/uiSlice";
import { badge } from "../../components/common/Utils";

function Invoice() {
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const invoices = useSelector(
    (state) => state.persistedReducer.invoice.invoices
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getInvoices(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  // const payNowHandler = (invoice) => {
  //   initiatePayment(invoice);
  // };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">ইনভয়েস </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট : <span>{invoices?.length || "0"}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr className="spetialSortingRow">
                          <th scope="col">
                            টাইপ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th scope="col">
                            পরিমাণ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th scope="col">
                            স্ট্যাটাস
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th scope="col">
                            ইনভয়েস তৈরির তারিখ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th scope="col">
                            পেমেন্টের শেষ তারিখ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th className="text-center" scope="col">
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <TdLoader colspan={10} />
                          </tr>
                        ) : invoices?.length === undefined ? (
                          ""
                        ) : (
                          invoices.map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td>
                                {val.type === "registration"
                                  ? "রেজিস্ট্রেশন"
                                  : val.type === "migration"
                                  ? "প্যাকেজ মাইগ্রেশন"
                                  : val.type === "smsPurchase"
                                  ? "এসএমএস"
                                  : "মাসিক ফি"}
                              </td>
                              <td>{val.amount} Tk</td>
                              <td>
                                {val.status === "unpaid" ? (
                                  <> {badge(val.status)}</>
                                ) : (
                                  <>{badge(val.status)}</>
                                )}
                              </td>
                              <td>
                                {moment(val.createdAt).format(
                                  "DD-MM-YYYY hh:mm:ss A"
                                )}
                              </td>
                              <td>
                                {moment(val.dueDate).format(
                                  "DD-MM-YYYY hh:mm:ss A"
                                )}
                              </td>
                              <td className="centeringTD">
                                {val.status === "unpaid" && (
                                  <ThreeDots
                                    className="dropdown-toggle ActionDots"
                                    id="customerDrop"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  />
                                )}
                                {/* modal */}
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="customerDrop"
                                >
                                  <li
                                    onClick={() => {
                                      dispatch(showModal(val));
                                      // payNowHandler(val);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <CashStack />
                                        <p className="actionP">Pay Now</p>
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
                        onChange={(e) => setCustomerPerPage(e.target.value)}
                      >
                        <option value="50">৫</option>
                        <option value="100">১০</option>
                        <option value="200">২০</option>
                        <option value="500">৫০</option>
                        <option value="1000">১০০</option>
                      </select>
                      <Pagination
                        customerPerPage={customerPerPage}
                        totalCustomers={invoices.length}
                        paginate={paginate}
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

export default Invoice;
