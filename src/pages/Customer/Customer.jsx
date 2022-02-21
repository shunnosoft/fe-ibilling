import React, { useEffect, useState } from "react";
import "../collector/collector.css";
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
  Truck,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
// import ReactPaginate from "react-paginate";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
// import {
//   fetchCustomer,
//   getCustomer,
//   setSingleCustomer,
//   deleteSingleCustomer,
// } from "../../features/customerSlice";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import BillDiposit from "./customerCRUD/BillDiposit";
import CustomerEdit from "./customerCRUD/CustomerEdit";
import Loader from "../../components/common/Loader";
import TdLoader from "../../components/common/TdLoader";
import { deleteACustomer, getCustomer } from "../../features/apiCalls";
import arraySort from "array-sort";

export default function Customer() {
  const cus = useSelector((state) => state.customer.customer);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.currentUser);
  const ispOwner = useSelector((state) => state.auth.ispOwnerId);
  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");

  let serial = 0;

  const [Customers, setCustomers] = useState(cus);
  const [filterdCus, setFilter] = useState(Customers);
  const [isFilterRunning, setRunning] = useState(false);
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
  const [singleCustomer, setSingleCustomer] = useState("");
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

  const billUpdateHandler = (data) => {
    // console.log("Bill Data:", data);
  };
  const [isSorted, setSorted] = useState(false);
  const toggleSort = (item) => {
    setCustomers(arraySort(Customers, item, { reverse: isSorted }));
    setSorted(!isSorted);
  };

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
                <h2 className="collectorTitle">গ্রাহক </h2>
              </FourGround>

              {/* Model start */}
              <CustomerPost />
              <CustomerEdit single={singleCustomer} />
              <BillDiposit single={singleCustomer} />
              <CustomerBillCollect single={singleCustomer} />
              <CustomerDetails single={singleCustomer} />
              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>নতুন গ্রাহক অ্যাড করুন </p>

                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
                        />
                      </div>
                    </div>

                    {/* filter selector */}
                    <div className="selectFiltering">
                      <select
                        className="form-select"
                        onChange={handleActiveFilter}
                      >
                        <option value="" selected>
                          ফিল্টার করুন{" "}
                        </option>
                        <option value="status.active">একটিভ</option>
                        <option value="status.inactive">ইনএকটিভ</option>
                        <option value="paymentStatus.unpaid">বকেয়া</option>
                        <option value="paymentStatus.paid">পরিশোধ</option>
                      </select>
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
                        <tr>
                          <th
                            onClick={() => toggleSort("customerId")}
                            scope="col"
                          >
                            আইডি
                          </th>
                          <th onClick={() => toggleSort("name")} scope="col">
                            নাম
                          </th>
                          <th onClick={() => toggleSort("mobile")} scope="col">
                            মোবাইল
                          </th>
                          <th
                            onClick={() => toggleSort("paymentStatus")}
                            scope="col"
                          >
                            পেমেন্ট স্ট্যাটাস
                          </th>
                          <th onClick={() => toggleSort("status")} scope="col">
                            স্ট্যাটাস
                          </th>
                          <th
                            onClick={() => toggleSort("pppoe.profile")}
                            scope="col"
                          >
                            PPPoE
                          </th>
                          <th onClick={() => toggleSort("balance")} scope="col">
                            ব্যালান্স
                          </th>
                          <th
                            onClick={() => toggleSort("monthlyFee")}
                            scope="col"
                          >
                            মাসিক ফি
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
                          Customers.map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td>{val.customerId}</td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{val.paymentStatus}</td>
                              <td>{val.status}</td>
                              <td>{val.pppoe.profile}</td>
                              <td>{val.balance}</td>
                              <td>{val.monthlyFee}</td>
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
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#billDipositeModal"
                                    onClick={() => {
                                      getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <Truck />
                                        <p className="actionP">ডিপোজিট</p>
                                      </div>
                                    </div>
                                  </li>
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
                                    onClick={() => {
                                      deleteCustomer(val.id);
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

                    {/* previous */}

                    {/* <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      pageCount={8}
                      marginPagesDisplayed={2}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination"}
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      breakClassName={"page-item"}
                      breakLinkClassName={"page-link"}
                      activeClassName={"active"}
                    /> */}
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
