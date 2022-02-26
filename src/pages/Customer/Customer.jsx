import React, { useEffect, useState } from "react";
import "../collector/collector.css";
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
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import CustomerEdit from "./customerCRUD/CustomerEdit";
import Loader from "../../components/common/Loader";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import { deleteACustomer, getCustomer } from "../../features/apiCalls";
import arraySort from "array-sort";

export default function Customer() {
  const cus = useSelector((state) => state.customer.customer);
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const ispOwner = useSelector((state) => state.auth.ispOwnerId);
  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");

  const [Customers, setCustomers] = useState(cus);
  const [filterdCus, setFilter] = useState(Customers);
  const [isFilterRunning, setRunning] = useState(false);
  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;
  const currentCustomers = Customers.slice(firstIndex, lastIndex);

  // paginate call Back function -> response from paginate component
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const keys = [
      "monthlyFee",
      "customerId",
      "name",
      "mobile",
      "address",
      "paymentStatus",
      "status",
      "balance",
    ];
    setCustomers(
      (isFilterRunning ? filterdCus : cus).filter((item) =>
        keys.some((key) =>
          typeof item[key] === "string"
            ? item[key].toLowerCase().includes(cusSearch)
            : item[key].toString().includes(cusSearch)
        )
      )
    );
  }, [cus, cusSearch, filterdCus, isFilterRunning]);

  //   filter
  const handleActiveFilter = (e) => {
  
  setRunning(true);
    let fvalue = e.target.value;
    const field = fvalue.split(".")[0];
    const subfield = fvalue.split(".")[1];

    const filterdData = cus.filter((item) => item[field] === subfield);

    setFilter(filterdData);
  };
  // get specific customer
  const getSpecificCustomer = (id) => {
    if (cus.length !== undefined) {
      const temp = cus.find((val) => {
        return val.id === id;
      });
      setSingleCustomer(temp);
    }
  };

  // DELETE handler
  const deleteCustomer = async (ID) => {
    setIsDeleting(true);
    const IDs = {
      ispID: ispOwner,
      customerID: ID,
    };
    deleteACustomer(dispatch, IDs);
    setIsDeleting(false);
  };

  useEffect(() => {
    getCustomer(dispatch, ispOwner, setIsloading);
  }, [dispatch, ispOwner]);

  const [isSorted, setSorted] = useState(false);

  const toggleSort = (item) => {
    setCustomers(arraySort(Customers, item, { reverse: isSorted }));
    setSorted(!isSorted);
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
                <h2 className="collectorTitle">গ্রাহক </h2>
              </FourGround>

              {/* Model start */}
              <CustomerPost />
              <CustomerEdit single={singleCustomer} />
              <CustomerBillCollect single={singleCustomer} />
              <CustomerDetails single={singleCustomer} />
              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      <div className="selectFiltering">
                        <select
                          className="form-select"
                          onChange={handleActiveFilter}
                        >
                          <option value="" defaultValue>
                            PPPoE স্ট্যাটাস
                          </option>
                          <option value="status.active">PPPoE একটিভ</option>
                          <option value="status.inactive">PPPoE ইনএকটিভ</option>
                        </select>
                        <select
                          className="form-select"
                          onChange={handleActiveFilter}
                        >
                          <option value="" defaultValue>
                            পেমেন্ট
                          </option>
                          <option value="paymentStatus.unpaid">বকেয়া</option>
                          <option value="paymentStatus.paid">পরিশোধ</option>
                        </select>
                      </div>
                      <div className="addNewCollector">
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            data-bs-toggle="modal"
                            data-bs-target="#customerModal"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট গ্রাহক : <span>{cus?.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          {/* <Search className="serchingIcon" /> */}
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ"
                            onChange={(e) => setCusSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    {isDeleting ? (
                      <div className="deletingAction">
                        <Loader /> <b>Deleting...</b>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr className="spetialSortingRow">
                          <th
                            onClick={() => toggleSort("customerId")}
                            scope="col"
                          >
                            আইডি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("name")} scope="col">
                            নাম
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("mobile")} scope="col">
                            মোবাইল
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("paymentStatus")}
                            scope="col"
                          >
                            পেমেন্ট স্ট্যাটাস
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("status")} scope="col">
                            স্ট্যাটাস
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("pppoe.profile")}
                            scope="col"
                          >
                            প্যাকেজ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("balance")} scope="col">
                            ব্যালান্স
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("monthlyFee")}
                            scope="col"
                          >
                            মাসিক ফি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("billingCycle")}
                            scope="col"
                          >
                            বিল ডেট
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th scope="col" className="centeringTD">
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <TdLoader colspan={9} />
                          </tr>
                        ) : Customers?.length === undefined ? (
                          ""
                        ) : (
                          currentCustomers.map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td>{val.customerId}</td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{val.paymentStatus}</td>
                              <td>{val.status}</td>
                              <td>{val.pppoe.profile}</td>
                              <td>{val.balance}</td>
                              <td>{val.monthlyFee}</td>
                              <td>
                                {moment(val.billingCycle).format("DD-MM-YYYY")}
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
                                      getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">প্রোফাইল</p>
                                      </div>
                                    </div>
                                  </li>
                                  {role === "ispOwner" ? (
                                    ""
                                  ) : (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#collectCustomerBillModal"
                                      onClick={() => {
                                        getSpecificCustomer(val.id);
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
                                      getSpecificCustomer(val.id);
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
                                    data-bs-toggle="modal"
                                    data-bs-target="#showCustomerDetails"
                                    onClick={() => {
                                      getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <CashStack />
                                        <p className="actionP">রিপোর্ট</p>
                                      </div>
                                    </div>
                                  </li>

                                  <li
                                    onClick={() => {
                                      let con = window.confirm(
                                        `${val.name} গ্রাহক ডিলিট করতে চান?`
                                      );
                                      con && deleteCustomer(val.id);
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
                        onChange={(e) => setCustomerPerPage(e.target.value)}
                      >
                        <option value="50">৫০ জন</option>
                        <option value="100">১০০ জন</option>
                        <option value="200">২০০ জন</option>
                        <option value="500">৫০০ জন</option>
                        <option value="1000">১০০০ জন</option>
                      </select>
                      <Pagination
                        customerPerPage={customerPerPage}
                        totalCustomers={Customers.length}
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
