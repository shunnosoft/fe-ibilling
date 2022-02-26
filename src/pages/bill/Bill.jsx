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
import BillPost from "./billCRUD/BillPost";
import BillDetails from "./billCRUD/BillDetails";
import BillCollect from "./billCRUD/BillCollect";
// import BillDiposit from "../Customer/customerCRUD/BillDiposit";
import BillEdit from "./billCRUD/BillEdit";
import Loader from "../../components/common/Loader";
import TdLoader from "../../components/common/TdLoader";
import { deleteACustomer, getCustomer } from "../../features/apiCalls";

export default function Bill() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.currentUser);
  const ispOwner = useSelector((state) => state.auth.ispOwnerId);
  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");

  const Customers = useSelector((state) => state.customer.customer);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  const getSpecificCustomer = (id) => {
    if (Customers.length !== undefined) {
      const temp = Customers.find((val) => {
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
    getCustomer(dispatch, ispOwner);
  }, [ispOwner, dispatch, auth]);

  // get customer
  useEffect(() => {
    const getData = () => {
      setIsloading(true);
      getCustomer(dispatch, ispOwner, setIsloading);
    };
    getData();
  }, [dispatch, ispOwner]);

  // const handlePageClick = (data) => {
  //   setIsloading(true);
  //   let limit = 10;
  //   const data2 = {
  //     ispOwnerId: ispOwner,
  //     limit: limit,
  //     currentPage: data.selected + 1,
  //   };
  //   getCustomer(dispatch, data2, setIsloading);
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
                <h2 className="collectorTitle">বিল </h2>
              </FourGround>

              {/* Model start */}
              <BillPost />
              <BillEdit single={singleCustomer} />
              <BillCollect singleCustomer={singleCustomer} />
              {/* <BillDiposit /> */}
              <BillDetails single={singleCustomer} />
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

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট গ্রাহক :{" "}
                          <span>{Customers?.length || "NULL"}</span>
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
                          <th scope="col">আইডি</th>
                          <th scope="col">নাম</th>
                          <th scope="col">মোবাইল</th>
                          <th scope="col">এড্রেস</th>
                          <th scope="col">স্ট্যাটাস</th>
                          <th scope="col">PPPoE</th>
                          <th scope="col">ব্যালান্স</th>
                          <th scope="col">মাসিক ফি</th>
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
                          Customers.filter((val) => {
                            return val.name
                              .toLowerCase()
                              .includes(cusSearch.toLowerCase());
                          }).map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td>{val.customerId}</td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{val.address}</td>
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
                                    data-bs-target="#collectBillModal"
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
