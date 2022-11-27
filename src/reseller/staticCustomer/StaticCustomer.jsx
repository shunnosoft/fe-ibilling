import React, { useEffect, useRef, useState } from "react";
import "../collector/collector.css";
import moment from "moment";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  Wallet,
  ThreeDots,
  PersonFill,
  PrinterFill,
  ArrowClockwise,
  ChatText,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

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
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import PrintCustomer from "./customerPDF";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
export default function RstaticCustomer() {
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component
  const cus = useSelector((state) => state?.customer?.staticCustomer);

  const role = useSelector((state) => state.persistedReducer.auth?.role);
  const dispatch = useDispatch();
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );
  const [Customers, setCustomers] = useState(cus);
  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // const currentCustomers = Customers
  const subAreas = useSelector((state) => state?.area?.area);
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
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

    // if (paymentStatus) {
    //   tempCustomers = tempCustomers.filter(
    //     (customer) => customer.paymentStatus === paymentStatus
    //   );
    // }

    if (paymentStatus) {
      tempCustomers = tempCustomers.filter((customer) => {
        if (customer.paymentStatus && paymentStatus === "free") {
          if (customer.monthlyFee === parseInt("0")) {
            return customer;
          }
        } else if (
          customer.paymentStatus === "paid" &&
          paymentStatus === "paid"
        ) {
          return customer;
        } else if (
          customer.paymentStatus === "unpaid" &&
          paymentStatus === "unpaid" &&
          customer.balance == 0
        ) {
          return customer;
        } else if (
          customer.paymentStatus === "unpaid" &&
          paymentStatus === "partial"
        ) {
          if (
            customer.monthlyFee > customer.balance &&
            customer.balance > parseInt("0")
          ) {
            return customer;
          }
        } else if (
          customer.paymentStatus === "paid" &&
          paymentStatus === "advance"
        ) {
          if (2 * customer.monthlyFee < customer.balance) {
            return customer;
          }
        } else if (
          customer.paymentStatus === "unpaid" &&
          paymentStatus === "overdue"
        ) {
          if (customer.balance < parseInt("0")) {
            return customer;
          }
        }
      });
    }

    setCustomers(tempCustomers);
  }, [cus, paymentStatus, status, subAreaId]);

  // find area name
  const areaName = subAreas.find((item) => item.id === subAreaId);

  // send filter data to print
  const filterData = {
    area: areaName?.name ? areaName.name : t("allArea"),
    status: status ? status : t("sokolCustomer"),
    payment: paymentStatus ? paymentStatus : t("sokolCustomer"),
  };

  //possible total monthly fee state
  const [totalMonthlyFee, setTotalMonthlyFee] = useState(0);
  const [totalFeeWithDue, setTotalFeeWithDue] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [hasDue, setDue] = useState(false);

  //get possible total monthly fee
  useEffect(() => {
    if (cus) {
      let totalMonthlyFee = 0;
      let totalDue = 0;
      let advanceFee = 0;
      for (let i = 0; i < cus.length; i++) {
        totalMonthlyFee += cus[i].monthlyFee;
        if (cus[i].balance < 0) {
          totalDue += Math.abs(cus[i].balance);
        }
        if (cus[i].balance > 0) {
          advanceFee += cus[i].balance;
        }
      }
      if (totalDue > 0) setDue(true);
      setTotalMonthlyFee(totalMonthlyFee - advanceFee);
      setTotalDue(totalDue);
      setTotalFeeWithDue(totalMonthlyFee + totalDue - advanceFee);
    }
  }, [cus]);

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

  // reload handler
  const reloadHandler = () => {
    if (role === "reseller") {
      getStaticCustomerApi(dispatch, userData?.reseller.id, setIsloading);
    } else if (role === "collector") {
      getCustomer(dispatch, userData?.collector?.reseller, setIsloading);
    }
  };

  useEffect(() => {
    if (role === "collector") {
      getMikrotik(dispatch, userData.collector.reseller);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, resellerId);
      if (cus.length === 0)
        getStaticCustomerApi(dispatch, userData?.reseller.id, setIsloading);
      getSubAreas(dispatch, resellerId);
    } else if (role === "collector") {
      getSubAreas(dispatch, userData?.collector?.reseller);
      if (cus.length === 0)
        getStaticCustomerApi(
          dispatch,
          userData?.collector?.reseller,
          setIsloading
        );
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
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: "IP",
        accessor: (field) =>
          field.userType === "firewall-queue"
            ? field.queue.address
            : field.queue.target,
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "9%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "10%",
        Header: t("month"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "12%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "7%",
        Header: () => <div className="text-center"> {t("action")} </div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
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
                      <p className="actionP"> {t("profile")} </p>
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
                        <p className="actionP"> {t("useMemoRecharge")} </p>
                      </div>
                    </div>
                  </li>
                )}

                {original.mobile && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#customerMessageModal"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ChatText />
                        <p className="actionP">{t("message")}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
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
                  <div className="d-flex">
                    <h2>{t("staticCustomer")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>

                  <div className="h6 d-flex justify-content-center align-items-start">
                    <p>
                      {t("totalPossibilityBill")} : {totalMonthlyFee}
                    </p>
                    {hasDue && (
                      <>
                        <p>
                          {t("totalPrevDue")} : {totalDue}
                        </p>
                        <p>
                          {t("totalPossibilityBillWithDue")} : {totalFeeWithDue}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="addAndSettingIcon">
                    <ReactToPrint
                      documentTitle="গ্রাহক লিস্ট"
                      trigger={() => (
                        <PrinterFill
                          title={t("print")}
                          className="addcutmButton"
                        />
                      )}
                      content={() => componentRef.current}
                    />
                  </div>
                </div>
              </FourGround>

              {/* Model start */}
              <CustomerBillCollect single={singleCustomer} />
              <AddStaticCustomer />
              <CustomerDetails single={singleCustomer} />
              <SingleMessage
                single={singleCustomer}
                sendCustomer="staticCustomer"
              />

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
                            {t("area")}
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
                            {t("status")}
                          </option>
                          <option value="active"> {t("active")} </option>
                          <option value="inactive"> {t("in active")} </option>
                          <option value="expired"> {t("expired")} </option>
                        </select>
                        <select
                          className="form-select"
                          onChange={handlePaymentChange}
                        >
                          <option value="" defaultValue>
                            {t("payment")}
                          </option>
                          <option value="free"> {t("free")} </option>
                          <option value="paid"> {t("paid")} </option>
                          <option value="unpaid"> {t("unpaid")} </option>
                          <option value="partial"> {t("partial")} </option>
                          <option value="advance"> {t("advance")} </option>
                          <option value="overdue"> {t("overDue")} </option>
                        </select>
                      </div>

                      <div style={{ display: "none" }}>
                        <PrintCustomer
                          filterData={filterData}
                          currentCustomers={Customers}
                          ref={componentRef}
                        />
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
