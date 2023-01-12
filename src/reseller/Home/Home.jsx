// external imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import { easeQuadIn } from "d3-ease";
import "chart.js/auto";
import {
  People,
  ThreeDotsVertical,
  BarChartFill,
  PersonCheckFill,
  Coin,
  CurrencyDollar,
} from "react-bootstrap-icons";
// internal imports
// import "./home.css";
import "../Home/home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { cardData, monthsName } from "./homeData";
import { getCollector } from "../../features/apiCallReseller";
import {
  getChartsReseller,
  getDashboardCardData,
  getIspOwnerData,
} from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { FetchAreaSuccess } from "../../features/areaSlice";
// import { managerFetchSuccess } from "../../features/managerSlice";
import FormatNumber from "../../components/common/NumberFormat";
import { useTranslation } from "react-i18next";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import ReactDatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";
import { Accordion } from "react-bootstrap";

export default function Home() {
  const { t } = useTranslation();
  const role = useSelector((state) => state.persistedReducer.auth.role);
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const allCollector = useSelector((state) => state.collector.collector);
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );
  const ChartsData = useSelector((state) => state.chart.charts);
  const customerStat = useSelector((state) => state.chart.customerStat);
  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const date = new Date();

  const [currentCollector, setCurrentCollector] = useState("");
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(date);

  const chartsData = {
    // labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: collection,
    datasets: [
      showGraphData === "amount"
        ? {
            label: "এমাউন্ট",
            data: label,
            backgroundColor: "rgb(110 110 110 / 24%)",
            borderJoinStyle: "round",
            borderColor: "#00a4e3",
            // borderCapStyle: "bevel" || "round" || "miter",
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

  useEffect(() => {
    getIspOwnerData(dispatch, ispOwnerId, setIsLoading);

    if (role === "collector") {
      const areas = [];
      userData.collector?.areas.map((i) => {
        const arr = {
          name: i.name,
          id: i.id,
        };
        return areas.push(arr);
      });

      dispatch(FetchAreaSuccess(areas));
    }
  }, [dispatch, userData, role, ispOwnerId]);

  useEffect(() => {
    //for all roles
    if (role === "collector") {
      getChartsReseller(
        dispatch,
        userData.collector.reseller,
        Year,
        Month,
        userData?.collector.user
      );
      getDashboardCardData(
        dispatch,
        setIsLoading,
        ispOwnerId,
        userData.collector.reseller,
        userData.collector.id
      );
    } else {
      getCollector(dispatch, userData?.reseller.id, setIsLoading);
      getChartsReseller(dispatch, resellerId, Year, Month);
      getDashboardCardData(
        dispatch,
        setIsLoading,
        ispOwnerId,
        resellerId,
        null,
        filterDate
      );
    }
  }, []);

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

  const handleFilterHandler = () => {
    if (role === "collector") {
      getChartsReseller(
        dispatch,
        userData?.reseller.id,
        Year,
        Month,
        userData?.user
      );
    } else {
      getChartsReseller(
        dispatch,
        userData?.reseller.id,
        Year,
        Month,
        currentCollector
      );
    }
  };

  let totalCollection = 0,
    totalCount = 0,
    todayCollection = 0;
  ChartsData.map((item) => {
    totalCollection += item.total;
    totalCount += item.count;
    if (item.id === new Date().getDate()) {
      todayCollection = item.total;
    }
  });

  const collectionPercentage = customerStat
    ? Math.round(
        (customerStat.totalMonthlyCollection /
          customerStat.totalProbableAmount) *
          100
      )
    : 0;

  const dashboardFilterController = () => {
    //for all roles
    if (role === "collector") {
      getChartsReseller(
        dispatch,
        userData.collector.reseller,
        Year,
        Month,
        userData?.collector.user
      );
      getDashboardCardData(
        dispatch,
        setIsLoading,
        ispOwnerId,
        userData.collector.reseller,
        userData.collector.id
      );
    } else {
      getCollector(dispatch, userData?.reseller.id, setIsLoading);
      getChartsReseller(dispatch, resellerId, Year, Month);
      getDashboardCardData(
        dispatch,
        setIsLoading,
        ispOwnerId,
        resellerId,
        null,
        filterDate
      );
    }
  };

  return (
    <div className="container homeWrapper">
      <ToastContainer position="top-right" theme="colored" />
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            {role === "reseller" && (
              <>
                <div className="col-md-12 mb-3">
                  <div className="row">
                    <div className="col-md-3 d-flex justify-content-end align-items-center">
                      <h2>
                        {t("possibleCollection")} <br /> <CurrencyDollar />{" "}
                        {FormatNumber(customerStat.totalProbableAmount)}{" "}
                      </h2>
                    </div>
                    <div className="col-md-6">
                      <div
                        style={{ width: 200, height: 200, margin: "0 auto" }}
                      >
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
                        {t("totalCollection")} <br />
                        <CurrencyDollar />{" "}
                        {FormatNumber(customerStat.totalMonthlyCollection)}
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
                        minDate={new Date(userData.reseller.createdAt)}
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
              </>
            )}
            <div className="col-md-3" key={1}>
              <div id="card1" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <People />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}> {t("total customer")} </p>
                  <h2>{FormatNumber(customerStat.total)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("new customer")} {FormatNumber(customerStat.newCustomer)}
                  </p>
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
                  <p style={{ fontSize: "18px" }}> {t("active")} </p>
                  <h2>{FormatNumber(customerStat.active)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("in active")} : {FormatNumber(customerStat.inactive)}
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
                  <p style={{ fontSize: "18px" }}> {t("paid")} </p>
                  <h2>{FormatNumber(customerStat.paid)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("due")} : {FormatNumber(customerStat.unpaid)}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3" key={4}>
              <div id="card4" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <Coin />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}> {t("total collection")} </p>
                  <h2>৳ {FormatNumber(customerStat.totalMonthlyCollection)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("today collection")}{" "}
                    {FormatNumber(
                      customerStat.totalResellerCollectionToday +
                        customerStat.totalCollectorCollectionToday
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* chart section */}
          {/* <h2 className="dashboardTitle mt-2">কালেকশন</h2> */}

          <Accordion alwaysOpen>
            {role === "reseller" && (
              <Accordion.Item eventKey="2">
                <Accordion.Header className="shadow-none">
                  <h4 className="mb-0">{t("roleCollector")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="row ">
                    <div className="col-md-3">
                      <div id="card9" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">
                          <CurrencyDollar />
                        </div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("totalCollection")}
                          </p>
                          <h2>
                            ৳{" "}
                            {FormatNumber(
                              customerStat.totalBillCollectionByCollector
                            )}
                          </h2>

                          <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                            {t("todayTotalCollectionByCollector")}:{" "}
                            {FormatNumber(
                              customerStat.totalCollectorCollectionToday
                            )}
                          </p>
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
                            {FormatNumber(
                              customerStat.totalDepositByCollectors
                            )}
                          </h2>

                          {/* <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectorDeposite")}:{" "}
                        {FormatNumber(customerStat.inactive)}
                      </p> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div id="card13" className="dataCard">
                        <ThreeDotsVertical className="ThreeDots" />
                        <div className="cardIcon">
                          <CurrencyDollar />
                        </div>
                        <div className="chartSection">
                          <p style={{ fontSize: "16px" }}>
                            {t("managersBalance")}
                          </p>
                          <h2>৳ {customerStat.totalBalanceByCollectors}</h2>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-3">
                  <div id="card13" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <CurrencyDollar />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("totalProfit")}</p>
                      <h2>
                        ৳{" "}
                        {FormatNumber(
                          totalCollection - customerStat.totalExpenditure
                        )}
                      </h2>
                    </div>
                  </div>
                </div> */}

                    {/* <div className="col-md-3">
                  <div id="card12" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <CurrencyDollar />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("totalDue")}</p>
                      <h2>{FormatNumber(customerStat.dueAmount)}</h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("new customer")}:{" "}
                        {FormatNumber(customerStat.dueAmount)}
                      </p>
                    </div>
                  </div>
                </div> */}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>

          <br />
          <FourGround>
            <div className="ChartsHeadernew">
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
                {role === "collector" ? (
                  ""
                ) : (
                  <select
                    className="form-select chartFilteritem"
                    onChange={(e) => setCurrentCollector(e.target.value)}
                  >
                    <option value=""> {t("all collector")} </option>
                    {allCollector?.map((c, key) => (
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
                  <option value={Year}>{Year}</option>
                  <option value={Year - 1}>{Year - 1}</option>
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
                  {t("filter")}
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
        </div>
      </FontColor>
    </div>
  );
}
