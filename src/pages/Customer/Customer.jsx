import React, { useEffect, useState } from "react";
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
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import arraySort from "array-sort";
import CustomerReport from "./customerCRUD/showCustomerReport";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";

export default function Customer() {
  const cus = useSelector((state) => state.persistedReducer.customer.customer);
  const role = useSelector((state) => state.persistedReducer.auth.role);
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cusSearch, setCusSearch] = useState("");
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
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
  const allareas = useSelector((state) => state.persistedReducer.area.area);
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth.currentUser?.collector.areas
      : []
  );
  const [allArea, setAreas] = useState([]);

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.userData?.bpSettings
  );

  // paginate call Back function -> response from paginate component
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

          return (areas[
            areas.findIndex((item) => item.id === found.id)
          ] = found);
        } else {
          return areas.push(area);
        }
      });
      setAreas(areas);
    }
  }, [collectorArea, role]);

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
            ? item[key].toLowerCase().includes(cusSearch)
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
      ispID: ispOwner,
      customerID: ID,
    };
    deleteACustomer(dispatch, IDs);
    setIsDeleting(false);
  };
  //export customer data

  let customerForCsV = currentCustomers.map((customer) => {
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
      !bpSettings.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwner, dispatch);
    }
    getCustomer(dispatch, ispOwner, setIsloading);
  }, [dispatch, ispOwner, role, bpSettings]);

  const [isSorted, setSorted] = useState(false);
  const toggleSort = (item) => {
    setCustomers(arraySort([...Customers], item, { reverse: isSorted }));
    setSorted(!isSorted);
  };

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
                          onChange={handleActiveFilter}
                        >
                          <option value="" defaultValue>
                            স্ট্যাটাস
                          </option>
                          <option value="status.active">এক্টিভ</option>
                          <option value="status.inactive">ইন-এক্টিভ</option>
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

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট গ্রাহক :{" "}
                          <span>{FormatNumber(Customers?.length) || "0"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          {/* <Search className="serchingIcon" /> */}
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ"
                            onChange={(e) => setCusSearch(e.target.value)}
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
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr className="spetialSortingRow">
                          <th
                            onClick={() => toggleSort("customerId")}
                            scope="col"
                          >
                            আইডি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("name")} scope="col">
                            নাম
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("mobile")} scope="col">
                            মোবাইল
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th onClick={() => toggleSort("status")} scope="col">
                            স্ট্যাটাস
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("paymentStatus")}
                            scope="col"
                          >
                            পেমেন্ট
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("pppoe.profile")}
                            scope="col"
                          >
                            প্যাকেজ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("monthlyFee")}
                            scope="col"
                            className="text-end"
                          >
                            মাসিক ফি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th
                            onClick={() => toggleSort("balance")}
                            scope="col"
                            className="text-end"
                          >
                            ব্যালান্স
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th
                            onClick={() => toggleSort("billingCycle")}
                            scope="col"
                            className="text-end"
                          >
                            বিল সাইকেল
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th scope="col" className="centeringTD">
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <TdLoader colspan={10} />
                          </tr>
                        ) : Customers?.length === undefined ? (
                          ""
                        ) : (
                          currentCustomers.map((val, key) => (
                            <tr key={key} id={val.id}>
                              <td>{val.customerId}</td>
                              <td>{val.name}</td>
                              <td>{val.mobile}</td>
                              <td>{badge(val.status)}</td>
                              <td>{badge(val.paymentStatus)}</td>
                              <td>{val.pppoe.profile}</td>
                              <td align="right">
                                {FormatNumber(val.monthlyFee)}
                              </td>
                              <td align="right">
                                <strong>{FormatNumber(val.balance)}</strong>
                              </td>
                              <td align="right">
                                {moment(val.billingCycle).format("DD-MM-YYYY")}
                              </td>
                              <td className="centeringTD">
                                <ThreeDots
                                  className="dropdown-toggle ActionDots"
                                  id="customerDrop"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                />

                                {/* modal */}
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="customerDrop"
                                >
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#showCustomerDetails"
                                    onClick={() => {
                                      getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">প্রোফাইল</p>
                                      </div>
                                    </div>
                                  </li>
                                  {permission?.billPosting ||
                                  role === "ispOwner" ? (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#collectCustomerBillModal"
                                      onClick={() => {
                                        getSpecificCustomer(val.id);
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

                                  {permission?.customerEdit ||
                                  role === "ispOwner" ? (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#customerEditModal"
                                      onClick={() => {
                                        getSpecificCustomer(val.id);
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
                                      getSpecificCustomerReport(val);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <CashStack />
                                        <p className="actionP">রিপোর্ট</p>
                                      </div>
                                    </div>
                                  </li>

                                  {permission?.customerDelete ||
                                  role === "ispOwner" ? (
                                    <li
                                      onClick={() => {
                                        let con = window.confirm(
                                          `${val.name} গ্রাহক ডিলিট করতে চান?`
                                        );
                                        con && deleteCustomer(val.id);
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

                                {/* end */}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="paginationSection">
                      <select
                        className="form-select paginationFormSelect"
                        aria-label="Default select example"
                        onChange={(e) => setCustomerPerPage(e.target.value)}
                      >
                        <option value="50">৫০ জন</option>
                        <option value="100">১০০ জন</option>
                        <option value="200">২০০ জন</option>
                        <option value="500">৫০০ জন</option>
                        <option value="1000">১০০০ জন</option>
                      </select>
                      <Pagination
                        customerPerPage={customerPerPage}
                        totalCustomers={Customers.length}
                        paginate={paginate}
                      />
                    </div>
                  </div>
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
