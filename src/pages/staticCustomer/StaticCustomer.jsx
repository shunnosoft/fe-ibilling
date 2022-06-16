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
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import ReactToPrint from "react-to-print";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerPost from "./customerCRUD/AddStaticCustomer";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import StaticCustomerEdit from "./customerCRUD/StaticCustomerEdit";
import Loader from "../../components/common/Loader";
import {
  getStaticCustomer,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import arraySort from "array-sort";
import CustomerReport from "./customerCRUD/showCustomerReport";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import PrintCustomer from "./customerPDF";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import CustomerDelete from "./customerCRUD/StaticCustomerDelete";
import AddStaticCustomer from "./customerCRUD/AddStaticCustomer";
import apiLink from "../../api/apiLink";

export default function Customer() {
  const [mikrotikPac, setMikrotikPac] = useState([]);
  const [Customers1, setCustomers1] = useState([]);
  const [Customers2, setCustomers2] = useState([]);
  const mikrotiks = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  const componentRef = useRef(); //reference of pdf export component
  const cus = useSelector(
    (state) => state?.persistedReducer?.customer?.staticCustomer
  );

  const role = useSelector((state) => state?.persistedReducer?.auth?.role);
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const ispOwnerData = useSelector(
    (state) => state?.persistedReducer?.auth?.userData
  );

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");
  const permission = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.permissions
  );
  const [filterOptions, setFilterOption] = useState({
    status: "",
    paymentStatus: "",
    area: "",
    subArea: "",
    package: "",
    mikrotik: "",
  });
  const [Customers, setCustomers] = useState(cus);
  // const [filterdCus, setFilter] = useState(Customers);
  // const [isFilterRunning, setRunning] = useState(false);
  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  const [singleData, setSingleData] = useState();

  // const currentCustomers = Customers;
  const allareas = useSelector((state) => state?.persistedReducer?.area?.area);
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer?.auth?.currentUser?.collector?.areas
      : []
  );
  const [allArea, setAreas] = useState([]);

  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );

  useEffect(() => {
    if (role === "collector") {
      let areas = [];

      collectorArea?.map((item) => {
        let area = {
          id: item.area.id,
          name: item.area.name,
          subAreas: [
            {
              id: item.id,
              name: item.name,
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

  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  //   filter

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

  useEffect(() => {
    if (
      !bpSettings?.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch);
    }
    getStaticCustomer(dispatch, ispOwner, setIsloading);
  }, [dispatch, ispOwner, role, bpSettings]);

  const [isSorted, setSorted] = useState(false);

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

  // useEffect(() => {
  //   const temp = [];
  //   cus.map((customer) => {
  //     allareas.map((area) => {
  //       area.subAreas.map((sub) => {
  //         if (customer.subArea === sub.id) {
  //           temp.push({
  //             ...customer,
  //             area: area.id,
  //             profile: customer.pppoe.profile,
  //           });
  //         } else {
  //           const check = temp.some((item) => item.id === customer.id);
  //           if (!check) {
  //             temp.push({
  //               ...customer,
  //               area: "noArea",
  //               profile: customer.pppoe?.profile,
  //             });
  //           }
  //         }
  //       });
  //     });
  //   });

  //   setCustomers(temp);
  //   setCustomers1(temp);
  //   setCustomers2(temp);
  // }, [cus, allareas]);
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

    // temp.map((t) => {
    //   if (t.area === "noArea") console.log(t);
    // });
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
    });
    setCustomers1(Customers2);
  };
  const onChangeSubArea = (id) => {
    setCusSearch(id);
  };

  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
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
        Header: "আইডি",
        accessor: "customerId",
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      {
        Header: "IP",
        accessor: (field) =>
          field.userType === "firewall-queue"
            ? field.queue.address
            : field.queue.target,
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
          return moment(value).format("MMM DD YYYY hh:mm A");
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

              {role === "ispOwner" && (
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
                      <p className="actionP">এডিট</p>
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
                      <p className="actionP">রিপোর্ট</p>
                    </div>
                  </div>
                </li>
              )}

              {role === "ispOwner" ? (
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
                      <p className="actionP">ডিলিট</p>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}

              {original.mobile && role === "ispOwner" ? (
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
                      <p className="actionP">মেসেজ</p>
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="me-3">স্ট্যাটিক গ্রাহক </div>
                  <div
                    className="d-flex"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    {role === "ispOwner" && (
                      <>
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
                            প্যাকেজ সেটিং{" "}
                            <ArrowRightShort style={{ fontSize: "19px" }} />
                          </Link>
                        </div>
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

                        <PersonPlusFill
                          title="স্ট্যাটিক গ্রাহক যুক্ত"
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#addStaticCustomerModal"
                        />
                      </>
                    )}
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

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="displexFlexSys">
                      {/* filter selector */}
                      {/* filter selector */}
                      <div className="selectFiltering allFilter">
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
                            সকল এরিয়া
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
                              এরিয়া বিহীন গ্রাহক
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
                          className="form-select"
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
                            সাব এরিয়া
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
                          className="form-select"
                          onChange={(e) => {
                            handleChangeStatus(e);
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
                            স্ট্যাটাস
                          </option>
                          <option
                            selected={filterOptions.status === "active"}
                            value="active"
                          >
                            এক্টিভ
                          </option>
                          <option
                            selected={filterOptions.status === "inactive"}
                            value="inactive"
                          >
                            ইন-এক্টিভ
                          </option>
                          <option
                            selected={filterOptions.status === "expired"}
                            value="expired"
                          >
                            এক্সপায়ার্ড
                          </option>
                        </select>

                        <select
                          className="form-select"
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
                            পেমেন্ট
                          </option>
                          <option
                            selected={filterOptions.paymentStatus === "paid"}
                            value="paid"
                          >
                            পেইড
                          </option>
                          <option
                            selected={filterOptions.paymentStatus === "unpaid"}
                            value="unpaid"
                          >
                            আন-পেইড
                          </option>
                        </select>
                        {bpSettings?.hasMikrotik && (
                          <select
                            className="form-select"
                            onChange={(e) => {
                              mikrotikHandler(e.target.value);
                            }}
                          >
                            <option
                              selected={filterOptions.mikrotik === ""}
                              value=""
                              defaultValue
                            >
                              মাইক্রোটিক
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
                            প্যাকেজ
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
                      </div>
                    </div>

                    {isDeleting && (
                      <div className="deletingAction">
                        <Loader /> <b>Deleting...</b>
                      </div>
                    )}
                  </div>
                  {/* print report */}
                  <div style={{ display: "none" }}>
                    <PrintCustomer
                      filterData={filterData}
                      currentCustomers={Customers}
                      ref={componentRef}
                    />
                  </div>
                  <div className="filterresetbtn">
                    {/* <button onClick={handleActiveFilter}>filter</button> */}
                    <button
                      className="btn btn-success mt-2"
                      type="button"
                      onClick={handleActiveFilter}
                    >
                      ফিল্টার
                    </button>
                    <button
                      style={{
                        marginLeft: "7px",
                        width: "150px",
                      }}
                      className="btn btn-secondary mt-2"
                      type="button"
                      onClick={handleFilterReset}
                    >
                      রিসেট
                    </button>
                    {/* <button onClick={handleFilterReset}>reset</button> */}
                  </div>

                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={Customers1}
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
