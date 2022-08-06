import React, { useEffect, useState, useRef } from "react";
import "../collector/collector.css";
import moment from "moment";
import { CSVLink } from "react-csv";
//internal import
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
  FileExcelFill,
  PrinterFill,
  ChatText,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ReactToPrint from "react-to-print";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import CustomerEdit from "./customerCRUD/CustomerEdit";
import {
  fetchReseller,
  getCustomer,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import PrintCustomer from "./customerPDF";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import CustomerDelete from "./customerCRUD/CustomerDelete";
import apiLink from "../../api/apiLink";
import BulkSubAreaEdit from "./customerCRUD/bulkOpration/bulkSubAreaEdit";
import BulkBillingCycleEdit from "./customerCRUD/bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "./customerCRUD/bulkOpration/bulkStatusEdit";
import BulkCustomerDelete from "./customerCRUD/bulkOpration/BulkdeleteModal";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import { useTranslation } from "react-i18next";
import BulkAutoConnectionEdit from "./customerCRUD/bulkOpration/bulkAutoConnectionEdit";
import Loader from "../../components/common/Loader";
import TransferToReseller from "./customerCRUD/TransferToReseller";
import BulkCustomerTransfer from "./customerCRUD/bulkOpration/bulkCustomerTransfer";

// import apiLink from ""
export default function Customer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component

  // get all customer
  const cus = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );

  // get all role
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state?.persistedReducer?.auth?.userData
  );

  // get user permission
  const permission = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.permissions
  );

  // get all area
  const allareas = useSelector((state) => state?.persistedReducer?.area?.area);
  const mikrotiks = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  // get collector area
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state?.persistedReducer?.auth?.currentUser?.collector?.areas
      : []
  );

  // get bp setting permisson
  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );

  const nonMikrotikPackages = useSelector((state) => state.package.packages);

  const [isLoading, setIsloading] = useState(false);
  const [cusSearch, setCusSearch] = useState("");
  const [Customers, setCustomers] = useState(cus);
  const [allArea, setAreas] = useState([]);
  const [singleCustomer, setSingleCustomer] = useState("");
  const [customerReportData, setId] = useState([]);
  const [subAreaIds, setSubArea] = useState([]);
  const [singleArea, setArea] = useState({});
  const [singleData, setSingleData] = useState();
  const [Customers1, setCustomers1] = useState([]);
  const [Customers2, setCustomers2] = useState([]);
  const [mikrotikPac, setMikrotikPac] = useState([]);
  const [filterOptions, setFilterOption] = useState({
    status: "",
    paymentStatus: "",
    area: "",
    subArea: "",
    package: "",
    mikrotik: "",
    freeUser: "",
    filterDate: null,
  });

  const [totalMonthlyFee, setTotalMonthlyFee] = useState(0);
  const [totalFeeWithDue, setTotalFeeWithDue] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [hasDue, setDue] = useState(false);
  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // reload handler
  const reloadHandler = () => {
    if (
      !bpSettings?.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch, setIsloading);
    }
    getCustomer(dispatch, ispOwner, setIsloading);
  };

  // get customer api call
  useEffect(() => {
    if (
      !bpSettings?.hasMikrotik
      // && (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch, setIsloading);
    }
    if (cus.length === 0) getCustomer(dispatch, ispOwner, setIsloading);
  }, [dispatch, ispOwner, role, bpSettings]);

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

  // collector filter
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

        let found = areas?.find((area) => area?.id === item.area?.id);
        if (found) {
          found.subAreas.push({ id: item?.id, name: item?.name });

          return (areas[areas.findIndex((item) => item.id === found?.id)] =
            found);
        } else {
          return areas.push(area);
        }
      });
      setAreas(areas);
    }
  }, [collectorArea, role]);
  // end collector filter

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

  //   filter
  const handleActiveFilter = () => {
    let tempCustomers = Customers2;

    if (filterOptions.area) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.area === filterOptions.area
      );
    }

    if (filterOptions.subArea) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.subArea === filterOptions.subArea
      );
    }

    if (filterOptions.freeUser) {
      if (filterOptions.freeUser === "freeUser") {
        tempCustomers = tempCustomers.filter(
          (customer) => customer.monthlyFee === parseInt("0")
        );
      } else if (filterOptions.freeUser === "nonFreeUser") {
        tempCustomers = tempCustomers.filter(
          (customer) => customer.monthlyFee !== parseInt("0")
        );
      }
    }

    if (filterOptions.status) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.status === filterOptions.status
      );
    }

    if (filterOptions.paymentStatus) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.paymentStatus === filterOptions.paymentStatus
      );
    }
    if (filterOptions.mikrotik) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.mikrotik === filterOptions.mikrotik
      );
    }
    if (filterOptions.package) {
      tempCustomers = tempCustomers.filter(
        (customer) => customer.profile === filterOptions.package
      );
    }

    if (filterOptions.filterDate) {
      const convertStingToDate = moment(filterOptions.filterDate).format(
        "YYYY-MM-DD"
      );

      tempCustomers = tempCustomers.filter(
        (customer) =>
          new Date(
            moment(customer.billingCycle).format("YYYY-MM-DD")
          ).getTime() === new Date(convertStingToDate).getTime()
      );
    }

    setCustomers1(tempCustomers);
    setCustomers(tempCustomers);
  };
  const handleFilterReset = () => {
    setMikrotikPac([]);
    setFilterOption({
      status: "",
      paymentStatus: "",
      area: "",
      subArea: "",
      package: "",
      isFree: "",
      filterDate: null,
    });
    setCustomers1(Customers2);
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

  //call all reseller for transfer customer to reseller
  useEffect(() => {
    if (ispOwnerData) {
      fetchReseller(dispatch, ispOwnerData.id, setIsloading);
    }
  }, [ispOwnerData]);

  const onChangeSubArea = (id) => {
    setCusSearch(id);
  };

  let subArea, customerStatus, customerPaymentStatus;
  if (singleArea && cusSearch) {
    subArea = singleArea?.subAreas?.find((item) => item.id === subAreaIds[0]);
  }

  if (filterOptions.status) {
    if (filterOptions.status === "active") {
      customerStatus = t("active");
    } else if (filterOptions.status === "inactive") {
      customerStatus = t("in active");
    }
  }

  if (filterOptions.paymentStatus) {
    if (filterOptions.paymentStatus === "unpaid") {
      customerPaymentStatus = t("due");
    } else if (filterOptions.paymentStatus === "paid") {
      customerPaymentStatus = t("paid");
    } else if (filterOptions.paymentStatus === "expired") {
      customerPaymentStatus = t("expired");
    }
  }

  const filterData = {
    area: singleArea?.name ? singleArea.name : t("allArea"),
    subArea: subArea ? subArea.name : t("allSubArea"),
    status: customerStatus ? customerStatus : t("sokolCustomer"),
    payment: customerPaymentStatus ? customerPaymentStatus : t("sokolCustomer"),
  };

  //export customer data
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

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // get specific customer Report
  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);

    setSingleData(customerId);
  };

  //bulk-operations
  const [bulkCustomer, setBulkCustomer] = useState([]);

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
        Header: t("paymentFilter"),
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
                {permission?.billPosting || role === "ispOwner" ? (
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
                ) : (
                  ""
                )}

                {permission?.customerEdit || role === "ispOwner" ? (
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
                ) : (
                  ""
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

                {permission?.customerDelete || role === "ispOwner" ? (
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
                ) : (
                  ""
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
                {/* {role === "ispOwner" && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#transferToReseller"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ChatText />
                        <p className="actionP">{t("transferReseller")}</p>
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
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>

                  {permission?.customerAdd || role === "ispOwner" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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

                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
                          title={t("newCustomer")}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </FourGround>

              {/* Model start */}
              <CustomerPost />
              <CustomerEdit single={singleCustomer} />
              <CustomerBillCollect single={singleCustomer} />
              <CustomerDetails single={singleCustomer} />
              <CustomerReport single={customerReportData} />
              <CustomerDelete
                single={singleData}
                mikrotikCheck={mikrotikCheck}
                setMikrotikCheck={setMikrotikCheck}
              />
              <SingleMessage single={singleCustomer} sendCustomer="customer" />

              {/* transferReseller modal */}
              {/* <TransferToReseller customerId={singleCustomer} /> */}
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
              {/* <BulkCustomerTransfer
                bulkCustomer={bulkCustomer}
                modalId="transferToReseller"
              /> */}

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      <div className=" d-flex flex-wrap">
                        <select
                          className="form-select"
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
                            {t("paymentFilter")}
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
                        {bpSettings?.hasMikrotik ? (
                          <select
                            className="form-select"
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
                                  value={m.name}
                                >
                                  {m.name}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <select
                            className="form-select ms-2"
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

                            {nonMikrotikPackages?.map((m, i) => {
                              return (
                                <option
                                  key={i}
                                  selected={
                                    filterOptions.package === `${m.name}`
                                  }
                                  value={m.name}
                                >
                                  {m.name}
                                </option>
                              );
                            })}
                          </select>
                        )}
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
                        <div>
                          <button
                            className="btn btn-outline-primary mt-2 w-6rem ms-2"
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
                  {/* table */}
                  {/* print report */}
                  <div style={{ display: "none" }}>
                    <PrintCustomer
                      filterData={filterData}
                      currentCustomers={Customers}
                      ref={componentRef}
                    />
                  </div>
                  <div className="filterresetbtn d-flex justify-content-between"></div>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
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
          {/* <button
            className="bulk_action_button"
            title={t("transferReseller")}
            data-bs-toggle="modal"
            data-bs-target="#transferToReseller"
            type="button"
            class="btn btn-info btn-floating btn-sm"
          >
            <i class="fa-solid fa-right-left"></i>
            <span className="button_title"> {t("transferReseller")} </span>
          </button> */}
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
    </>
  );
}
