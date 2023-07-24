import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import {
  ArrowClockwise,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import Footer from "../../components/admin/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBills,
  getCollector,
  getSubAreas,
} from "../../features/apiCallReseller";
import moment from "moment";
import Table from "../../components/table/Table";
import FormatNumber from "../../components/common/NumberFormat";
import ReactToPrint from "react-to-print";
import PrintReport from "./ReportPDF";
import DatePicker from "react-datepicker";
import { Accordion } from "react-bootstrap";

const Report = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get user information
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get reseller, collector collection all bills
  const allBills = useSelector((state) => state.payment.allBills);

  // get all area subArea
  const subAreas = useSelector((state) => state.area.area);

  // get all bill collector
  const allCollector = useSelector((state) => state.collector.collector);

  // get user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // collection all bills state
  const [mainData, setMainData] = useState(allBills);

  // select area id state
  const [areaIds, setAreaIds] = useState("");

  // select collector id state
  const [collectorIds, setCollectorIds] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // bill report medium
  const [medium, setMedium] = useState("");

  // date & time find
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  // reseller & collector collection bill report filter
  const collectionReportFilter = () => {
    let arr = [...allBills];

    if (areaIds) {
      arr = arr.filter((bill) => bill?.customer?.subArea === areaIds);
    }

    if (collectorIds) {
      arr = arr.filter((bill) => bill?.user === collectorIds);
    }

    if (medium) {
      if (medium === "onlinePayment") {
        arr = arr.filter(
          (paymentStatus) =>
            paymentStatus.medium === "sslcommerz" ||
            paymentStatus.medium === "uddoktapay" ||
            paymentStatus.medium === "sslpay" ||
            paymentStatus.medium === "bKashPG"
        );
      } else {
        arr = arr.filter((item) => item.medium === medium);
      }
    }

    arr = arr.filter(
      (item) =>
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );

    setMainData(arr);
  };

  // reload handler
  const reloadHandler = () => {
    getAllBills(dispatch, userData.id, setIsLoading);
  };

  useEffect(() => {
    getAllBills(dispatch, userData.id, setIsLoading);
  }, [userData]);

  useEffect(() => {
    // all bills current month filter data
    var initialToday = new Date();
    var initialFirst = new Date(
      initialToday.getFullYear(),
      initialToday.getMonth(),
      1
    );

    initialFirst.setHours(0, 0, 0, 0);
    initialToday.setHours(23, 59, 59, 999);
    setMainData(
      allBills.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [allBills]);

  useEffect(() => {
    getSubAreas(dispatch, userData.id);
    getCollector(dispatch, userData.id);
  }, []);

  // select area & collector find
  const areaName = subAreas.find((item) => item.id === areaIds);
  const collector = allCollector.find((item) => item.user === collectorIds);

  // collection bill report print pdf
  const filterData = {
    area: areaName?.name ? areaName.name : t("all"),
    collector: collector?.name ? collector.name : t("all"),
    startDate: moment(dateStart).format("YYYY-MM-DD"),
    endDate: moment(dateEnd).format("YYYY-MM-DD"),
    totalBill: mainData.reduce((prev, current) => prev + current.amount, 0),
  };

  // collection all bill amount count
  const addAllBills = useCallback(() => {
    var count = 0;
    mainData.forEach((item) => {
      count = count + item.amount;
    });
    return FormatNumber(count);
  }, [mainData]);

  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {addAllBills()} {t("tk")}
    </div>
  );

  //billing data show columns
  const columns = useMemo(
    () => [
      {
        width: "16%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "17%",
        Header: t("customer"),
        accessor: "customer.name",
      },
      {
        width: "17%",
        Header: t("PPPoEName"),
        accessor: "customer.pppoe.name",
      },
      {
        width: "16%",
        Header: t("medium"),
        accessor: "medium",
      },
      {
        width: "16%",
        Header: t("bill"),
        accessor: "amount",
      },

      {
        width: "18%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
    ],
    []
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <div className="collectorTitle d-flex justify-content-between px-4">
                <div className="d-flex">
                  <div>{t("billReport")}</div>
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  <div
                    onClick={() => {
                      if (!activeKeys) {
                        setActiveKeys("filter");
                      } else {
                        setActiveKeys("");
                      }
                    }}
                    title={t("filter")}
                  >
                    <FilterCircle className="addcutmButton" />
                  </div>

                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        onClick={() => reloadHandler()}
                      ></ArrowClockwise>
                    )}
                  </div>

                  <ReactToPrint
                    documentTitle={t("billReport")}
                    trigger={() => (
                      <button
                        className="header_icon border-0"
                        type="button"
                        title={t("downloadPdf")}
                      >
                        <PrinterFill />
                      </button>
                    )}
                    content={() => componentRef.current}
                  />
                </div>
              </div>

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="displayGrid6">
                          <select
                            className="form-select mt-0"
                            onChange={(e) => setAreaIds(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("allArea")}
                            </option>
                            {subAreas?.map((sub, key) => (
                              <option key={key} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>

                          {userRole !== "collector" && (
                            <select
                              className="form-select mt-0"
                              onChange={(e) => setCollectorIds(e.target.value)}
                            >
                              <option value="" defaultValue>
                                {t("all collector")}{" "}
                              </option>
                              {allCollector?.map((coll, key) => (
                                <option key={key} value={coll.user}>
                                  {coll.name}
                                </option>
                              ))}
                            </select>
                          )}

                          <select
                            className="form-select mt-0"
                            onChange={(e) => setMedium(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("medium")}
                            </option>
                            <option value="cash">{t("handCash")}</option>
                            <option value="onlinePayment">
                              {t("onlinePayment")}
                            </option>
                            <option value="bKash"> {t("bKash")} </option>
                            <option value="rocket"> {t("rocket")} </option>
                            <option value="nagad"> {t("nagad")} </option>
                            <option value="others"> {t("others")} </option>
                          </select>

                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={dateStart}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={dateEnd}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <button
                            className="btn btn-outline-secondary w-6rem h-76"
                            type="button"
                            onClick={collectionReportFilter}
                          >
                            {t("filter")}
                          </button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="addCollector">
                      {/* print report */}
                      <div style={{ display: "none" }}>
                        <PrintReport
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                        />
                      </div>
                      {/* print report end*/}

                      <Table
                        customComponent={customComponent}
                        isLoading={isLoading}
                        columns={columns}
                        data={mainData}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
