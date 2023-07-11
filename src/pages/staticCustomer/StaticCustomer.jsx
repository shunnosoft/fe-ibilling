import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "../collector/collector.css";
import moment from "moment";
import { CSVLink } from "react-csv";

import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
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
  CurrencyDollar,
  KeyFill,
  CardChecklist,
  Newspaper,
  ArrowRightSquareFill,
  ReceiptCutoff,
  GearFill,
  Boxes,
  FilterCircle,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
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
  getCollector,
  getManger,
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
import BulkPromiseDateEdit from "../Customer/customerCRUD/bulkOpration/BulkPromiseDateEdit";
import BulkStatusEdit from "../Customer/customerCRUD/bulkOpration/bulkStatusEdit";
import BulkCustomerDelete from "../Customer/customerCRUD/bulkOpration/BulkdeleteModal";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import { useTranslation } from "react-i18next";
import BulkAutoConnectionEdit from "../Customer/customerCRUD/bulkOpration/bulkAutoConnectionEdit";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import CustomerNote from "./customerCRUD/CustomerNote";
import CreateSupportTicket from "../../components/modals/CreateSupportTicket";
import BulkCustomerTransfer from "../Customer/customerCRUD/bulkOpration/bulkCustomerTransfer";
import TransferToReseller from "./customerCRUD/TransferToReseller";
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import FireWallFilterIpDropControl from "./FireWallFilterIpDropControl";
import CustomersNumber from "../Customer/CustomersNumber";
import BulkMikrotikEdit from "../Customer/customerCRUD/bulkOpration/bulkMikrotikEdit";
import BulkBalanceEdit from "../Customer/customerCRUD/bulkOpration/BulkBalanceEdit";
import BulkPackageEdit from "../Customer/customerCRUD/bulkOpration/bulkPackageEdit";
import BulkRecharge from "../Customer/customerCRUD/bulkOpration/BulkRecharge";
import StaticCreateInvoice from "./StaticCreateInvoice";
import { Accordion } from "react-bootstrap";

export default function Customer() {
  //call hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get data from redux store
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);
  // user id state
  const [userId, setUserId] = useState();
  const componentRef = useRef(); //reference of pdf export component
  const cus = useSelector((state) => state?.customer?.staticCustomer);
  const collectors = useSelector((state) => state?.collector?.collector);
  const manager = useSelector((state) => state.manager?.manager);

  const role = useSelector((state) => state.persistedReducer.auth?.role);
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData.permissions
  );
  const allareas = useSelector((state) => state?.area?.area);
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth?.currentUser?.collector?.areas
      : []
  );

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //declare local state
  const [isLoading, setIsloading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [show, setShow] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  const [cusSearch, setCusSearch] = useState("");

  const [mikrotikPac, setMikrotikPac] = useState([]);
  const [Customers1, setCustomers1] = useState([]);
  const [Customers2, setCustomers2] = useState([]);

  // set customer id in state for note
  const [customerNoteId, setCustomerNoteId] = useState();

  // set customer name state
  const [customerName, setCustomerName] = useState("");

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
    changedPromiseDate: "",
  });

  const [Customers, setCustomers] = useState(cus);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  const [singleData, setSingleData] = useState();
  const [customerData, setCustomerData] = useState({});

  const [allArea, setAreas] = useState([]);

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

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

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    // const singleData = cus?.find((item) => item.id === customerId);
    setSingleData(customerId);
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

    if (cus.length === 0)
      getStaticCustomer(dispatch, ispOwner, setCustomerLoading);
  }, [dispatch, ispOwner, role, bpSettings]);

  const [subAreaIds, setSubArea] = useState([]);
  const [singleArea, setArea] = useState({});
  const [subAreas, setSubAreas] = useState([]);

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    const allSub = storeSubArea.filter((val) => val.area === area.id);
    setSubAreas(allSub);
    setArea(area);
    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];

      area?.subAreas.map((sub) => subAreaIds.push(sub));

      setSubArea(subAreaIds);
    }
  };

  useEffect(() => {
    const temp = [];
    cus.map((customer) => {
      let areaFound = false;
      allareas.map((area) => {
        area.subAreas.map((sub) => {
          if (customer.subArea === sub) {
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
    // get sub area api
    getSubAreasApi(dispatch, ispOwner);
    getPoleBoxApi(dispatch, ispOwner, setIsloading);

    if (role !== "collector") {
      if (collectors.length === 0)
        getCollector(dispatch, ispOwner, setIsloading);

      role === "ispOwner" && getManger(dispatch, ispOwner);
    }
  }, []);

  const handleActiveFilter = () => {
    let tempCustomers = Customers2.reduce((acc, c) => {
      const {
        area,
        subArea,
        status,
        mikrotik,
        paymentStatus,
        freeUser,
        filterDate,
        dayFilter,
        changedPromiseDate,
      } = filterOptions;

      const billingCycle = new Date(
        moment(c.billingCycle).format("YYYY-MM-DD")
      ).getTime();

      const promiseDate = new Date(
        moment(c.promiseDate).format("YYYY-MM-DD")
      ).getTime();

      let today = new Date();
      let lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getTime();

      const todayDate = new Date(
        moment(new Date()).format("YYYY-MM-DD")
      ).getTime();

      const filterDateData = new Date(
        moment(filterOptions.filterDate).format("YYYY-MM-DD")
      ).getTime();

      let getArea = [];
      if (area) {
        getArea = allareas.find((item) => item.id === area);
      }

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        area: area ? getArea.subAreas.some((item) => item === c.subArea) : true,
        subArea: subArea ? c.subArea === subArea : true,
        status: status ? c.status === status : true,
        paid: paymentStatus ? c.paymentStatus === "paid" : true,
        unpaid: paymentStatus
          ? c.paymentStatus === "unpaid" && c.monthlyFee !== 0
          : true,
        free: paymentStatus ? c.monthlyFee === 0 : true,
        partial: paymentStatus
          ? c.paymentStatus === "unpaid" &&
            c.monthlyFee > c.balance &&
            c.balance > 0
          : true,
        advance: paymentStatus
          ? c.monthlyFee <= c.balance && c.monthlyFee > 0
          : true,
        overdue: paymentStatus
          ? c.paymentStatus === "unpaid" && c.balance < 0
          : true,
        mikrotik: mikrotik ? c.mikrotik === mikrotik : true,
        freeUser: freeUser ? c.monthlyFee === 0 : true,
        nonFreeUser: freeUser ? c.monthlyFee !== 0 : true,
        prepaid: freeUser ? c.customerBillingType === "prepaid" : true,
        postpaid: freeUser ? c.customerBillingType === "postpaid" : true,
        package: filterOptions.package
          ? c.mikrotikPackage === filterOptions.package
          : true,
        filterDate: filterDate ? billingCycle == filterDateData : true,
        dayFilter: dayFilter
          ? moment(c.billingCycle).diff(moment(), "days") ===
            Number(filterOptions.dayFilter)
          : true,
        changedPromiseDate: changedPromiseDate
          ? billingCycle == todayDate &&
            billingCycle < promiseDate &&
            promiseDate < lastDayOfMonth
          : true,
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

      if (paymentStatus) {
        isPass = conditions[paymentStatus];
        if (!isPass) return acc;
      }

      isPass = conditions["mikrotik"];
      if (!isPass) return acc;

      if (freeUser) {
        isPass = conditions[freeUser];
        if (!isPass) return acc;
      }

      isPass = conditions["package"];
      if (!isPass) return acc;

      isPass = conditions["filterDate"];
      if (!isPass) return acc;

      isPass = conditions["dayFilter"];
      if (!isPass) return acc;

      isPass = conditions["changedPromiseDate"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer in customer state
    setCustomers1(tempCustomers);
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
    setCustomers1(cus);
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
            : field.userType === "core-queue"
            ? field.queue.srcAddress
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
        Header: t("monthly"),
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
                      getSpecificCustomerReport(original);
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

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerNote"
                  onClick={() => {
                    setCustomerNoteId(original.id);
                    setCustomerName(original?.name);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CardChecklist />
                      <p className="actionP">{t("note")}</p>
                    </div>
                  </div>
                </li>

                {(role === "ispOwner" || permission.customerDelete) && (
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
                )}

                {original.mobile &&
                  (role === "ispOwner" || permission.sendSMS) && (
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

                {role === "ispOwner" &&
                  ispOwnerData?.bpSettings?.hasReseller && (
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

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#createSupportTicket"
                  onClick={() => {
                    getSpecificCustomer(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <Newspaper />
                      <p className="actionP">{t("supportTicket")}</p>
                    </div>
                  </div>
                </li>
                {role === "ispOwner" && original.mobile && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#resetPassword"
                    onClick={() => {
                      setUserId(original.user);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <KeyFill />
                        <p className="actionP">{t("passwordReset")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {((role === "ispOwner" && bpSettings?.customerInvoice) ||
                  (role === "manager" && permission?.customerInvoice)) &&
                (!(original?.monthlyFee <= original?.balance) ||
                  original?.paymentStatus !== "paid") ? (
                  <li
                    onClick={() => {
                      setShow(true);
                      getSpecificCustomer(original.id);
                      setCustomerData(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">{t("invoice")}</p>
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

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    Customers1.map((item) => {
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
  }, [Customers1]);

  //custom table header component
  const customComponent = (
    <div>
      {dueMonthlyFee?.totalMonthlyFee > 0 < dueMonthlyFee?.totalSumDue && (
        <div
          className="text-center"
          style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
        >
          {dueMonthlyFee?.totalMonthlyFee > 0 && t("monthlyFee")}:-৳
          {FormatNumber(dueMonthlyFee.totalMonthlyFee)}
          &nbsp;&nbsp; {dueMonthlyFee.totalSumDue > 0 && t("due")}:-৳
          {FormatNumber(dueMonthlyFee.totalSumDue)}
        </div>
      )}
    </div>
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
                    <h2> {t("staticCustomer")}</h2>
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

                      {role === "ispOwner" && bpSettings?.hasMikrotik && (
                        <div className="settingbtn">
                          <Link to={`/packageSetting`}>
                            <Boxes
                              className="addcutmButton"
                              title={t("packageSetting")}
                            />
                          </Link>
                        </div>
                      )}
                      {role === "ispOwner" &&
                      (bpSettings?.queueType === "simple-queue" ||
                        bpSettings?.queueType === "core-queue") &&
                      bpSettings?.hasMikrotik ? (
                        <div
                          className="addAndSettingIcon"
                          title={t("fireWallFilterIpDrop")}
                        >
                          <svg
                            data-bs-toggle="modal"
                            data-bs-target="#fireWallFilterIpDropControl"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-receipt-cutoff addcutmButton"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zM11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                            <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293 2.354.646zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118l.137-.274z" />
                          </svg>
                        </div>
                      ) : (
                        ""
                      )}

                      {((role === "manager" && permission?.customerEdit) ||
                        role === "ispOwner") && (
                        <div
                          className="addAndSettingIcon"
                          title={t("customerNumberUpdateOrDelete")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-pencil-square addcutmButton"
                            viewBox="0 0 16 16"
                            onClick={() =>
                              setNumberModalShow({
                                ...numberModalShow,
                                [false]: true,
                              })
                            }
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fill-rule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                            />
                          </svg>
                        </div>
                      )}

                      {permission?.viewCustomerList || role !== "collector" ? (
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
                      ) : (
                        ""
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
              <CustomerBillCollect
                single={singleCustomer}
                customerData={customerReportData}
              />
              <CustomerDetails single={singleCustomer} />
              <CustomerReport single={customerReportData} />
              {/* customer note modal */}
              <CustomerNote
                customerId={customerNoteId}
                customerName={customerName}
              />
              <CustomerDelete
                single={singleData}
                mikrotikCheck={mikrotikCheck}
                setMikrotikCheck={setMikrotikCheck}
              />
              <SingleMessage
                single={singleCustomer}
                sendCustomer="staticCustomer"
              />

              {/* transferReseller modal */}
              <TransferToReseller customerId={singleCustomer} />

              {/* password reset modal */}
              <PasswordReset resetCustomerId={userId} />
              {/* bulk Modal */}

              {/* static customer create invoice */}
              <StaticCreateInvoice
                show={show}
                setShow={setShow}
                single={singleCustomer}
                customerData={customerData}
              />

              <BulkSubAreaEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBulkEdit"
              />

              <BulkBillingCycleEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBillingCycle"
              />

              <BulkPromiseDateEdit
                bulkCustomer={bulkCustomer}
                modalId="bulkPromiseDateEdit"
              />

              {bpSettings?.hasMikrotik && (
                <>
                  <BulkStatusEdit
                    bulkCustomer={bulkCustomer}
                    modalId="bulkStatusEdit"
                  />

                  <BulkMikrotikEdit
                    bulkCustomer={bulkCustomer}
                    modalId="bulkMikrotikEdit"
                  />
                </>
              )}

              <BulkPackageEdit
                bulkCustomer={bulkCustomer}
                modalId="bulkPackageEdit"
              />

              <BulkRecharge
                bulkCustomer={bulkCustomer}
                modalId="bulkRecharge"
              />

              <BulkBalanceEdit
                bulkCustomer={bulkCustomer}
                modalId="customerBalanceEdit"
              />

              <BulkCustomerDelete
                bulkCustomer={bulkCustomer}
                modalId="bulkDeleteCustomer"
              />
              <BulkAutoConnectionEdit
                bulkCustomer={bulkCustomer}
                modalId="autoDisableEditModal"
              />

              <BulkCustomerTransfer
                bulkCustomer={bulkCustomer}
                modalId="bulkTransferToReseller"
              />

              <CreateSupportTicket
                collectors={collectors}
                manager={manager}
                customer={singleCustomer}
                ispOwner={ispOwner}
                reseller=""
              />

              <FireWallFilterIpDropControl />
              {/* bulk Modal end */}

              {/* customers number update or delete modal */}
              <CustomersNumber showModal={numberModalShow} />

              {/* Model finish */}

              <FourGround>
                {permission?.viewCustomerList || role !== "collector" ? (
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <div className="displayGrid6">
                            <select
                              className="form-select shadow-none "
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
                              className="form-select shadow-none"
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
                              {subAreas?.map((sub, key) => (
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
                              className="form-select shadow-none"
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
                              className="form-select shadow-none"
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
                                selected={
                                  filterOptions.paymentStatus === "free"
                                }
                                value="free"
                              >
                                {t("free")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "paid"
                                }
                                value="paid"
                              >
                                {t("payPaid")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "unpaid"
                                }
                                value="unpaid"
                              >
                                {t("unpaid")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "partial"
                                }
                                value="partial"
                              >
                                {t("partial")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "advance"
                                }
                                value="advance"
                              >
                                {t("advance")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "overdue"
                                }
                                value="overdue"
                              >
                                {t("overDue")}
                              </option>
                            </select>
                            {bpSettings?.hasMikrotik && (
                              <select
                                className="form-select shadow-none"
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
                              className="form-select shadow-none "
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
                                    selected={
                                      filterOptions.package === `${m.name}`
                                    }
                                    value={m.id}
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
                              className="form-select shadow-none"
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
                                selected={
                                  filterOptions.freeUser === "nonFreeUser"
                                }
                                value="nonFreeUser"
                              >
                                {t("nonFreeCustomer")}
                              </option>
                            </select>
                            <input
                              className="form-select shadow-none"
                              type="date"
                              onChange={(e) =>
                                setFilterOption({
                                  ...filterOptions,
                                  filterDate: e.target.value,
                                })
                              }
                            />
                            <select
                              className="form-select shadow-none"
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

                            <select
                              className="form-select shadow-none"
                              onChange={(e) =>
                                setFilterOption({
                                  ...filterOptions,
                                  changedPromiseDate: e.target.value,
                                })
                              }
                            >
                              <option value="">{t("promiseDateChange")}</option>
                              <option value="changedPromiseDate">
                                {t("changedCustomer")}
                              </option>
                            </select>

                            <div className="d-flex justify-content-end align-items-end">
                              <button
                                className="btn btn-outline-primary w-6rem h-76"
                                type="button"
                                onClick={handleActiveFilter}
                              >
                                {t("filter")}
                              </button>
                              <button
                                className="btn btn-outline-secondary w-6rem h-76 ms-2"
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

                    <div className="collectorWrapper">
                      <div style={{ display: "none" }}>
                        <PrintCustomer
                          filterData={filterData}
                          currentCustomers={Customers}
                          ref={componentRef}
                        />
                      </div>

                      <div className="table-section">
                        <Table
                          isLoading={customerLoading}
                          customComponent={customComponent}
                          bulkLength={bulkCustomer?.length}
                          columns={columns}
                          data={Customers1}
                          bulkState={{
                            setBulkCustomer,
                          }}
                        ></Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </FourGround>
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
              {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
                (bpSettings?.bulkAreaEdit &&
                  permission?.bulkAreaEdit &&
                  role !== "manager")) && (
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

              {((role === "ispOwner" && bpSettings?.bulkStatusEdit) ||
                (bpSettings?.bulkStatusEdit &&
                  permission?.bulkStatusEdit &&
                  role === "manager")) && (
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

              {((role === "ispOwner" && bpSettings?.bulkBillingCycleEdit) ||
                (bpSettings?.bulkBillingCycleEdit &&
                  permission?.bulkBillingCycleEdit &&
                  role === "manager")) && (
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

              {((role === "ispOwner" && bpSettings?.bulkPromiseDateEdit) ||
                (bpSettings?.bulkPromiseDateEdit &&
                  permission?.bulkPromiseDateEdit &&
                  role === "manager")) && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#bulkPromiseDateEdit"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-success"
                      title={t("editPromiseDate")}
                    >
                      <i class="fas fa-calendar-week fa-xs"></i>
                      <span className="button_title">
                        {" "}
                        {t("editPromiseDate")}{" "}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editPromiseDate")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.updateCustomerBalance) ||
                (bpSettings?.updateCustomerBalance &&
                  permission?.updateCustomerBalance &&
                  role === "manager")) && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerBalanceEdit"
                  type="button"
                  className="p-1"
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
              )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" &&
                  bpSettings?.bulkCustomerMikrotikUpdate) ||
                  (bpSettings?.bulkCustomerMikrotikUpdate &&
                    permission?.bulkCustomerMikrotikUpdate &&
                    role === "manager")) && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#bulkMikrotikEdit"
                    type="button"
                    className="p-1"
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                        title={t("package")}
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
                    data-bs-toggle="modal"
                    data-bs-target="#bulkRecharge"
                    type="button"
                    className="p-1"
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                        title={t("package")}
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

              {((role === "ispOwner" && bpSettings?.bulkAutoDisableEdit) ||
                (bpSettings?.bulkAutoDisableEdit &&
                  permission?.bulkAutoDisableEdit &&
                  role === "manager")) && (
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

              {((role === "ispOwner" && bpSettings?.bulkTransferToReseller) ||
                (bpSettings?.bulkTransferToReseller &&
                  permission?.bulkTransferToReseller &&
                  role === "collector")) && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#bulkTransferToReseller"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("transferReseller")}
                    >
                      <i className="fa-solid fa-right-left fa-xs "></i>
                      <span className="button_title">
                        {" "}
                        {t("transferReseller")}{" "}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("transferReseller")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {((role === "ispOwner" && bpSettings?.bulkCustomerDelete) ||
                (bpSettings?.bulkCustomerDelete &&
                  permission?.bulkCustomerDelete &&
                  role === "collector")) && (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#bulkDeleteCustomer"
                  type="button"
                  className="p-1"
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                      title={t("customerDelete")}
                    >
                      <i className="fas fa-trash-alt fa-xs "></i>
                      <span className="button_title">
                        {" "}
                        {t("customerDelete")}{" "}
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
}
