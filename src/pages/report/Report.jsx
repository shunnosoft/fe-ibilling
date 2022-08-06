import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import ReactToPrint from "react-to-print";
import PrintReport from "./ReportPDF";

import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
// import { useDispatch } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import { ArrowClockwise, PrinterFill } from "react-bootstrap-icons";
import { getAllBills } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
export default function Report() {
  const { t } = useTranslation();
  const componentRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const dispatch = useDispatch();
  const allArea = useSelector((state) => state?.persistedReducer?.area?.area);

  const allCollector = useSelector(
    (state) => state?.persistedReducer?.collector?.collector
  );
  const manager = useSelector(
    (state) => state?.persistedReducer?.manager?.manager
  );
  const currentUser = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector(
    (state) => state?.persistedReducer?.payment?.allBills
  );

  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const userRole = useSelector((state) => state?.persistedReducer?.auth?.role);
  const [mainData, setMainData] = useState(allBills);

  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  const [billType, setBillType] = useState("");
  const [medium, setMedium] = useState("");

  // reload handler
  const reloadHandler = () => {
    getAllBills(dispatch, ispOwnerId, setIsLoading);
  };

  useEffect(() => {
    if (allBills.length === 0) getAllBills(dispatch, ispOwnerId, setIsLoading);
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );
    if (collectors.length === allCollector.length) {
      if (userRole === "ispOwner") {
        // const { user, name, id } = manager;
        const manager1 = {
          user: manager.user,
          name: manager.name + " (ম্যানেজার)",
          id: manager.id,
        };
        const isp = {
          user: currentUser.user.id,
          name: currentUser.ispOwner.name + " (এডমিন)",
          id: currentUser.ispOwner.id,
        };

        collectors.unshift(manager1);
        collectors.unshift(isp);
      } else {
        // const { user, name, id } = manager;
        const manager1 = {
          user: manager.user,
          name: manager.name + "(Manager)",
          id: manager.id,
        };

        collectors.unshift(manager1);
      }
    }

    setCollectors(collectors);

    let collectorUserIdsArr = [];
    collectors.map((item) => collectorUserIdsArr.push(item.user));
    setCollectorIds(collectorUserIdsArr);
  }, [allCollector, manager]);

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
  }, [allBills]);

  const onChangeCollector = (userId) => {
    if (userId) {
      setCollectorIds([userId]);
    } else {
      let collectorUserIdsArr = [];
      collectors.map((item) => collectorUserIdsArr.push(item.user));
      setCollectorIds(collectorUserIdsArr);
    }
  };

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    setArea(area);

    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];

      area?.subAreas.map((sub) => subAreaIds.push(sub.id));

      setSubArea(subAreaIds);
    }
  };

  const onChangeSubArea = (id) => {
    if (!id) {
      let subAreaIds = [];
      singleArea?.subAreas.map((sub) => subAreaIds.push(sub.id));

      setSubArea(subAreaIds);
    } else {
      setSubArea([id]);
    }
  };

  const onClickFilter = () => {
    let arr = [...allBills];

    if (subAreaIds.length) {
      arr = allBills.filter((bill) =>
        subAreaIds.includes(bill.customer?.subArea)
      );
    }
    if (collectorIds.length) {
      arr = arr.filter((bill) => collectorIds.includes(bill.user));
    }
    if (billType) {
      arr = arr.filter((bill) => bill.billType === billType);
    }
    if (medium) {
      arr = arr.filter((item) => item.medium === medium);
    }

    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
    // setMainData2(arr);
  };

  const addAllBills = useCallback(() => {
    var count = 0;
    mainData.forEach((item) => {
      count = count + item.amount;
    });
    return count.toString();
  }, [mainData]);

  let subArea, collector;
  if (singleArea && subAreaIds.length === 1) {
    subArea = singleArea?.subAreas?.find((item) => item.id === subAreaIds[0]);
  }

  if (collectorIds.length === 1 && collectors.length > 0) {
    collector = collectors.find((item) => item.user === collectorIds[0]);
  }

  const filterData = {
    area: singleArea?.name ? singleArea.name : t("all"),
    subArea: subArea ? subArea.name : t("all"),
    collector: collector?.name ? collector.name : t("all"),
    startDate: dateStart,
    endDate: dateEnd,
    totalBill: mainData.reduce((prev, current) => prev + current.amount, 0),
  };

  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "12%",
        Header: t("customer"),
        accessor: "customer.name",
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "customer.mikrotikPackage.name",
      },
      {
        width: "8%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "8%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "9%",
        Header: t("agent"),
        accessor: "medium",
      },
      {
        width: "11%",
        Header: t("collector"),
        accessor: "name",
      },
      {
        width: "22%",
        Header: t("note"),
        accessor: (data) => {
          return {
            note: data.note,
            start: data.start,
            end: data.end,
          };
        },
        Cell: ({ cell: { value } }) => {
          return (
            <>
              <p>{value.note && value.note}</p>
              {value?.start && value?.end && (
                <span className="badge bg-secondary">
                  {moment(value.start).format("DD/MM/YY")}--
                  {moment(value.end).format("DD/MM/YY")}
                </span>
              )}
            </>
          );
        },
      },

      {
        width: "12%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
    ],
    [t]
  );

  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {addAllBills()} {t("tk")}
    </div>
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
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
                  {/* <div> {t("billReport")} </div> */}
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
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <select
                        className="form-select"
                        onChange={(e) => onChangeArea(e.target.value)}
                      >
                        <option value={JSON.stringify({})} defaultValue>
                          {t("allArea")}
                        </option>
                        {allArea.map((area, key) => (
                          <option key={key} value={JSON.stringify(area)}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <select
                        className="form-select mx-2"
                        onChange={(e) => onChangeSubArea(e.target.value)}
                      >
                        <option value="" defaultValue>
                          {t("subArea")}
                        </option>
                        {singleArea?.subAreas?.map((sub, key) => (
                          <option key={key} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>

                      {userRole !== "collector" && (
                        <select
                          className="form-select"
                          onChange={(e) => onChangeCollector(e.target.value)}
                        >
                          <option value="" defaultValue>
                            {t("all collector")}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.user}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      )}

                      <select
                        className="form-select mx-2"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="" defaultValue>
                          {t("billType")}
                        </option>

                        <option value="connectionFee">
                          {t("connectionFee")}
                        </option>
                        <option value="bill"> {t("monthBill")} </option>
                      </select>
                      <select
                        className="form-select"
                        onChange={(e) => setMedium(e.target.value)}
                      >
                        <option value="" selected>
                          {t("medium")}
                        </option>

                        <option value="cash">{t("handCash")}</option>
                        <option value="bKash"> {t("bKash")} </option>
                        <option value="rocket"> {t("rocket")} </option>
                        <option value="nagod"> {t("nagad")} </option>
                        <option value="others"> {t("others")} </option>
                      </select>

                      <input
                        className="form-select mx-2"
                        type="date"
                        id="start"
                        name="trip-start"
                        value={moment(dateStart).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                      />
                      <input
                        className="form-select me-2"
                        type="date"
                        id="end"
                        name="trip-start"
                        value={moment(dateEnd).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                      />

                      <div>
                        <button
                          className="btn btn-outline-primary w-110 mt-2"
                          type="button"
                          onClick={onClickFilter}
                        >
                          {t("filter")}
                        </button>
                      </div>
                    </div>
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
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      customComponent={customComponent}
                      columns={columns}
                      data={mainData}
                    ></Table>
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
}
