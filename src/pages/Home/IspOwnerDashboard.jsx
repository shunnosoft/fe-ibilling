// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  People,
  ThreeDotsVertical,
  BarChartFill,
  PersonCheckFill,
  ChatSquareDots,
} from "react-bootstrap-icons";
import moment from "moment";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import {
  fetchReseller,
  getCollector,
  getIspOwnerData,
  getManger,
} from "../../features/apiCalls";
import {
  getIspOwnerCharts,
  getIspOwnerDashboardCardData,
} from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../features/uiSlice";
import FormatNumber from "../../components/common/NumberFormat";
// the hook
import { useTranslation } from "react-i18next";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import { easeQuadIn } from "d3-ease";
import ReactDatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../../components/admin/footer/Footer";
import Inactive from "./dataComponent/Inactive";
import Expired from "./dataComponent/Expired";
import FreeCustomer from "./dataComponent/FreeCustomer";
import Paid from "./dataComponent/Paid";
import Unpaid from "./dataComponent/Unpaid";
import Active from "./dataComponent/Active";
import AllCollector from "./dataComponent/AllCollector";
import Reseller from "./dataComponent/Reseller";

export default function IspOwnerDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get login user role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  //get ispOwnerId
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get ispOwner data when logged in
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.currentUser.ispOwner
  );

  //get ispOwner data from any component
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  //get reseller data
  const reseller = useSelector((state) => state.reseller);

  //get all Collectors
  const allCollector = useSelector((state) => state.collector.collector);

  //get all manager
  const manager = useSelector((state) => state.manager.manager);

  //get graph data
  const ChartsData = useSelector((state) => state.chart.charts);

  //get dashboard different cards data
  const customerStat = useSelector((state) => state.chart.customerStat);

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  //all internal states
  const [isLoading, setIsloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDashboardData, setLoadingDashboardData] = useState(false);
  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);
  const [status, setStatus] = useState("");
  const [currentCollector, setCurrentCollector] = useState("");

  //all dates states
  const date = new Date();
  const newYear = date.getFullYear();
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(date);

  // collectors and managers for graph filter
  useEffect(() => {
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );

    if (collectors.length === allCollector.length) {
      manager?.map((man) => {
        const { user, name, id } = man;
        collectors.unshift({ name: name + " Manager", user, id }); //pushing managers into array of all collectors
      });
    }

    setCollectors(collectors);
  }, [allCollector, manager]);

  //api calls
  useEffect(() => {
    Object.keys(ispOwner)?.length === 0 &&
      getIspOwnerData(dispatch, ispOwnerId, setIsloading);

    Object.keys(manager)?.length === 0 && getManger(dispatch, ispOwnerId);
    reseller?.reseller.length === 0 &&
      fetchReseller(dispatch, ispOwnerId, setIsloading);

    allCollector?.length === 0 &&
      getCollector(dispatch, ispOwnerId, setIsloading);

    //get graph chart data
    getIspOwnerCharts(setLoading, dispatch, ispOwnerId, Year, Month);

    //get card data
    getIspOwnerDashboardCardData(dispatch, setLoadingDashboardData, ispOwnerId);
  }, []);

  //graph data calculation
  useEffect(() => {
    let tempArr = [],
      tempCollection = [],
      tempCount = [];

    ChartsData?.forEach((val) => {
      tempArr.push(val.total);
      tempCollection.push(val._id);
      tempCount.push(val.count);
    });

    setLabel(tempArr);
    setCollection(tempCollection);
    setCount(tempCount);
  }, [ChartsData]);

  const monthsName = [
    { value: "January", label: t("january") },
    { value: "February", label: t("february") },
    { value: "March", label: t("march") },
    { value: "April", label: t("april") },
    { value: "May", label: t("may") },
    { value: "June", label: t("june") },
    { value: "July", label: t("July") },
    { value: "August", label: t("august") },
    { value: "September", label: t("september") },
    { value: "October", label: t("october") },
    { value: "November", label: t("november") },
    { value: "December", label: t("december") },
  ];

  //chartsData for graph
  const chartsData = {
    labels: collection,
    datasets: [
      showGraphData === "amount"
        ? {
            label: t("amount"),
            data: label,
            backgroundColor: "rgb(110 110 110 / 24%)",
            borderJoinStyle: "round",
            borderColor: "#00a4e3",
            fill: "origin",
            borderWidth: 2,
          }
        : {
            label: t("bill"),
            data: count,
            borderColor: "#0cc30c",
            borderWidth: 2,
            fill: "origin",
            backgroundColor: "rgb(110 110 110 / 24%)",
          },
    ],
  };

  //filter for graph chart
  const handleFilterHandler = () => {
    getIspOwnerCharts(
      setLoading,
      dispatch,
      ispOwnerId,
      Year,
      Month,
      currentCollector
    );
  };

  //expiration date calculation for pop-up modal
  let invoiceFlag;
  if (invoice) {
    if (new Date(invoice?.dueDate).getTime() < new Date().getTime()) {
      invoiceFlag = "EXPIRED";
    } else {
      const dt = new Date(),
        expDate = new Date(invoice?.dueDate);

      const diffTime = Math.abs(expDate - dt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        invoiceFlag = "UNPAID";
      }
    }
  }
  const invoiceType = {
    monthlyServiceCharge: t("monthly"),
    registration: t("register"),
  };

  //percantage calculation
  const collectionPercentage = customerStat
    ? Math.round(
        (customerStat.totalBillCollection /
          (customerStat.totalProbableAmount -
            customerStat.totalInactiveAmount)) *
          100
      )
    : 0;

  //reload cards handler
  const dashboardReloadHandler = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    getIspOwnerDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      ispOwnerId,
      filterData
    );
  };

  //filter card information
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    getIspOwnerDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      ispOwnerId,
      filterData
    );
  };

  return (
    <>
      <div className="container homeWrapper">
        <div className={`Loader ${loadingDashboardData && "d-block"}`}></div>
        <ToastContainer position="top-right" theme="colored" />
        <FontColor>
          <div className="home">
            {/* card section */}

            <div className="row">
              {invoiceFlag === "UNPAID" && (
                <div className="col-md-12 mb-3 pt-3 pb-3 badge bg-primary text-wrap fs-5 text">
                  <div className="mb-1 pt-1 pb-1">{`${t("netFee")} ${
                    invoiceType[invoice.type]
                  } ${t("fee")} ${invoice.amount} ${t("expiredFee")} ${moment(
                    invoice.dueDate
                  ).format("DD-MM-YYYY hh:mm:ss A")}`}</div>

                  <button
                    type="button"
                    className="btn btn-success fs-5 text"
                    onClick={() => {
                      dispatch(showModal(invoice));
                    }}
                  >
                    {t("payment")}
                  </button>
                </div>
              )}

              <div className="col-md-12 mb-3">
                {(role === "ispOwner" ||
                  permissions?.dashboardCollectionData) && (
                  <div className="row">
                    <div className="col-md-3 d-flex justify-content-end align-items-center">
                      <h2>
                        {t("possibleCollection")}
                        <br /> ৳ &nbsp;
                        {FormatNumber(
                          customerStat.totalProbableAmount -
                            customerStat.totalInactiveAmount
                        )}{" "}
                      </h2>
                    </div>
                    <div className="col-md-6">
                      <div
                        style={{
                          width: 200,
                          height: 200,
                          margin: "0 auto",
                        }}
                      >
                        {/* Percantage circular bar part*/}
                        <AnimatedProgressProvider
                          valueStart={0}
                          valueEnd={Math.round(collectionPercentage)}
                          duration={1}
                          easingFunction={easeQuadIn}
                        >
                          {(value) => {
                            const roundedValue = isNaN(value)
                              ? collectionPercentage
                              : Math.round(value);
                            return (
                              <CircularProgressbar
                                value={roundedValue}
                                text={`${
                                  isNaN(roundedValue) ? 0 : roundedValue
                                }%`}
                                styles={buildStyles({
                                  pathTransition: "none",
                                })}
                              />
                            );
                          }}
                        </AnimatedProgressProvider>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex justify-content-start align-items-center">
                      <h2>
                        {t("totalCollection")} <br /> ৳ &nbsp;
                        {FormatNumber(
                          customerStat.totalBillCollection -
                            customerStat.totalMonthlyDiscount
                        )}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-between align-items-center">
                    <p
                      className="fw-700 me-3"
                      data-bs-toggle="modal"
                      data-bs-target="#activeCustomer"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() => setStatus("active")}
                    >
                      {t("active")} &nbsp;
                      <span className="text-secondary fw-bold">
                        ৳{FormatNumber(customerStat.totalActiveAmount)}
                      </span>
                    </p>

                    <p
                      className="fw-700"
                      data-bs-toggle="modal"
                      data-bs-target="#expiredCustomer"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() => setStatus("expired")}
                    >
                      {t("expired")} &nbsp;
                      <span className="text-secondary fw-bold">
                        ৳{FormatNumber(customerStat.totalExpiredAmount)}
                      </span>
                    </p>
                  </div>

                  <div className="d-flex justify-content-end">
                    <div
                      className="d-flex justify-content-center align-items-center me-2"
                      title={t("refresh")}
                      style={{
                        borderRadius: "10%",
                        backgroundColor: "#F7E9D7",
                      }}
                    >
                      {isLoading ? (
                        <div className="dashboardLoader">
                          <Loader />
                        </div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="23"
                          height="23"
                          fill="currentColor"
                          className="bi bi-arrow-clockwise dashboardButton"
                          viewBox="0 0 16 16"
                          onClick={dashboardReloadHandler}
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                          />
                          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <ReactDatePicker
                        selected={filterDate}
                        className="form-control shadow-none"
                        onChange={(date) => setFilterDate(date)}
                        dateFormat="MMM/yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        endDate={"2014/04/08"}
                        placeholderText={t("filterDashboard")}
                        maxDate={new Date()}
                        minDate={new Date(ispOwnerData?.createdAt)}
                      />
                    </div>
                    <button
                      className="btn btn-primary w-140 ms-1"
                      onClick={dashboardFilterController}
                    >
                      {isLoading ? <Loader /> : t("filter")}
                    </button>
                  </div>
                </div>

                {/* </div> */}
              </div>

              <div className="col-md-3">
                <div id="card1" className="dataCard">
                  <ThreeDotsVertical className="ThreeDots" />
                  <div className="cardIcon">
                    <People />
                  </div>
                  <div className="chartSection">
                    <p style={{ fontSize: "16px" }}>{t("total customer")}</p>
                    <h2>{FormatNumber(customerStat.customers)}</h2>

                    <Link to={"/new/customer"}>
                      <p className="dashboardData">
                        {t("new customer")}{" "}
                        {FormatNumber(customerStat.newCustomer)}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-3" key={2}>
                <div id="card2" className="dataCard">
                  <ThreeDotsVertical className="ThreeDots" />
                  <div className="cardIcon">
                    <PersonCheckFill />
                  </div>
                  <div className="chartSection">
                    <p
                      className="dashboardActive"
                      data-bs-toggle="modal"
                      data-bs-target="#activeCustomer"
                      style={{ fontSize: "16px" }}
                      onClick={() => setStatus("active")}
                    >
                      {t("active")}
                    </p>
                    <h2
                      className="dashboardActive"
                      data-bs-toggle="modal"
                      data-bs-target="#activeCustomer"
                      onClick={() => setStatus("active")}
                    >
                      {FormatNumber(customerStat.active)}
                    </h2>
                    {(role === "ispOwner" ||
                      permissions?.dashboardCollectionData) && (
                      <p
                        className="dashboardActive pb-1"
                        data-bs-toggle="modal"
                        data-bs-target="#activeCustomer"
                        style={{ fontSize: "15px" }}
                        onClick={() => setStatus("active")}
                      >
                        {t("active")}
                        &nbsp;
                        <span className="text-info">
                          ৳ {FormatNumber(customerStat.totalActiveAmount)}
                        </span>
                      </p>
                    )}
                    <p
                      className="dashboardData pb-1 pt-0"
                      data-bs-toggle="modal"
                      data-bs-target="#inactiveCustomer"
                      style={{ fontSize: "15px", marginBottom: "0px" }}
                      onClick={() => setStatus("inactive")}
                    >
                      {t("in active")}: {FormatNumber(customerStat.inactive)}{" "}
                      &nbsp;
                      {(role === "ispOwner" ||
                        permissions?.dashboardCollectionData) && (
                        <span className="text-info">
                          ৳ {FormatNumber(customerStat.totalInactiveAmount)}
                        </span>
                      )}
                    </p>
                    <p
                      className="dashboardData pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#expiredCustomer"
                      style={{ fontSize: "15px", paddingTop: "0px" }}
                      onClick={() => setStatus("expired")}
                    >
                      {t("expired")}: {FormatNumber(customerStat.expired)}{" "}
                      &nbsp;
                      {(role === "ispOwner" ||
                        permissions?.dashboardCollectionData) && (
                        <span className="text-info">
                          ৳{FormatNumber(customerStat.totalExpiredAmount)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3" key={3}>
                <div id="card3" className="dataCard">
                  <ThreeDotsVertical className="ThreeDots" />
                  <div className="cardIcon">
                    <BarChartFill />
                  </div>
                  <div className="chartSection">
                    <p
                      className="dashboardUnpaid pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#paid"
                      style={{ fontSize: "16px" }}
                      onClick={() => setStatus("paid")}
                    >
                      {t("paid")}
                    </p>
                    <h2
                      className="dashboardUnpaid"
                      data-bs-toggle="modal"
                      data-bs-target="#paid"
                      onClick={() => setStatus("paid")}
                    >
                      {FormatNumber(customerStat.paid)}
                    </h2>
                    <p
                      className="dashboardUnpaid pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#unPaid"
                      style={{ fontSize: "15px", paddingTop: "10px" }}
                      onClick={() => setStatus("unpaid")}
                    >
                      {t("unpaid")}: {FormatNumber(customerStat.unpaid)}
                    </p>

                    <p
                      className="dashboardUnpaid pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#freeCustomer"
                      style={{
                        fontSize: "15px",
                        paddingTop: "0px",
                      }}
                      onClick={() => setStatus("freeCustomer")}
                    >
                      {t("freeCustomer")}:
                      {FormatNumber(customerStat.freeCustomer)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div id="card4" className="dataCard">
                  <ThreeDotsVertical className="ThreeDots" />
                  <div className="cardIcon">৳</div>
                  <div className="chartSection">
                    {(role === "ispOwner" ||
                      permissions?.dashboardCollectionData) && (
                      <>
                        <p style={{ fontSize: "16px" }}>
                          {t("total collection")}
                        </p>
                        <h2>
                          ৳{" "}
                          {FormatNumber(
                            customerStat.totalBillCollection -
                              customerStat.totalMonthlyDiscount
                          )}
                        </h2>
                      </>
                    )}
                    {role !== "collector" && (
                      <>
                        {(role === "ispOwner" ||
                          permissions?.dashboardCollectionData) && (
                          <>
                            <p
                              style={{ fontSize: "15px", marginBottom: "0px" }}
                            >
                              {t("discount")}:{" "}
                              {FormatNumber(customerStat.totalMonthlyDiscount)}
                            </p>

                            <p
                              style={{ fontSize: "13px", marginBottom: "0px" }}
                            >
                              {t("withoutDiscount")}:{" "}
                              {FormatNumber(customerStat.totalBillCollection)}
                            </p>
                          </>
                        )}

                        <p
                          className={
                            !permissions?.dashboardCollectionData
                              ? "fs-6"
                              : "fs-13"
                          }
                        >
                          {t("today collection")}{" "}
                          {FormatNumber(customerStat.todayBillCollection)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <FourGround>
              <div className="ChartsHeadernew">
                <div className="selectGraph">
                  <h4>{t("collection")}</h4>
                  <div>
                    <input
                      id="amount"
                      type="radio"
                      name="graphSelectRadio"
                      checked={showGraphData === "amount" && "checked"}
                      onChange={() => setShowGraphData("amount")}
                    />
                     <label htmlFor="amount">{t("amount")}</label>
                  </div>
                  <div>
                    <input
                      id="bill"
                      type="radio"
                      name="graphSelectRadio"
                      onChange={() => setShowGraphData("bill")}
                    />
                      <label htmlFor="bill">{t("bill")}</label>
                  </div>
                </div>

                <div className="ChartsFilternew">
                  {role === "collector" ? (
                    ""
                  ) : (
                    <select
                      className="form-select chartFilteritem"
                      onChange={(e) => setCurrentCollector(e.target.value)}
                    >
                      <option value="">{t("all collector")}</option>
                      {collectors?.map((c, key) => (
                        <option key={key} value={c.user}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    className="form-select chartFilteritem"
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option value={newYear}>{newYear}</option>
                    <option value={newYear - 1}>{newYear - 1}</option>
                  </select>
                  <select
                    className="form-select chartFilteritem"
                    value={Month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {monthsName.map((val, index) => (
                      <option
                        // selected={index === Month ? true : false}
                        value={index}
                        key={index}
                      >
                        {val.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-outline-primary w-140 mt-2 chartFilteritem"
                    type="button"
                    onClick={handleFilterHandler}
                  >
                    {loading ? <Loader /> : t("filter")}
                  </button>
                </div>
              </div>

              {/* select graph */}

              <div className="lineChart">
                <Line
                  data={chartsData}
                  height={400}
                  width={600}
                  options={{
                    tension: 0.4,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </FourGround>

            <Accordion alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h4 className="mb-0">{t("roleAdmin")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="row">
                    <div className="col-md-3">
                      <div id="card12" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("totalCollection")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(
                              customerStat?.ispOwner?.billCollection -
                                customerStat?.ispOwner?.monthlyDiscount
                            )}
                          </h2>

                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("today")}:{" "}
                            {FormatNumber(
                              customerStat?.ispOwner?.billCollectionToday
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card14" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("connectionFee")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(
                              customerStat?.ispOwner?.monthlyConnectionFee
                            )}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card8" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("ownCost")}</p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(customerStat?.ispOwner?.expenditure)}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card7" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("totalExpenditure")}
                          </p>
                          <h2>
                            ৳ {FormatNumber(customerStat?.totalExpenditure)}
                          </h2>

                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("todayTotalExpenditure")}:{" "}
                            {FormatNumber(customerStat?.todayExpenditure)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card11" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("salary")}</p>
                          <h2>৳ {FormatNumber(customerStat?.totalSalary)}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card1" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("balance")}</p>
                          <h2>
                            ৳ {FormatNumber(customerStat?.ispOwner?.balance)}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card5" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("ownBalance")}</p>
                          <h2>
                            ৳ {FormatNumber(customerStat?.ispOwner?.ownBalance)}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card5" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">
                          <ChatSquareDots />
                        </div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("nonMasking")}</p>
                          <h2> {FormatNumber(ispOwnerData.smsBalance)}</h2>
                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("masking")}:{" "}
                            {FormatNumber(ispOwnerData.maskingSmsBalance)}
                          </p>
                          <p style={{ fontSize: "15px" }}>
                            {t("fixedNumber")}:{" "}
                            {FormatNumber(ispOwnerData.fixedNumberSmsBalance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <h4 className="mb-0">{t("roleManager")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="row">
                    <div className="col-md-3">
                      <div id="card12" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("customerCollection")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(
                              customerStat?.manager?.billCollection
                            )}
                          </h2>
                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("todayTotalCollectionByManager")}:{" "}
                            {FormatNumber(
                              customerStat?.manager?.todayBillCollection
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card10" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("connectionFee")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(customerStat?.manager?.connectionFee)}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card14" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("depositCollection")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(
                              customerStat?.manager?.collectionDeposit
                            )}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card5" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("totalMonthlyCollection")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(
                              customerStat?.manager?.totalBillCollection
                            )}
                          </h2>

                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("todayTotalCollectionByManager")}:{" "}
                            {FormatNumber(
                              customerStat?.manager?.totalBillCollectionToday
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3" key={3}>
                      <div id="card6" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">
                          <BarChartFill />
                        </div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("totalManagerDeposite")}
                          </p>
                          <h2>
                            ৳ {FormatNumber(customerStat?.manager?.deposit)}
                          </h2>

                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("todayTotalManagerDeposite")}:{" "}
                            {FormatNumber(customerStat?.manager?.todayDeposit)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card8" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("cost")}</p>
                          <h2>
                            ৳ {FormatNumber(customerStat?.manager?.expenditure)}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card11" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>{t("staffSalary")}</p>
                          <h2>
                            ৳ {FormatNumber(customerStat?.manager?.staffSalary)}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card7" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">৳</div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("managersBalance")}
                          </p>
                          <h2>
                            {" "}
                            ৳ {FormatNumber(customerStat?.manager?.balance)}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {customerStat?.collector?.collectors ? (
                <>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="shadow-none">
                      <h4 className="mb-0">{t("roleCollector")}</h4>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row ">
                        <div className="col-md-3">
                          <div
                            id="card9"
                            className="dataCard"
                            data-bs-toggle="modal"
                            data-bs-target="#allCollector"
                            onClick={() => setStatus("collector")}
                            style={{ cursor: "pointer" }}
                          >
                            <ThreeDotsVertical className="ThreeDots" />
                            <div className="cardIcon">৳</div>
                            <div className="chartSection">
                              <p style={{ fontSize: "16px" }}>
                                {t("allCollector")}
                              </p>
                              <h2>
                                {" "}
                                {FormatNumber(
                                  customerStat?.collector?.collectors
                                )}
                              </h2>

                              <p style={{ fontSize: "15px" }}>
                                {t("totalCollection")}:{" "}
                                {FormatNumber(
                                  customerStat?.collector?.billCollection
                                )}
                              </p>

                              <p style={{ fontSize: "15px" }}>
                                {t("todayTotalCollectionByCollector")}:{" "}
                                {FormatNumber(
                                  customerStat?.collector?.todayBillCollection
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div id="card13" className="dataCard">
                            <ThreeDotsVertical className="ThreeDots" />
                            <div className="cardIcon">৳</div>
                            <div className="chartSection">
                              <p style={{ fontSize: "16px" }}>
                                {t("connectionFee")}
                              </p>
                              <h2>
                                ৳{" "}
                                {FormatNumber(
                                  customerStat?.collector?.connectionFee
                                )}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3" key={2}>
                          <div id="card10" className="dataCard">
                            <ThreeDotsVertical className="ThreeDots" />
                            <div className="cardIcon">
                              <PersonCheckFill />
                            </div>
                            <div className="chartSection">
                              <p style={{ fontSize: "16px" }}>
                                {t("totalManagerDeposite")}
                              </p>
                              <h2>
                                ৳{" "}
                                {FormatNumber(customerStat?.collector?.deposit)}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div id="card13" className="dataCard">
                            <ThreeDotsVertical className="ThreeDots" />
                            <div className="cardIcon">৳</div>
                            <div className="chartSection">
                              <p style={{ fontSize: "16px" }}>
                                {t("managersBalance")}
                              </p>
                              <h2>
                                ৳{" "}
                                {FormatNumber(customerStat?.collector?.balance)}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  {customerStat?.reseller?.resellers > 0 && (
                    <Accordion.Item eventKey="3">
                      <Accordion.Header className="shadow-none">
                        <h4 className="mb-0">{t("reseller")}</h4>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="row ">
                          <div className="col-md-3">
                            <div
                              id="card1"
                              className="dataCard"
                              data-bs-toggle="modal"
                              data-bs-target="#resellerInformationModal"
                              onClick={() => setStatus("reseller")}
                              style={{ cursor: "pointer" }}
                            >
                              <ThreeDotsVertical className="ThreeDots" />
                              <div className="cardIcon">
                                <People />
                              </div>
                              <div className="chartSection">
                                <p style={{ fontSize: "16px" }}>
                                  {t("reseller")}
                                </p>
                                <h2>
                                  {" "}
                                  {FormatNumber(
                                    customerStat?.reseller?.resellers
                                  )}
                                </h2>

                                <p
                                  style={{
                                    fontSize: "15px",
                                    paddingTop: "10px",
                                  }}
                                >
                                  {t("totalMonthlyBillCollect")}:{" "}
                                  {FormatNumber(
                                    customerStat?.reseller?.billCollection
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  )}
                </>
              ) : (
                ""
              )}
            </Accordion>
          </div>
          <Footer />
        </FontColor>
      </div>

      <Inactive
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
      <Expired
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
      <FreeCustomer
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
      <Paid
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
      <Unpaid
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
      <Active
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />

      <AllCollector
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
      <Reseller
        status={status}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
      />
    </>
  );
}
