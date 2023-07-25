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
  ArrowClockwise,
  ArrowLeftCircle,
  ArrowRightCircle,
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

  // current date set
  let lastDate = new Date();
  let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

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
  const [resellerId, setResellerId] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // reseller customer collection main data state
  const [currentData, setCurrentData] = useState(collectionReport);

  //payment type state
  const [paymentType, setPaymentType] = useState("");

  // report id state
  const [viewId, setViewId] = useState("");
  const [reportId, setReportId] = useState("");

  // note state
  const [note, setNote] = useState("");

  // set date state
  const [startDate, setStartDate] = useState(firstDate);
  const [endDate, setEndDate] = useState(lastDate);
  const [open, setOpen] = useState(false);

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
        width: "10%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "customer.mikrotikPackage",
        Cell: ({ cell: { value } }) => (
          <div>{currentData && getCustomerPackage(value)?.name}</div>
        ),
      },
      {
        width: "10%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "10%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "10%",
        Header: t("agent"),
        accessor: "medium",
      },
      {
        width: "10%",
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
        width: "10%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
      {
        width: "10%",
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
    [t, allPackages]
  );

  //reload handler
  const reloadHandler = () => {
    resellerCustomerReport(dispatch, setIsLoading, resellerId);
  };

  useEffect(() => {
    setResellerId(reseller[0]?.id);
  }, [reseller]);

  useEffect(() => {
    fetchReseller(dispatch, ispOwnerId, setDataLoader);
    getAllPackages(dispatch, ispOwnerId, setPackageLoading);
  }, []);

  useEffect(() => {
    if (resellerId) {
      resellerCustomerReport(dispatch, setIsLoading, resellerId);
    }
  }, [resellerId]);

  useEffect(() => {
    var initialToday = new Date();
    var initialFirst = new Date(
      initialToday.getFullYear(),
      initialToday.getMonth(),
      1
    );
    initialToday.setHours(0, 0, 0, 0);
    initialFirst.setHours(23, 59, 59, 999);

    setCurrentData(
      collectionReport.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [collectionReport]);

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

  const addAllBills = useMemo(() => {
    var count = 0;
    currentData.forEach((item) => {
      count = count + item.amount;
    });
    return { count };
  }, [currentData]);

  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {addAllBills?.count > 0 && (
        <div>
          {t("totalBill")}:-৳
          {FormatNumber(addAllBills.count)}
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
                  <div className="d-flex">
                    <div>{t("resellerCollection")}</div>
                  </div>
                  <div
                    style={{ fontSize: "25px", height: "45px" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {!open && (
                      <ArrowLeftCircle
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className="me-3"
                      />
                    )}

                    {open && (
                      <ArrowRightCircle
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        className="me-3"
                      />
                    )}

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card
                          body
                          className="border-0"
                          style={{
                            width: "100px",
                            backgroundColor: "#2E87DF",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="addAndSettingIcon">
                              <CSVLink
                                data={resellerCollectionCsVTableInfo}
                                filename={ispOwnerData.company}
                                headers={resellerCollectionCsVTableInfoHeader}
                                title={t("resellerCollection")}
                              >
                                <FiletypeCsv
                                  style={{ height: "34px", width: "34px" }}
                                  className="addcutmButton"
                                />
                              </CSVLink>
                            </div>

                            <div className="addAndSettingIcon">
                              <ReactToPrint
                                documentTitle={t("billReport")}
                                trigger={() => (
                                  <PrinterFill
                                    style={{ height: "34px", width: "34px" }}
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
                      <FilterCircle
                        style={{ height: "34px", width: "34px" }}
                        className="addcutmButton"
                      />
                    </div>

                    <div
                      style={{ height: "34px", width: "34px" }}
                      className="reloadBtn"
                    >
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          style={{ height: "20px", width: "20px" }}
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="d-flex justify-content-center">
                          <div className="col-md-2 form-group mx-2">
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
                          <div className="col-md-2 form-group">
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

                          <div className="ms-2 ">
                            <DatePicker
                              className="form-control w-140 mt-0"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div className="mx-2 ">
                            <DatePicker
                              className="form-control w-140 mt-0"
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
