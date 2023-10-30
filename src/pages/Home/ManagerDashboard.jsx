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
  Coin,
  CurrencyDollar,
} from "react-bootstrap-icons";
import moment from "moment";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { monthsName } from "./homeData";
import {
  getAllPackages,
  getIspOwnerData,
  getManagerDashboardCardData,
  getManagerDashboardCharts,
} from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { managerFetchSuccess } from "../../features/managerSlice";
import { showModal } from "../../features/uiSlice";
import FormatNumber from "../../components/common/NumberFormat";
// the hook
import { useTranslation } from "react-i18next";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import { easeQuadIn } from "d3-ease";
import ReactDatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import Footer from "../../components/admin/footer/Footer";
import Inactive from "./dataComponent/Inactive";
import Expired from "./dataComponent/Expired";
import FreeCustomer from "./dataComponent/FreeCustomer";
import Paid from "./dataComponent/Paid";
import Unpaid from "./dataComponent/Unpaid";
import Active from "./dataComponent/Active";
import AllCollector from "./dataComponent/AllCollector";
import Discount from "./dataComponent/Discount";
import { getHotspotPackage } from "../../features/hotspotApi";
import useISPowner from "../../hooks/useISPOwner";

export default function ManagerDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, bpSetting, permissions } = useISPowner();

  //get ispOwner data for logged in user
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.currentUser.ispOwner
  );

  //get ispOwner data from any component
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  // get userdata
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // get managerId
  const managerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.manager.id
  );

  //get dashboard different cards data
  const customerStat = useSelector((state) => state.chart.customerStat);

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  //get graph data
  const ChartsData = useSelector((state) => state.chart.charts);

  //all internal states
  const [isLoading, setIsloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDashboardData, setLoadingDashboardData] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);

  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
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

  // discount modal state
  const [discountShow, setDiscountShow] = useState(false);

  //api calls
  useEffect(() => {
    Object.keys(ispOwner)?.length === 0 &&
      getIspOwnerData(dispatch, ispOwnerId, setIsloading);

    dispatch(managerFetchSuccess(userData));

    //get graph data
    getManagerDashboardCharts(
      setLoading,
      dispatch,
      managerId,
      Year,
      Month,
      currentCollector
    );

    //get card data
    getManagerDashboardCardData(dispatch, setLoadingDashboardData, managerId);

    getAllPackages(dispatch, ispOwnerId, setPackageLoading);

    // get hotspot package api call
    getHotspotPackage(dispatch, ispOwnerId, setPackageLoading);
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

  //chartsData for graph
  const chartsData = {
    labels: collection,
    datasets: [
      showGraphData === "amount"
        ? {
            label: t("এমাউন্ট"),
            data: label,
            backgroundColor: "rgb(110 110 110 / 24%)",
            borderJoinStyle: "round",
            borderColor: "#00a4e3",
            fill: "origin",
            borderWidth: 2,
          }
        : {
            label: t("বিল"),
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
    getManagerDashboardCharts(
      setLoading,
      dispatch,
      managerId,
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

  // probability amount calculation ispOwner permission wise
  const probabilityAmountCalculation = () => {
    if (bpSetting?.dashboardProbabilityAmountWithNewCustomer) {
      return (
        customerStat.totalProbableAmount -
        customerStat.totalInactiveAmount -
        customerStat.newCustomerBillCount
      );
    } else {
      return (
        customerStat.totalProbableAmount - customerStat.totalInactiveAmount
      );
    }
  };

  //percantage calculation
  const collectionPercentage = customerStat
    ? Math.round(
        (customerStat.totalMonthlyBillCollection /
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

    getManagerDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      managerId,
      filterData
    );
  };

  //filter card information
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    getManagerDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      managerId,
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
                {permissions?.dashboardCollectionData && (
                  <div className="row">
                    <div className="col-md-3 d-flex justify-content-end align-items-center">
                      <h2>
                        {t("possibleCollection")}
                        <br /> ৳ &nbsp;
                        {FormatNumber(probabilityAmountCalculation())}{" "}
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
                                  athTransition: "none",
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
                          customerStat?.totalMonthlyBillCollection -
                            customerStat?.totalMonthlyBillDiscount
                        )}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  {permissions?.dashboardCollectionData && (
                    <div className="d-flex justify-content-between align-items-center">
                      <p
                        className="fw-700 me-3"
                        data-bs-toggle="modal"
                        data-bs-target="#activeCustomer"
                        onClick={() => setStatus("active")}
                        style={{ fontSize: "20px", cursor: "pointer" }}
                      >
                        {t("active")} &nbsp;
                        <span className="text-secondary fw-bold">
                          ৳{FormatNumber(customerStat?.totalActiveAmount)}
                        </span>
                      </p>

                      <p
                        className="fw-700"
                        data-bs-toggle="modal"
                        data-bs-target="#expiredCustomer"
                        onClick={() => setStatus("expired")}
                        style={{ fontSize: "20px", cursor: "pointer" }}
                      >
                        {t("expired")} &nbsp;
                        <span className="text-secondary fw-bold">
                          ৳{FormatNumber(customerStat?.totalExpiredAmount)}
                        </span>
                      </p>
                    </div>
                  )}

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
                    <h2>{FormatNumber(customerStat?.customers)}</h2>

                    <Link to={"/other/customer"}>
                      <p
                        className="dashboardData"
                        style={{ fontSize: "15px", marginBottom: "0px" }}
                      >
                        {t("newCustomer")}:&nbsp;
                        {FormatNumber(customerStat.newCustomer)}
                        &nbsp;
                        <span className="text-info">
                          ৳ {FormatNumber(customerStat.newCustomerBillCount)}
                        </span>
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
                      className="dashboardActive pb-0"
                      data-bs-toggle="modal"
                      data-bs-target="#activeCustomer"
                      style={{ fontSize: "16px" }}
                      onClick={() => setStatus("active")}
                    >
                      {t("active")}
                      <h4>{FormatNumber(customerStat.active)}</h4>
                    </p>

                    {permissions?.dashboardCollectionData && (
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
                          ৳ {FormatNumber(customerStat?.totalActiveAmount)}
                        </span>
                      </p>
                    )}
                    <p
                      className="dashboardData pb-1 pt-0"
                      data-bs-toggle="modal"
                      data-bs-target="#inactiveCustomer"
                      onClick={() => setStatus("inactive")}
                      style={{ fontSize: "15px", marginBottom: "0px" }}
                    >
                      {t("in active")}: {FormatNumber(customerStat?.inactive)}
                      &nbsp;
                      {permissions?.dashboardCollectionData && (
                        <span className="text-info">
                          ৳ {FormatNumber(customerStat?.totalInactiveAmount)}
                        </span>
                      )}
                    </p>
                    <p
                      className="dashboardData pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#expiredCustomer"
                      onClick={() => setStatus("expired")}
                      style={{ fontSize: "15px", paddingTop: "0px" }}
                    >
                      {t("expired")}: {FormatNumber(customerStat?.expired)}
                      &nbsp;
                      {permissions?.dashboardCollectionData && (
                        <span className="text-info">
                          ৳{FormatNumber(customerStat?.totalExpiredAmount)}
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
                      className="dashboardUnpaid pb-0"
                      data-bs-toggle="modal"
                      onClick={() => setStatus("paid")}
                      data-bs-target="#paid"
                      style={{ fontSize: "16px" }}
                    >
                      {t("paid")}
                      <h4>{FormatNumber(customerStat.paid)}</h4>
                    </p>

                    <p
                      className="dashboardUnpaid pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#unPaid"
                      onClick={() => setStatus("unpaid")}
                      style={{ fontSize: "15px", paddingTop: "10px" }}
                    >
                      {t("unpaid")}: {FormatNumber(customerStat?.unpaid)}
                    </p>

                    <p
                      className="dashboardUnpaid pb-1"
                      data-bs-toggle="modal"
                      data-bs-target="#freeCustomer"
                      onClick={() => setStatus("freeCustomer")}
                      style={{
                        fontSize: "15px",
                        paddingTop: "0px",
                      }}
                    >
                      {t("freeCustomer")}:
                      {FormatNumber(customerStat?.freeCustomer)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div id="card4" className="dataCard">
                  <ThreeDotsVertical className="ThreeDots" />
                  <div className="cardIcon">৳</div>
                  <div className="chartSection">
                    {permissions?.dashboardCollectionData && (
                      <>
                        <p style={{ fontSize: "16px", paddingTop: "10px" }}>
                          {t("total collection")}
                          <h4>
                            ৳
                            {FormatNumber(
                              customerStat?.totalMonthlyBillCollection -
                                customerStat?.totalMonthlyBillDiscount
                            )}
                          </h4>
                        </p>
                      </>
                    )}

                    {permissions?.dashboardCollectionData && (
                      <>
                        <p
                          className="dashboardCollection pb-0"
                          style={{ fontSize: "15px" }}
                          // onClick={() => {
                          //   setDiscountShow(true);
                          //   setStatus("discount");
                          // }}
                        >
                          {t("discount")}:&nbsp;
                          {FormatNumber(customerStat?.totalMonthlyBillDiscount)}
                        </p>

                        <p style={{ fontSize: "13px", paddingBottom: "0px" }}>
                          {t("withoutDiscount")}:
                          {FormatNumber(
                            customerStat?.totalMonthlyBillCollection
                          )}
                        </p>
                      </>
                    )}

                    <p
                      className={
                        !permissions?.dashboardCollectionData ? "fs-6" : "fs-13"
                      }
                    >
                      {t("today collection")}
                      {FormatNumber(customerStat?.billCollectionToday)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            {permissions?.dashboardCollectionData && (
              <FourGround>
                <div className="ChartsHeadernew">
                  <div className="selectGraph">
                    <h4>{t("collection")}</h4>
                    <div>
                      <input
                        id="amount1"
                        type="radio"
                        name="graphSelectRadio"
                        checked={showGraphData === "amount" && "checked"}
                        onChange={() => setShowGraphData("amount")}
                      />
                       <label htmlFor="amount1">{t("amount")}</label>
                    </div>
                    <div>
                      <input
                        id="bill2"
                        type="radio"
                        name="graphSelectRadio"
                        onChange={() => setShowGraphData("bill")}
                      />
                        <label htmlFor="bill2">{t("bill")}</label>
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
                        {customerStat?.collectorStat?.map((c, key) => (
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
                          {val}
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
            )}

            {role === "manager" ? (
              <div className="row">
                <div className="col-md-3">
                  <div id="card5" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">৳</div>
                    <div className="chartSection">
                      {permissions?.dashboardCollectionData && (
                        <>
                          <p style={{ fontSize: "16px" }}>
                            {t("totalMonthlyCollection")}
                          </p>
                          <h2>
                            ৳
                            {FormatNumber(
                              customerStat?.totalMonthlyBillCollection -
                                customerStat?.totalMonthlyBillDiscount
                            )}
                          </h2>
                        </>
                      )}

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectionByManager")}:
                        {FormatNumber(customerStat?.billCollectionToday)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div id="card5" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">৳</div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>
                        {t("totalOwnCollection")}
                      </p>
                      <h2>
                        ৳ {FormatNumber(customerStat?.totalOwnCollection)}
                      </h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectionByManager")}:
                        {FormatNumber(customerStat?.totalOwnCollectionToday)}
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
                        ৳ {FormatNumber(customerStat?.totalManagerDeposit)}
                      </h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectionByManager")}:
                        {FormatNumber(customerStat?.todayManagerDeposit)}
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
                        {t("depositCollection")}
                      </p>
                      <h2>
                        ৳ {FormatNumber(customerStat?.totalDepositByCollectors)}
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
                        ৳ {FormatNumber(customerStat?.managerStaffSalarySum)}
                      </h2>
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
                        ৳ {FormatNumber(customerStat?.managerExpenditure)}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div id="card7" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">৳</div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("managersBalance")}</p>
                      <h2>৳ {FormatNumber(customerStat.balance)}</h2>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div
                    id="card5"
                    className="dataCard"
                    data-bs-toggle="modal"
                    data-bs-target="#allCollector"
                    onClick={() => setStatus("collector")}
                    style={{ cursor: "pointer" }}
                  >
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">৳</div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("collector")}</p>
                      <h2>{customerStat?.collectorStat?.length}</h2>

                      {permissions?.dashboardCollectionData && (
                        <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                          {t("totalCollection")}:
                          {FormatNumber(customerStat?.collectorsBillCollection)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
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

      <Discount
        show={discountShow}
        setShow={setDiscountShow}
        ispOwnerId={ispOwnerId}
        year={filterDate.getFullYear()}
        month={filterDate.getMonth() + 1}
        status={status}
      />
    </>
  );
}
