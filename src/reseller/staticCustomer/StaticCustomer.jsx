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
  ArrowBarLeft,
  ArrowBarRight,
  ArchiveFill,
  Phone,
  GeoAlt,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import { Accordion, Card, Collapse } from "react-bootstrap";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import {
  getCustomer,
  getMikrotik,
  getStaticCustomerApi,
  getSubAreas,
} from "../../features/apiCallReseller";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import AddStaticCustomer from "./staticCustomerCrud/StaticCustomerPost";
import PrintCustomer from "./customerPDF";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import FormatNumber from "../../components/common/NumberFormat";
import {
  fetchPackagefromDatabase,
  getAllPackages,
} from "../../features/apiCalls";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import CustomerDelete from "../../pages/Customer/customerCRUD/CustomerDelete";
import useISPowner from "../../hooks/useISPOwner";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../pages/Customer/customerCRUD/customerBillDayPromiseDate";
import CustomerDetails from "./staticCustomerCrud/CustomerDetails";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import StaticCustomerEdit from "./actionComponent/StaticCustomerEdit";
import RechargeCustomer from "./actionComponent/RechargeCustomer";
import PrintOptions from "../../components/common/PrintOptions";

export default function RstaticCustomer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef(); //reference of pdf export component

  // get user & current user data form useISPOwner hook
  const {
    role,
    ispOwnerId,
    bpSettings,
    userData,
    resellerData,
    permissions,
    permission,
    currentUser,
  } = useISPowner();

  //get reseller areas customer form redux store
  const cus = useSelector((state) => state?.customer?.staticCustomer);

  // get reseller mikrotiks form store
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik & with out mikrotik packages
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  //get customer subareas form redux
  const subAreas = useSelector((state) => state?.area?.area);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [packLoading, setPackLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  const [Customers, setCustomers] = useState(cus);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // customer id state
  const [customerId, setCustomerId] = useState("");

  // component modal state
  const [modalStatus, setModalStatus] = useState("");

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  const [subAreaId, setSubAreaId] = useState("");
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // api calls
  useEffect(() => {
    if (role === "reseller") {
      // get reseller mikrotik
      getMikrotik(dispatch, userData?.id);

      // get reseller areas
      getSubAreas(dispatch, userData?.id);

      // get reseller areas static customer
      if (cus.length === 0)
        getStaticCustomerApi(dispatch, currentUser.reseller?.id, setIsloading);
    }

    if (role === "collector") {
      // get reseller mikrotik
      getMikrotik(dispatch, currentUser.collector?.reseller);

      // get reseller areas
      getSubAreas(dispatch, currentUser.collector?.reseller);

      // get collector areas static customer
      if (cus.length === 0)
        getStaticCustomerApi(
          dispatch,
          currentUser.collector?.reseller,
          setIsloading
        );
    }

    // get ispOwner all packages api
    getAllPackages(dispatch, ispOwnerId, setPackLoading);

    // get ispOwner & staffs api
    getOwnerUsers(dispatch, ispOwnerId);

    // netFee bulletin api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, [role]);

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

  // reload handler
  const reloadHandler = () => {
    if (role === "reseller") {
      getStaticCustomerApi(dispatch, currentUser?.reseller.id, setIsloading);
    }
    if (role === "collector") {
      getCustomer(dispatch, currentUser?.collector?.reseller, setIsloading);
    }
  };

  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      //ToDo
      if (bpSettings?.hasMikrotik) {
        fetchPackagefromDatabase(dispatch, IDs, setPackLoading);
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

  // customer current package find
  const customerPackageFind = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  // customer delete controller
  const customerDelete = (customerID) => {
    setMikrotikCheck(false);
    setCustomerId(customerID);
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

  // find area name
  const areaName = subAreas.find((item) => item.id === subAreaId);

  // send filter data to print
  const filterData = {
    area: areaName?.name ? areaName.name : t("allArea"),
    status: status ? status : t("sokolCustomer"),
    payment: paymentStatus ? paymentStatus : t("sokolCustomer"),
  };

  // static customer print option
  const printData = {
    id: 1003,
    value: "ip",
    label: "ip",
    checked: true,
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
        Header: t("nameIP"),
        accessor: (data) =>
          `${data?.name} ${data?.queue.address} ${data?.queue.srcAddress} ${data?.queue.target}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original.userType === "firewall-queue"
                ? original.queue.address
                : original.userType === "core-queue"
                ? original.queue.srcAddress
                : original.queue.target}
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
        width: "11%",
        Header: t("package"),
        accessor: "mikrotikPackage",
        Cell: ({ cell: { value } }) => (
          <div>{Customers && customerPackageFind(value)?.name}</div>
        ),
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
              ৳{original?.balance}
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

              <p
                className={`d-flex align-self-end text-${
                  getCustomerPromiseDate(original)?.promiseDateChange
                }`}
              >
                {getCustomerPromiseDate(original)?.promiseDate}
              </p>
            </div>
          </div>
        ),
      },
      {
        width: "6%",
        Header: t("day"),
        accessor: (data) => `${new Date(data?.billingCycle).getDay()}`,
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
                  onClick={() => {
                    getSpecificCustomer(original.id);
                    setModalStatus("profile");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP"> {t("profile")} </p>
                    </div>
                  </div>
                </li>

                {(permission?.customerEdit || permissions?.customerEdit) && (
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

                {((role === "reseller" && permission?.customerRecharge) ||
                  (role === "collector" &&
                    resellerData.permission?.customerRecharge &&
                    permissions?.billPosting)) && (
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
                        <Wallet />
                        <p className="actionP"> {t("useMemoRecharge")} </p>
                      </div>
                    </div>
                  </li>
                )}
                {permission?.customerDelete && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#customerDelete"
                    onClick={() => {
                      customerDelete(original.id);
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
    [t, Customers, allPackages]
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
                  <h2>{t("staticCustomer")}</h2>

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

                    <div>
                      {(permission?.customerAdd ||
                        permissions?.customerAdd) && (
                        <PersonPlusFill
                          className="addcutmButton"
                          onClick={() => {
                            setModalStatus("customerPost");
                            setShow(true);
                          }}
                        />
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="addAndSettingIcon">
                            <PrinterFill
                              title={t("print")}
                              className="addcutmButton"
                              onClick={() => {
                                setModalStatus("printOptions");
                                setShow(true);
                              }}
                            />
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
                                    userData.mikrotiks?.map(
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
                    <Table
                      customComponent={customComponent}
                      isLoading={isLoading}
                      columns={columns}
                      data={Customers}
                    ></Table>
                  </div>
                </div>

                {(butPermission?.customer || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Model start */}

      {/* single customer profile details */}
      {modalStatus === "profile" && (
        <CustomerDetails
          show={show}
          setShow={setShow}
          customerId={singleCustomer}
        />
      )}

      {/* new customer added */}
      {modalStatus === "customerPost" && (
        <AddStaticCustomer show={show} setShow={setShow} />
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

      {/* single customer update */}
      <StaticCustomerEdit single={singleCustomer} />

      {/* single customer message */}
      <SingleMessage single={singleCustomer} sendCustomer="staticCustomer" />

      {/* customer delete modal  */}
      <CustomerDelete
        single={customerId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
        page="reseller"
      />

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

      {/* Model finish */}
    </>
  );
}
