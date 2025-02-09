// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from "react-i18next";
import { easeQuadIn } from "d3-ease";
import ReactDatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { monthsName } from "./homeData";
import {
  getDashboardBelowCollectorCardData,
  getManagerDashboardCardData,
  getManagerDashboardCharts,
  getManagerDashboardCollectionOverviewData,
  getManagerDashboardCustomerOverviewData,
} from "../../features/apiCalls";
import { managerFetchSuccess } from "../../features/managerSlice";
import FormatNumber from "../../components/common/NumberFormat";
import AnimatedProgressProvider from "../../components/common/AnimationProgressProvider";
import Loader from "../../components/common/Loader";
import Footer from "../../components/admin/footer/Footer";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import DashboardCard from "./dashboardCard/DashboardCard";
import PaymentAlert from "./PaymentAlert";
import { userStaffs } from "../../features/getIspOwnerUsersApi";
import useSelectorState from "../../hooks/useSelectorState";
import { ArrowClockwise } from "react-bootstrap-icons";

const ManagerDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get redux store state data from useSelectorState hooks
  const { userStaff } = useSelectorState();

  // get current date
  const getDate = new Date();
  const currentDate = {
    year: getDate.getFullYear(),
    month: getDate.getMonth() + 1,
  };

  // get user & current user data form useISPOwner
  const { role, ispOwnerData, ispOwnerId, bpSettings, permissions } =
    useISPowner();

  // get userdata
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // get managerId
  const managerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.manager.id
  );

  //get dashboard different cards data
  const customerStat = useSelector((state) => state.chart?.customerStat);

  // get dashboard collection over view data form redux store
  const dashboardOverviewManagerCollection = useSelector(
    (state) => state.chart.dashboardOverviewManagerCollection
  );

  // get dashboard customer over view data form redux store
  const dashboardOverviewManagerCustomer = useSelector(
    (state) => state.chart.dashboardOverviewManagerCustomer
  );

  // get dashboard Below collector card data form redux store
  const dashboardBelowCollectorCardData = useSelector(
    (state) => state.chart.dashboardBelowCollectorCardData
  );

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  //get graph data
  const ChartsData = useSelector((state) => state.chart.charts);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //all internal states
  const [isLoading, setIsloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [belowCardLoading, setBelowCardLoading] = useState(false);
  const [managerCardLoading, setManagerCardLoading] = useState(false);
  const [collectorCardLoading, setCollectorCardLoading] = useState(false);
  const [overViewLoading, setOverViewLoading] = useState(false);

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

  //================// API CALL's //================//
  useEffect(() => {
    //===========================================================> FIRST API

    //---> @Get manager dashboard overview monthly collection data
    !Object.keys(dashboardOverviewManagerCollection).length &&
      getManagerDashboardCollectionOverviewData(
        dispatch,
        setOverViewLoading,
        managerId,
        currentDate
      );

    //---> @Get manager dashboard overview monthly customer data
    !Object.keys(dashboardOverviewManagerCustomer).length &&
      getManagerDashboardCustomerOverviewData(
        dispatch,
        setBelowCardLoading,
        managerId,
        currentDate
      );

    //---> @Get ispOwner staffs information with current user
    !userStaff?.length && userStaffs(dispatch);

    //---> @Get manager dashboard middle monthly collection chart data
    !ChartsData.length &&
      getManagerDashboardCharts(
        setLoading,
        dispatch,
        managerId,
        Year,
        Month,
        currentCollector
      );

    //---> User data dispatch manager slice
    dispatch(managerFetchSuccess(userData));

    //===========================================================> LAST API

    //---> @Get netFee app page bulletin permission data
    !Object.keys(butPermission)?.length && getBulletinPermission(dispatch);
  }, []);

  //---> Manager dashboard below accordion change handler
  const handleAccordionChange = (eventKey) => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    //---> Set local state accordion key value
    setAccordionKey(eventKey);

    if (eventKey.includes("manager")) {
      //---> @Get Manager dashboard below MANAGER card business summary
      !Object.keys(customerStat).length &&
        getManagerDashboardCardData(
          dispatch,
          setManagerCardLoading,
          managerId,
          filterData
        );
    }

    if (eventKey.includes("collector")) {
      //---> @Get Manager dashboard below COLLECTOR card business summary
      !Object.keys(dashboardBelowCollectorCardData).length &&
        getDashboardBelowCollectorCardData(
          dispatch,
          setCollectorCardLoading,
          ispOwnerId,
          filterData
        );
    }
  };

  //---> Manager Dashboard monthly filter handler
  const dashboardFilterController = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    //---> @Get manager dashboard overview monthly collection data
    getManagerDashboardCollectionOverviewData(
      dispatch,
      setOverViewLoading,
      managerId,
      filterData
    );

    //---> @Get manager dashboard overview monthly customer data
    getManagerDashboardCustomerOverviewData(
      dispatch,
      setBelowCardLoading,
      managerId,
      filterData
    );

    //---> @Get manager dashboard middle monthly collection chart data
    getManagerDashboardCharts(
      setLoading,
      dispatch,
      managerId,
      filterDate.getFullYear(),
      filterDate.getMonth(),
      currentCollector
    );

    //---> @Get Manager dashboard below MANAGER card business summary
    getManagerDashboardCardData(
      dispatch,
      setManagerCardLoading,
      managerId,
      filterData
    );

    //---> @Get Manager dashboard below COLLECTOR card business summary
    getDashboardBelowCollectorCardData(
      dispatch,
      setCollectorCardLoading,
      ispOwnerId,
      filterData
    );
  };

  //---> Manager dashboard monthly filter refresh handler
  const dashboardReloadHandler = () => {
    const filterData = {
      year: filterDate.getFullYear(),
      month: filterDate.getMonth() + 1,
    };

    //---> @Get manager dashboard overview monthly collection data
    getManagerDashboardCollectionOverviewData(
      dispatch,
      setOverViewLoading,
      managerId,
      filterData
    );

    //---> @Get manager dashboard overview monthly customer data
    getManagerDashboardCustomerOverviewData(
      dispatch,
      setBelowCardLoading,
      managerId,
      filterData
    );

    //---> @Get manager dashboard middle monthly collection chart data
    getManagerDashboardCharts(
      setLoading,
      dispatch,
      managerId,
      filterData.year,
      filterData.month,
      currentCollector
    );

    //---> @Get Manager dashboard below MANAGER card business summary
    getManagerDashboardCardData(
      dispatch,
      setManagerCardLoading,
      managerId,
      filterData
    );

    //---> @Get Manager dashboard below COLLECTOR card business summary
    getDashboardBelowCollectorCardData(
      dispatch,
      setCollectorCardLoading,
      ispOwnerId,
      filterData
    );
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
        dashboardOverviewManagerCustomer.totalProbableAmount -
        dashboardOverviewManagerCustomer.totalInactiveAmount
      );
    } else {
      return (
        dashboardOverviewManagerCustomer.totalProbableAmount -
        dashboardOverviewManagerCustomer.newCustomerBillCount -
        dashboardOverviewManagerCustomer.totalInactiveAmount
      );
    }
  };

  //percantage calculation
  const collectionPercentage = customerStat
    ? Math.round(
        ((bpSettings?.dashboardProbabilityAmountWithNewCustomer
          ? Math.abs(
              dashboardOverviewManagerCollection.totalMonthlyCollection -
                dashboardOverviewManagerCollection.totalMonthlyDiscount
            )
          : Math.abs(
              dashboardOverviewManagerCollection.totalMonthlyCollection -
                dashboardOverviewManagerCustomer.newCustomerBillCollection -
                dashboardOverviewManagerCollection.totalMonthlyDiscount
            )) /
          probabilityAmountCalculation()) *
          100
      )
    : 0;

  return (
    <>
      <div className="container homeWrapper">
        {overViewLoading && (
          <div
            className={`d-flex justify-content-center align-items-center Loader ${
              overViewLoading && "d-block"
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
            <div className="row">
              <PaymentAlert invoice={invoice} />

              <div className="col-md-12 mb-3">
                {permissions?.dashboardCollectionData && (
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
                        {t("collection")} <br /> ৳ &nbsp;
                        {FormatNumber(
                          bpSettings?.dashboardProbabilityAmountWithNewCustomer
                            ? Math.abs(
                                dashboardOverviewManagerCollection.totalMonthlyCollection -
                                  dashboardOverviewManagerCollection.totalMonthlyDiscount
                              )
                            : Math.abs(
                                dashboardOverviewManagerCollection.totalMonthlyCollection -
                                  dashboardOverviewManagerCustomer.newCustomerBillCollection -
                                  dashboardOverviewManagerCollection.totalMonthlyDiscount
                              )
                        )}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <div></div>

                  <div className="d-flex justify-content-end">
                    <div className="addcutmButton me-1">
                      {isLoading ? (
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
                {/* </div> */}
              </div>

              {/* dashboard overview card */}
              <DashboardCard
                dashboardCard={{
                  ...dashboardOverviewManagerCollection,
                  ...dashboardOverviewManagerCustomer,
                }}
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
                    {role === "manager" && (
                      <select
                        className="form-select chartFilteritem"
                        onChange={(e) => setCurrentCollector(e.target.value)}
                      >
                        <option value="">{t("all collector")}</option>
                        {userStaff?.map((c, key) => (
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

            <Accordion
              alwaysOpen
              onSelect={handleAccordionChange}
              activeKey={accordionKey}
            >
              <Accordion.Item eventKey="manager">
                <Accordion.Header className="shadow-none">
                  <h4 className="mb-0">{t("roleManager")}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  {/* dashboard below card */}
                  <DashboardCard
                    dashboardCard={customerStat}
                    isLoading={managerCardLoading}
                    filterDate={filterDate}
                    cardRole="managerBelowCard"
                  />
                </Accordion.Body>
              </Accordion.Item>

              {dashboardOverviewManagerCollection?.collectorStat > 0 && (
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

export default ManagerDashboard;
