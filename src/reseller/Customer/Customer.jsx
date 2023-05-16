import React, { useEffect, useMemo, useRef, useState } from "react";
import "../collector/collector.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  PersonFill,
  CashStack,
  PrinterFill,
  ArrowClockwise,
  FileExcelFill,
  ChatText,
  CurrencyDollar,
  Server,
  GearFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import CustomerEdit from "./customerCRUD/CustomerEdit";
import Loader from "../../components/common/Loader";

import {
  deleteACustomer,
  fetchpppoePackage,
  getCustomer,
  getMikrotik,
  getSubAreas,
  resellerInfo,
  withMtkPackage,
} from "../../features/apiCallReseller";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import PrintCustomer from "./customerPDF";
import { CSVLink } from "react-csv";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import BulkBillingCycleEdit from "./bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "./bulkOpration/bulkStatusEdit";
import BulkSubAreaEdit from "./bulkOpration/bulkSubAreaEdit";
import FormatNumber from "../../components/common/NumberFormat";
import BandwidthModal from "../../pages/Customer/BandwidthModal";
import BulkResellerRecharge from "./bulkOpration/BulkResellerRecharge";
import ResellerBulkAutoConnectionEdit from "./bulkOpration/ResellerBulkAutoConnectionEdit";
import BulkPackageEdit from "./bulkOpration/bulkPackageEdit";
// import CustomersNumber from "../../pages/Customer/CustomersNumber";

export default function Customer() {
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);
  const reseller = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  const ppPackage = useSelector((state) => state?.mikrotik?.pppoePackage);
  const cus = useSelector((state) => state?.customer?.customer);

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get ispOwner data from redux
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );
  const dispatch = useDispatch();
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [packageRate, setPackageRate] = useState("");

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && resellerId) {
      const IDs = {
        reseller: resellerId,
        mikrotikId: id,
      };
      fetchpppoePackage(dispatch, IDs);
    }
    setSingleMikrotik(id);
  };

  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };

  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
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

  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  const [subAreaId, setSubAreaId] = useState("");

  // customer id state
  const [customerId, setCustomerId] = useState("");

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

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

    if (packageRate) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.pppoe.profile === packageRate.name
      );
    }

    if (singleMikrotik) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.mikrotik === singleMikrotik
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
  }, [cus, paymentStatus, status, subAreaId, packageRate, singleMikrotik]);

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

  const bandwidthModalController = (customerID) => {
    setCustomerId(customerID);
    setBandWidthModal(true);
  };

  // reload handler
  const reloadHandler = () => {
    if (role === "reseller") {
      getCustomer(dispatch, userData?.reseller.id, setIsloading);
    } else if (role === "collector") {
      getCustomer(dispatch, userData?.collector?.reseller, setIsloading);
    }
  };

  useEffect(() => {
    if (!ispOwnerData.bpSettings?.hasMikrotik) {
      withMtkPackage(dispatch, resellerId);
    }
    getSubAreas(dispatch, resellerId);

    if (role === "collector") {
      getMikrotik(dispatch, userData.collector.reseller);
      resellerInfo(resellerId, dispatch);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, resellerId);
      if (cus.length === 0)
        getCustomer(dispatch, userData?.reseller.id, setIsloading);
    } else if (role === "collector") {
      if (cus.length === 0)
        getCustomer(dispatch, userData?.collector?.reseller, setIsloading);
    }
  }, [userData, role]);

  const [subAreaIds, setSubArea] = useState([]);

  useEffect(() => {
    if (subAreaIds.length) {
      setCustomers(cus.filter((c) => subAreaIds.includes(c.subArea)));
    } else {
      setCustomers(cus);
    }
  }, [cus, subAreaIds]);

  //bulk-operations
  const [bulkCustomer, setBulkCustomer] = useState([]);

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    Customers?.map((item) => {
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
      {/* {t("collection")}&nbsp;{" "} */}
      {/* {FormatNumber(Number(sumMonthlyFee()) - Number(dueMonthlyFee()))} &nbsp;
        {t("tk")} */}
    </div>
  );

  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox
            customeStyle={true}
            {...getToggleAllPageRowsSelectedProps()}
          />
        ),
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
        width: "2%",
      },
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "9%",
        Header: "PPPoE",
        accessor: "pppoe.name",
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "8%",
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
        width: "9%",
        Header: t("package"),
        accessor: "pppoe.profile",
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
        width: "11%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "7%",
        Header: () => <div className="text-center">{t("action")}</div>,
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
                      <p className="actionP"> {t("profile")}</p>
                    </div>
                  </div>
                </li>
                {(role === "reseller" || collectorPermission?.billPosting) && (
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
                        <CurrencyDollar />
                        <p className="actionP">{t("useMemoRecharge")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(permission?.customerEdit ||
                  collectorPermission?.customerEdit) && (
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
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>
                )}
                {role !== "collector" && (
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
                        <p className="actionP">{t("report")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {/* {permission?.customerDelete && (
                  <li
                    onClick={() => {
                      let con = window.confirm(
                        `${original.name}  ${t("wantToDeleteCustomer")}`
                      );
                      con && deleteCustomer(original.id);
                    }}
                  >
                    <div className="dropdown-item actionManager">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP"> {t("delete")} </p>
                      </div>
                    </div>
                  </li>
                )} */}

                {original.mobile &&
                  (collectorPermission?.sendSMS || role !== "collector") && (
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

                {role === "reseller" &&
                  ispOwnerData.bpSettings?.hasMikrotik && (
                    <li onClick={() => bandwidthModalController(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Server />
                          <p className="actionP">{t("bandwidth")}</p>
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

  //export customer data
  let customerForCsVTableInfo = Customers?.map((customer) => {
    return {
      name: customer.name,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      package: customer?.pppoe?.profile,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
    };
  });

  const customerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

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
                  {/* <h2> {t("customer")} </h2> */}

                  <div className="d-flex">
                    <h2>{t("customer")}</h2>
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

                  <div className="addAndSettingIcon">
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-pencil-square addcutmButton addAndSettingIcon"
                      viewBox="0 0 16 16"
                      onClick={() =>
                        setNumberModalShow({
                          ...numberModalShow,
                          [false]: true,
                        })
                      }
                      title={t("customerNumberUpdateOrDelete")}
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg> */}

                    <CSVLink
                      data={customerForCsVTableInfo}
                      filename={ispOwnerData.company}
                      headers={customerForCsVTableInfoHeader}
                      title="Customer Report"
                    >
                      <FileExcelFill className="addcutmButton" />
                    </CSVLink>

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
                      <>
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
                        />
                      </>
                    )}
                  </div>
                </div>
              </FourGround>

              {/* Model start */}
              <CustomerPost />
              <CustomerEdit single={singleCustomer} />
              <CustomerBillCollect
                single={singleCustomer}
                customerData={customerReportData}
              />
              <CustomerDetails single={singleCustomer} />
              <CustomerReport single={customerReportData} />
              <SingleMessage single={singleCustomer} sendCustomer="customer" />

              {/* bulk operation modal section */}
              <BulkSubAreaEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBulkEdit"
              />
              <BulkResellerRecharge
                bulkCustomer={bulkCustomer}
                modalId="bulkResellerRecharge"
              />
              <BulkBillingCycleEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBillingCycle"
              />

              <BulkStatusEdit
                bulkCustomer={bulkCustomer}
                modalId="bulkStatusEdit"
              />

              <ResellerBulkAutoConnectionEdit
                bulkCustomer={bulkCustomer}
                modalId="autoDisableEditModal"
              />

              <BulkPackageEdit
                bulkCustomer={bulkCustomer}
                modalId="bulkPackageEdit"
              />
              {/*  bulk operation modal section */}

              {/* customers number update or delete modal */}
              {/* <CustomersNumber showModal={numberModalShow} /> */}

              {/* Model finish */}

              {role === "reseller" || collectorPermission?.viewCustomerList ? (
                <FourGround>
                  <div className="collectorWrapper mt-e py-2">
                    <div className="addCollector">
                      <div className="displexFlexSys d-flex ">
                        {/* filter selector */}

                        <div className="selectFiltering allFilter mx-auto">
                          {/* //Todo */}

                          <select
                            className="form-select"
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
                            onChange={selectMikrotik}
                          >
                            <option value="" defaultValue>
                              {t("mikrotik")}
                            </option>

                            {Getmikrotik?.length &&
                              Getmikrotik?.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                          </select>

                          <select
                            className="form-select"
                            onChange={selectMikrotikPackage}
                          >
                            <option value="" defaultValue>
                              {t("PPPoEPackage")}
                            </option>

                            {ppPackage.length === undefined
                              ? ""
                              : ppPackage?.map((val, key) => (
                                  <option key={key} value={val.id}>
                                    {val.name}
                                  </option>
                                ))}
                          </select>

                          <select
                            className="form-select"
                            onChange={handlePaymentChange}
                          >
                            <option value="" defaultValue>
                              {t("paymentStatus")}
                            </option>
                            <option value="free">{t("free")}</option>
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
                        customComponent={customComponent}
                        isLoading={isLoading}
                        columns={columns}
                        data={Customers}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    </div>
                  </div>
                </FourGround>
              ) : (
                ""
              )}
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {bulkCustomer.length > 0 && (
        <div className="client_wraper2">
          <div
            className={`settings_wraper2 ${
              isMenuOpen ? "show-menu2" : "hide-menu2"
            }`}
          >
            <ul className="client_service_list2 ps-0">
              {permission?.bulkAreaEdit && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerBulkEdit"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                      title={t("editArea")}
                    >
                      <i class="fas fa-map-marked-alt fa-xs"></i>
                      <span className="button_title">{t("editArea")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editArea")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {permission?.bulkCustomerRecharge && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#bulkResellerRecharge"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                      title={t("package")}
                    >
                      <i className="fas fa-dollar fa-xs "></i>
                      <span className="button_title">{t("bulkRecharge")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("bulkRecharge")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {permission?.bulkCustomerStatusEdit && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#bulkStatusEdit"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("editStatus")}
                    >
                      <i className="fas fa-edit fa-xs  "></i>
                      <span className="button_title"> {t("editStatus")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editStatus")}</div>
                </li>
              )}
              <hr className="mt-0 mb-0" />

              {permission?.bulkCustomerBillingCycleEdit && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerBillingCycle"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-secondary"
                      title={t("editBillingCycle")}
                    >
                      <i class="far fa-calendar-alt fa-xs"></i>
                      <span className="button_title">
                        {" "}
                        {t("editBillingCycle")}{" "}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBillingCycle")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {permission?.customerAutoDisableEdit && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#autoDisableEditModal"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-secondary"
                      title={t("autoConnectOnOff")}
                    >
                      <i class="fas fa-power-off fa-xs"></i>
                      <span className="button_title">
                        {t("automaticConnectionOff")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">
                    {" "}
                    {t("automaticConnectionOff")}
                  </div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {permission?.customerMikrotikPackageEdit && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#bulkPackageEdit"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                      title={t("package")}
                    >
                      <i class="fas fa-wifi fa-xs"></i>
                      <span className="button_title">{t("updatePackage")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("updatePackage")}</div>
                </li>
              )}
            </ul>

            <div className="setting_icon_wraper2">
              <div
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="client_setting_icon2"
              >
                <GearFill />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {bulkCustomer.length > 0 && (
        <div className="bulkActionButton">
          {permission?.bulkAreaEdit && (
            <button
              className="bulk_action_button"
              title={t("editArea")}
              data-bs-toggle="modal"
              data-bs-target="#customerBulkEdit"
              type="button"
              class="btn btn-primary btn-floating btn-sm"
            >
              <i class="fas fa-edit"></i>
              <span className="button_title">{t("editArea")}</span>
            </button>
          )}
          {permission?.bulkCustomerRecharge && (
            <button
              className="bulk_action_button btn btn-warning btn-floating btn-sm"
              title={t("package")}
              data-bs-toggle="modal"
              data-bs-target="#bulkResellerRecharge"
              type="button"
              class="btn btn-primary btn-floating btn-sm"
            >
              <i className="fas fa-dollar"></i>
              <span className="button_title">{t("bulkRecharge")}</span>
            </button>
          )}
          {permission?.bulkCustomerStatusEdit && (
            <button
              className="bulk_action_button"
              title={t("editStatus")}
              data-bs-toggle="modal"
              data-bs-target="#bulkStatusEdit"
              type="button"
              class="btn btn-dark btn-floating btn-sm"
            >
              <i class="fas fa-edit"></i>
              <span className="button_title"> {t("editStatus")}</span>
            </button>
          )}
          {permission?.bulkCustomerBillingCycleEdit && (
            <button
              className="bulk_action_button"
              title={t("editBillingCycle")}
              data-bs-toggle="modal"
              data-bs-target="#customerBillingCycle"
              type="button"
              class="btn btn-warning btn-floating btn-sm"
            >
              <i class="fas fa-edit"></i>
              <span className="button_title"> {t("editBillingCycle")} </span>
            </button>
          )}

          {permission?.customerAutoDisableEdit && (
            <button
              className="bulk_action_button btn btn-primary btn-floating btn-sm"
              title={t("autoConnectOnOff")}
              data-bs-toggle="modal"
              data-bs-target="#autoDisableEditModal"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title">
                {t("automaticConnectionOff")}
              </span>
            </button>
          )}

          {permission?.customerMikrotikPackageEdit && (
            <button
              className="bulk_action_button btn btn-warning btn-floating btn-sm"
              title={t("package")}
              data-bs-toggle="modal"
              data-bs-target="#bulkPackageEdit"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title">{t("updatePackage")}</span>
            </button>
          )}
        </div>
      )} */}

      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customerId={customerId}
      />
    </>
  );
}
