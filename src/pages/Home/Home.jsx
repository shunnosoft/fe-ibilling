// external imports
import React, { useState, useEffect, useCallback } from "react";
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
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import { easeQuadIn } from "d3-ease";
import Table from "../../components/table/Table";
import ReactDatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";

export default function Home() {
  const { t } = useTranslation();

  const role = useSelector((state) => state.persistedReducer.auth.role);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.currentUser.ispOwner
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
  const invoice = useSelector(
    (state) => state.persistedReducer.invoice.invoice
  );
  const [isLoading, setIsloading] = useState(false);
  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);
  const dispatch = useDispatch();

  const date = new Date();

  const [currentCollector, setCurrentCollector] = useState("");
  const [collectorData, setCollectorData] = useState([]);
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(null);

  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth.currentUser?.collector.areas
      : []
  );
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

  useEffect(() => {
    setCollectorData(customerStat?.collectorStat);
  }, [customerStat]);

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
    getIspOwnerData(dispatch, ispOwnerId, setIsloading);

    if (role === "ispOwner") {
      getManger(dispatch, ispOwnerId);
      fetchReseller(dispatch, ispOwnerId);
    }
    if (role === "manager") {
      dispatch(managerFetchSuccess(userData));
      getIspOwnerData(dispatch, ispOwnerId, setIsloading);
    }

    if (role === "ispOwner" || role === "manager" || role === "reseller") {
      getCollector(dispatch, ispOwnerId);

      fetchMikrotik(dispatch, ispOwnerId);
      getArea(dispatch, ispOwnerId, setIsloading);
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
      getDashboardCardData(
        dispatch,
        setIsloading,
        ispOwnerId,
        null,
        userData?.id
      );
    } else {
      getCharts(dispatch, ispOwnerId, Year, Month);
      getDashboardCardData(dispatch, setIsloading, ispOwnerId);
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
    monthlyServiceCharge: t("monthly"),
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

  const collectionPersentage = customerStat
    ? Math.round(
        (customerStat.totalMonthlyCollection /
          customerStat.totalProbableAmount) *
          100
      )
    : 0;

  const managerBalanceCalculation = () => {
    const totalCollection =
      customerStat.totalManagerCollection +
      customerStat.totalDepositByCollectors;
    const totalCost =
      customerStat.managerExpenditure + customerStat.totalManagerDeposit;

    return FormatNumber(totalCollection - totalCost);
  };

  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    if (role === "collector") {
      getDashboardCardData(
        dispatch,
        setIsloading,
        ispOwnerId,
        null,
        userData?.id,
        filterData
      );
    } else {
      getDashboardCardData(
        dispatch,
        setIsloading,
        ispOwnerId,
        null,
        null,
        filterData
      );
    }
  };

  const columns = React.useMemo(
    () => [
      {
        width: "15%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "21%",
        Header: t("todayBillCollection"),
        accessor: "todayBillCollection",
      },
      {
        width: "21%",
        Header: t("totalBillCollected"),
        accessor: "totalBillCollected",
      },
      {
        width: "21%",
        Header: t("totalDepositCollector"),
        accessor: "totalDeposit",
      },
      {
        width: "21%",
        Header: t("balance"),
        accessor: "balance",
      },
    ],
    [t]
  );

  return (
    <div className="container homeWrapper">
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
            {/* <h2 className="dashboardTitle">{t("dashboard")}</h2> */}
            <div className="col-md-12 mb-3">
              <div className="row">
                <div className="col-md-3 d-flex justify-content-end align-items-center">
                  <h2>
                    {t("possibleCollection")} <br /> <CurrencyDollar />{" "}
                    {FormatNumber(customerStat.totalProbableAmount)}{" "}
                  </h2>
                </div>
                <div className="col-md-6">
                  <div style={{ width: 200, height: 200, margin: "0 auto" }}>
                    <AnimatedProgressProvider
                      valueStart={0}
                      valueEnd={Math.round(collectionPersentage)}
                      duration={1}
                      easingFunction={easeQuadIn}
                    >
                      {(value) => {
                        const roundedValue = isNaN(value)
                          ? collectionPersentage
                          : Math.round(value);
                        return (
                          <CircularProgressbar
                            value={roundedValue}
                            text={`${roundedValue}%`}
                            styles={buildStyles({ pathTransition: "none" })}
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
                <div className="d-flex justify-content-end">
                  <div>
                    <ReactDatePicker
                      selected={filterDate}
                      className="form-control shadow-none"
                      onChange={(date) => setFilterDate(date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      endDate={"2014/04/08"}
                      placeholderText={t("filterDashboard")}
                      maxDate={new Date()}
                      minDate={ispOwnerData.createdAt}
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-success ms-1 shadow-none"
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
                  <h2>{FormatNumber(customerStat.total)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("new customer")}:{" "}
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
                  <p style={{ fontSize: "16px" }}>{t("active")}</p>
                  <h2>{FormatNumber(customerStat.active)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("in active")}: {FormatNumber(customerStat.inactive)}
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
                  <p style={{ fontSize: "16px" }}>{t("paid")}</p>
                  <h2>{FormatNumber(customerStat.paid)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("due")}: {FormatNumber(customerStat.unpaid)}
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
                  <p style={{ fontSize: "16px" }}>{t("total collection")}</p>
                  <h2>৳ {FormatNumber(totalCollection)}</h2>

                  <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                    {t("today collection")}:{" "}
                    {FormatNumber(
                      calculationOfBillStat() +
                        customerStat.totalManagerCollectionToday +
                        customerStat.ispOwnerBillCollectionToday
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {role === "ispOwner" && (
            <>
              <div className="row">
                <h3>{t("roleAdmin")}</h3>
                <div className="col-md-3">
                  <div id="card12" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("totalCollection")}</p>
                      <h2>
                        ৳ {FormatNumber(customerStat.ispOwnerBillCollection)}
                      </h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("today")}:{" "}
                        {FormatNumber(customerStat.ispOwnerBillCollectionToday)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div id="card8" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("cost")}</p>
                      <h2>
                        ৳ {FormatNumber(customerStat.ispOwnerExpenditure)}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div id="card7" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>
                        {t("totalExpenditure")}
                      </p>
                      <h2>৳ {FormatNumber(customerStat.totalExpenditure)}</h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalExpenditure")}:{" "}
                        {FormatNumber(customerStat.totalExpenditureToday)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div id="card11" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <CurrencyDollar />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("salary")}</p>
                      <h2>৳ {FormatNumber(customerStat.totalSalary)}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <h3 className="mt-4">{t("roleManager")}</h3>
                <div className="col-md-3">
                  <div id="card12" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>
                        {t("customerCollection")}
                      </p>
                      <h2>
                        ৳ {FormatNumber(customerStat.totalManagerCollection)}
                      </h2>

                      {/* <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("totalCollectorDeposite")}:{" "}
                        {FormatNumber(customerStat.totalDepositByCollectors)}
                      </p> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div id="card14" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>
                        {t("depositCollection")}
                      </p>
                      <h2>
                        ৳ {FormatNumber(customerStat.totalDepositByCollectors)}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div id="card5" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>
                        {t("totalMonthlyCollection")}
                      </p>
                      <h2>
                        ৳{" "}
                        {FormatNumber(
                          customerStat.totalManagerCollection +
                            customerStat.totalDepositByCollectors
                        )}
                      </h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectionByManager")}:{" "}
                        {FormatNumber(customerStat.totalManagerCollectionToday)}
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
                        ৳ {FormatNumber(customerStat.totalManagerDeposit)}
                      </h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalManagerDeposite")}:{" "}
                        {FormatNumber(customerStat.totalManagerDepositToday)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div id="card8" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <Coin />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("cost")}</p>
                      <h2>৳ {FormatNumber(customerStat.managerExpenditure)}</h2>

                      {/* <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalExpenditure")}:{" "}
                        {FormatNumber(customerStat.totalExpenditureToday)}
                      </p> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div id="card7" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <CurrencyDollar />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("managersBalance")}</p>
                      <h2>৳ {managerBalanceCalculation()}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row ">
                <h3 className="mt-4">{t("roleCollector")}</h3>
                <div className="col-md-3">
                  <div id="card9" className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">
                      <CurrencyDollar />
                    </div>
                    <div className="chartSection">
                      <p style={{ fontSize: "16px" }}>{t("totalCollection")}</p>
                      <h2>
                        ৳{" "}
                        {FormatNumber(
                          customerStat.totalBillCollectionByCollector
                        )}
                      </h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectionByCollector")}:{" "}
                        {FormatNumber(calculationOfBillStat())}
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
                      <h2>৳ {FormatNumber(totalCollectorDeposite())}</h2>

                      <p style={{ fontSize: "15px", paddingTop: "10px" }}>
                        {t("todayTotalCollectorDeposite")}:{" "}
                        {FormatNumber(customerStat.inactive)}
                      </p>
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
                      <p style={{ fontSize: "16px" }}>{t("managersBalance")}</p>
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

              {/* <div className="row">
                <h3>{t("other")}</h3>
             
              </div> */}
            </>
          )}
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
          <FourGround>
            <div className="collectorWrapper pt-1">
              <div className="table-section">
                {collectorData && collectorData.length && (
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={collectorData}
                  ></Table>
                )}
              </div>
            </div>
          </FourGround>
        </div>
      </FontColor>
    </div>
  );
}
