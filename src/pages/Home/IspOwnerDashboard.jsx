// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactDatePicker from "react-datepicker";
import { easeQuadIn } from "d3-ease";
import { Accordion } from "react-bootstrap";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import {
  getDashboardBelowCollectorCardData,
  getDashboardBelowIspOwnerCardData,
  getDashboardBelowManagerCardData,
  getDashboardBelowResellerCardData,
  getIspOwnerDashboardOverViewData,
} from "../../features/apiCalls";
import { getIspOwnerCharts } from "../../features/apiCalls";
import FormatNumber from "../../components/common/NumberFormat";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import Loader from "../../components/common/Loader";
import Footer from "../../components/admin/footer/Footer";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import DashboardCard from "./dashboardCard/DashboardCard";
import PaymentAlert from "./PaymentAlert";
import { userStaffs } from "../../features/getIspOwnerUsersApi";
import { ArrowClockwise } from "react-bootstrap-icons";

const IspOwnerDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get current date
  const getDate = new Date();
  const currentDate = {
    year: getDate.getFullYear(),
    month: getDate.getMonth() + 1,
  };

  // full year twelve months
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

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, ispOwnerId, bpSettings } = useISPowner();

  // get dashboard over view data form redux store
  const dashboardOverView = useSelector(
    (state) => state.chart.dashboardOverview
  );

  // get dashboard Below  admin card data form redux store
  const dashboardBelowAdminCardData = useSelector(
    (state) => state.chart.dashboardBelowAdminCardData
  );

  // get dashboard Below manager card data form redux store
  const dashboardBelowManagerCardData = useSelector(
    (state) => state.chart.dashboardBelowManagerCardData
  );

  // get dashboard Below collector card data form redux store
  const dashboardBelowCollectorCardData = useSelector(
    (state) => state.chart.dashboardBelowCollectorCardData
  );

  // get dashboard Below reseller card data form redux store
  const dashboardBelowResellerCardData = useSelector(
    (state) => state.chart.dashboardBelowResellerCardData
  );

  // get user staff data from redux store
  const staffs = useSelector((state) => state?.ownerUsers?.userStaff);

  //get graph data
  const ChartsData = useSelector((state) => state.chart.charts);

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // loading states
  const [isLoading, setIsloading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [adminCardLoading, setAdminCardLoading] = useState(false);
  const [managerCardLoading, setManagerCardLoading] = useState(false);
  const [collectorCardLoading, setCollectorCardLoading] = useState(false);
  const [resellerCardLoading, setResellerCardLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGraphData, setShowGraphData] = useState("amount");
  const [label, setLabel] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);
  const [currentCollector, setCurrentCollector] = useState("");

  // accordion eventKey state
  const [accordionKey, setAccordionKey] = useState([]);

  //all dates states
  const date = new Date();
  const newYear = date.getFullYear();
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());
  const [filterDate, setFilterDate] = useState(date);

  const minMonth = new Date(ispOwnerData?.createdAt);
  minMonth.setDate(1);

  //api calls
  useEffect(() => {
    // get dashboard over view api
    Object.keys(dashboardOverView)?.length === 0 &&
      getIspOwnerDashboardOverViewData(
        dispatch,
        setDashboardLoading,
        ispOwnerId,
        currentDate
      );

    //get graph chart data
    getIspOwnerCharts(setLoading, dispatch, ispOwnerId, Year, Month);

    // get all user api
    staffs?.length === 0 && userStaffs(dispatch);

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

  // dashboard accordion change api call
  const handleAccordionChange = (eventKey) => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    // set accordion key
    setAccordionKey(eventKey);

    if (
      eventKey.includes("admin") &&
      Object.keys(dashboardBelowAdminCardData).length === 0
    ) {
      getDashboardBelowIspOwnerCardData(
        dispatch,
        setAdminCardLoading,
        ispOwnerId,
        filterData
      );
    }

    if (eventKey.includes("manager")) {
      getDashboardBelowManagerCardData(
        dispatch,
        setManagerCardLoading,
        ispOwnerId,
        filterData
      );
    }

    if (eventKey.includes("collector")) {
      getDashboardBelowCollectorCardData(
        dispatch,
        setCollectorCardLoading,
        ispOwnerId,
        filterData
      );
    }

    if (
      eventKey.includes("reseller") &&
      Object.keys(dashboardBelowResellerCardData).length === 0
    ) {
      getDashboardBelowResellerCardData(
        dispatch,
        setResellerCardLoading,
        ispOwnerId,
        filterData
      );
    }
  };

  // dashboard filter date api
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    // get dashboard over view api
    getIspOwnerDashboardOverViewData(
      dispatch,
      setDashboardLoading,
      ispOwnerId,
      filterData
    );

    // get dashboard below admin date filter card api
    if (accordionKey.includes("admin")) {
      getDashboardBelowIspOwnerCardData(
        dispatch,
        setAdminCardLoading,
        ispOwnerId,
        filterData
      );
    }

    // get dashboard below manager date filter card api
    if (accordionKey.includes("manager")) {
      getDashboardBelowManagerCardData(
        dispatch,
        setManagerCardLoading,
        ispOwnerId,
        filterData
      );
    }

    // get dashboard below collector date filter card api
    if (accordionKey.includes("collector")) {
      getDashboardBelowCollectorCardData(
        dispatch,
        setCollectorCardLoading,
        ispOwnerId,
        filterData
      );
    }

    // get dashboard below admin date filter card api
    if (accordionKey.includes("reseller")) {
      getDashboardBelowResellerCardData(
        dispatch,
        setResellerCardLoading,
        ispOwnerId,
        filterData
      );
    }
  };

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

  // probability amount calculation ispOwner permission wise
  const probabilityAmountCalculation = () => {
    if (bpSettings?.dashboardProbabilityAmountWithNewCustomer) {
      return (
        dashboardOverView.totalProbableAmount -
        dashboardOverView.totalInactiveAmount -
        dashboardOverView.newCustomerBillCount
      );
    } else {
      return (
        dashboardOverView.totalProbableAmount -
        dashboardOverView.totalInactiveAmount
      );
    }
  };

  //percantage calculation
  const collectionPercentage = dashboardOverView
    ? Math.floor(
        ((bpSettings?.dashboardProbabilityAmountWithNewCustomer
          ? Math.abs(
              dashboardOverView.totalMonthlyCollection -
                dashboardOverView.newCustomerBillCollection -
                dashboardOverView.totalMonthlyDiscount
            )
          : Math.abs(
              dashboardOverView.totalMonthlyCollection -
                dashboardOverView.totalMonthlyDiscount
            )) /
          probabilityAmountCalculation()) *
          100
      )
    : 0;

  //reload cards handler
  const dashboardReloadHandler = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    getIspOwnerDashboardOverViewData(
      dispatch,
      setDashboardLoading,
      ispOwnerId,
      filterData
    );
  };

  return (
    <>
      <div className="container homeWrapper">
        {/* {dashboardLoading && (
          <div
            className={`d-flex justify-content-center align-items-center Loader ${
              dashboardLoading && "d-block"
            }`}
          >
            <div class="d-flex justify-content-center align-items-center spinner-square">
              <div class="square-1 square"></div>
              <div class="square-2 square"></div>
              <div class="square-3 square"></div>
            </div>
          </div>
        )} */}

        <ToastContainer position="top-right" theme="colored" />
        <FontColor>
          <div className="home">
            {/* card section */}

            <div className="row">
              {invoiceFlag === "UNPAID" && <PaymentAlert invoice={invoice} />}

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
                        valueEnd={Math.floor(collectionPercentage)}
                        duration={1}
                        easingFunction={easeQuadIn}
                      >
                        {(value) => {
                          const roundedValue = isNaN(value)
                            ? collectionPercentage
                            : Math.floor(value);
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
                      {t("collection")} <br /> ৳ &nbsp;
                      {FormatNumber(
                        bpSettings?.dashboardProbabilityAmountWithNewCustomer
                          ? Math.abs(
                              dashboardOverView.totalMonthlyCollection -
                                dashboardOverView.newCustomerBillCollection -
                                dashboardOverView.totalMonthlyDiscount
                            )
                          : Math.abs(
                              dashboardOverView.totalMonthlyCollection -
                                dashboardOverView.totalMonthlyDiscount
                            )
                      )}
                    </h2>
                  </div>
                </div>

                <div className="d-flex justify-content-between d_calculation_section">
                  <div></div>
                  <div
                    id="reload_search"
                    className="d-flex justify-content-end "
                  >
                    <div
                      className="addcutmButton me-1"
                      // id="dashboard_reload"
                      // className="d-flex justify-content-center align-items-center me-2"
                      // title={t("refresh")}
                      // style={{
                      //   borderRadius: "10%",
                      //   backgroundColor: "#F7E9D7",
                      // }}
                    >
                      {dashboardLoading ? (
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
                        placeholderText={t("filterDashboard")}
                        maxDate={new Date()}
                        minDate={minMonth}
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

              {/* dashboard overview card */}
              <DashboardCard
                dashboardCard={dashboardOverView}
                filterDate={filterDate}
                cardRole="overView"
              />
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
                      {staffs?.map((c, key) => (
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
                      <option value={index} key={index}>
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

            <Accordion
              alwaysOpen
              onSelect={handleAccordionChange}
              activeKey={accordionKey}
            >
              <Accordion.Item eventKey="admin">
                <Accordion.Header>
                  <h4 className="mb-0">{t("roleAdmin")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  {/* dashboard below admin card */}
                  <DashboardCard
                    dashboardCard={dashboardBelowAdminCardData}
                    isLoading={adminCardLoading}
                    filterDate={filterDate}
                    cardRole="adminCard"
                  />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="manager">
                <Accordion.Header>
                  <h4 className="mb-0">{t("roleManager")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  {/* dashboard below manager card */}
                  <DashboardCard
                    dashboardCard={dashboardBelowManagerCardData}
                    isLoading={managerCardLoading}
                    filterDate={filterDate}
                    cardRole="managerCard"
                  />
                </Accordion.Body>
              </Accordion.Item>

              {dashboardOverView.collectors > 0 && (
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
                      cardRole="collectorCard"
                    />
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {dashboardOverView.resellers > 0 && (
                <Accordion.Item eventKey="reseller">
                  <Accordion.Header className="shadow-none">
                    <h4 className="mb-0">{t("reseller")}</h4>
                  </Accordion.Header>
                  <Accordion.Body>
                    {/* dashboard below reseller card */}
                    <DashboardCard
                      dashboardCard={dashboardBelowResellerCardData}
                      isLoading={resellerCardLoading}
                      filterDate={filterDate}
                      cardRole="resellerCard"
                    />
                  </Accordion.Body>
                </Accordion.Item>
              )}
            </Accordion>
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

export default IspOwnerDashboard;
