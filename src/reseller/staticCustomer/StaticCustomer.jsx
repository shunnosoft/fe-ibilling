import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import moment from "moment";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  PersonPlusFill,
  Wallet,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  CashStack,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
// import CustomerPost from "./customerCRUD/CustomerPost";
// import CustomerDetails from "./customerCRUD/CustomerDetails";
// import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
// import CustomerEdit from "./customerCRUD/CustomerEdit";
import Loader from "../../components/common/Loader";

import {
  deleteACustomer,
  getCustomer,
  getMikrotik,
  getStaticCustomerApi,
  getSubAreas,
} from "../../features/apiCallReseller";
// import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import CustomerBillCollect from "./staticCustomerCrud/CustomerBillCollect";
import AddStaticCustomer from "./staticCustomerCrud/StaticCustomerPost";
import CustomerDetails from "../../pages/staticCustomer/customerCRUD/CustomerDetails";
export default function RstaticCustomer() {
  const cus = useSelector(
    (state) => state?.persistedReducer?.customer?.staticCustomer
  );

  const role = useSelector((state) => state?.persistedReducer?.auth?.role);
  const dispatch = useDispatch();
  const resellerId = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.id
  );

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const permission = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.permission
  );
  const [Customers, setCustomers] = useState(cus);
  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // const currentCustomers = Customers
  const subAreas = useSelector((state) => state?.persistedReducer?.area?.area);
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );

  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  const [subAreaId, setSubAreaId] = useState("");

  //   filter
  const handleSubAreaChange = (id) => {
    setSubAreaId(id);
  };

  const handlePaymentChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  useEffect(() => {
    let tempCustomers = cus;

    if (subAreaId) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.subArea === subAreaId
      );
    }

    if (status) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.status === status
      );
    }

    if (paymentStatus) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.paymentStatus === paymentStatus
      );
    }

    setCustomers(tempCustomers);
  }, [cus, paymentStatus, status, subAreaId]);

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };
  // get specific customer Report
  const [customerReportData, setId] = useState([]);

  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  // DELETE handler
  const deleteCustomer = async (ID) => {
    setIsDeleting(true);
    const IDs = {
      ispID: resellerId,
      customerID: ID,
    };
    deleteACustomer(dispatch, IDs);
    setIsDeleting(false);
  };
  useEffect(() => {
    if (role === "collector") {
      getMikrotik(dispatch, userData.collector.reseller);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, resellerId);
      getStaticCustomerApi(dispatch, userData?.reseller.id, setIsloading);
      getSubAreas(dispatch, resellerId);
    } else if (role === "collector") {
      getCustomer(dispatch, userData?.collector?.reseller, setIsloading);
    }
  }, [dispatch, resellerId, userData, role]);

  const [subAreaIds, setSubArea] = useState([]);

  useEffect(() => {
    if (subAreaIds.length) {
      setCustomers(cus.filter((c) => subAreaIds.includes(c.subArea)));
    } else {
      setCustomers(cus);
    }
  }, [cus, subAreaIds]);

  const columns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "আইডি",
        accessor: "customerId",
      },
      {
        width: "10%",
        Header: "নাম",
        accessor: "name",
      },
      {
        width: "10%",
        Header: "PPPoE",
        accessor: "pppoe.name",
      },
      {
        width: "12%",
        Header: "মোবাইল",
        accessor: "mobile",
      },

      {
        width: "9%",
        Header: "স্ট্যাটাস",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: "পেমেন্ট",
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "10%",
        Header: "মাসিক ফি",
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: "ব্যালেন্স",
        accessor: "balance",
      },
      {
        width: "12%",
        Header: "বিল সাইকেল",
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMMM DD YYYY hh:mm A");
        },
      },

      {
        width: "7%",
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="customerDrop">
              <li
                data-bs-toggle="modal"
                data-bs-target="#showCustomerDetails"
                onClick={() => {
                  getSpecificCustomer(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <PersonFill />
                    <p className="actionP">প্রোফাইল</p>
                  </div>
                </div>
              </li>
              {(role === "reseller" || role === "collector") && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#collectCustomerBillModal"
                  onClick={() => {
                    getSpecificCustomer(original.id);
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

              {/* {(permission?.customerEdit || role === "ispOwner") && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerEditModal"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">এডিট</p>
                    </div>
                  </div>
                </li>
              )} */}
              {/* {role !== "collector" && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#showCustomerReport"
                  onClick={() => {
                    getSpecificCustomerReport(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">রিপোর্ট</p>
                    </div>
                  </div>
                </li>
              )} */}

              {/* {permission?.customerDelete && role === "ispOwner" && (
                <li
                  onClick={() => {
                    let con = window.confirm(
                      `${original.name} গ্রাহক ডিলিট করতে চান?`
                    );
                    con && deleteCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">ডিলিট</p>
                    </div>
                  </div>
                </li>
              )} */}
            </ul>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <h2>গ্রাহক </h2>
                  {/* <div
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#addStaticCustomerModal"
                  >
                    <PersonPlusFill />
                  </div> */}
                </div>
              </FourGround>

              {/* Model start */}
              <CustomerBillCollect single={singleCustomer} />
              <AddStaticCustomer />
              <CustomerDetails single={singleCustomer} />
              {/* <CustomerPost />
              <CustomerEdit single={singleCustomer} />
              <CustomerReport single={customerReportData} /> */}

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      <div className="selectFiltering allFilter">
                        {/* //Todo */}
                        <select
                          className="form-select"
                          onChange={(e) => handleSubAreaChange(e.target.value)}
                        >
                          <option value="" defaultValue>
                            এরিয়া
                          </option>
                          {subAreas?.map((sub, key) => (
                            <option key={key} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="form-select"
                          onChange={handleStatusChange}
                        >
                          <option value="" defaultValue>
                            স্ট্যাটাস
                          </option>
                          <option value="active">এক্টিভ</option>
                          <option value="inactive">ইন-এক্টিভ</option>
                          <option value="expired">এক্সপায়ার্ড</option>
                        </select>
                        <select
                          className="form-select"
                          onChange={handlePaymentChange}
                        >
                          <option value="" defaultValue>
                            পেমেন্ট
                          </option>
                          <option value="paid">পেইড</option>
                          <option value="unpaid">আন-পেইড</option>
                        </select>
                      </div>

                      <div className="addNewCollector"></div>
                    </div>

                    {isDeleting ? (
                      <div className="deletingAction">
                        <Loader /> <b>Deleting...</b>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={Customers}
                    ></Table>
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
