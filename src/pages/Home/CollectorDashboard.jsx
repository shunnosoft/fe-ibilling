// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { easeQuadIn } from "d3-ease";
import ReactDatePicker from "react-datepicker";

// custom hook import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { monthsName } from "./homeData";
import {
  getCollectorDashboardCardData,
  getCollectorDashboardCharts,
} from "../../features/apiCalls";
import FormatNumber from "../../components/common/NumberFormat";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import Loader from "../../components/common/Loader";
import Footer from "../../components/admin/footer/Footer";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import DashboardCard from "./dashboardCard/DashboardCard";
import PaymentAlert from "./PaymentAlert";
import { ArrowClockwise } from "react-bootstrap-icons";

const CollectorDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { ispOwnerData, bpSettings, permissions } = useISPowner();

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

  //all dates states
  const date = new Date();
  const newYear = date.getFullYear();
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(date);

  //================// API CALL's //================//
  useEffect(() => {
    //---> @Get collector dashboard overview monthly business summary data
    !Object.keys(customerStat).length &&
      getCollectorDashboardCardData(
        dispatch,
        setLoadingDashboardData,
        collectorId
      );

    //---> @Get collector dashboard middle monthly collection chart data
    !ChartsData?.length &&
      getCollectorDashboardCharts(
        setLoading,
        dispatch,
        collectorId,
        Year,
        Month
      );

    //---> @Get netFee app page bulletin permission data
    !Object.keys(butPermission)?.length && getBulletinPermission(dispatch);
  }, []);

  //---> IspOwner Dashboard monthly filter handler
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    //---> @Get collector dashboard overview monthly business summary data
    getCollectorDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      collectorId,
      filterData
    );
  };

  //---> IspOwner dashboard monthly filter refresh handler
  const dashboardReloadHandler = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    //---> @Get collector dashboard overview monthly business summary data
    getCollectorDashboardCardData(
      dispatch,
      setLoadingDashboardData,
      collectorId,
      filterData
    );

    //---> @Get collector dashboard middle monthly collection chart data
    getCollectorDashboardCharts(
      setLoading,
      dispatch,
      collectorId,
      filterDate.getFullYear(),
      filterDate.getMonth()
    );
  };

  //---> Collector Dashboard below monthly collection graph chard filter handler
  const handleFilterHandler = () => {
    //---> @Get collector dashboard overview monthly business summary data
    getCollectorDashboardCharts(setLoading, dispatch, collectorId, Year, Month);
  };

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

  // probability amount calculation ispOwner permission wise
  const probabilityAmountCalculation = () => {
    if (bpSettings?.dashboardProbabilityAmountWithNewCustomer) {
      return (
        customerStat.totalProbableAmount - customerStat.totalInactiveAmount
      );
    } else {
      return (
        customerStat.totalProbableAmount -
        customerStat.newCustomerBillCount -
        customerStat.totalInactiveAmount
      );
    }
  };

  //percantage calculation
  const collectionPercentage = customerStat
    ? Math.round(
        ((bpSettings?.dashboardProbabilityAmountWithNewCustomer
          ? Math.abs(customerStat.totalMonthlyCollection)
          : customerStat.totalMonthlyCollection -
            customerStat.newCustomerBillCollection) /
          probabilityAmountCalculation()) *
          100
      )
    : 0;

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
              <PaymentAlert invoice={invoice} />

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
                        {t("collection")}
                        <br /> ৳ &nbsp;
                        {FormatNumber(
                          bpSettings?.dashboardProbabilityAmountWithNewCustomer
                            ? Math.abs(customerStat.totalMonthlyCollection)
                            : customerStat.totalMonthlyCollection -
                                customerStat.newCustomerBillCollection
                        )}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <div></div>
                  <div className="d-flex justify-content-end">
                    <div className="addcutmButton me-1">
                      {loading || loadingDashboardData ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={dashboardReloadHandler}
                        />
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

              {/* dashboard over view card */}
              <DashboardCard
                dashboardCard={customerStat}
                filterDate={filterDate}
                cardRole={"overView"}
              />
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
                        <option value={index} key={index}>
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

      {/* dashboard netFee bulletin added */}
      {(butPermission?.dashboard || butPermission?.allPage) && (
        <NetFeeBulletin />
      )}
    </>
  );
};
export default CollectorDashboard;
