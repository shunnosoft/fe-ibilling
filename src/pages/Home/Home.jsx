// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

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
import { cardData, monthsName } from "./homeData";
import {
  fetchMikrotik,
  fetchReseller,
  getArea,
  getCollector,
  getIspOwnerData,
  getManger,
} from "../../features/apiCalls";
import { getCharts, getDashboardCardData } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { managerFetchSuccess } from "../../features/managerSlice";
import { showModal } from "../../features/uiSlice";
import { FetchAreaSuccess } from "../../features/areaSlice";
import FormatNumber from "../../components/common/NumberFormat";
// the hook
import { useTranslation } from "react-i18next";
import GaugeChart from "react-gauge-chart";

export default function Home() {
  const { t } = useTranslation();

  const role = useSelector((state) => state.persistedReducer.auth.role);
  // console.log(role)
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const allCollector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  const manager = useSelector(
    (state) => state.persistedReducer.manager.manager
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const ChartsData = useSelector(
    (state) => state.persistedReducer.chart.charts
  );

  const customerStat = useSelector(
    (state) => state.persistedReducer.chart.customerStat
  );
  console.log({ customerStat });
  const invoice = useSelector(
    (state) => state.persistedReducer.invoice.invoice
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
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth.currentUser?.collector.areas
      : []
  );
  const chartsData = {
    // labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: collection,
    datasets: [
      showGraphData === "amount"
        ? {
            label: t("এমাউন্ট"),
            data: label,
            backgroundColor: "rgb(110 110 110 / 24%)",
            borderJoinStyle: "round",
            borderColor: "#00a4e3",
            // borderCapStyle: "bevel" || "round" || "miter",
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

  // select colloectors
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
  }, [allCollector, manager]);

  useEffect(() => {
    getIspOwnerData(dispatch, ispOwnerId);

    if (role === "ispOwner") {
      getManger(dispatch, ispOwnerId);
      fetchReseller(dispatch, ispOwnerId);
    }
    if (role === "manager") {
      dispatch(managerFetchSuccess(userData));
      getIspOwnerData(dispatch, ispOwnerId);
    }

    if (role === "ispOwner" || role === "manager" || role === "reseller") {
      getCollector(dispatch, ispOwnerId);

      fetchMikrotik(dispatch, ispOwnerId);
      getArea(dispatch, ispOwnerId);
    }

    //for all roles
    // getArea(dispatch, IDBOpenDBRequest)
    if (role === "collector") {
      getCharts(dispatch, ispOwnerId, Year, Month, userData?.user);
      fetchMikrotik(dispatch, ispOwnerId);

      let areas = [];

      collectorArea?.map((item) => {
        let area = {
          id: item.area?.id,
          name: item.area?.name,
          subAreas: [
            {
              id: item?.id,
              name: item?.name,
            },
          ],
        };

        let found = areas?.find((area) => area.id === item?.area?.id);
        if (found) {
          found.subAreas.push({ id: item?.id, name: item?.name });

          return (areas[areas.findIndex((item) => item.id === found.id)] =
            found);
        } else {
          return areas.push(area);
        }
      });
      dispatch(FetchAreaSuccess(areas));
      getDashboardCardData(dispatch, ispOwnerId, null, userData?.id);
    } else {
      getCharts(dispatch, ispOwnerId, Year, Month);
      getDashboardCardData(dispatch, ispOwnerId);
    }

    // if (!invoice) getUnpaidInvoice(dispatch, ispOwnerId, setIsloading);
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
      getCharts(dispatch, ispOwnerId, Year, Month, userData?.user);
    } else {
      getCharts(dispatch, ispOwnerId, Year, Month, currentCollector);
    }
  };

  let invoiceFlag;

  if (invoice) {
    if (new Date(invoice?.dueDate).getTime() < new Date().getTime()) {
      invoiceFlag = "EXPIRED";
    } else {
      invoiceFlag = "UNPAID";
    }
  }

  let totalCollection = 0,
    totalCount = 0;
  ChartsData.map((item) => {
    totalCollection += item.total;
    totalCount += item.count;
  });

  // const payNowHandler = (invoice) => {
  //   initiatePayment(invoice);
  // };

  const invoiceType = {
    monthlyServiceCharge: t("month"),
    registration: t("register"),
  };

  const calculationOfBillStat = () => {
    if (customerStat.collectorStat) {
      const totalBillCollectionToday = customerStat.collectorStat.reduce(
        (prev, curr) => prev + curr.todayBillCollection,
        0
      );
      return totalBillCollectionToday;
    }
  };

  const totalCollectorDeposite = () => {
    if (customerStat.collectorStat) {
      const totalCollectorDeposite = customerStat.collectorStat.reduce(
        (prev, curr) => prev + curr.totalDeposit,
        0
      );
      return totalCollectorDeposite;
    }
  };

  return (
    <div className="container homeWrapper">
      <ToastContainer position="top-right" theme="colored" />
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            <h2 className="dashboardTitle">{t("dashboard")}</h2>

            {invoiceFlag === "UNPAID" && (
              <div className="col-md-12 mb-3 pt-3 pb-3 badge bg-primary text-wrap fs-5 text">
                <div className="mb-1 pt-1 pb-1">{`নেটফি ${
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

            {/* {cardData.map((val, key) => {
              return (
                <div className="col-md-3" key={key}>
                  <div id={val.classnam} className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">{val.icon}</div>
                    <div className="chartSection">
                      <p>{val.title}</p>
                      <h2>{val.balance}</h2>
                    </div>
                  </div>
                </div>
              );
            })} */}

            <div className="col-md-3">
              <div id="card1" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <People />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}>{t("total customer")}</p>
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
                  <p style={{ fontSize: "18px" }}>{t("active")}</p>
                  <h2>{FormatNumber(customerStat.active)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("in active")} {FormatNumber(customerStat.inactive)}
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
                  <p style={{ fontSize: "18px" }}>{t("paid")}</p>
                  <h2>{FormatNumber(customerStat.paid)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("due")} {FormatNumber(customerStat.unpaid)}
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
                  <p style={{ fontSize: "18px" }}>{t("total collection")}</p>
                  <h2>৳ {FormatNumber(totalCollection)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("today collection")}{" "}
                    {FormatNumber(
                      calculationOfBillStat() +
                        customerStat.totalManagerCollectionToday
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3" key={4}>
              <div id="card4" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <Coin />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}>
                    {t("totalManagerCollection")}
                  </p>
                  <h2>৳ {FormatNumber(customerStat.totalManagerCollection)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("todayTotalCollectionByManager")}{" "}
                    {FormatNumber(customerStat.totalManagerCollectionToday)}
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
                  <p style={{ fontSize: "18px" }}>
                    {t("totalManagerDeposite")}
                  </p>
                  <h2>{FormatNumber(customerStat.totalManagerDeposit)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("todayTotalManagerDeposite")}{" "}
                    {FormatNumber(customerStat.totalManagerDepositToday)}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div id="card2" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <CurrencyDollar />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}>
                    {t("totalCollectionByCollector")}
                  </p>
                  <h2>
                    {FormatNumber(customerStat.totalBillCollectionByCollector)}
                  </h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("todayTotalCollectionByCollector")}{" "}
                    {FormatNumber(calculationOfBillStat())}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3" key={2}>
              <div id="card1" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <PersonCheckFill />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}>
                    {t("totalCollectorDeposite")}
                  </p>
                  <h2>{FormatNumber(totalCollectorDeposite())}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("todayTotalCollectorDeposite")}{" "}
                    {FormatNumber(customerStat.inactive)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row ">
            <div className="col-md-3">
              <div id="card4" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <Coin />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}>{t("totalExpenditure")}</p>
                  <h2>{FormatNumber(customerStat.totalExpenditure)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("todayTotalExpenditure")}{" "}
                    {FormatNumber(customerStat.totalExpenditureToday)}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <GaugeChart
                id="gauge-chart3"
                nrOfLevels={20}
                arcWidth={0.3}
                percent={
                  customerStat
                    ? ((customerStat.totalMonthlyCollection /
                        customerStat.totalProbableAmount) *
                        100) /
                      100
                    : 0.0
                }
                animDelay={1000}
                textColor="red"
                style={{ width: "60%", margin: "0 auto" }}
              />
              <div className="speed_meter_text d-flex justify-content-around">
                <p>
                  {t("totalPossibilityBill")}:{customerStat.totalProbableAmount}
                </p>
                <p>
                  {t("totalMonthlyCollection")}:
                  {customerStat.totalMonthlyCollection}
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div id="card1" className="dataCard">
                <ThreeDotsVertical className="ThreeDots" />
                <div className="cardIcon">
                  <CurrencyDollar />
                </div>
                <div className="chartSection">
                  <p style={{ fontSize: "18px" }}>{t("totalDue")}</p>
                  <h2>{FormatNumber(customerStat.dueAmount)}</h2>

                  {/* <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("new customer")} {FormatNumber(customerStat.dueAmount)}
                  </p> */}
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
                <h3>{t("collection")}</h3>
                <div>
                  <input
                    type="radio"
                    name="graphSelectRadio"
                    checked={showGraphData === "amount" && "checked"}
                    onChange={() => setShowGraphData("amount")}
                  />
                   <label htmlFor="html">{t("amount")}</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="graphSelectRadio"
                    onChange={() => setShowGraphData("bill")}
                  />
                    <label htmlFor="css">{t("bill")}</label>
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
