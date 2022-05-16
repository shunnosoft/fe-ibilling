import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import moment from "moment";
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
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

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
  getMikrotik,
  getSubAreas,
} from "../../features/apiCallReseller";
import arraySort from "array-sort";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { FetchAreaSuccess } from "../../features/areaSlice";
import { badge } from "../../components/common/Utils";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";

export default function Customer() {
  const cus = useSelector((state) => state.persistedReducer.customer.customer);
  const role = useSelector((state) => state.persistedReducer.auth.role);
  const dispatch = useDispatch();
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );
  const [Customers, setCustomers] = useState(cus);
  const [filterdCus, setFilter] = useState(Customers);
  const [isFilterRunning, setRunning] = useState(false);
  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  // const [cusId, setSingleCustomerReport] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;

  const currentCustomers = Customers.slice(firstIndex, lastIndex);
  const subAreas = useSelector((state) => state.persistedReducer.area.area);
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // paginate call Back function -> response from paginate component
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
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
            ? item[key].toString().toLowerCase().includes(cusSearch)
            : item[key].toString().includes(cusSearch)
        )
      )
    );
  }, [cus, cusSearch, filterdCus, isFilterRunning]);

  //   filter
  const handleActiveFilter = (e) => {
    setRunning(true);
    let fvalue = e.target.value;
    const field = fvalue.split(".")[0];
    const subfield = fvalue.split(".")[1];

    const filterdData = cus.filter((item) => item[field] === subfield);

    setFilter(filterdData);
  };
  // get specific customer
  const getSpecificCustomer = (id) => {
    if (cus.length !== undefined) {
      const temp = cus.find((val) => {
        return val.id === id;
      });
      setSingleCustomer(temp);
    }
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
  useEffect(() => {
    if (role === "collector") {
      getMikrotik(dispatch, userData.collector.reseller);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, resellerId);
      getCustomer(dispatch, userData?.reseller.id, setIsloading);
      getSubAreas(dispatch, resellerId);
    } else if (role === "collector") {
      getCustomer(dispatch, userData?.collector?.reseller, setIsloading);
    }
  }, [dispatch, resellerId, userData, role]);

  const [isSorted, setSorted] = useState(false);

  const toggleSort = (item) => {
    setCustomers(arraySort([...Customers], item, { reverse: isSorted }));
    setSorted(!isSorted);
  };
  // console.log(permission)
  const [subAreaIds, setSubArea] = useState([]);
  // const [singleArea, setArea] = useState({});

  useEffect(() => {
    if (subAreaIds.length) {
      setCustomers(cus.filter((c) => subAreaIds.includes(c.subArea)));
    } else {
      setCustomers(cus);
    }
  }, [cus, subAreaIds]);

  const onChangeSubArea = (id) => {
    setCusSearch(id);
    // console.log(id)
    //     const filterdData = cus.filter((item) => item["subArea"] === id);

    //     setFilter(filterdData);
    // if (!id) {
    //   let subAreaIds = [];
    //   singleArea?.subAreas.map((sub) => subAreaIds.push(sub.id));

    //   setSubArea(subAreaIds);
    // } else {
    //   setSubArea([id]);
    // }
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
        Header: "	প্যাকেজ",
        accessor: "pppoe.profile",
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
                        {/* //Todo */}
                        <select
                          className="form-select"
                          onChange={(e) => onChangeSubArea(e.target.value)}
                        >
                          <option value="" defaultValue>
                            সাব এরিয়া
                          </option>
                          {subAreas?.map((sub, key) => (
                            <option key={key} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="form-select"
                          onChange={handleActiveFilter}
                        >
                          <option value="" defaultValue>
                            স্ট্যাটাস
                          </option>
                          <option value="status.active">এক্টিভ</option>
                          <option value="status.inactive">ইনএক্টিভ</option>
                        </select>
                        <select
                          className="form-select"
                          onChange={handleActiveFilter}
                        >
                          <option value="" defaultValue>
                            পেমেন্ট
                          </option>
                          <option value="paymentStatus.unpaid">বকেয়া</option>
                          <option value="paymentStatus.paid">পরিশোধ</option>
                          <option value="paymentStatus.expired">
                            মেয়াদোত্তীর্ণ
                          </option>
                        </select>
                      </div>

                      <div className="addNewCollector">
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            data-bs-toggle="modal"
                            data-bs-target="#customerModal"
                          />
                        </div>
                      </div>
                    </div>

                    {isDeleting ? (
                      <div className="deletingAction">
                        <Loader /> <b>Deleting...</b>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <Table columns={columns} data={currentCustomers}></Table>
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
