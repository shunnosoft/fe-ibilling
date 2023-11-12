import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArchiveFill,
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  CashStack,
  CurrencyDollar,
  FiletypeCsv,
  FilterCircle,
  GearFill,
  GeoAlt,
  PenFill,
  PencilSquare,
  PersonFill,
  PersonPlusFill,
  Phone,
  PrinterFill,
  QrCodeScan,
  ThreeDots,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Accordion, Card, Collapse } from "react-bootstrap";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";

// internal import
import "./hotspot.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import AddCustomer from "./customerOperation/AddCustomer";
import EditCustomer from "./customerOperation/EditCustomer";
import {
  deleteHotspotCustomer,
  getHotspotCustomer,
  getHotspotPackage,
} from "../../features/hotspotApi";
import { badge } from "../../components/common/Utils";
import Footer from "../../components/admin/footer/Footer";
import Table from "../../components/table/Table";
import DeleteCustomer from "./customerOperation/DeleteCustomer";
import RechargeCustomer from "./customerOperation/RechargeCustomer";
import CustomersNumber from "../Customer/CustomersNumber";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import Loader from "../../components/common/Loader";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { fetchMikrotik, getArea } from "../../features/apiCalls";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import FormatNumber from "../../components/common/NumberFormat";
import BulkCustomerDelete from "../Customer/customerCRUD/bulkOpration/BulkdeleteModal";
import BulkPaymentStatusEdit from "../Customer/customerCRUD/bulkOpration/BulkPaymentStatusEdit";
import BulkCustomerMessage from "../Customer/customerCRUD/bulkOpration/BulkCustomerMessage";
import HotspotCustomerReport from "./hotspotBulkOperation/modal/HotspotCustomerReport";
import CustomerDetails from "./customerOperation/CustomerDetails";
import PrintOptions from "../../components/common/PrintOptions";
import PublicHotspotCustomer from "./customerOperation/PublicHotspotCustomer";

const HotspotCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();

  // current date
  const date = new Date();

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  //get mikrotik
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [getCustomerLoading, setGetCustomerLoading] = useState(false);
  const [open, setOpen] = useState(false);

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

  // hotspot customer state
  const [hotspotCustomers, setHotspotCustomers] = useState([]);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // Single area state
  const [areaId, setAreaId] = useState("");

  // customer id state
  const [customerId, setCustomerId] = useState();

  // customer data state
  const [customerData, setCustomerData] = useState("");

  // mikrotik filter package
  const [filterPackage, setFilterPackage] = useState([]);

  // bulk customer state
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // bulk modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // filter options state
  const [filterOptions, setFilterOptions] = useState({
    area: "",
    subArea: "",
    status: "",
    paymentStatus: "",
    mikrotik: "",
    package: "",
    filterDate: null,
  });

  // customer get api call
  useEffect(() => {
    // get customer
    customer.length === 0 &&
      getHotspotCustomer(dispatch, ispOwnerId, setGetCustomerLoading);

    // fatch mikrotik
    mikrotiks.length === 0 && fetchMikrotik(dispatch, ispOwnerId, setIsLoading);

    // get hotspot api
    hotsPackage.length === 0 &&
      getHotspotPackage(dispatch, ispOwnerId, setIsLoading);

    // get area api
    if (areas.length === 0) getArea(dispatch, ispOwnerId, setIsLoading);

    // get sub area api
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwnerId);

    // bulletin api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  // set all customer in state
  useEffect(() => {
    setHotspotCustomers(customer);
  }, [customer]);

  // reload handler
  const reloadHandler = () => {
    getHotspotCustomer(dispatch, ispOwnerId, setGetCustomerLoading);
  };

  // select mikrotik filter & fetch mikrotik package
  const mikrotikHandler = (id) => {
    setFilterOptions({
      ...filterOptions,
      mikrotik: id,
    });

    const mikrotikPackage = hotsPackage.filter((val) => val.mikrotik === id);
    setFilterPackage(mikrotikPackage);
  };

  // hotspot customer filter handler
  const hotspotFilterHandler = () => {
    let tempCustomers = customer.reduce((acc, c) => {
      const { area, subArea, status, paymentStatus, mikrotik, filterDate } =
        filterOptions;

      // finds area all subareas
      let getSubarea = [];
      if (area) {
        getSubarea = subAreas.filter((val) => val.area === area);
      }

      // filter date
      const filterBillDate = new Date(
        moment(filterDate).format("YYYY-MM-DD")
      ).getTime();

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        area: area ? getSubarea.some((val) => val.id === c.subArea) : true,
        subArea: subArea ? subArea === c.subArea : true,
        status: status ? status === c.status : true,
        paymentStatus: paymentStatus ? paymentStatus === c.paymentStatus : true,
        mikrotik: mikrotik ? mikrotik === c.mikrotik : true,
        package: filterOptions.package
          ? filterOptions.package === c.hotspotPackage
          : true,
        filterDate: filterDate ? filterBillDate == c.billingCycle : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true
      let isPass = false;

      isPass = conditions["area"];
      if (!isPass) return acc;

      isPass = conditions["subArea"];
      if (!isPass) return acc;

      isPass = conditions["status"];
      if (!isPass) return acc;

      isPass = conditions["paymentStatus"];
      if (!isPass) return acc;

      isPass = conditions["mikrotik"];
      if (!isPass) return acc;

      isPass = conditions["package"];
      if (!isPass) return acc;

      isPass = conditions["filterDate"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer in customer state
    setHotspotCustomers(tempCustomers);
  };

  // filter reset controller
  const handleFilterReset = () => {
    setFilterPackage([]);
    setFilterOptions({
      area: "",
      subArea: "",
      status: "",
      paymentStatus: "",
      mikrotik: "",
      package: "",
      filterDate: null,
    });
    setHotspotCustomers(customer);
  };

  // filter input options
  const filterInputs = [
    {
      type: "select",
      name: "area",
      id: "area",
      value: filterOptions.area,
      isVisible: true,
      disable: false,
      options: areas,
      onChange: (e) => {
        setAreaId(e.target.value);
        setFilterOptions({
          ...filterOptions,
          area: e.target.value,
        });
      },
      firstOption: t("allArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "subarea",
      id: "subarea",
      value: filterOptions.subArea,
      isVisible: true,
      disable: false,
      options: subAreas.filter((item) => item?.area === areaId),
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      firstOption: t("subArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "status",
      id: "status",
      value: filterOptions.status,
      isVisible: true,
      disable: false,
      options: [
        { text: t("active"), value: "active" },
        { text: t("in active"), value: "inactive" },
        { text: t("expired"), value: "expired" },
      ],
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          status: e.target.value,
        });
      },
      firstOption: t("status"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      type: "select",
      name: "paymentStatus",
      id: "paymentStatus",
      value: filterOptions.paymentStatus,
      isVisible: true,
      disable: false,
      options: [
        { text: t("paid"), value: "paid" },
        { text: t("unpaid"), value: "unpaid" },
      ],
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          paymentStatus: e.target.value,
        });
      },
      firstOption: t("paymentStatus"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      type: "select",
      name: "mikrotik",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      isVisible: bpSettings?.hasMikrotik,
      disable: false,
      options: mikrotiks,
      onChange: (e) => {
        mikrotikHandler(e.target.value);
      },
      firstOption: t("mikrotik"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "package",
      id: "package",
      value: filterOptions.package,
      isVisible: true,
      disable: false,
      options: filterPackage,
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          package: e.target.value,
        });
      },
      firstOption: t("package"),
      textAccessor: "name",
      valueAccessor: "id",
    },
  ];

  //sum of all monthly fee and collection calculation
  const monthlySum = useMemo(() => {
    let totalMonthlyFee = 0;
    let totalCollection = 0;

    hotspotCustomers.map((item) => {
      totalMonthlyFee += item.monthlyFee;
      totalCollection += item.balance;
    });

    return { totalMonthlyFee, totalCollection };
  }, [hotspotCustomers]);

  //custom table header component
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {monthlySum?.totalMonthlyFee > 0 && (
        <div>
          {t("monthlyFee")}:-৳
          {FormatNumber(monthlySum.totalMonthlyFee)}
        </div>
      )}
      &nbsp;&nbsp;
      {monthlySum.totalCollection > 0 && (
        <div>
          {t("totalCollection")}:-৳
          {FormatNumber(monthlySum.totalCollection)}
        </div>
      )}
    </div>
  );

  const sortingCustomer = useMemo(() => {
    return [...customer].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [hotspotCustomers]);

  const tableData = useMemo(() => sortingCustomer, [hotspotCustomers]);

  // csv table header
  const customerForCsVHeader = [
    { label: "ID", key: "id" },
    { label: "customer_name", key: "name" },
    { label: "address", key: "customerAddress" },
    { label: "mobile", key: "mobile" },
    { label: "email", key: "email" },
    { label: "bandwidth", key: "package" },
    { label: "payment_status", key: "paymentStatus" },
    { label: "status", key: "status" },
    { label: "balance", key: "balance" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //export customer data
  let customerForCsV = useMemo(
    () =>
      tableData.map((customer) => {
        return {
          id: customer?.customerId,
          name: customer.name,
          customerAddress: customer.address || "",
          mobile: customer?.mobile || "",
          email: customer.email || "",
          package: customer?.hotspot.profile,
          paymentStatus: customer?.paymentStatus,
          status: customer?.status,
          balance: customer?.balance,
          monthlyFee: customer.monthlyFee,
          billingCycle: moment(customer.billingCycle).format("YYYY/MM/DD"),
        };
      }),
    [customer]
  );

  // find filter area and sub area
  const areaName = areas.find((val) => val.id === filterOptions.area)?.name;
  const subAreaName = subAreas.find(
    (val) => val.id === filterOptions.subArea
  )?.name;

  // filter data print
  const filterData = {
    area: areaName ? areaName : t("allArea"),
    subarea: subAreaName ? subAreaName : t("allSubArea"),
  };

  // customer day left filtering in current date
  const getCustomerDayLeft = (billDate) => {
    //current day
    const currentDay = new Date(
      new Date(moment(date).format("YYYY-MM-DD"))
    ).getTime();

    // // billing day
    const billDay = new Date(
      new Date(moment(billDate).format("YYYY-MM-DD"))
    ).getTime();

    const diffInMs = billDay - currentDay;

    // // bill day left
    const dayLeft = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    return dayLeft;
  };

  //column for table
  const columns = useMemo(
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
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "13%",
        Header: t("nameHp"),
        accessor: (data) => `${data?.name} ${data.hotspot?.name}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>{original.hotspot?.name}</p>
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
              <Phone className="text-info" />
              {original?.mobile}
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
        accessor: "hotspot.profile",
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
        Header: t("billDate"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
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
        width: "5%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center justify-content-center">
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
                    setCustomerId(original.id);
                    setModalStatus("profile");
                    setShow(true);
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
                    data-bs-target="#customerRecharge"
                    onClick={() => {
                      setCustomerId(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">{t("recharge")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(permission?.customerEdit || role === "ispOwner") && (
                  <li
                    onClick={() => {
                      setCustomerId(original.id);
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
                )}

                <li
                  onClick={() => {
                    setCustomerData(original);
                    setModalStatus("customerReport");
                    setShow(true);
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
                    data-bs-target="#hotsportCustomerDelete"
                    onClick={() => setCustomerId(original.id)}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {/* {original.mobile &&
                  (permission?.sendSMS || role !== "collector" ? (
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
                  ))} */}
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
                  <div>{t("customer")}</div>

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
                      {getCustomerLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={reloadHandler}
                        />
                      )}
                    </div>

                    <div>
                      {(permission?.customerAdd || role === "ispOwner") && (
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            title={t("newCustomer")}
                            onClick={() => {
                              setModalStatus("customerPost");
                              setShow(true);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="addAndSettingIcon">
                      <QrCodeScan
                        className="addcutmButton"
                        title={t("codeScan")}
                        onClick={() => {
                          setModalStatus("codeScan");
                          setShow(true);
                        }}
                      />
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            {((role === "manager" &&
                              permission?.customerEdit) ||
                              role === "ispOwner") && (
                              <div
                                className="addAndSettingIcon"
                                title={t("customerNumberUpdateOrDelete")}
                                onClick={() =>
                                  setNumberModalShow({
                                    ...numberModalShow,
                                    [false]: true,
                                  })
                                }
                              >
                                <PencilSquare className="addcutmButton" />
                              </div>
                            )}

                            {(permission?.viewCustomerList ||
                              role === "ispOwner") && (
                              <>
                                <CSVLink
                                  data={customerForCsV}
                                  filename={ispOwnerData.company}
                                  headers={customerForCsVHeader}
                                  title={t("customerReport")}
                                >
                                  <FiletypeCsv className="addcutmButton" />
                                </CSVLink>

                                <div className="addAndSettingIcon">
                                  <PrinterFill
                                    title={t("print")}
                                    className="addcutmButton"
                                    onClick={() => {
                                      setModalStatus("print");
                                      setShow(true);
                                    }}
                                  />
                                </div>
                              </>
                            )}
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
                {(permission?.viewCustomerList || role !== "collector") && (
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <div className="displayGrid6">
                            {filterInputs.map(
                              (item) =>
                                item.isVisible && (
                                  <select
                                    className="form-select shadow-none mt-0"
                                    onChange={item.onChange}
                                    value={item.value}
                                  >
                                    <option value="">{item.firstOption}</option>
                                    {item.options?.map((opt) => (
                                      <option value={opt[item.valueAccessor]}>
                                        {opt[item.textAccessor]}
                                      </option>
                                    ))}
                                  </select>
                                )
                            )}

                            <div>
                              <DatePicker
                                className="form-control mt-0"
                                selected={filterOptions.filterDate}
                                onChange={(date) =>
                                  setFilterOptions({
                                    ...filterOptions,
                                    filterDate: date,
                                  })
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText={t("selectDate")}
                              />
                            </div>

                            <div
                              id="customer_filter_button"
                              className="d-flex justify-content-end align-items-end mt-0 "
                            >
                              <button
                                className="btn btn-outline-primary w-6rem h-76"
                                type="button"
                                onClick={hotspotFilterHandler}
                                id="filterBtn"
                              >
                                {t("filter")}
                              </button>
                              <button
                                id="filter_reset"
                                className="btn btn-outline-secondary w-6rem h-76 ms-1 "
                                type="button"
                                onClick={handleFilterReset}
                              >
                                {t("reset")}
                              </button>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="collectorWrapper pb-2">
                      <Table
                        isLoading={getCustomerLoading}
                        customComponent={customComponent}
                        columns={columns}
                        data={hotspotCustomers}
                        bulkState={{
                          setBulkCustomer,
                        }}
                        bulkLength={bulkCustomers?.length}
                      ></Table>
                    </div>
                  </div>
                )}

                {(butPermission?.customer || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* modal start */}

      {modalStatus === "profile" && (
        <CustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      )}

      {/* hotspot customer post modal */}
      {modalStatus === "customerPost" && (
        <AddCustomer show={show} setShow={setShow} />
      )}

      {/* hotspot customer update modal */}
      {modalStatus === "customerEdit" && (
        <EditCustomer show={show} setShow={setShow} customerId={customerId} />
      )}

      {/* single customer delete modal */}
      <DeleteCustomer
        customerId={customerId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
      />

      {/* customer recharge modal */}
      <RechargeCustomer customerId={customerId} />

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* single customer recharge report */}
      {modalStatus === "customerReport" && (
        <HotspotCustomerReport
          show={show}
          setShow={setShow}
          customerData={customerData}
        />
      )}

      {/* customer Qr Code scanning can be done in hotspot account */}
      {modalStatus === "codeScan" && (
        <PublicHotspotCustomer
          show={show}
          setShow={setShow}
          ispData={ispOwnerData}
        />
      )}

      {/* print option modal */}
      {modalStatus === "print" && (
        <PrintOptions
          show={show}
          setShow={setShow}
          filterData={filterData}
          tableData={tableData}
          page={"customer"}
        />
      )}

      {/* modal end */}

      {/* bulk modal start */}
      {bpSettings.hasMikrotik && (
        <>
          {modalStatus === "modalStatusEdit" && (
            <modalStatusEdit
              bulkCustomer={bulkCustomers}
              show={show}
              setShow={setShow}
              modalStatus="hotspot"
            />
          )}
        </>
      )}

      {modalStatus === "bulkPaymentStatusEdit" && (
        <BulkPaymentStatusEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
          modalStatus="hotspot"
        />
      )}

      {modalStatus === "bulkDeleteCustomer" && (
        <BulkCustomerDelete
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
          status="hotspot"
        />
      )}

      {modalStatus === "bulkMessage" && (
        <BulkCustomerMessage
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {/* bulk modal end */}

      {bulkCustomers.length > 0 && (
        <div className="client_wraper2">
          <div
            className={`settings_wraper2 ${
              isMenuOpen ? "show-menu2" : "hide-menu2"
            }`}
          >
            <ul className="client_service_list2 ps-0">
              {/* {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
                (bpSettings?.bulkAreaEdit &&
                  permission?.bulkAreaEdit &&
                  role !== "collector")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("customerAreaEdit");
                    setShow(true);
                  }}
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
              {((role === "ispOwner" && bpSettings?.updateCustomerBalance) ||
                (bpSettings?.updateCustomerBalance &&
                  permission?.updateCustomerBalance &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("customerBalanceEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                      title={t("editBalance")}
                    >
                      <i className="fas fa-dollar fa-xs "></i>
                      <span className="button_title">{t("editBalance")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBalance")}</div>
                </li>
              )} */}

              <hr className="mt-0 mb-0" />

              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" && bpSettings?.modalStatusEdit) ||
                  (bpSettings?.modalStatusEdit &&
                    permission?.modalStatusEdit &&
                    role === "manager") ||
                  (role === "collector" &&
                    bpSettings.modalStatusEdit &&
                    permission.modalStatusEdit)) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setModalStatus("modalStatusEdit");
                      setShow(true);
                    }}
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

              {((role === "ispOwner" && bpSettings?.bulkPaymentStatusEdit) ||
                (bpSettings?.bulkPaymentStatusEdit &&
                  permission?.bulkPaymentStatusEdit &&
                  role === "manager") ||
                (role === "collector" &&
                  bpSettings.bulkPaymentStatusEdit &&
                  permission.bulkPaymentStatusEdit)) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkPaymentStatusEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("editPaymentStatus")}
                    >
                      <i className="fas fa-edit fa-xs  "></i>
                      <span className="button_title">
                        {t("editPaymentStatus")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editPaymentStatus")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {((role === "ispOwner" && bpSettings?.bulkMessage) ||
                (bpSettings?.bulkMessage &&
                  permission?.bulkMessage &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkMessage");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-success"
                      title={t("bulkMessage")}
                    >
                      <i class="fa-regular fa-envelope"></i>

                      <span className="button_title">{t("bulkMessage")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("bulkMessage")}</div>
                </li>
              )}

              {/*   <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkBillingCycleEdit) ||
                (bpSettings?.bulkBillingCycleEdit &&
                  permission?.bulkBillingCycleEdit &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("customerBillingCycle");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-secondary"
                      title={t("editBillingCycle")}
                    >
                      <i class="far fa-calendar-alt fa-xs"></i>
                      <span className="button_title">
                        {t("editBillingCycle")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBillingCycle")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkPromiseDateEdit) ||
                (bpSettings?.bulkPromiseDateEdit &&
                  permission?.bulkPromiseDateEdit &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkPromiseDateEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-success"
                      title={t("editPromiseDate")}
                    >
                      <i class="fas fa-calendar-week fa-xs"></i>
                      <span className="button_title">
                        {t("editPromiseDate")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editPromiseDate")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkAutoDisableEdit) ||
                (bpSettings?.bulkAutoDisableEdit &&
                  permission?.bulkAutoDisableEdit &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("autoDisableEditModal");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-secondary"
                      title={t("automaticConnectionOff")}
                    >
                      <i class="fas fa-power-off fa-xs"></i>
                      <span className="button_title">
                        {t("automaticConnectionOff")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">
                    {t("automaticConnectionOff")}
                  </div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" &&
                  bpSettings?.bulkCustomerMikrotikUpdate) ||
                  (bpSettings?.bulkCustomerMikrotikUpdate &&
                    permission?.bulkCustomerMikrotikUpdate &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setModalStatus("bulkMikrotikEdit");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                        title={t("changeMikrotik")}
                      >
                        <i class="fas fa-server fa-xs"></i>
                        <span className="button_title">
                          {t("changeMikrotik")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">{t("changeMikrotik")}</div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" && bpSettings?.bulkPackageEdit) ||
                  (bpSettings?.bulkPackageEdit &&
                    permission?.bulkPackageEdit &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setModalStatus("bulkPackageEdit");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                        title={t("updatePackage")}
                      >
                        <i class="fas fa-wifi fa-xs"></i>
                        <span className="button_title">
                          {t("updatePackage")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">{t("updatePackage")}</div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" && bpSettings?.bulkCustomerRecharge) ||
                  (bpSettings?.bulkCustomerRecharge &&
                    permission?.bulkCustomerRecharge &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setModalStatus("bulkRecharge");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                        title={t("bulkRecharge")}
                      >
                        <i className="fas fa-dollar fa-xs "></i>
                        <span className="button_title">
                          {t("bulkRecharge")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">{t("bulkRecharge")}</div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkTransferToReseller) ||
                (bpSettings?.bulkTransferToReseller &&
                  permission?.bulkTransferToReseller &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkTransferToReseller");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("transferReseller")}
                    >
                      <i className="fa-solid fa-right-left fa-xs "></i>
                      <span className="button_title">
                        {t("transferReseller")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("transferReseller")}</div>
                </li>
              )}*/}

              <hr className="mt-0 mb-0" />

              {((role === "ispOwner" && bpSettings?.bulkCustomerDelete) ||
                (bpSettings?.bulkCustomerDelete &&
                  permission?.bulkCustomerDelete &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkDeleteCustomer");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                      title={t("customerDelete")}
                    >
                      <i className="fas fa-trash-alt fa-xs "></i>
                      <span className="button_title">
                        {t("customerDelete")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("customerDelete")}</div>
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
    </>
  );
};

export default HotspotCustomer;
