import React, { useEffect, useState, useRef } from "react";
import "../collector/collector.css";
import moment from "moment";
import { CSVLink } from "react-csv";

// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  PersonPlusFill,
  Wallet,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  ArrowDownUp,
  CashStack,
  FileExcelFill,
  PrinterFill,
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
import Loader from "../../components/common/Loader";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import {
  deleteACustomer,
  getCustomer,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import arraySort from "array-sort";
import CustomerReport from "./customerCRUD/showCustomerReport";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import PrintCustomer from "./customerPDF";
import Table from "../../components/table/Table";

export default function Customer() {
  const dispatch = useDispatch();

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

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");
  const [Customers, setCustomers] = useState(cus);
  const [filterdCus, setFilter] = useState(Customers);
  const [isFilterRunning, setRunning] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  const [allArea, setAreas] = useState([]);
  const [singleCustomer, setSingleCustomer] = useState("");
  const [customerReportData, setId] = useState([]);
  const [isSorted, setSorted] = useState(false);
  const [subAreaIds, setSubArea] = useState([]);
  const [singleArea, setArea] = useState({});

  // get customer api call
  useEffect(() => {
    if (
      !bpSettings.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch);
    }
    getCustomer(dispatch, ispOwner, setIsloading);
  }, [dispatch, ispOwner, role, bpSettings]);

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

        let found = areas?.find((area) => area.id === item.area.id);
        if (found) {
          found.subAreas.push({ id: item.id, name: item.name });

          return (areas[areas.findIndex((item) => item.id === found.id)] =
            found);
        } else {
          return areas.push(area);
        }
      });
      setAreas(areas);
    }
  }, [collectorArea, role]);
  // end collector filter

  useEffect(() => {
    const keys = [
      "monthlyFee",
      "customerId",
      "name",
      "mobile",
      "address",
      "paymentStatus",
      "status",
      "balance",
      "subArea",
    ];
    setCustomers(
      (isFilterRunning ? filterdCus : cus).filter((item) =>
        keys.some((key) =>
          typeof item[key] === "string"
            ? item[key]?.toString().toLowerCase().includes(cusSearch)
            : item[key]?.toString().includes(cusSearch)
        )
      )
    );
  }, [cus, cusSearch, filterdCus, isFilterRunning]);

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
  const handleActiveFilter = (e) => {
    setPaymentStatus(e.target.value);
    setRunning(true);
    let fvalue = e.target.value;
    const field = fvalue.split(".")[0];
    const subfield = fvalue.split(".")[1];

    const filterdData = cus.filter((item) => item[field] === subfield);

    setFilter(filterdData);
  };

  // const toggleSort = (item) => {
  //   setCustomers(arraySort([...Customers], item, { reverse: isSorted }));
  //   setSorted(!isSorted);
  // };

  useEffect(() => {
    if (subAreaIds.length) {
      setCustomers(cus.filter((c) => subAreaIds.includes(c.subArea)));
    } else {
      setCustomers(cus);
    }
  }, [cus, subAreaIds]);

  const onChangeSubArea = (id) => {
    setCusSearch(id);
  };

  let subArea, customerStatus, customerPaymentStatus;
  if (singleArea && cusSearch) {
    subArea = singleArea?.subAreas?.find((item) => item.id === subAreaIds[0]);
  }

  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  };

  if (status) {
    const splitStatus = status.split(".")[1];
    if (splitStatus === "active") {
      customerStatus = "এক্টিভ";
    } else if (splitStatus === "inactive") {
      customerStatus = "ইনএক্টিভ";
    }
  }

  if (paymentStatus) {
    const splitStatus = paymentStatus.split(".")[1];
    if (splitStatus === "unpaid") {
      customerPaymentStatus = "বকেয়া";
    } else if (splitStatus === "paid") {
      customerPaymentStatus = "পরিশোধ";
    } else if (splitStatus === "expired") {
      customerPaymentStatus = "মেয়াদোত্তীর্ণ";
    }
  }

  const filterData = {
    area: singleArea?.name ? singleArea.name : "সকল এরিয়া",
    subArea: subArea ? subArea.name : "সকল সাবএরিয়া",
    status: customerStatus ? customerStatus : "সকল গ্রাহক",
    payment: customerPaymentStatus ? customerPaymentStatus : "সকল গ্রাহক",
  };

  //export customer data
  let customerForCsV = Customers.map((customer) => {
    return {
      companyName: ispOwnerData.company,
      home: "Home",
      companyAddress: ispOwnerData.address,
      name: customer.name,
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
    // console.log(id);
    if (cus.length !== undefined) {
      const temp = cus.find((original) => {
        return original.id === id;
      });
      setSingleCustomer(temp);
    }
  };

  // get specific customer Report
  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  // DELETE handler
  const deleteCustomer = async (ID) => {
    setIsDeleting(true);
    const IDs = {
      ispID: ispOwner,
      customerID: ID,
    };
    deleteACustomer(dispatch, IDs);
    setIsDeleting(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "আইডি",
        accessor: "customerId",
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      {
        Header: "PPPoE",
        accessor: "pppoe.name",
      },
      {
        Header: "মোবাইল",
        accessor: "mobile",
      },

      {
        Header: "স্ট্যাটাস",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        Header: "পেমেন্ট",
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      // {
      //   Header: "	প্যাকেজ",
      //   accessor: "pppoe.profile",
      // },
      {
        Header: "মাসিক ফি",
        accessor: "monthlyFee",
      },
      {
        Header: "ব্যালান্স",
        accessor: "balance",
      },
      {
        Header: "বিল সাইকেল",
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YY hh:mm A");
        },
      },

      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                    <p className="actionP">প্রোফাইল</p>
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
                      <p className="actionP">বিল গ্রহণ</p>
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
                      <p className="actionP">এডিট</p>
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
                    <p className="actionP">রিপোর্ট</p>
                  </div>
                </div>
              </li>

              {permission?.customerDelete || role === "ispOwner" ? (
                <li
                  onClick={() => {
                    let con = window.confirm(
                      `${original.name} গ্রাহক ডিলিট করতে চান?`
                    );
                    con && deleteCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">ডিলিট</p>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        ),
      },
    ],
    []
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
                <h2 className="collectorTitle">গ্রাহক </h2>
              </FourGround>

              {/* Model start */}
              <CustomerPost />
              <CustomerEdit single={singleCustomer} />
              <CustomerBillCollect single={singleCustomer} />
              <CustomerDetails single={singleCustomer} />
              <CustomerReport single={customerReportData} />

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      <div className="selectFiltering allFilter">
                        <select
                          className="form-select"
                          onChange={(e) => onChangeArea(e.target.value)}
                        >
                          <option value={JSON.stringify({})} defaultValue>
                            সকল এরিয়া
                          </option>
                          {(role === "collector" ? allArea : allareas)?.map(
                            (area, key) => {
                              return (
                                <option key={key} value={JSON.stringify(area)}>
                                  {area.name}
                                </option>
                              );
                            }
                          )}
                        </select>

                        {/* //Todo */}
                        <select
                          className="form-select"
                          onChange={(e) => onChangeSubArea(e.target.value)}
                        >
                          <option value="" defaultValue>
                            সাব এরিয়া
                          </option>
                          {singleArea?.subAreas?.map((sub, key) => (
                            <option key={key} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="form-select"
                          onChange={(e) => {
                            handleActiveFilter(e);
                            handleChangeStatus(e);
                          }}
                        >
                          <option value="" defaultValue>
                            স্ট্যাটাস
                          </option>
                          <option value="status.active">এক্টিভ</option>
                          <option value="status.inactive">ইন-এক্টিভ</option>
                          <option value="status.expired">এক্সপায়ার্ড</option>
                        </select>

                        <select
                          className="form-select"
                          onChange={handleActiveFilter}
                        >
                          <option value="" defaultValue>
                            পেমেন্ট
                          </option>
                          <option value="paymentStatus.paid">পেইড</option>
                          <option value="paymentStatus.unpaid">আন-পেইড</option>
                        </select>
                      </div>
                      {permission?.customerAdd || role === "ispOwner" ? (
                        <>
                          <div className="addNewCollector">
                            <div className="addAndSettingIcon">
                              <CSVLink
                                data={customerForCsV}
                                filename={ispOwnerData.company}
                                headers={headers}
                                title="BTRC রিপোর্ট ডাউনলোড"
                              >
                                <FileExcelFill className="addcutmButton" />
                              </CSVLink>
                            </div>
                          </div>
                          <div className="addNewCollector">
                            <div className="addAndSettingIcon">
                              <ReactToPrint
                                documentTitle="গ্রাহক লিস্ট"
                                trigger={() => (
                                  <PrinterFill
                                    title="প্রিন্ট "
                                    className="addcutmButton"
                                  />
                                )}
                                content={() => componentRef.current}
                              />
                            </div>
                          </div>
                          <div className="addNewCollector">
                            <div className="addAndSettingIcon">
                              <PersonPlusFill
                                className="addcutmButton"
                                data-bs-toggle="modal"
                                data-bs-target="#customerModal"
                                title="নতুন গ্রাহক"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    {isDeleting ? (
                      <div className="deletingAction">
                        <Loader /> <b>Deleting...</b>
                      </div>
                    ) : (
                      ""
                    )}
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

                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={Customers}
                  ></Table>
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
