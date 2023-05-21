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

import {
  ArrowClockwise,
  FileExcelFill,
  PenFill,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import {
  getAllBills,
  getAllManagerBills,
  getArea,
  getCollector,
  getManger,
} from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import EditReport from "./modal/EditReport";
import ReportView from "./modal/ReportView";
import { CSVLink } from "react-csv";
import FormatNumber from "../../components/common/NumberFormat";
import DatePicker from "react-datepicker";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { managerFetchSuccess } from "../../features/managerSlice";
export default function Report() {
  const { t } = useTranslation();
  const componentRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const dispatch = useDispatch();
  const allArea = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get userdata
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  const allCollector = useSelector((state) => state?.collector?.collector);
  const manager = useSelector((state) => state?.manager?.manager);

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector((state) => state?.payment?.allBills);
  const [areaLoading, setAreaLoading] = useState(false);
  const [collectorLoading, setCollectorLoading] = useState(false);
  const [singleArea, setArea] = useState({});
  const [subareas, setSubAreas] = useState([]);
  const [subAreaIds, setSubArea] = useState([]);
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  const [mainData, setMainData] = useState(allBills);
  console.log(mainData);

  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  const [collectedBy, setCollectedBy] = useState();
  const [billType, setBillType] = useState("");
  const [medium, setMedium] = useState("");

  //reload handler
  const reloadHandler = () => {
    if (userRole === "manager") {
      getAllManagerBills(dispatch, ispOwnerId, setIsLoading);
      dispatch(managerFetchSuccess(userData));
    }

    userRole === "ispOwner" && getAllBills(dispatch, ispOwnerId, setIsLoading);
  };

  useEffect(() => {
    allArea.length === 0 && getArea(dispatch, ispOwnerId, setAreaLoading);
    storeSubArea.length === 0 && getSubAreasApi(dispatch, ispOwner);

    if (userRole === "manager") {
      allBills.length === 0 &&
        getAllManagerBills(dispatch, ispOwnerId, setIsLoading);
    }

    if (userRole === "ispOwner") {
      allBills.length === 0 && getAllBills(dispatch, ispOwnerId, setIsLoading);
    }
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );
    if (collectors.length === allCollector.length) {
      if (userRole === "ispOwner") {
        // const { user, name, id } = manager;
        let allManager = [];
        let manager1 = {};
        manager?.forEach((man) => {
          manager1 = {
            user: man.user,
            name: man.name + " (ম্যানেজার)",
            id: man.id,
          };
          allManager.push(manager1);
        });

        const isp = {
          user: currentUser.user.id,
          name: currentUser.ispOwner.name + " (এডমিন)",
          id: currentUser.ispOwner.id,
        };

        collectors.unshift(...allManager);
        collectors.unshift(isp);
      } else {
        // const { user, name, id } = manager;
        const manager1 = {
          user: manager?.manager?.user,
          name: manager?.manager?.name + "(Manager)",
          id: manager?.manager?.id,
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

  useEffect(() => {
    if (userRole === "manager") {
      dispatch(managerFetchSuccess(userData));
    }
    if (userRole === "ispOwner") getManger(dispatch, ispOwnerId);
    if (allCollector.length === 0)
      getCollector(dispatch, ispOwnerId, setCollectorLoading);
  }, []);

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    setArea(area);
    const temp = storeSubArea.filter((val) => val.area === area?.id);
    setSubAreas(temp);
    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];
      area?.subAreas.map((sub) => subAreaIds.push(sub));
      setSubArea(subAreaIds);
    }
  };

  const onChangeSubArea = (id) => {
    if (!id) {
      let subAreaIds = [];

      singleArea?.subAreas.map((sub) => subAreaIds.push(sub));

      setSubArea(subAreaIds);
    } else {
      setSubArea([id]);
    }
  };

  // set Report id
  const [reportId, setReportId] = useState();
  const [viewId, setViewId] = useState();

  // note state
  const [note, setNote] = useState();

  // set Report function
  const getReportId = (reportID) => {
    setReportId(reportID);
    setNote("");
  };

  const onClickFilter = () => {
    let arr = [...allBills];

    if (subAreaIds.length) {
      arr = allBills.filter((bill) =>
        subAreaIds.includes(bill.customer?.subArea)
      );
    }

    if (collectedBy && collectedBy !== "other") {
      arr = arr.filter((collected) => collected.collectorId === collectedBy);
    }

    if (collectedBy && collectedBy === "other") {
      arr = arr.filter((collected) => collected.collectorId !== collectedBy);
    }

    if (billType) {
      arr = arr.filter((bill) => bill.billType === billType);
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
    // setMainData2(arr);
  };

  const addAllBills = useCallback(() => {
    var count = 0;
    mainData.forEach((item) => {
      count = count + item.amount;
    });
    return FormatNumber(count);
  }, [mainData]);

  let subArea, collector;
  if (singleArea && subAreaIds.length === 1) {
    subArea = storeSubArea?.find((item) => item.id === subAreaIds[0]);
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

  // csv start
  // get data from main data for csv
  let reportForCsVTableInfo = mainData.map((data) => {
    const note = data?.note ? data?.note : "";
    let start = data?.start ? moment(data?.start).format("DD/MM/YY") : "";
    let end = data?.end ? moment(data?.end).format("DD/MM/YY") : "";
    return {
      name: data?.customer?.name,
      package: data.customer?.mikrotikPackage?.name,
      amount: data.amount,
      due: data.due,
      medium: data.medium,
      collector: data.name,
      comment: note + " - " + start + " - " + end,
      createdAt: moment(data.createdAt).format("MM/DD/YYYY"),
    };
  });

  // set csv header
  const reportForCsVTableInfoHeader = [
    { label: "Name", key: "name" },
    { label: "Package", key: "package" },
    { label: "Bill_Amount", key: "amount" },
    { label: "Bill_Due", key: "due" },
    { label: "Bill_Medium", key: "medium" },
    { label: "Collector_Name", key: "collector" },
    { label: "Comment", key: "comment" },
    { label: "Bill_Collect_Date", key: "createdAt" },
  ];
  // end csv

  const columns = useMemo(
    () => [
      {
        width: "7%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "10%",
        Header: t("PPPoEName"),
        accessor: "customer.pppoe.name",
      },
      {
        width: "8%",
        Header: t("package"),
        accessor: "package",
      },
      {
        width: "8%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "9%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "8%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "8%",
        Header: t("agent"),
        accessor: "medium",
      },
      {
        width: "8%",
        Header: t("collector"),
        accessor: "name",
      },
      {
        width: "10%",
        Header: t("note"),
        accessor: (data) => {
          return {
            id: data.id,
            note: data.note,
            start: data.start,
            end: data.end,
            month: data.month,
          };
        },
        Cell: ({ cell: { value } }) => {
          return (
            <>
              <p>
                {value.note && value.note.slice(0, 15)}{" "}
                <span>{value?.note && value?.note?.length > 15 && "..."}</span>
              </p>
              {value?.start && value?.end && (
                <span className="badge bg-secondary">
                  {moment(value.start).format("DD/MM/YY")}--
                  {moment(value.end).format("DD/MM/YY")}
                </span>
              )}
              <p>
                {value?.month && value.month.slice(0, 15)}{" "}
                <span>
                  {value?.month && value?.month?.length > 15 && "..."}
                </span>
              </p>
              <span
                className="see_more"
                data-bs-toggle="modal"
                data-bs-target="#reportView"
                onClick={() => {
                  setViewId(value?.id);
                }}
              >
                ...See More
              </span>
            </>
          );
        },
      },

      {
        width: "10%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "6%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#reportEditModal"
                  onClick={() => {
                    getReportId(original?.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
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
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                  <div className="report_bill d-flex">
                    <div className="addAndSettingIcon">
                      <CSVLink
                        data={reportForCsVTableInfo}
                        filename={ispOwnerData.company}
                        headers={reportForCsVTableInfoHeader}
                        title="Bill Report"
                      >
                        <FileExcelFill className="addcutmButton" />
                      </CSVLink>
                    </div>

                    <div className="addAndSettingIcon">
                      <ReactToPrint
                        documentTitle={t("billReport")}
                        trigger={() => (
                          <PrinterFill
                            title={t("print")}
                            className="addcutmButton"
                          />
                        )}
                        content={() => componentRef.current}
                      />
                    </div>
                  </div>
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
                        {subareas?.map((sub, key) => (
                          <option key={key} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>

                      {userRole !== "collector" && (
                        <select
                          className="form-select"
                          onChange={(e) => setCollectedBy(e.target.value)}
                        >
                          <option value="" defaultValue>
                            {t("all collector")}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                          <option value="other">Other</option>
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
                        <option value="onlinePayment">
                          {t("onlinePayment")}
                        </option>
                        <option value="bKash"> {t("bKash")} </option>
                        <option value="rocket"> {t("rocket")} </option>
                        <option value="nagad"> {t("nagad")} </option>
                        <option value="others"> {t("others")} </option>
                      </select>

                      <div className="ms-2">
                        <DatePicker
                          className="form-control w-140 mt-2"
                          selected={dateStart}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={t("selectBillDate")}
                        />
                      </div>
                      <div className="mx-2">
                        <DatePicker
                          className="form-control w-140 mt-2"
                          selected={dateEnd}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={t("selectBillDate")}
                        />
                      </div>

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
      <EditReport
        reportId={reportId}
        note={note}
        setNote={setNote}
        status="ispOwnerCustomerReport"
      />
      <ReportView reportId={viewId} status="ispOwnerCustomerReport" />
    </>
  );
}
