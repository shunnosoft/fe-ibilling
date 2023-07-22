import React, { useEffect, useMemo, useRef, useState } from "react";
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
  PersonPlusFill,
  PenFill,
  FilterCircle,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";

import {
  deleteACustomer,
  getCustomer,
  getMikrotik,
  getStaticCustomerApi,
  getSubAreas,
} from "../../features/apiCallReseller";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import CustomerBillCollect from "./staticCustomerCrud/CustomerBillCollect";
import AddStaticCustomer from "./staticCustomerCrud/StaticCustomerPost";
import CustomerDetails from "../../pages/staticCustomer/customerCRUD/CustomerDetails";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import PrintCustomer from "./customerPDF";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import FormatNumber from "../../components/common/NumberFormat";
import CustomerEdit from "./staticCustomerCrud/CustomerEdit";
import { fetchPackagefromDatabase } from "../../features/apiCalls";
import { Accordion } from "react-bootstrap";

export default function RstaticCustomer() {
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component
  const cus = useSelector((state) => state?.customer?.staticCustomer);
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);
  const reseller = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const role = useSelector((state) => state.persistedReducer.auth?.role);
  const dispatch = useDispatch();
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );

  const collectorPermission = useSelector(
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

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  const [subAreaId, setSubAreaId] = useState("");
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      //ToDo
      if (bpSettings?.hasMikrotik) {
        fetchPackagefromDatabase(dispatch, IDs, setIsloading);
      }
    }
    setSingleMikrotik(id);
  };

  //function for set 0
  const setPackageLimit = (value, isDown) => {
    setMikrotikPackage(value);
    const temp = ppPackage.find((val) => val.id === value);
    if (isDown) {
      setPackageRate(temp);
    }
    if (value === "unlimited") return "0";
    const getLetter = temp.name.toLowerCase();
    if (getLetter.indexOf("m") !== -1) {
      const setZero = getLetter.replace("m", "000000");
      return setZero;
    }
    if (getLetter.indexOf("k") !== -1) {
      const setZero = getLetter.replace("k", "000");
      return setZero;
    }
  };

  // select Mikrotik Package
  const selectMikrotikPackage = ({ target }) => {
    if (target.name === "downPackage") {
      const getLimit = setPackageLimit(target.value, true);
      getLimit && setDownMaxLimit(getLimit);
    }
  };

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

    if (singleMikrotik) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.mikrotik === singleMikrotik
      );
    }

    if (mikrotikPackage) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.mikrotikPackage === mikrotikPackage
      );
    }

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
  }, [cus, paymentStatus, status, subAreaId, singleMikrotik, mikrotikPackage]);

  // find area name
  const areaName = subAreas.find((item) => item.id === subAreaId);

  // send filter data to print
  const filterData = {
    area: areaName?.name ? areaName.name : t("allArea"),
    status: status ? status : t("sokolCustomer"),
    payment: paymentStatus ? paymentStatus : t("sokolCustomer"),
  };

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

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    Customers.map((item) => {
      if (item.paymentStatus === "unpaid") {
        // filter due ammount
        dueAmount = item.monthlyFee - item.balance;

        // total sum due
        totalSumDue += dueAmount;
      }

      // sum of all monthly fee
      totalMonthlyFee += item.monthlyFee;
    });

    return { totalSumDue, totalMonthlyFee };
  }, [Customers]);

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {t("monthlyFee")}&nbsp; {FormatNumber(dueMonthlyFee.totalMonthlyFee)}
      &nbsp;
      {t("tk")} &nbsp;&nbsp; {t("due")}&nbsp;
      {FormatNumber(dueMonthlyFee.totalSumDue)} &nbsp;{t("tk")} &nbsp;
    </div>
  );

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
          return moment(value).format("YYYY/MM/DD hh:mm A");
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

                {(permission?.customerEdit ||
                  collectorPermission?.customerEdit) && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#resellerCustomerEdit"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(role === "reseller" || role === "collector") && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#collectCustomerBillModal"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      getSpecificCustomerReport(original);
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <h2>{t("staticCustomer")}</h2>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title={t("filter")}
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

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
                    {(permission?.customerAdd ||
                      collectorPermission?.customerAdd) && (
                      <PersonPlusFill
                        className="addcutmButton"
                        data-bs-toggle="modal"
                        data-bs-target="#addStaticCustomerModal"
                      />
                    )}
                  </div>
                </div>
              </FourGround>

              {/* Model start */}
              <CustomerBillCollect
                single={singleCustomer}
                customerData={customerReportData}
              />
              <AddStaticCustomer />
              <CustomerEdit single={singleCustomer} />
              <CustomerDetails single={singleCustomer} />
              <SingleMessage
                single={singleCustomer}
                sendCustomer="staticCustomer"
              />

              {/* Model finish */}

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="displexFlexSys d-flex justify-content-center">
                          {/* filter selector */}
                          <div className="selectFiltering allFilter ">
                            {/* //Todo */}

                            <select
                              className="form-select mt-0"
                              onChange={selectMikrotik}
                            >
                              <option value="" defaultValue>
                                {t("mikrotik")}
                              </option>

                              {Getmikrotik?.length === undefined
                                ? ""
                                : Getmikrotik?.map((val, key) =>
                                    reseller.mikrotiks?.map(
                                      (item) =>
                                        val.id === item && (
                                          <option key={key} value={val.id}>
                                            {val.name}
                                          </option>
                                        )
                                    )
                                  )}
                            </select>

                            <select
                              name="downPackage"
                              className="form-select mt-0"
                              onChange={selectMikrotikPackage}
                            >
                              <option value="" defaultValue>
                                {t("package")}
                              </option>
                              {ppPackage &&
                                ppPackage?.map(
                                  (val, key) =>
                                    val.packageType === "queue" && (
                                      <option key={key} value={val.id}>
                                        {val.name}
                                      </option>
                                    )
                                )}
                            </select>

                            <select
                              className="form-select mt-0"
                              onChange={(e) =>
                                handleSubAreaChange(e.target.value)
                              }
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
                              className="form-select mt-0"
                              onChange={handleStatusChange}
                            >
                              <option value="" defaultValue>
                                {t("status")}
                              </option>
                              <option value="active"> {t("active")} </option>
                              <option value="inactive">{t("in active")}</option>
                              <option value="expired"> {t("expired")} </option>
                            </select>

                            <select
                              className="form-select mt-0"
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
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="addCollector">
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
                        customComponent={customComponent}
                        isLoading={isLoading}
                        columns={columns}
                        data={Customers}
                      ></Table>
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
