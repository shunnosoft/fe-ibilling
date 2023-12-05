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
  getCollectorDashboardCardData,
  getCollectorDashboardCharts,
  getIspOwnerData,
  getPPPoEPackage,
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
import { Link } from "react-router-dom";
import Footer from "../../components/admin/footer/Footer";
import Inactive from "./dataComponent/Inactive";
import Expired from "./dataComponent/Expired";
import FreeCustomer from "./dataComponent/FreeCustomer";
import Paid from "./dataComponent/Paid";
import Unpaid from "./dataComponent/Unpaid";
import Active from "./dataComponent/Active";
import { getHotspotPackageSuccess } from "../../features/packageSlice";
import useISPowner from "../../hooks/useISPOwner";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";

export default function CollectorDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { ispOwnerId, bpSetting, permissions } = useISPowner();

  //get ispOwner data when logged in
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.currentUser.ispOwner
  );

  //get ispOwner Info
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  // get collectorId
  const collectorId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.collector.id
  );

  //get dashboard different cards data
  const customerStat = useSelector((state) => state.chart.customerStat);

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  //get graph data
  const ChartsData = useSelector((state) => state.chart.charts);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //all internal states
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDashboardData, setLoadingDashboardData] = useState(false);
  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);

  // choose modal handle
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);

  //all dates states
  const date = new Date();
  const newYear = date.getFullYear();
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(date);

  //api calls
  useEffect(() => {
    Object.keys(ispOwner)?.length === 0 &&
      getIspOwnerData(dispatch, ispOwnerId, setIsLoading);

    //get graph chart data
    getCollectorDashboardCharts(setLoading, dispatch, collectorId, Year, Month);

    //get card data
    getCollectorDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      collectorId
    );

    //get all customer package
    getAllPackages(dispatch, ispOwnerId, setIsLoading);

    // get pppoe package api call
    getPPPoEPackage(dispatch, ispOwnerId, setIsLoading);

    // get hotspot package api call
    getHotspotPackageSuccess(dispatch, ispOwnerId, setIsLoading);

    // get netFee bulletin api call
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
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
    getCollectorDashboardCharts(setLoading, dispatch, collectorId, Year, Month);
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
        (customerStat.totalOwnCollection /
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

    getCollectorDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      collectorId,
      filterData
    );
  };

  //filter card information
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    getCollectorDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      collectorId,
      filterData
    );
  };

  return (
    <>
      <div className="container homeWrapper">
        {loadingDashboardData && (
          <div
            className={`d-flex justify-content-center align-items-center Loader ${
              loadingDashboardData && "d-block"
            }`}
          >
            <div class="d-flex justify-content-center align-items-center spinner-square">
              <div class="square-1 square"></div>
              <div class="square-2 square"></div>
              <div class="square-3 square"></div>
            </div>
          </div>
        )}

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
                        <AnimatedProgressProvider
                          valueStart={0}
                          valueEnd={Math.round(collectionPercentage)}
                          duration={1}
                          s
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
                        {t("totalCollection")}
                        <br /> ৳ &nbsp;
                        {FormatNumber(customerStat?.totalOwnCollection)}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  {permissions?.dashboardCollectionData && (
                    <div className="d-flex justify-content-between align-items-center">
                      <p
                        className="fw-700 me-3"
                        style={{ fontSize: "20px", cursor: "pointer" }}
                        onClick={() => {
                          setStatus("active");
                          setShow(true);
                        }}
                      >
                        {t("active")} &nbsp;
                        <span className="text-secondary fw-bold">
                          ৳{FormatNumber(customerStat?.totalActiveAmount)}
                        </span>
                      </p>

                      <p
                        className="fw-700"
                        style={{ fontSize: "20px", cursor: "pointer" }}
                        onClick={() => {
                          setStatus("expired");
                          setShow(true);
                        }}
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
                          ৳{FormatNumber(customerStat.newCustomerBillCount)}
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
                      style={{ fontSize: "16px" }}
                      onClick={() => {
                        setStatus("active");
                        setShow(true);
                      }}
                    >
                      {t("active")}
                      <h4>{FormatNumber(customerStat?.active)}</h4>
                    </p>

                    {permissions?.dashboardCollectionData && (
                      <p
                        className="dashboardActive pb-0"
                        style={{ fontSize: "15px", marginTop: "0px" }}
                        onClick={() => {
                          setStatus("active");
                          setShow(true);
                        }}
                      >
                        {t("active")}
                        &nbsp;
                        <span className="text-info">
                          ৳{FormatNumber(customerStat?.totalActiveAmount)}
                        </span>
                      </p>
                    )}
                    <p
                      className="dashboardActive pb-1"
                      style={{ fontSize: "15px", marginBottom: "0px" }}
                      onClick={() => {
                        setStatus("inactive");
                        setShow(true);
                      }}
                    >
                      {t("in active")}: {FormatNumber(customerStat?.inactive)}
                      &nbsp;
                      {permissions?.dashboardCollectionData && (
                        <span className="text-info">
                          ৳{FormatNumber(customerStat?.totalInactiveAmount)}
                        </span>
                      )}
                    </p>
                    <p
                      className="dashboardActive pb-1"
                      style={{ fontSize: "15px", marginBottom: "0px" }}
                      onClick={() => {
                        setStatus("expired");
                        setShow(true);
                      }}
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
                      className="dashboardActive pb-1"
                      style={{ fontSize: "16px" }}
                      onClick={() => {
                        setStatus("paid");
                        setShow(true);
                      }}
                    >
                      {t("paid")}
                      <h4>{FormatNumber(customerStat?.paid)}</h4>
                    </p>

                    <p
                      className="dashboardActive pb-1"
                      style={{ fontSize: "15px", paddingTop: "10px" }}
                      onClick={() => {
                        setStatus("unpaid");
                        setShow(true);
                      }}
                    >
                      {t("unpaid")}: {FormatNumber(customerStat?.unpaid)}
                    </p>

                    <p
                      className="dashboardUnpaid pb-1"
                      style={{
                        fontSize: "15px",
                        paddingTop: "0px",
                      }}
                      onClick={() => {
                        setStatus("freeCustomer");
                        setShow(true);
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
                  <div className="cardIcon">
                    <Coin />
                  </div>
                  <div className="chartSection">
                    {permissions?.dashboardCollectionData && (
                      <>
                        <p style={{ fontSize: "16px" }}>
                          {t("total collection")}
                        </p>
                        <h2>
                          ৳ {FormatNumber(customerStat?.totalOwnCollection)}
                        </h2>
                      </>
                    )}

                    <p
                      className={
                        !permissions?.dashboardCollectionData ? "fs-6" : "fs-13"
                      }
                    >
                      {t("today collection")} &nbsp;৳
                      {FormatNumber(customerStat?.totalOwnCollectionToday)}
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
          </div>
          <Footer />
        </FontColor>
      </div>

      {/* dashboard modal */}

      {/* all active customers modal */}
      {status === "active" && (
        <Active
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all active customers modal */}
      {status === "inactive" && (
        <Inactive
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all expired customers modal */}
      {status === "expired" && (
        <Expired
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all paid customers modal */}
      {status === "paid" && (
        <Paid
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* all unpaid customers modal */}
      {status === "unpaid" && (
        <Unpaid
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* owner free customer modal */}
      {status === "freeCustomer" && (
        <FreeCustomer
          status={status}
          modalShow={show}
          setModalShow={setShow}
          ispOwnerId={ispOwnerId}
          year={filterDate.getFullYear()}
          month={filterDate.getMonth() + 1}
        />
      )}

      {/* dashboard netFee bulletin added */}
      {(butPermission?.dashboard || butPermission?.allPage) && (
        <NetFeeBulletin />
      )}
    </>
  );
}
