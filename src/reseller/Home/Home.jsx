// external imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  People,
  ThreeDotsVertical,
  BarChartFill,
  PersonCheckFill,
  Coin,
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

export default function Home() {
  const { t } = useTranslation();
  const role = useSelector((state) => state.persistedReducer.auth.role);
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const allCollector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  const manager = useSelector(
    (state) => state.persistedReducer.manager.manager
  );
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );
  const ChartsData = useSelector(
    (state) => state.persistedReducer.chart.charts
  );
  const customerStat = useSelector(
    (state) => state.persistedReducer.chart.customerStat
  );

  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);
  const dispatch = useDispatch();

  const date = new Date();

  const [currentCollector, setCurrentCollector] = useState("");
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());

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
    getIspOwnerData(dispatch, ispOwnerId);

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
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );

    if (collectors.length === allCollector.length) {
      const { user, name, id } = manager;
      collectors.unshift({ name, user, id });
    }

    setCollectors(collectors);
  }, [allCollector, manager, dispatch, ispOwnerId, resellerId]);

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
        ispOwnerId,
        userData.collector.reseller,
        userData.collector.id
      );
    } else {
      getChartsReseller(dispatch, resellerId, Year, Month);
      getDashboardCardData(dispatch, ispOwnerId, resellerId);
    }
  }, [dispatch, resellerId, role, userData, Month, Year]);

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
      getCollector(dispatch, userData?.reseller.id);
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

  return (
    <div className="container homeWrapper">
      <ToastContainer position="top-right" theme="colored" />
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            <h2 className="dashboardTitle"> {t("dashboard")} </h2>
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
                    {t("new customer")} :{" "}
                    {FormatNumber(customerStat.newCustomer)}
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
                  <h2>৳ {FormatNumber(totalCollection)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("today collection")} ৳ {FormatNumber(todayCollection)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* chart section */}
          {/* <h2 className="dashboardTitle mt-2">কালেকশন</h2> */}
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
