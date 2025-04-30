import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  PersonFill,
  CashStack,
  PrinterFill,
  ArrowClockwise,
  ChatText,
  Server,
  FilterCircle,
  PencilSquare,
  FiletypeCsv,
  ArrowBarLeft,
  ArrowBarRight,
  ArchiveFill,
  Phone,
  GeoAlt,
  Cash,
  ClockHistory,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { Accordion, Card, Collapse } from "react-bootstrap";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import Loader from "../../components/common/Loader";
import {
  getCustomer,
  getSubAreas,
  getResellerProfile,
  getResellerPackages,
} from "../../features/apiCallReseller";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import FormatNumber from "../../components/common/NumberFormat";
import CustomersNumber from "../../pages/Customer/CustomersNumber";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import CustomerDelete from "../../pages/Customer/customerCRUD/CustomerDelete";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../pages/Customer/customerCRUD/customerBillDayPromiseDate";
import PPPoECustomerEdit from "./actionComponent/PPPoECustomerEdit";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import RechargeCustomer from "./actionComponent/RechargeCustomer";
import PrintOptions from "../../components/common/PrintOptions";
import BulkOptions from "../../pages/Customer/customerCRUD/bulkOpration/BulkOptions";
import DataFilter from "../../pages/common/DataFilter";
import useDataState from "../../hooks/useDataState";
import { handleActiveFilter } from "../../pages/common/activeFilter";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // current Date
  let today = new Date();
  let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

  //---> Get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, ispOwnerId, userData, permission, permissions } =
    useISPowner();

  //---> Get reseller customer from redux store
  const customers = useSelector((state) => state?.customer?.customer);

  //---> Get reseller subAreas from redux store
  const subAreas = useSelector((state) => state?.area?.area);

  //---> Get reseller mikrotik package from redux store
  const packages = useSelector((state) => state?.mikrotik?.pppoePackage);

  //---> Get bulletin route permission from redux store
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);
  const [open, setOpen] = useState(false);

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // bulk modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  const [Customers, setCustomers] = useState([]);

  // get specific customer Report
  const [customerReportData, setId] = useState([]);

  //bulk-operations
  const [bulkCustomer, setBulkCustomer] = useState([]);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // customer id state
  const [customerId, setCustomerId] = useState("");

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  //================// API CALL's //================//
  useEffect(() => {
    //===========================================================> FIRST API

    //---> @Get reseller ispOwner areas sub-area data
    !subAreas.length && getSubAreas(dispatch, resellerId);

    //---> @Get ispOwner all customer data
    !customers?.length && getCustomer(dispatch, resellerId, setIsLoading);

    //===========================================================> SECOND STEP API

    //---> @Get reseller with and withOut mikrotik package data
    !packages.length && getResellerPackages(dispatch, resellerId);

    //===========================================================> LAST API

    //---> @Get reseller profile data
    role === "collector" && getResellerProfile(resellerId, dispatch);

    //---> @Get netFee bulletin permissions data
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, [resellerId]);

  // set state api call data
  useEffect(() => {
    let customerModified = [];

    // add area to customers
    customers?.map((c) => {
      if (!c.area) {
        subAreas?.map((sub) => {
          if (sub.id === c.subArea) {
            customerModified.push({
              ...c,
              area: sub.area,
            });
          }
        });
      } else {
        customerModified.push(c);
      }
    });

    setCustomers(customerModified);

    // set customer in state for filter
    Object?.values(filterOptions) &&
      setCustomers(handleActiveFilter(customerModified, filterOptions));
  }, [customers]);

  // reload handler
  const reloadHandler = () => {
    if (role === "reseller") {
      getCustomer(dispatch, userData?.id, setIsLoading);
    } else if (role === "collector") {
      getCustomer(dispatch, userData?.reseller, setIsLoading);
    }
  };

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // customer delete controller
  const customerDelete = (customerID) => {
    setMikrotikCheck(false);
    setCustomerId(customerID);
  };

  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  const bandwidthModalController = (customerID) => {
    setCustomerId(customerID);
    setBandWidthModal(true);
  };

  // export customer header
  const customerForCsVTableInfoHeader = [
    { label: "id", key: "customerId" },
    { label: "name_of_client", key: "name" },
    { label: "PPPoE_name", key: "pppoeName" },
    { label: "client_phone", key: "mobile" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //export customer data
  let customerForCsVTableInfo = Customers?.map((customer) => {
    return {
      customerId: customer.customerId,
      name: customer.name,
      pppoeName: customer.pppoe.name,
      mobile: customer?.mobile || "",
      package: customer?.pppoe?.profile,
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
    };
  });

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    Customers?.map((item) => {
      if (item.paymentStatus === "unpaid") {
        // filter due amount
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
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {dueMonthlyFee?.totalMonthlyFee > 0 && (
        <div>
          {t("monthlyFee")}:-৳
          {FormatNumber(dueMonthlyFee.totalMonthlyFee)}
        </div>
      )}
      &nbsp;&nbsp;
      {dueMonthlyFee.totalSumDue > 0 && (
        <div>
          {t("due")}:-৳
          {FormatNumber(dueMonthlyFee.totalSumDue)}
        </div>
      )}
    </div>
  );

  // find area name
  const areaName = subAreas.find((item) => item.id === filterOptions.subArea);

  // set filter value in pdf
  const filterData = {
    area: areaName?.name ? areaName.name : t("allArea"),
    status: filterOptions.status,
    payment: filterOptions.paymentStatus,
  };

  // pppoe customer print option
  const printData = {
    id: 1003,
    value: "pppoe",
    label: "pppoe",
    checked: true,
  };

  // single customer activity log handle
  const handleCustomerActivityLog = (data) => {
    navigate(`/activity/${data?.id}`);
  };

  const columns = useMemo(
    () => [
      {
        id: "selection",
        width: "2%",
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
      },
      {
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
        Cell: ({ row: { original } }) => (
          <div
            // onClick={(e) => autoDisableHandle(original, e)}
            style={{ cursor: "pointer" }}
          >
            {original?.autoDisable ? (
              <p className="text-success">{original?.customerId}</p>
            ) : (
              <p className="text-danger">{original?.customerId}</p>
            )}
          </div>
        ),
      },
      {
        width: "13%",
        Header: t("namePPPoE"),
        accessor: (data) => `${data?.name} ${data.pppoe?.name}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original.pppoe?.name}

              <span className="ms-1">
                {firstDate <= new Date(original?.createdAt) &&
                  lastDate >= new Date(original?.createdAt) && (
                    <small className="new_badge badge bg-secondary">
                      {"new"}
                    </small>
                  )}
              </span>
            </p>
          </div>
        ),
      },
      {
        width: "18%",
        Header: t("mobileAddress"),
        accessor: (data) => `${data?.mobile} ${data?.address}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p style={{ fontWeight: "500" }}>
              <Phone className="text-info" /> {original?.mobile || "N/A"}
            </p>
            <p>
              <GeoAlt />
              {original?.address || "N/A"}
            </p>
          </div>
        ),
      },
      {
        width: "13%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "11%",
        Header: t("billBalance"),
        accessor: (data) => `${data?.monthlyFee} ${data?.balance}`,
        Cell: ({ row: { original } }) => (
          <div style={{ fontWeight: "500" }}>
            <p>৳{original?.monthlyFee}</p>
            <p
              className={`text-${
                original?.balance > -1 ? "success" : "danger"
              }`}
            >
              ৳{FormatNumber(original?.balance)}
            </p>
          </div>
        ),
      },
      {
        width: "18%",
        Header: t("billPromise"),
        accessor: (data) =>
          `${moment(data?.billingCycle).format("YYYY/MM/DD hh:mm A")} 
          ${moment(data?.promiseDate).format("YYYY/MM/DD hh:mm A")}`,
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div>
              <p>{getCustomerPromiseDate(original)?.billDate}</p>

              {permission?.promiseDate && (
                <p
                  className={`d-flex align-self-end text-${
                    getCustomerPromiseDate(original)?.promiseDateChange
                  }`}
                >
                  {getCustomerPromiseDate(original)?.promiseDate}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        width: "6%",
        Header: t("day"),
        accessor: (data) => `${getCustomerDayLeft(data?.billingCycle)}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center p-1">
            <p
              className={`${
                getCustomerDayLeft(original?.billingCycle) >= 20
                  ? "border border-2 border-success"
                  : getCustomerDayLeft(original?.billingCycle) >= 10
                  ? "border border-2 border-primary"
                  : getCustomerDayLeft(original?.billingCycle) >= 0
                  ? "magantaColor"
                  : "bg-danger text-white"
              }`}
            >
              {getCustomerDayLeft(original?.billingCycle)}
            </p>
          </div>
        ),
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: (data) => `${data?.paymentStatus} ${data?.status}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center">
            <p>{badge(original?.paymentStatus)}</p>
            <p>{badge(original?.status)}</p>
          </div>
        ),
      },
      {
        width: "5%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
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
                    setModalStatus("profile");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP"> {t("profile")}</p>
                    </div>
                  </div>
                </li>

                {((role === "reseller" && permission?.customerRecharge) ||
                  (role === "collector" && permissions?.billPosting)) && (
                  <li
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      getSpecificCustomerReport(original);
                      setModalStatus("billCollect");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <Cash />
                        <p className="actionP">{t("recharge")}</p>
                      </div>
                    </div>
                  </li>
                )}

                <li
                  onClick={() => {
                    getSpecificCustomer(original.id);
                    setModalStatus("customerEdit");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>

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

                {permission?.customerDelete && (
                  <li
                    onClick={() => {
                      setCustomerId(original.id);
                      setModalStatus("delete");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {original.mobile &&
                  (permissions?.sendSMS || role !== "collector") && (
                    <li
                      onClick={() => {
                        setCustomerId(original.id);
                        setModalStatus("message");
                        setShow(true);
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

                <li onClick={() => handleCustomerActivityLog(original)}>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ClockHistory />
                      <p className="actionP">{t("activityLog")}</p>
                    </div>
                  </div>
                </li>
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
                  <h2> {t("customer")}</h2>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
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
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        />
                      )}
                    </div>

                    {(permission?.customerAdd || permissions?.customerAdd) && (
                      <div>
                        <PersonPlusFill
                          className="addcutmButton"
                          onClick={() => {
                            setModalStatus("customerPost");
                            setShow(true);
                          }}
                          title={t("newCustomer")}
                        />
                      </div>
                    )}

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            {permission &&
                            permission?.singleCustomerNumberEdit ? (
                              <div
                                className="addAndSettingIcon"
                                onClick={() =>
                                  setNumberModalShow({
                                    ...numberModalShow,
                                    [false]: true,
                                  })
                                }
                                title={t("customerNumberUpdateOrDelete")}
                              >
                                <PencilSquare className="addcutmButton" />
                              </div>
                            ) : (
                              ""
                            )}

                            <CSVLink
                              data={customerForCsVTableInfo}
                              filename={ispOwnerData.company}
                              headers={customerForCsVTableInfoHeader}
                              title="Customer Report"
                            >
                              <FiletypeCsv className="addcutmButton" />
                            </CSVLink>

                            <div className="addAndSettingIcon">
                              <PrinterFill
                                title={t("customerData")}
                                className="addcutmButton"
                                onClick={() => {
                                  setModalStatus("printOptions");
                                  setShow(true);
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Collapse>

                    {!open && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}

                    {open && (
                      <ArrowBarRight
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
                  </div>
                </div>
              </FourGround>

              {role === "reseller" || permissions?.viewCustomerList ? (
                <FourGround>
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <DataFilter
                            page="pppoe"
                            customers={customers}
                            setCustomers={setCustomers}
                            filterOptions={filterOptions}
                            setFilterOption={setFilterOption}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="collectorWrapper pb-2">
                      <Table
                        customComponent={customComponent}
                        bulkLength={bulkCustomer?.length}
                        isLoading={isLoading}
                        columns={columns}
                        data={Customers}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    </div>
                  </div>

                  {(butPermission?.customer || butPermission?.allPage) && (
                    <NetFeeBulletin />
                  )}
                </FourGround>
              ) : (
                ""
              )}
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* component model start */}

      {/* customer profile details modal */}
      {modalStatus === "profile" && (
        <CustomerDetails
          show={show}
          setShow={setShow}
          customerId={singleCustomer}
        />
      )}

      {/* new customer create */}
      {modalStatus === "customerPost" && (
        <CustomerPost show={show} setShow={setShow} />
      )}

      {/* create customer information update */}
      {modalStatus === "customerEdit" && (
        <PPPoECustomerEdit
          show={show}
          setShow={setShow}
          single={singleCustomer}
        />
      )}

      {/* customer bill collection */}
      {modalStatus === "billCollect" && (
        <RechargeCustomer
          show={show}
          setShow={setShow}
          single={singleCustomer}
          customerData={customerReportData}
        />
      )}

      {/* customer report modal */}
      <CustomerReport single={customerReportData} />

      {/* customer message modal */}
      {modalStatus === "message" && (
        <SingleMessage
          show={show}
          setShow={setShow}
          single={customerId}
          sendCustomer="customer"
        />
      )}

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* customer delete modal  */}
      {modalStatus === "delete" && (
        <CustomerDelete
          show={show}
          setShow={setShow}
          single={customerId}
          mikrotikCheck={checkMikrotik}
          setMikrotikCheck={setMikrotikCheck}
          status="pppoe"
          page="reseller"
        />
      )}

      {/* component model end */}

      {/* bulk options modal  */}
      <BulkOptions bulkCustomers={bulkCustomer} page="pppoe" />

      {/* customers data table print option modal */}
      {modalStatus === "printOptions" && (
        <PrintOptions
          show={show}
          setShow={setShow}
          filterData={filterData}
          tableData={Customers}
          page={"customer"}
          printData={printData}
        />
      )}

      {/* <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customerId={customerId}
      /> */}
    </>
  );
};

export default Customer;
