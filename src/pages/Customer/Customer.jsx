import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArchiveFill,
  ArrowClockwise,
  ArrowRightSquareFill,
  CashStack,
  ChatText,
  FileExcelFill,
  PenFill,
  PersonFill,
  PersonPlusFill,
  PrinterFill,
  ThreeDots,
  Wallet,
} from "react-bootstrap-icons";
import Table from "../../components/table/Table";

import { CSVLink } from "react-csv";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { badge } from "../../components/common/Utils";
import ReactToPrint from "react-to-print";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import {
  fetchMikrotik,
  getArea,
  getCustomer,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import CustomerEdit from "./customerCRUD/CustomerEdit";
import CustomerReport from "./customerCRUD/showCustomerReport";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import TransferToReseller from "./customerCRUD/TransferToReseller";
import BulkSubAreaEdit from "./customerCRUD/bulkOpration/bulkSubAreaEdit";
import BulkBillingCycleEdit from "./customerCRUD/bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "./customerCRUD/bulkOpration/bulkStatusEdit";
import BulkCustomerDelete from "./customerCRUD/bulkOpration/BulkdeleteModal";
import BulkAutoConnectionEdit from "./customerCRUD/bulkOpration/bulkAutoConnectionEdit";
import BulkCustomerTransfer from "./customerCRUD/bulkOpration/bulkCustomerTransfer";
import CustomerDelete from "./customerCRUD/CustomerDelete";
import {
  printOptionDataBangla,
  printOptionDataEng,
} from "./customerCRUD/printOptionData";
import apiLink from "../../api/apiLink";
import DatePicker from "react-datepicker";
import PrintCustomer from "./customerPDF";
import { Button, Modal } from "react-bootstrap";
import FormatNumber from "../../components/common/NumberFormat";
import { useCallback } from "react";

const PPPOECustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();

  // get all customer
  const customers = useSelector((state) => state.customer.customer);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get bp setting permisson
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.userData.bpSettings
  );

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  //get mikrotik
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  //get collector areas
  const collectorSubAreas = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth?.currentUser?.collector?.areas
      : []
  );

  //without mikrotik packages
  const withOutMikrotikPackages = useSelector(
    (state) => state.package.packages
  );

  //component states
  const [loading, setLoading] = useState(false);

  // customer loading state
  const [customerLoading, setCustomerLoading] = useState(false);

  // customer state
  const [pppoeCustomers, setPPPoeCustomers] = useState([]);

  // bulk customer state
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // customer id state
  const [customerId, setCustomerId] = useState("");

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // single customer object state
  const [customerData, setCustomerData] = useState({});

  // state for select print option print
  const [printOption, setPrintOptions] = useState([]);

  // print modal state
  const [modalShow, setModalShow] = useState(false);

  // Single area state
  const [areaId, setAreaId] = useState("");

  // sub area state
  const [subAreaId, setSubAreaId] = useState("");

  // mikrotik package state
  const [mikrotikPackages, setMikrotikPackages] = useState([]);

  //collector area
  const [collectorAreas, setCollectorAreas] = useState([]);

  //filter state
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
  console.log(filterOptions);

  //initial api calls
  useEffect(() => {
    // get mikrotik api without mikrotik / has mikrotik
    if (!bpSettings?.hasMikrotik) {
      getPackagewithoutmikrotik(ispOwner, dispatch, setLoading);
    } else {
      if (mikrotiks.length === 0) fetchMikrotik(dispatch, ispOwner, setLoading);
    }

    // get area api
    if (areas.length === 0) getArea(dispatch, ispOwner, setLoading);

    // get sub area api
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwner);

    // get customer api
    if (customers.length === 0)
      getCustomer(dispatch, ispOwner, setCustomerLoading);

    // set initial state for print oprions
    const lang = localStorage.getItem("netFee:lang");
    if (lang === "en") {
      setPrintOptions(printOptionDataEng);
      return;
    }

    setPrintOptions(printOptionDataBangla);
  }, []);

  // set all customer in state
  useEffect(() => {
    setPPPoeCustomers(customers);
  }, [customers]);

  //collector area state update
  useEffect(() => {
    if (role === "collector") {
      //loop over areas
      const tempCollectorAreas = areas.filter((item) => {
        return collectorSubAreas.some((subArea) => {
          return item.subAreas.some((s) => s.id === subArea);
        });
      });
      //update the collector area state
      setCollectorAreas(tempCollectorAreas);
    }
  }, [collectorSubAreas, areas, subAreas]);

  //get single customer from user action
  const getSpecificCustomer = (customerId) => {
    setCustomerId(customerId);
  };

  // customer delete controller
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    setCustomerId(customerId);
  };

  // mikrotik handler method
  const mikrotikHandler = async (id) => {
    setFilterOption({
      ...filterOptions,
      mikrotik: id,
    });
    if (!id) {
      setMikrotikPackages([]);
    }
    if (id) {
      try {
        const res = await apiLink.get(`/mikrotik/ppp/package/${id}`);
        setMikrotikPackages(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // reload handler
  const reloadHandler = () => {
    getCustomer(dispatch, ispOwner, setCustomerLoading);
  };

  // filter and filter reset
  const handleActiveFilter = () => {
    let filterLoading = true;
    let tempCustomers = [...customers];

    // distructured filterd value
    const {
      status,
      paymentStatus,
      area,
      subArea,
      mikrotik,
      freeUser,
      filterDate,
      dayFilter,
    } = filterOptions;

    // initial filter customer
    let filteredCustomer = [];

    // check filterd value
    if (
      status ||
      paymentStatus ||
      area ||
      subArea ||
      mikrotik ||
      freeUser ||
      filterDate ||
      dayFilter ||
      filterOptions.package
    ) {
      console.log("hello");
      filteredCustomer = tempCustomers.filter((customer) => {
        let isFound = false;

        //filter by area
        if (filterOptions.area) {
          const getArea = areas.find((item) => item.id === filterOptions.area);
          if (getArea.subAreas.some((item) => item.id === customer.subArea)) {
            isFound = true;
          } else {
            return false;
          }
        }

        // filter by subarea
        if (filterOptions.subArea) {
          if (customer.subArea === filterOptions.subArea) {
            isFound = true;
          } else {
            return false;
          }
        }

        // free user filter
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

        // status filter active/incative
        if (filterOptions.status) {
          if (customer.status === filterOptions.status) {
            isFound = true;
          } else {
            return false;
          }
        }

        // payment status filter
        if (filterOptions.paymentStatus) {
          if (customer.paymentStatus === filterOptions.paymentStatus) {
            isFound = true;
          } else {
            return false;
          }
        }

        // filter by mikrotik
        if (filterOptions.mikrotik) {
          if (customer.mikrotik === filterOptions.mikrotik) {
            isFound = true;
          } else {
            return false;
          }
        }

        // filter using mikrotik package
        if (filterOptions.package) {
          if (customer.mikrotikPackage === filterOptions.package) {
            isFound = true;
          } else {
            return false;
          }
        }
        // filter by billing cycle
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

        // bill date  filter
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
      // set filter customer in customer state
      setPPPoeCustomers(filteredCustomer);
    } else {
      setPPPoeCustomers(customers);
    }

    filterLoading = false;
  };

  // filter reset controller
  const handleFilterReset = () => {
    setMikrotikPackages([]);
    setFilterOption({
      status: "",
      paymentStatus: "",
      area: "",
      subArea: "",
      package: "",
      isFree: "",
      filterDate: null,
    });
    setPPPoeCustomers(customers);
  };

  //total monthly fee and due calculation
  const dueMonthlyFee = useCallback(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    pppoeCustomers.map((item) => {
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
  }, [pppoeCustomers]);

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {t("monthlyFee")}&nbsp; {FormatNumber(dueMonthlyFee().totalMonthlyFee)}
      {t("tk")} &nbsp;&nbsp; {t("due")}&nbsp;
      {FormatNumber(dueMonthlyFee().totalSumDue)} &nbsp;{t("tk")} &nbsp;
      {/* {t("collection")}&nbsp;{" "} */}
      {/* {FormatNumber(Number(sumMonthlyFee()) - Number(dueMonthlyFee()))} &nbsp;
      {t("tk")} */}
    </div>
  );

  //print option controller
  const printOptionsController = ({ target }) => {
    if (target.value === "default" && target.checked) {
      setPrintOptions(
        printOption.map((item) => {
          return { ...item, checked: true };
        })
      );
    } else {
      const updatedState = printOption.map((item) => {
        if (item.value === target.value) {
          item.checked = target.checked;
        }
        return item;
      });
      setPrintOptions(updatedState);
    }
  };

  //print modal controller
  const printModalController = (customerID) => {
    setModalShow(true);
  };

  //column for table
  const columns = useMemo(
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
        Cell: ({ row: { original } }) => (
          <div
            style={{ cursor: "move" }}
            data-toggle="tooltip"
            data-placement="top"
            title={original.address}
          >
            {original.name}
          </div>
        ),
      },
      {
        width: "9%",
        Header: t("PPPoE"),
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
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "6%",
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

                {(permission?.customerEdit || role === "ispOwner") && (
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

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#showCustomerReport"
                  onClick={() => {
                    setCustomerData(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("report")}</p>
                    </div>
                  </div>
                </li>

                {(permission?.customerDelete || role === "ispOwner") && (
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
                {role === "ispOwner" && ispOwnerData.bpSettings.hasReseller && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#transferToReseller"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArrowRightSquareFill />
                        <p className="actionP">{t("transferReseller")}</p>
                      </div>
                    </div>
                  </li>
                )}
                {/* {(role === "ispOwner" || role === "manager") &&
                  ispOwnerData.bpSettings.hasMikrotik && (
                    <li onClick={() => bandwidthModalController(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <ArrowRightSquareFill />
                          <p className="actionP">{t("bandwidth")}</p>
                        </div>
                      </div>
                    </li>
                  )} */}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  //export customer data
  let customerForCsV = customers.map((customer) => {
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

  // csv header
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
  let customerForCsVTableInfo = customers.map((customer) => {
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

  // csv table header
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

  // filter value for pdf
  let filterData = {};
  if (modalShow) {
    let area, subArea, customerStatus, customerPaymentStatus;

    // area
    if (filterOptions.area) {
      area = areas.find((item) => item.id === filterOptions.area);
    }

    // subarea
    if (filterOptions.subArea) {
      subArea = subAreas.find((item) => item.id === filterOptions.subArea);
    }

    // status
    if (filterOptions.status) {
      if (filterOptions.status === "active") {
        customerStatus = t("active");
      } else if (filterOptions.status === "inactive") {
        customerStatus = t("in active");
      }
    }

    // payment status
    if (filterOptions.paymentStatus) {
      if (filterOptions.paymentStatus === "unpaid") {
        customerPaymentStatus = t("due");
      } else if (filterOptions.paymentStatus === "paid") {
        customerPaymentStatus = t("paid");
      } else if (filterOptions.paymentStatus === "expired") {
        customerPaymentStatus = t("expired");
      }
    }

    // set filter value in pdf
    filterData = {
      area: area?.name ? area?.name : t("allArea"),
      subArea: subArea?.name ? subArea.name : t("allSubArea"),
      status: customerStatus ? customerStatus : t("sokolCustomer"),
      payment: customerPaymentStatus
        ? customerPaymentStatus
        : t("sokolCustomer"),
    };
  }
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
                    <h2>{t("customer")}</h2>
                    <div className="reloadBtn">
                      {customerLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise onClick={reloadHandler} />
                      )}
                    </div>
                  </div>
                  {/* customer page header area  */}
                  {(permission?.customerAdd || role === "ispOwner") && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
                        <PrinterFill
                          title={t("print")}
                          className="addcutmButton"
                          onClick={printModalController}
                        />
                      </div>

                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
                          title={t("newCustomer")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      <div className="d-flex flex-wrap">
                        {/* area filter  */}
                        <select
                          className="form-select mt-3"
                          onChange={(e) => {
                            setAreaId(e.target.value);
                            setFilterOption({
                              ...filterOptions,
                              area: e.target.value,
                            });
                          }}
                        >
                          <option value="" selected={filterOptions.area === ""}>
                            {t("allArea")}
                          </option>
                          {customers.some(
                            (customer) => customer.area === "noArea"
                          ) && (
                            <option
                              value=""
                              selected={filterOptions.area === "noArea"}
                            >
                              {t("customerWithoutArea")}
                            </option>
                          )}
                          {(role === "collector" ? collectorAreas : areas)?.map(
                            (area, key) => {
                              return (
                                <option
                                  selected={filterOptions.area === area?.id}
                                  key={key}
                                  value={area?.id}
                                >
                                  {area?.name}
                                </option>
                              );
                            }
                          )}
                        </select>
                        {/* sub area filter  */}
                        <select
                          className="form-select mt-3"
                          onChange={(e) => {
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
                          {subAreas?.map(
                            (item, key) =>
                              item.area?.id === areaId && (
                                <option
                                  selected={filterOptions.subArea === item?.id}
                                  key={key}
                                  value={item?.id}
                                >
                                  {item.name}
                                </option>
                              )
                          )}
                        </select>
                        {/* status filter  */}
                        <select
                          className="form-select mt-3"
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

                        {/* payment status filter  */}
                        <select
                          className="form-select mt-3"
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
                          //filter by mikrotik
                          <select
                            className="form-select mt-3"
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
                        {bpSettings?.hasMikrotik ? (
                          //package filter with mikrotik
                          <select
                            className="form-select mt-3"
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

                            {mikrotikPackages?.map((m, i) => {
                              return (
                                <option
                                  key={i}
                                  selected={filterOptions.package === `${m.id}`}
                                  value={m.id}
                                >
                                  {m.name}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          //without mikrotik package filter
                          <select
                            className="form-select mt-3"
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

                            {withOutMikrotikPackages?.map((m, i) => {
                              return (
                                <option
                                  key={i}
                                  selected={filterOptions.package === `${m.id}`}
                                  value={m.id}
                                >
                                  {m.name}
                                </option>
                              );
                            })}
                          </select>
                        )}

                        {/* free/non-free customer filter */}
                        <select
                          onChange={(e) =>
                            setFilterOption({
                              ...filterOptions,
                              freeUser: e.target.value,
                            })
                          }
                          className="form-select  mt-3"
                        >
                          <option selected={!filterOptions.freeUser} value="">
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

                        {/*how many day left from  bill date select*/}
                        <select
                          className="form-select mt-3"
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
                          <option value="7">{t("sevenDayLeft")}</option>
                        </select>
                        {/* date picker for filter billing cycle */}
                        <div className="mt-3" style={{ width: "200px" }}>
                          <DatePicker
                            className="form-control"
                            selected={filterOptions.filterDate}
                            onChange={(date) =>
                              setFilterOption({
                                ...filterOptions,
                                filterDate: date,
                              })
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText={t("selectDate")}
                          />
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-primary mt-3 w-6rem ms-2"
                            type="button"
                            onClick={handleActiveFilter}
                            id="filterBtn"
                          >
                            {t("filter")}
                          </button>
                          <button
                            className="btn btn-outline-secondary ms-1 w-6rem mt-3"
                            type="button"
                            onClick={handleFilterReset}
                          >
                            {t("reset")}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="table-section">
                      <Table
                        customComponent={customComponent}
                        isLoading={customerLoading}
                        columns={columns}
                        data={pppoeCustomers}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    </div>
                  </div>
                </div>

                {/* print component table  */}
                <div style={{ display: "none" }}>
                  <PrintCustomer
                    filterData={filterData}
                    currentCustomers={pppoeCustomers}
                    ref={componentRef}
                    printOptions={printOption}
                  />
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
      {/* all modal */}
      {/* customer create modal  */}
      <CustomerPost />

      {/* customer edit modal  */}
      <CustomerEdit single={customerId} />

      {/* bill collection modal  */}
      <CustomerBillCollect single={customerId} />

      {/* customer details modal  */}
      <CustomerDetails single={customerId} />

      {/* customer report modal  */}
      <CustomerReport single={customerData} />

      {/* customer delete modal  */}
      <CustomerDelete
        single={customerId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
      />

      {/* single message send modal  */}
      <SingleMessage single={customerId} sendCustomer="customer" />

      {/* transferReseller modal */}
      <TransferToReseller customerId={customerId} />

      {/* bulk Modal */}
      <BulkSubAreaEdit
        bulkCustomer={bulkCustomers}
        modalId="customerBulkEdit"
      />
      <BulkBillingCycleEdit
        bulkCustomer={bulkCustomers}
        modalId="customerBillingCycle"
      />

      <BulkStatusEdit bulkCustomer={bulkCustomers} modalId="bulkStatusEdit" />
      <BulkCustomerDelete
        bulkCustomer={bulkCustomers}
        modalId="bulkDeleteCustomer"
      />
      <BulkAutoConnectionEdit
        bulkCustomer={bulkCustomers}
        modalId="autoDisableEditModal"
      />
      <BulkCustomerTransfer
        bulkCustomer={bulkCustomers}
        modalId="bulkTransferToReseller"
      />
      {/* <BandwidthModal
                modalShow={modalShow}
                setModalShow={setModalShow}
                customerId={singleCustomer}
              /> */}
      {bulkCustomers.length > 0 && (
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
            <span className="button_title"> {t("editStatus")}</span>
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
            <span className="button_title"> {t("editBillingCycle")} </span>
          </button>
          <button
            className="bulk_action_button"
            title={t("autoConnectOnOff")}
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
            title={t("transferReseller")}
            data-bs-toggle="modal"
            data-bs-target="#bulkTransferToReseller"
            type="button"
            class="btn btn-info btn-floating btn-sm"
          >
            <i class="fa-solid fa-right-left"></i>
            <span className="button_title"> {t("transferReseller")} </span>
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
            <span className="button_title"> {t("customerDelete")} </span>
          </button>
        </div>
      )}

      {/* print option modal */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="customerBandWidth"
      >
        <Modal.Header closeButton>
          <Modal.Title id="customerBandWidth"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container d-flex align-items-center justify-content-between">
            <div className="select-options">
              {printOption.map((item) => (
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={item.id}
                    value={item.value}
                    checked={item.checked}
                    onChange={printOptionsController}
                  />
                  <label htmlFor={item.id} className="form-check-label">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="default-option">
              <div className="form-check d-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="default-print-option"
                  value="default"
                  onChange={printOptionsController}
                  checked={printOption.every((item) => item.checked)}
                />
                <label
                  htmlFor="default-print-option"
                  className="form-check-label"
                >
                  Set Default
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
          <ReactToPrint
            documentTitle="গ্রাহক লিস্ট"
            trigger={() => (
              <Button onClick={() => setModalShow(false)} variant="primary">
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PPPOECustomer;
