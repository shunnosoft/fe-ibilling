import { useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import {
  ArchiveFill,
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FiletypeCsv,
  FilterCircle,
  PenFill,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import { Accordion, Card, Collapse } from "react-bootstrap";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";
import useAreaPackage from "../../hooks/useAreaPackage";

// internal import
import {
  deleteBillReport,
  getAllBills,
  getAllManagerBills,
  getArea,
  getCollector,
  getManger,
} from "../../features/apiCalls";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import PrintReport from "./ReportPDF";
import Table from "../../components/table/Table";
import Loader from "../../components/common/Loader";
import EditReport from "./modal/EditReport";
import ReportView from "./modal/ReportView";
import FormatNumber from "../../components/common/NumberFormat";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { managerFetchSuccess } from "../../features/managerSlice";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";

const Report = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, userData, permissions, currentUser } =
    useISPowner();

  // get all area package data from useAreaPackage hooks
  const { areas, subAreas } = useAreaPackage();

  // get customer bill collection data from redux store
  const allBills = useSelector((state) => state?.payment?.allBills);

  // get all manager data from redux store
  const manager = useSelector((state) => state?.manager?.manager);

  // get all collector data from redux store
  const allCollector = useSelector((state) => state?.collector?.collector);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // current date state
  var today = new Date();
  var firstDay =
    role === "ispOwner" || permissions?.dashboardCollectionData
      ? new Date(today.getFullYear(), today.getMonth(), 1)
      : new Date();

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [collectorLoading, setCollectorLoading] = useState(false);

  const [singleArea, setArea] = useState({});
  const [subareas, setSubAreas] = useState([]);
  const [subAreaIds, setSubArea] = useState([]);

  const [mainData, setMainData] = useState(allBills);

  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  const [collectedBy, setCollectedBy] = useState();
  const [billType, setBillType] = useState("");
  const [medium, setMedium] = useState("");
  const [open, setOpen] = useState(false);

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  // curr & priv date state
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  // filter date state
  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  // api call
  useEffect(() => {
    if (role === "ispOwner") getManger(dispatch, ispOwnerId);

    if (role === "manager") {
      dispatch(managerFetchSuccess(userData));
    }

    areas.length === 0 && getArea(dispatch, ispOwnerId, setAreaLoading);
    subAreas.length === 0 && getSubAreasApi(dispatch, ispOwnerId);

    if (allCollector.length === 0)
      getCollector(dispatch, ispOwnerId, setCollectorLoading);

    // get netfee bulletin permission api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  useEffect(() => {
    if (role === "ispOwner") {
      setStartDate(selectDate);

      if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
        setEndDate(today);
      } else {
        setEndDate(lastDate);
      }

      filterDate.getMonth() + 1 &&
        getAllBills(
          dispatch,
          ispOwnerId,
          filterDate.getFullYear(),
          filterDate.getMonth() + 1,
          setIsLoading
        );
    }

    if (role === "manager") {
      filterDate.getMonth() + 1 &&
        getAllManagerBills(
          dispatch,
          ispOwnerId,
          filterDate.getFullYear(),
          filterDate.getMonth() + 1,
          setIsLoading
        );
    }

    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );

    if (collectors.length === allCollector.length) {
      if (role === "ispOwner") {
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
  }, [allCollector, manager, filterDate]);

  // set data in state
  useEffect(() => {
    if (allBills) {
      setMainData(allBills);
    }
  }, [allBills]);

  // report page reload handler
  const reloadHandler = () => {
    if (role === "manager") {
      getAllManagerBills(
        dispatch,
        ispOwnerId,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
      dispatch(managerFetchSuccess(userData));
    }

    role === "ispOwner" &&
      getAllBills(
        dispatch,
        ispOwnerId,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
  };

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    setArea(area);
    const temp = subAreas.filter((val) => val.area === area?.id);
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
            paymentStatus.medium === "bKashPG" ||
            paymentStatus.medium === "Webhook"
        );
      } else {
        arr = arr.filter((item) => item.medium === medium);
      }
    }
    arr = arr.filter(
      (item) =>
        new Date(item.createdAt) >= new Date(dateStart).setHours(0, 0, 0, 0) &&
        new Date(item.createdAt) <= new Date(dateEnd).setHours(23, 59, 59, 999)
    );

    setMainData(arr);
  };

  // delete customer collection report delete handler
  const collectionReportDeleteHandler = (reportId) => {
    const con = window.confirm(t("deleteAlert"));
    if (con) {
      deleteBillReport(dispatch, reportId);
    }
  };

  let subArea, collector;
  if (singleArea && subAreaIds.length === 1) {
    subArea = subAreas?.find((item) => item.id === subAreaIds[0]);
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
      name: data?.hotspotCustomer
        ? data?.hotspotCustomer?.name
        : data?.customer?.name,
      package: data?.customer?.mikrotikPackage?.name
        ? data.customer?.mikrotikPackage?.name
        : data.customer?.userType === "pppoe"
        ? data.customer?.pppoe?.profile
        : data.hotspotCustomer?.hotspot.profile,
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
        accessor: (field) =>
          field?.hotspotCustomer
            ? field?.hotspotCustomer?.customerId
            : field?.customer?.customerId,
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: (field) =>
          field?.hotspotCustomer
            ? field?.hotspotCustomer?.name
            : field?.customer?.name,
      },
      {
        width: "10%",
        Header: t("PPIPHp"),
        accessor: (field) =>
          field.customer?.userType === "pppoe"
            ? field.customer?.pppoe.name
            : field.customer?.userType === "firewall-queue"
            ? field.customer?.queue.address
            : field.customer?.userType === "core-queue"
            ? field.customer?.queue.srcAddress
            : field.customer?.userType === "simple-queue"
            ? field.customer?.queue.target
            : field?.hotspotCustomer?.hotspot.name,
      },
      {
        width: "9%",
        Header: t("package"),
        accessor: (field) =>
          field.customer?.mikrotikPackage?.name
            ? field.customer?.mikrotikPackage?.name
            : field.customer?.userType === "pppoe"
            ? field.customer?.pppoe?.profile
            : field?.hotspotCustomer?.hotspot.profile,
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
        width: "9%",
        Header: t("collected"),
        accessor: "name",
      },
      {
        width: "8%",
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
                  {moment(value.start).format("YYYY/MM/DD")}
                  {moment(value.end).format("YYYY/MM/DD")}
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
                onClick={() => {
                  setViewId(value?.id);
                  setModalStatus("reportView");
                  setShow(true);
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
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
      {
        width: "6%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
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
                  onClick={() => {
                    getReportId(original?.id);
                    setModalStatus("reportEdit");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>

                {(original.customer === null ||
                  original.hotspotCustomer === null) && (
                  <li
                    onClick={() => collectionReportDeleteHandler(original?.id)}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  // data amount count in data table hader
  const addAllBills = useMemo(() => {
    var count = 0;
    let connectionFeeSum = 0;
    let discount = 0;
    mainData.forEach((item) => {
      item.billType === "bill"
        ? (count += item.amount)
        : (connectionFeeSum += item.amount);

      discount = discount + item.discount;
    });
    return { count, connectionFeeSum, discount };
  }, [mainData]);

  // custom component for table header
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {(role === "ispOwner" || permissions?.dashboardCollectionData) &&
        addAllBills.count > 0 && (
          <div>
            {t("totalBill")}: ৳{FormatNumber(addAllBills.count)}
          </div>
        )}
      &nbsp;&nbsp;
      {(role === "ispOwner" || permissions?.dashboardCollectionData) &&
        addAllBills.connectionFeeSum > 0 && (
          <div>
            {t("connectionFee")}: ৳{FormatNumber(addAllBills.connectionFeeSum)}
          </div>
        )}
      &nbsp;&nbsp;
      {addAllBills.discount > 0 && (
        <div>
          {t("discount")}: ৳{FormatNumber(addAllBills.discount)}
        </div>
      )}
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <h2>{t("billReport")}</h2>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
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
                          className="arrowClock"
                          onClick={() => reloadHandler()}
                          title={t("refresh")}
                        />
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            <div className="addAndSettingIcon">
                              <CSVLink
                                data={reportForCsVTableInfo}
                                filename={userData.company}
                                headers={reportForCsVTableInfoHeader}
                                title="Bill Report"
                              >
                                <FiletypeCsv className="addcutmButton" />
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
                        </Card>
                      </div>
                    </Collapse>

                    {!open && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}

                    {open && (
                      <ArrowBarRight
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="displayGrid6">
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={filterDate}
                              onChange={(date) => setFilterDate(date)}
                              dateFormat="MMM-yyyy"
                              showMonthYearPicker
                              showFullMonthYearPicker
                              minDate={new Date(userData?.createdAt)}
                              maxDate={new Date()}
                            />
                          </div>

                          <select
                            className="form-select mt-0"
                            onChange={(e) => onChangeArea(e.target.value)}
                          >
                            <option value={JSON.stringify({})} defaultValue>
                              {t("allArea")}
                            </option>
                            {areas.map((area, key) => (
                              <option key={key} value={JSON.stringify(area)}>
                                {area.name}
                              </option>
                            ))}
                          </select>
                          <select
                            className="form-select mt-0"
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

                          {role !== "collector" && (
                            <select
                              className="form-select mt-0"
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
                            className="form-select mt-0"
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
                            className="form-select mt-0"
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

                          {(role === "ispOwner" ||
                            permissions?.dashboardCollectionData) && (
                            <>
                              <div>
                                <DatePicker
                                  className="form-control"
                                  selected={dateStart}
                                  onChange={(date) => setStartDate(date)}
                                  dateFormat="MMM dd yyyy"
                                  minDate={selectDate}
                                  maxDate={
                                    lastDate.getMonth() + 1 ===
                                    today.getMonth() + 1
                                      ? today
                                      : lastDate
                                  }
                                  placeholderText={t("selectBillDate")}
                                />
                              </div>

                              <div>
                                <DatePicker
                                  className="form-control"
                                  selected={dateEnd}
                                  onChange={(date) => setEndDate(date)}
                                  dateFormat="MMM dd yyyy"
                                  minDate={selectDate}
                                  maxDate={
                                    lastDate.getMonth() + 1 ===
                                    today.getMonth() + 1
                                      ? today
                                      : lastDate
                                  }
                                  placeholderText={t("selectBillDate")}
                                />
                              </div>
                            </>
                          )}

                          <div>
                            <button
                              className="btn btn-outline-primary w-140"
                              type="button"
                              onClick={onClickFilter}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="addCollector">
                      <div style={{ display: "none" }}>
                        <PrintReport
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                          status="report"
                        />
                      </div>

                      <div className="table-section">
                        <Table
                          isLoading={isLoading}
                          customComponent={customComponent}
                          columns={columns}
                          data={mainData}
                        ></Table>
                      </div>
                    </div>
                  </div>
                </div>

                {(butPermission?.collectionReport ||
                  butPermission?.allPage) && <NetFeeBulletin />}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* report edit modal */}
      {modalStatus === "reportEdit" && (
        <EditReport
          show={show}
          setShow={setShow}
          reportId={reportId}
          note={note}
          setNote={setNote}
          status="ispOwnerCustomerReport"
        />
      )}

      {/* report view modal */}
      {modalStatus === "reportView" && (
        <ReportView
          show={show}
          setShow={setShow}
          reportId={viewId}
          status="ispOwnerCustomerReport"
        />
      )}
    </>
  );
};

export default Report;
