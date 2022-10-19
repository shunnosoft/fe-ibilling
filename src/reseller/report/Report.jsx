import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";

import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
// import { useDispatch } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import arraySort from "array-sort";
import {
  ArrowClockwise,
  ArrowDownUp,
  PrinterFill,
} from "react-bootstrap-icons";
import { getAllBills } from "../../features/apiCallReseller";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import PrintReport from "./ReportPDF";
import Loader from "../../components/common/Loader";
import DatePicker from "react-datepicker";

export default function Report() {
  const { t } = useTranslation();
  const componentRef = useRef();

  const subAreas = useSelector((state) => state.area.area);
  const allCollector = useSelector((state) => state.collector.collector);

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector((state) => state.payment.allBills);

  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const [isLoading, setisLoading] = useState(false);
  const [subAreaIds, setSubArea] = useState([]);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const [mainData, setMainData] = useState(allBills);
  const [mainData2, setMainData2] = useState(allBills);
  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  const [isSorted, setSorted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;

  const dispatch = useDispatch();

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // reload handler
  const reloadHandler = () => {
    getAllBills(dispatch, userData.id, setisLoading);
  };

  useEffect(() => {
    if (allBills.length === 0) getAllBills(dispatch, userData.id, setisLoading);
    setSubArea(subAreas.map((i) => i.id));

    if (collectors.length === allCollector.length) {
      const { user, name, id } = userData;
      collectors.unshift({ name, user, id });
    }
  }, [dispatch, userData, subAreas, allCollector, collectors]);

  useEffect(() => {
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );

    setCollectors(collectors);

    let collectorUserIdsArr = [];
    collectors.map((item) => collectorUserIdsArr.push(item.user));
    setCollectorIds(collectorUserIdsArr);
  }, [allCollector]);

  useEffect(() => {
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

    // Temp varialbe for search
    setMainData2(
      allBills.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [allBills]);

  const onChangeCollector = (userId) => {
    // console.log("collector id", collectorId);

    if (userId) {
      setCollectorIds([userId]);
    } else {
      let collectorUserIdsArr = [];
      collectors.map((item) => collectorUserIdsArr.push(item.user));
      setCollectorIds(collectorUserIdsArr);
    }
  };

  const onChangeSubArea = (id) => {
    if (!id) {
      setSubArea(subAreas.map((i) => i.id));
    } else {
      setSubArea([id]);
    }
  };

  const onClickFilter = () => {
    let arr = allBills;

    if (subAreaIds.length) {
      arr = allBills.filter((bill) =>
        subAreaIds.includes(bill.customer.subArea)
      );
    }
    if (collectorIds.length) {
      arr = arr.filter((bill) => collectorIds.includes(bill.user));
    }

    arr = arr.filter(
      (item) =>
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );

    setMainData(arr);
    setMainData2(arr);
  };

  const addAllBills = useCallback(() => {
    var count = 0;
    mainData.forEach((item) => {
      count = count + item.amount;
    });
    return FormatNumber(count);
  }, [mainData]);
  // console.log(addAllBills())

  const areaName = subAreas.find((item) => item.id === subAreaIds);

  // send filter data to print
  const collector = collectors.find((item) => item.user === collectorIds);

  const filterData = {
    area: areaName?.name ? areaName.name : t("all"),
    collector: collector?.name ? collector.name : t("all"),
    startDate: moment(dateStart).format("YYYY-MM-DD"),
    endDate: moment(dateEnd).format("YYYY-MM-DD"),
    totalBill: mainData.reduce((prev, current) => prev + current.amount, 0),
  };

  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {addAllBills()} {t("tk")}
    </div>
  );

  const columns = useMemo(
    () => [
      {
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "20%",
        Header: t("customer"),
        accessor: "customer.name",
      },
      {
        width: "20%",
        Header: t("bill"),
        accessor: "amount",
      },

      {
        width: "25%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
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
              <div className="collectorTitle d-flex justify-content-between px-5">
                <div className="d-flex">
                  <div>{t("billReport")}</div>
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader></Loader>
                    ) : (
                      <ArrowClockwise
                        onClick={() => reloadHandler()}
                      ></ArrowClockwise>
                    )}
                  </div>
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

              {/* Model start */}

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <select
                        className="form-select"
                        onChange={(e) => onChangeSubArea(e.target.value)}
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
                      {userRole !== "collector" ? (
                        <select
                          className="form-select mx-3"
                          onChange={(e) => onChangeCollector(e.target.value)}
                        >
                          <option value="" defaultValue>
                            {t("all collector")}{" "}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.user}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        ""
                      )}

                      <div>
                        <DatePicker
                          className="form-control mw-100 mt-2"
                          selected={dateStart}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={t("selectBillDate")}
                        />
                      </div>
                      <div className="mx-2">
                        <DatePicker
                          className="form-control mw-100 mt-2"
                          selected={dateEnd}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={t("selectBillDate")}
                        />
                      </div>

                      {/* <input
                        className="form-select"
                        type="date"
                        id="start"
                        name="trip-start"
                        value={moment(dateStart).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                        // value="2018-07-22"

                        // min="2018-01-01"
                        // max="2018-12-31"
                      />
                      <input
                        className="form-select mx-3"
                        type="date"
                        id="end"
                        name="trip-start"
                        value={moment(dateEnd).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                      /> */}
                      <button
                        className="btn btn-outline-primary w-140 mt-2 chartFilteritem"
                        type="button"
                        onClick={onClickFilter}
                      >
                        {t("filter")}
                      </button>
                      {/* print report */}
                      <div style={{ display: "none" }}>
                        <PrintReport
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                        />
                      </div>
                      {/* print report end*/}
                    </div>
                  </div>
                  {/* table */}

                  <Table
                    customComponent={customComponent}
                    isLoading={isLoading}
                    columns={columns}
                    data={mainData}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
