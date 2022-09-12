import React, { useEffect, useState, useRef } from "react";
import "../collector/collector.css";
import moment from "moment";
import { CSVLink } from "react-csv";

import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  Wallet,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  ArrowRightShort,
  CashStack,
  ChatText,
  PersonPlusFill,
  FileExcelFill,
  PrinterFill,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ReactToPrint from "react-to-print";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import StaticCustomerEdit from "./customerCRUD/StaticCustomerEdit";
import {
  getStaticCustomer,
  getPackagewithoutmikrotik,
  fetchMikrotik,
  getArea,
} from "../../features/apiCalls";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import PrintCustomer from "./customerPDF";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import CustomerDelete from "./customerCRUD/StaticCustomerDelete";
import AddStaticCustomer from "./customerCRUD/AddStaticCustomer";
import apiLink from "../../api/apiLink";
import BulkSubAreaEdit from "../Customer/customerCRUD/bulkOpration/bulkSubAreaEdit";
import BulkBillingCycleEdit from "../Customer/customerCRUD/bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "../Customer/customerCRUD/bulkOpration/bulkStatusEdit";
import BulkCustomerDelete from "../Customer/customerCRUD/bulkOpration/BulkdeleteModal";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import { useTranslation } from "react-i18next";
import BulkAutoConnectionEdit from "../Customer/customerCRUD/bulkOpration/bulkAutoConnectionEdit";
import Loader from "../../components/common/Loader";

export default function Customer() {
  const { t } = useTranslation();
  const [mikrotikPac, setMikrotikPac] = useState([]);
  const [Customers1, setCustomers1] = useState([]);
  const [Customers2, setCustomers2] = useState([]);
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);
  const componentRef = useRef(); //reference of pdf export component
  const cus = useSelector((state) => state?.customer?.staticCustomer);

  const role = useSelector((state) => state.persistedReducer.auth?.role);
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  const [isLoading, setIsloading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [cusSearch, setCusSearch] = useState("");

  const [filterOptions, setFilterOption] = useState({
    status: "",
    paymentStatus: "",
    area: "",
    subArea: "",
    package: "",
    mikrotik: "",
    freeUser: "",
    filterDate: null,
    dayFilter: "",
  });
  const [Customers, setCustomers] = useState(cus);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  const [singleData, setSingleData] = useState();

  // const currentCustomers = Customers;
  const allareas = useSelector((state) => state?.area?.area);
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth?.currentUser?.collector?.areas
      : []
  );
  const [allArea, setAreas] = useState([]);

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData.permissions
  );

  useEffect(() => {
    if (role === "collector") {
      let areas = [];

      collectorArea?.map((item) => {
        let area = {
          id: item.area?.id,
          name: item.area?.name,
          subAreas: [
            {
              id: item?.id,
              name: item?.name,
            },
          ],
        };

        let found = areas?.find((area) => area.id === item.area?.id);
        if (found) {
          found.subAreas.push({ id: item?.id, name: item?.name });

          return (areas[areas.findIndex((item) => item?.id === found?.id)] =
            found);
        } else {
          return areas.push(area);
        }
      });
      setAreas(areas);
    }
  }, [collectorArea, role]);

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };
  // get specific customer Report
  const [customerReportData, setId] = useState([]);

  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    const singleData = cus?.find((item) => item.id === customerId);
    setSingleData(singleData);
  };

  let customerForCsV = Customers.map((customer) => {
    return {
      companyName: ispOwnerData.company,
      home: "Home",
      companyAddress: ispOwnerData.address,
      name: customer.name,
      customerAddress: customer.address,
      connectionType: "Wired",
      connectivity: "Dedicated",
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      package: customer?.pppoe?.profile,
      ip: "",
      road: ispOwnerData.address,
      address: ispOwnerData.address,
      area: ispOwnerData?.fullAddress?.area || "",
      district: ispOwnerData?.fullAddress?.district || "",
      thana: ispOwnerData?.fullAddress?.thana || "",
      mobile: customer?.mobile.slice(1) || "",
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
    };
  });

  const headers = [
    { label: "name_operator", key: "companyName" },
    { label: "type_of_client", key: "home" },
    { label: "distribution Location point", key: "companyAddress" },
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "type_of_connection", key: "connectionType" },
    { label: "type_of_connectivity", key: "connectivity" },
    { label: "activation_date", key: "createdAt" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "allowcated_ip", key: "ip" },
    { label: "house_no", key: "address" },
    { label: "road_no", key: "road" },
    { label: "area", key: "area" },
    { label: "district", key: "district" },
    { label: "thana", key: "thana" },
    { label: "client_phone", key: "mobile" },
    { label: "mail", key: "email" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
  ];

  //export customer data
  let customerForCsVTableInfo = Customers.map((customer) => {
    return {
      name: customer.name,
      ip:
        customer.userType === "firewall-queue"
          ? customer.queue.address
          : customer.queue.target,
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
    { label: "customer_ip", key: "ip" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  // reload Handler
  const reloadHandler = () => {
    if (
      !bpSettings?.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch, setIsloading);
    }

    getStaticCustomer(dispatch, ispOwner, setCustomerLoading);
  };

  useEffect(() => {
    if (
      !bpSettings?.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch, setIsloading);
    }

    if (cus.length === 0) getStaticCustomer(dispatch, ispOwner, setIsloading);
  }, [dispatch, ispOwner, role, bpSettings]);

  const [subAreaIds, setSubArea] = useState([]);
  const [singleArea, setArea] = useState({});

  const onChangeArea = (param) => {
    let area = JSON.parse(param);

    setArea(area);
    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];

      area?.subAreas.map((sub) => subAreaIds.push(sub.id));

      setSubArea(subAreaIds);
    }
  };

  useEffect(() => {
    const temp = [];
    cus.map((customer) => {
      let areaFound = false;
      allareas.map((area) => {
        area.subAreas.map((sub) => {
          if (customer.subArea === sub.id) {
            areaFound = true;
            // if (!temp.find((item) => item.id === customer.id)) {
            temp.push({
              ...customer,
              area: area.id,
              profile: customer.pppoe.profile,
            });
            // }
          }
        });
      });

      if (!areaFound) {
        temp.push({
          ...customer,
          area: "noArea",
          profile: customer.pppoe?.profile,
        });
      }
    });

    setCustomers(temp);
    setCustomers1(temp);
    setCustomers2(temp);
  }, [allareas, cus]);

  useEffect(() => {
    if (subAreaIds.length) {
      setCustomers(cus.filter((c) => subAreaIds.includes(c.subArea)));
    } else {
      setCustomers(cus);
    }
  }, [cus, subAreaIds]);

  useEffect(() => {
    if (mikrotiks.length === 0) fetchMikrotik(dispatch, ispOwner, setIsloading);
    if (allArea.length === 0) getArea(dispatch, ispOwner, setIsloading);
  }, []);

  //Filter function
  const handleActiveFilter = () => {
    let tempCustomers = [...Customers2];

    const filteredCustomer = tempCustomers.filter((customer) => {
      let isFound = false;
      //filter by area
      if (filterOptions.area) {
        if (customer.area === filterOptions.area) {
          isFound = true;
        } else {
          return false;
        }
      }
      //filter by subarea
      if (filterOptions.subArea) {
        if (customer.subArea === filterOptions.subArea) {
          isFound = true;
        } else {
          return false;
        }
      }
      //free user filter
      if (filterOptions.freeUser) {
        if (filterOptions.freeUser === "freeUser") {
          if (customer.monthlyFee === parseInt("0")) {
            isFound = true;
          } else {
            return false;
          }
        } else if (filterOptions.freeUser === "nonFreeUser") {
          if (customer.monthlyFee !== parseInt("0")) {
            isFound = true;
          } else {
            return false;
          }
        }
      }
      //status filter active/incative
      if (filterOptions.status) {
        if (customer.status === filterOptions.status) {
          isFound = true;
        } else {
          return false;
        }
      }
      //payment status filter
      if (filterOptions.paymentStatus) {
        if (customer.paymentStatus === filterOptions.paymentStatus) {
          isFound = true;
        } else {
          return false;
        }
      }
      //filter by mikrotik
      if (filterOptions.mikrotik) {
        if (customer.mikrotik === filterOptions.mikrotik) {
          isFound = true;
        } else {
          return false;
        }
      }
      //filter using mikrotik package
      if (filterOptions.package) {
        if (customer.profile === filterOptions.package) {
          isFound = true;
        } else {
          return false;
        }
      }
      //filter by billing cycle
      if (filterOptions.filterDate) {
        const convertStingToDate = moment(filterOptions.filterDate).format(
          "YYYY-MM-DD"
        );
        if (
          new Date(
            moment(customer.billingCycle).format("YYYY-MM-DD")
          ).getTime() === new Date(convertStingToDate).getTime()
        ) {
          isFound = true;
        } else {
          return false;
        }
      }
      //bill date  filter
      if (filterOptions.dayFilter) {
        if (
          moment(customer.billingCycle).diff(moment(), "days") ===
          Number(filterOptions.dayFilter)
        ) {
          isFound = true;
        } else {
          return false;
        }
      }
      return isFound;
    });
    setCustomers1(filteredCustomer);
    setCustomers(filteredCustomer);
  };
  const handleFilterReset = () => {
    setMikrotikPac([]);
    setFilterOption({
      status: "",
      paymentStatus: "",
      area: "",
      subArea: "",
      package: "",
      filterDate: null,
    });
    setCustomers1(Customers2);
  };
  const onChangeSubArea = (id) => {
    setCusSearch(id);
  };

  let subArea, customerStatus, customerPaymentStatus;
  if (singleArea && cusSearch) {
    subArea = singleArea?.subAreas?.find((item) => item.id === subAreaIds[0]);
  }

  if (filterOptions.status) {
    if (filterOptions.status === "active") {
      customerStatus = "এক্টিভ";
    } else if (filterOptions.status === "inactive") {
      customerStatus = "ইনএক্টিভ";
    }
  }

  if (filterOptions.paymentStatus) {
    if (filterOptions.paymentStatus === "unpaid") {
      customerPaymentStatus = "বকেয়া";
    } else if (filterOptions.paymentStatus === "paid") {
      customerPaymentStatus = "পরিশোধ";
    } else if (filterOptions.paymentStatus === "expired") {
      customerPaymentStatus = "মেয়াদোত্তীর্ণ";
    }
  }

  const filterData = {
    area: singleArea?.name ? singleArea.name : "সকল এরিয়া",
    subArea: subArea ? subArea.name : "সকল সাবএরিয়া",
    status: customerStatus ? customerStatus : "সকল গ্রাহক",
    payment: customerPaymentStatus ? customerPaymentStatus : "সকল গ্রাহক",
  };
  const mikrotikHandler = async (id) => {
    setFilterOption({
      ...filterOptions,
      mikrotik: id,
    });
    if (!id) {
      setMikrotikPac([]);
    }
    if (id) {
      try {
        const res = await apiLink.get(`/mikrotik/ppp/package/${id}`);
        setMikrotikPac(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns = React.useMemo(
    () => [
      {
        width: "2%",
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
        width: "12%",
        Header: t("ip"),
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
        width: "9%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "10%",
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
                      <p className="actionP">{t("profile")}</p>
                    </div>
                  </div>
                </li>
                {(permission?.billPosting || role === "ispOwner") && (
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
                        <p className="actionP">{t("recharge")}</p>
                      </div>
                    </div>
                  </li>
                )}
                {(role === "ispOwner" || permission.customerEdit) && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#editStaticCustomerModal"
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

                {role === "ispOwner" || permission.customerDelete ? (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#staticCustomerDelete"
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
                ) : (
                  ""
                )}

                {original.mobile &&
                (role === "ispOwner" || permission.sendSMS) ? (
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
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  //bulk operations
  const [bulkCustomer, setBulkCustomer] = useState([]);

  //free users filter

  const handleFreeUser = (value) => {
    let getFreeUser;
    if (value === "freeUser") {
      getFreeUser = cus.filter((item) => item.monthlyFee === parseInt("0"));
    } else if (value === "nonFreeUser") {
      getFreeUser = cus.filter((item) => item.monthlyFee !== parseInt("0"));
    } else {
      return setCustomers1(cus);
    }
    setCustomers1(getFreeUser);
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2> {t("staticCustomer")} </h2>
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
                  <div
                    className="d-flex"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    <>
                      {role === "ispOwner" && (
                        <div className="settingbtn me-2">
                          <Link
                            to={`/packageSetting`}
                            className="mikrotikConfigureButtom"
                            style={{
                              height: "40px",
                              fontSize: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {t("packagingSetting")}
                            <ArrowRightShort style={{ fontSize: "19px" }} />
                          </Link>
                        </div>
                      )}
                      {(role === "ispOwner" || permission.customerAdd) && (
                        <>
                          <div className="addAndSettingIcon">
                            <CSVLink
                              data={customerForCsVTableInfo}
                              filename={ispOwnerData.company}
                              headers={customerForCsVTableInfoHeader}
                              title="Customer Report"
                            >
                              <FileExcelFill className="addcutmButton" />
                            </CSVLink>
                          </div>
                          <div className="addAndSettingIcon">
                            <CSVLink
                              data={customerForCsV}
                              filename={ispOwnerData.company}
                              headers={headers}
                              title={t("downloadBTRCreport")}
                            >
                              <FileExcelFill className="addcutmButton" />
                            </CSVLink>
                          </div>

                          <div className="addAndSettingIcon">
                            <ReactToPrint
                              documentTitle={t("CustomerList")}
                              trigger={() => (
                                <PrinterFill
                                  title={t("print")}
                                  className="addcutmButton"
                                />
                              )}
                              content={() => componentRef.current}
                            />
                          </div>
                        </>
                      )}

                      {(role === "ispOwner" || permission.customerAdd) && (
                        <PersonPlusFill
                          title={t("addStaticCustomer")}
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#addStaticCustomerModal"
                        />
                      )}
                    </>
                  </div>
                </div>
              </FourGround>

              {/* Model start */}
              <AddStaticCustomer />
              <StaticCustomerEdit single={singleCustomer} />
              <CustomerBillCollect single={singleCustomer} />
              <CustomerDetails single={singleCustomer} />
              <CustomerReport single={customerReportData} />
              <CustomerDelete
                single={singleData}
                mikrotikCheck={mikrotikCheck}
                setMikrotikCheck={setMikrotikCheck}
              />
              <SingleMessage
                single={singleCustomer}
                sendCustomer="staticCustomer"
              />
              {/* bulk Modal */}

              <BulkSubAreaEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBulkEdit"
              />
              <BulkBillingCycleEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBillingCycle"
              />

              <BulkStatusEdit
                bulkCustomer={bulkCustomer}
                modalId="bulkStatusEdit"
              />
              <BulkCustomerDelete
                bulkCustomer={bulkCustomer}
                modalId="bulkDeleteCustomer"
              />
              <BulkAutoConnectionEdit
                bulkCustomer={bulkCustomer}
                modalId="autoDisableEditModal"
              />
              {/* bulk Modal end */}

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      {/* filter selector */}
                      <div className="d-flex flex-wrap">
                        <select
                          className="form-select "
                          onChange={(e) => {
                            onChangeArea(e.target.value);
                            setFilterOption({
                              ...filterOptions,
                              area: JSON.parse(e.target.value).id,
                            });
                          }}
                        >
                          <option
                            value={JSON.stringify({
                              id: "",
                              name: "",
                              subAreas: [],
                            })}
                            defaultValue
                            selected={filterOptions.area === ""}
                          >
                            {t("allArea")}
                          </option>
                          {Customers2.some((c) => c.area === "noArea") && (
                            <option
                              value={JSON.stringify({
                                id: "noArea",
                                name: "",
                                subAreas: [],
                              })}
                              selected={filterOptions.area === "noArea"}
                            >
                              {t("customerWithoutArea")}
                            </option>
                          )}
                          {(role === "collector" ? allArea : allareas)?.map(
                            (area, key) => {
                              return (
                                <option
                                  selected={filterOptions.area === area.id}
                                  key={key}
                                  value={JSON.stringify(area)}
                                >
                                  {area.name}
                                </option>
                              );
                            }
                          )}
                        </select>

                        {/* //Todo */}
                        <select
                          className="form-select ms-2"
                          onChange={(e) => {
                            onChangeSubArea(e.target.value);
                            setFilterOption({
                              ...filterOptions,
                              subArea: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={filterOptions.subArea === ""}
                            value=""
                            defaultValue
                          >
                            {t("subArea")}
                          </option>
                          {singleArea?.subAreas?.map((sub, key) => (
                            <option
                              selected={filterOptions.subArea === sub.id}
                              key={key}
                              value={sub.id}
                            >
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="form-select ms-2"
                          onChange={(e) => {
                            setFilterOption({
                              ...filterOptions,
                              status: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={filterOptions.status === ""}
                            value=""
                            defaultValue
                          >
                            {t("status")}
                          </option>
                          <option
                            selected={filterOptions.status === "active"}
                            value="active"
                          >
                            {t("active")}
                          </option>
                          <option
                            selected={filterOptions.status === "inactive"}
                            value="inactive"
                          >
                            {t("in active")}
                          </option>
                          <option
                            selected={filterOptions.status === "expired"}
                            value="expired"
                          >
                            {t("expired")}
                          </option>
                        </select>

                        <select
                          className="form-select ms-2"
                          onChange={(e) => {
                            setFilterOption({
                              ...filterOptions,
                              paymentStatus: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={filterOptions.paymentStatus === ""}
                            value=""
                            defaultValue
                          >
                            {t("paymentStatus")}
                          </option>
                          <option
                            selected={filterOptions.paymentStatus === "paid"}
                            value="paid"
                          >
                            {t("payPaid")}
                          </option>
                          <option
                            selected={filterOptions.paymentStatus === "unpaid"}
                            value="unpaid"
                          >
                            {t("unpaid")}
                          </option>
                        </select>
                        {bpSettings?.hasMikrotik && (
                          <select
                            className="form-select ms-2"
                            onChange={(e) => {
                              mikrotikHandler(e.target.value);
                            }}
                          >
                            <option
                              selected={filterOptions.mikrotik === ""}
                              value=""
                              defaultValue
                            >
                              {t("mikrotik")}
                            </option>

                            {mikrotiks.map((m, i) => {
                              return (
                                <option
                                  key={i}
                                  selected={
                                    filterOptions.mikrotik === `${m.id}`
                                  }
                                  value={m.id}
                                >
                                  {m.name}
                                </option>
                              );
                            })}
                          </select>
                        )}

                        <select
                          className="form-select "
                          onChange={(e) => {
                            setFilterOption({
                              ...filterOptions,
                              package: e.target.value,
                            });
                          }}
                        >
                          <option
                            selected={filterOptions.mikrotik === ""}
                            value=""
                            defaultValue
                          >
                            {t("package")}
                          </option>

                          {mikrotikPac?.map((m, i) => {
                            return (
                              <option
                                key={i}
                                selected={filterOptions.package === `${m.name}`}
                                value={m.name}
                              >
                                {m.name}
                              </option>
                            );
                          })}
                        </select>

                        <select
                          onChange={(e) =>
                            setFilterOption({
                              ...filterOptions,
                              freeUser: e.target.value,
                            })
                          }
                          className="form-select ms-2"
                        >
                          <option
                            selected={filterOptions.freeUser === "allUser"}
                            value="allUser"
                          >
                            {t("sokolCustomer")}
                          </option>
                          <option
                            selected={filterOptions.freeUser === "freeUser"}
                            value="freeUser"
                          >
                            {t("freeCustomer")}
                          </option>
                          <option
                            selected={filterOptions.freeUser === "nonFreeUser"}
                            value="nonFreeUser"
                          >
                            {t("nonFreeCustomer")}
                          </option>
                        </select>
                        <input
                          className="form-select ms-2"
                          type="date"
                          onChange={(e) =>
                            setFilterOption({
                              ...filterOptions,
                              filterDate: e.target.value,
                            })
                          }
                        />
                        <select
                          className="form-select ms-2"
                          onChange={(e) =>
                            setFilterOption({
                              ...filterOptions,
                              dayFilter: e.target.value,
                            })
                          }
                        >
                          <option value="">{t("filterBillDate")}</option>
                          <option value="1">{t("oneDayLeft")}</option>
                          <option value="2">{t("twoDayLeft")}</option>
                          <option value="3">{t("threeDayLeft")}</option>
                          <option value="4">{t("fourDayLeft")}</option>
                        </select>
                        <div>
                          <button
                            className="btn btn-outline-primary w-6rem mt-2 ms-2"
                            type="button"
                            onClick={handleActiveFilter}
                          >
                            {t("filter")}
                          </button>
                          <button
                            className="btn btn-outline-secondary ms-2 w-6rem mt-2"
                            type="button"
                            onClick={handleFilterReset}
                          >
                            {t("reset")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* print report */}
                  <div style={{ display: "none" }}>
                    <PrintCustomer
                      filterData={filterData}
                      currentCustomers={Customers}
                      ref={componentRef}
                    />
                  </div>
                  <div className="filterresetbtn d-flex justify-content-between">
                    {/* <button onClick={handleActiveFilter}>filter</button> */}
                    <div></div>
                    {/* <button onClick={handleFilterReset}>reset</button> */}
                  </div>
                  <div className="table-section">
                    <Table
                      isLoading={customerLoading}
                      columns={columns}
                      data={Customers1}
                      bulkState={{
                        setBulkCustomer,
                      }}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      {bulkCustomer.length > 0 && (
        <div className="bulkActionButton">
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
          <button
            className="bulk_action_button"
            title={t("editStatus")}
            data-bs-toggle="modal"
            data-bs-target="#bulkStatusEdit"
            type="button"
            class="btn btn-dark btn-floating btn-sm"
          >
            <i class="fas fa-edit"></i>
            <span className="button_title">{t("editStatus")}</span>
          </button>
          <button
            className="bulk_action_button"
            title={t("editBillingCycle")}
            data-bs-toggle="modal"
            data-bs-target="#customerBillingCycle"
            type="button"
            class="btn btn-warning btn-floating btn-sm"
          >
            <i class="fas fa-edit"></i>
            <span className="button_title">{t("editBillingCycle")}</span>
          </button>
          <button
            className="bulk_action_button"
            title={t("automaticConnectionOff")}
            data-bs-toggle="modal"
            data-bs-target="#autoDisableEditModal"
            type="button"
            class="btn btn-primary btn-floating btn-sm"
          >
            <i class="fas fa-edit"></i>
            <span className="button_title">{t("automaticConnectionOff")}</span>
          </button>
          <button
            className="bulk_action_button"
            title={t("customerDelete")}
            data-bs-toggle="modal"
            data-bs-target="#bulkDeleteCustomer"
            type="button"
            class="btn btn-danger btn-floating btn-sm"
          >
            <i class="fas fa-trash-alt"></i>
            <span className="button_title">{t("customerDelete")}</span>
          </button>
        </div>
      )}
    </>
  );
}
