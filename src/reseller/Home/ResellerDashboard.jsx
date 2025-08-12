// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import { easeQuadIn } from "d3-ease";
import "chart.js/auto";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import ReactDatePicker from "react-datepicker";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "../Home/home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { monthsName } from "./homeData";
import {
  getChartsReseller,
  getResellerCollectorBwlowCardData,
  getResellerDashboardOverViewData,
} from "../../features/apiCalls";
import FormatNumber from "../../components/common/NumberFormat";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import Loader from "../../components/common/Loader";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import DashboardCard from "../../pages/Home/dashboardCard/DashboardCard";

const ResellerDashboard = () => {
  const { t } = useTranslation();

  // current date
  const date = new Date();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, userData } = useISPowner();

  // get dashboard over view data form redux store
  const dashboardOverView = useSelector(
    (state) => state.chart.dashboardOverview
  );

  // get dashboard below collector card data form redux store
  const dashboardBelowCollectorCardData = useSelector(
    (state) => state.chart.dashboardBelowCollectorCardData
  );

  // get dashboard chart data
  const chartsData = useSelector((state) => state.chart.charts);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // loading state
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [collectorCardLoading, setCollectorCardLoading] = useState(false);

  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState([]);
  const dispatch = useDispatch();

  const [currentCollector, setCurrentCollector] = useState("");
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(date);

  // accordion eventKey state
  const [accordionKey, setAccordionKey] = useState([]);

  // get api call
  useEffect(() => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    // get dashboard over view api
    getResellerDashboardOverViewData(
      dispatch,
      setOverviewLoading,
      resellerId,
      filterData
    );

    // get dashboard chart api
    getChartsReseller(
      dispatch,
      resellerId,
      filterData,
      currentCollector,
      setChartLoading
    );

    // get iBilling bulletin permission api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  // set chart data
  useEffect(() => {
    let tempArr = [],
      tempCollection = [],
      tempCount = [];

    chartsData?.forEach((val) => {
      tempArr.push(val.total);
      tempCollection.push(val._id);
      tempCount.push(val.count);
    });

    setLabel(tempArr);
    setCollection(tempCollection);
    setCount(tempCount);
  }, [chartsData]);

  // dashboard accordion change api call
  const handleAccordionChange = (eventKey) => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    // set accordion key
    setAccordionKey(eventKey);

    if (
      eventKey.includes("collector") &&
      Object.keys(dashboardBelowCollectorCardData).length === 0
    ) {
      getResellerCollectorBwlowCardData(
        dispatch,
        setCollectorCardLoading,
        resellerId,
        filterData
      );
    }
  };

  // dashboard monthly filter controller
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    // get dashboard over view api
    getResellerDashboardOverViewData(
      dispatch,
      setOverviewLoading,
      resellerId,
      filterData
    );

    // get dashboard below admin date filter card api
    if (accordionKey.includes("collector")) {
      getResellerCollectorBwlowCardData(
        dispatch,
        setCollectorCardLoading,
        resellerId,
        filterData
      );
    }

    // get dashboard chart api
    getChartsReseller(
      dispatch,
      resellerId,
      filterData,
      currentCollector,
      setChartLoading
    );
  };

  // dashboard charts data filter handler
  const dashboardChartsDataFilter = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    // get dashboard chart api
    getChartsReseller(
      dispatch,
      resellerId,
      filterData,
      currentCollector,
      setChartLoading
    );
  };

  // probability amount calculation reseller
  const probabilityAmountCalculation = () => {
    return (
      dashboardOverView.totalProbableAmount -
      dashboardOverView.totalInactiveAmount
    );
  };

  //percantage calculation
  const collectionPercentage = dashboardOverView
    ? Math.floor(
        (dashboardOverView.totalMonthlyCollection /
          probabilityAmountCalculation()) *
          100
      )
    : 0;

  // for chart
  const chartOption = {
    labels: collection,
    datasets: [
      showGraphData === "amount"
        ? {
            label: "এমাউন্ট",
            data: label,
            backgroundColor: "rgb(110 110 110 / 24%)",
            borderJoinStyle: "round",
            borderColor: "#00a4e3",
            fill: "origin",
            borderWidth: 2,
          }
        : {
            label: "বিল",
            data: count,
            borderColor: "#0cc30c",
            borderWidth: 2,
            fill: "origin",
            backgroundColor: "rgb(110 110 110 / 24%)",
          },
    ],
  };

  return (
    <div className="container homeWrapper">
      {overviewLoading && (
        <div
          className={`d-flex justify-content-center align-items-center Loader ${
            overviewLoading && "d-block"
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
          <div className="row mb-3">
            <div className="col-md-12 mb-3">
              <div className="row">
                <div className="col-md-3 d-flex justify-content-end align-items-center">
                  <h2>
                    {t("possibleCollection")}
                    <br /> ৳ &nbsp;
                    {FormatNumber(probabilityAmountCalculation())}
                  </h2>
                </div>

                <div className="col-md-6">
                  <div style={{ width: 200, height: 200, margin: "0 auto" }}>
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
                            text={`${isNaN(roundedValue) ? 0 : roundedValue}%`}
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
                    {t("collection")} <br /> ৳ &nbsp;
                    {FormatNumber(dashboardOverView.totalMonthlyCollection)}
                  </h2>
                </div>
              </div>

              <div className="d-flex justify-content-end">
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
                    minDate={new Date(ispOwnerData.createdAt)}
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

            {/* dashboard over view card */}
            <DashboardCard
              dashboardCard={dashboardOverView}
              cardRole={"overView"}
            />
          </div>

          {dashboardOverView.collectors?.length > 0 && (
            <Accordion
              alwaysOpen
              onSelect={handleAccordionChange}
              activeKey={accordionKey}
            >
              <Accordion.Item eventKey="collector">
                <Accordion.Header className="shadow-none">
                  <h4 className="mb-0">{t("roleCollector")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  {/* dashboard below collector card */}
                  <DashboardCard
                    dashboardCard={dashboardBelowCollectorCardData}
                    isLoading={collectorCardLoading}
                    filterDate={filterDate}
                    cardRole={"collectorCard"}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}

          <FourGround>
            <div className="ChartsHeadernew mt-3">
              <div className="selectGraph">
                <h3> {t("collection")} </h3>
                <div>
                  <input
                    type="radio"
                    name="graphSelectRadio"
                    checked={showGraphData === "amount" && "checked"}
                    onChange={() => setShowGraphData("amount")}
                  />
                   <label htmlFor="html"> {t("amount")} </label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="graphSelectRadio"
                    onChange={() => setShowGraphData("bill")}
                  />
                    <label htmlFor="css"> {t("bill")} </label>
                </div>
              </div>

              <div className="ChartsFilternew">
                <select
                  className="form-select chartFilteritem"
                  onChange={(e) => setCurrentCollector(e.target.value)}
                >
                  <option value=""> {t("all collector")} </option>
                  {dashboardOverView.collectors?.map((c, key) => (
                    <option key={key} value={c.user}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select chartFilteritem"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value={Year}>{Year}</option>
                  <option value={Year - 1}>{Year - 1}</option>
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
                  onClick={dashboardChartsDataFilter}
                >
                  {t("filter")}
                </button>
              </div>
            </div>

            <div className="lineChart">
              <Line
                data={chartOption}
                height={400}
                width={600}
                options={{
                  tension: 0.4,
                  maintainAspectRatio: false,
                }}
              />
            </div>

            {(butPermission?.dashboard || butPermission?.allPage) && (
              <NetFeeBulletin />
            )}
          </FourGround>
        </div>
      </FontColor>
    </div>
  );
};

export default ResellerDashboard;
