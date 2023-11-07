import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { Accordion, Card, Collapse, ToastContainer } from "react-bootstrap";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Loader from "../../../components/common/Loader";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FiletypeCsv,
  FilterCircle,
  PenFill,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import Table from "../../../components/table/Table";
import Footer from "../../../components/admin/footer/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReseller,
  getAllPackages,
  resellerCustomerReport,
} from "../../../features/apiCalls";
import moment from "moment";
import ReportView from "../../report/modal/ReportView";
import EditReport from "../../report/modal/EditReport";
import DatePicker from "react-datepicker";
import FormatNumber from "../../../components/common/NumberFormat";
import { CSVLink } from "react-csv";
import PrintReport from "../../report/ReportPDF";
import ReactToPrint from "react-to-print";

const ResellerCollection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  //get reseller collection report data
  const collectionReport = useSelector(
    (state) => state?.reseller?.resellerCollection
  );

  //loading state
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);

  //reseller id state
  const [resellerId, setResellerId] = useState(reseller[0]?.id);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // reseller customer collection main data state
  const [currentData, setCurrentData] = useState([]);

  //payment type state
  const [paymentType, setPaymentType] = useState("");

  // report id state
  const [viewId, setViewId] = useState("");
  const [reportId, setReportId] = useState("");

  // note state
  const [note, setNote] = useState("");

  // table card handle
  const [open, setOpen] = useState(false);

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  // curr & priv date state
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(new Date());

  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  useEffect(() => {
    fetchReseller(dispatch, ispOwnerId, setDataLoader);
    getAllPackages(dispatch, ispOwnerId, setPackageLoading);
  }, []);

  useEffect(() => {
    setResellerId(reseller[0]?.id);
  }, [reseller]);

  useEffect(() => {
    setStartDate(selectDate);

    if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
      setEndDate(today);
    } else {
      setEndDate(lastDate);
    }

    if (filterDate.getMonth() + 1 && resellerId) {
      resellerCustomerReport(
        dispatch,
        resellerId,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
    }
  }, [filterDate, resellerId]);

  useEffect(() => {
    setCurrentData(collectionReport);
  }, [collectionReport]);

  //reload handler
  const reloadHandler = () => {
    resellerCustomerReport(
      dispatch,
      resellerId,
      filterDate.getFullYear(),
      filterDate.getMonth() + 1,
      setIsLoading
    );
  };

  //filter handler
  const filterHandler = () => {
    let mainData = [...collectionReport];

    if (paymentType) {
      if (paymentType === "onlinePayment") {
        mainData = mainData.filter(
          (paymentStatus) =>
            paymentStatus.medium === "sslcommerz" ||
            paymentStatus.medium === "uddoktapay" ||
            paymentStatus.medium === "sslpay" ||
            paymentStatus.medium === "bKashPG"
        );
      } else {
        mainData = mainData.filter((item) => item.medium === paymentType);
      }
    }

    mainData = mainData.filter(
      (item) =>
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );
    setCurrentData(mainData);
  };

  //reseller customer collection report handler
  const resellerCollectionReport = (e) => {
    setResellerId(e.target.value);
  };

  // set Report function
  const getReportId = (id) => {
    setReportId(id);
    setNote("");
  };

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "7%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "8%",
        Header: t("package"),
        accessor: "customer.mikrotikPackage",
        Cell: ({ cell: { value } }) => (
          <div>{currentData && getCustomerPackage(value)?.name}</div>
        ),
      },
      {
        width: "8%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "8%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "7%",
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
        Header: t("resellerCommission"),
        accessor: "resellerCommission",
      },
      {
        width: "10%",
        Header: t("ispOwnerCommission"),
        accessor: "ispOwnerCommission",
      },
      {
        width: "6%",
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
                  {moment(value.start).format("YYYY/MM/DD")}--
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
        width: "7%",
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
    [t, allPackages]
  );

  // set csv header
  const resellerCollectionCsVTableInfoHeader = [
    { label: "Name", key: "name" },
    { label: "Package", key: "package" },
    { label: "Bill_Amount", key: "amount" },
    { label: "Bill_Discount", key: "discount" },
    { label: "Bill_Medium", key: "medium" },
    { label: "Collector_Name", key: "collector" },
    { label: "Comment", key: "comment" },
    { label: "Bill_Collect_Date", key: "createdAt" },
  ];

  // get data from current data for csv
  let resellerCollectionCsVTableInfo = currentData.map((data) => {
    const note = data?.note ? data?.note : "";
    let start = data?.start ? moment(data?.start).format("YYYY/MM/DD") : "";
    let end = data?.end ? moment(data?.end).format("YYYY/MM/DD") : "";
    return {
      name: data?.customer?.name,
      package: data.package,
      amount: data.amount,
      discount: data.discount,
      medium: data.medium,
      collector: data.name,
      comment: note + " - " + start + " - " + end,
      createdAt: moment(data.createdAt).format("YYYY/MM/DD"),
    };
  });

  const resellerName = reseller.find((item) => item.id === resellerId);

  const filterData = {
    reseller: resellerName?.name ? resellerName.name : t("all"),
    medium: paymentType ? paymentType : t("all"),
    startDate: startDate,
    endDate: endDate,
    totalBill: currentData.reduce((prev, current) => prev + current.amount, 0),
  };

  //function to calculate total Commissions and other amount
  const totalSum = () => {
    const initialValue = {
      amount: 0,
      resellerCommission: 0,
      ispOwnerCommission: 0,
    };

    const calculatedValue = currentData?.reduce((previous, current) => {
      //total amount
      previous.amount += current.amount;

      // sum of all reseller commission
      previous.resellerCommission += current.resellerCommission;

      // sum of all ispOwner commission
      previous.ispOwnerCommission += current.ispOwnerCommission;

      return previous;
    }, initialValue);
    return calculatedValue;
  };

  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {totalSum()?.amount > 0 && (
        <div className="mx-3">
          {t("totalBill")}{" "}
          <span className="fw-bold">৳ {FormatNumber(totalSum().amount)}</span>
        </div>
      )}
      <div className="me-3">
        {t("resellerCommission")}:{" "}
        <span className="fw-bold">
          ৳ {FormatNumber(totalSum().resellerCommission)}
        </span>
      </div>
      <div>
        {t("ispOwnerCommission")}:
        <span className="fw-bold">
          ৳ {FormatNumber(totalSum().ispOwnerCommission)}
        </span>
      </div>
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
                  <h2>{t("resellerCollection")}</h2>

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
                          title={t("refresh")}
                          onClick={reloadHandler}
                        />
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            <div className="addAndSettingIcon">
                              <CSVLink
                                data={resellerCollectionCsVTableInfo}
                                filename={ispOwnerData.company}
                                headers={resellerCollectionCsVTableInfoHeader}
                                title={t("resellerCollection")}
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
                              maxDate={new Date()}
                              minDate={new Date(ispOwnerData?.createdAt)}
                            />
                          </div>

                          <div>
                            <select
                              className="form-select mt-0 mw-100"
                              id="resellerCollection"
                              onChange={resellerCollectionReport}
                            >
                              {reseller?.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <select
                              className="form-select mt-0 mw-100"
                              onChange={(e) => setPaymentType(e.target.value)}
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
                          </div>

                          <div>
                            <DatePicker
                              className="form-control mt-0"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <div>
                            <DatePicker
                              className="form-control mt-0"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <button
                            className="btn btn-outline-primary w-110"
                            type="button"
                            onClick={filterHandler}
                          >
                            {t("filter")}
                          </button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper pb-2">
                    <div style={{ display: "none" }}>
                      <PrintReport
                        filterData={filterData}
                        currentCustomers={currentData}
                        ref={componentRef}
                        status="collection"
                      />
                    </div>

                    <div className="table-section">
                      <Table
                        isLoading={isLoading || dataLoader}
                        customComponent={customComponent}
                        columns={columns}
                        data={currentData}
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
      <EditReport
        reportId={reportId}
        note={note}
        setNote={setNote}
        status="resellerCustomerReport"
      />
      <ReportView reportId={viewId} status="resellerCustomerReport" />
    </>
  );
};

export default ResellerCollection;
