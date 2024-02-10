import React, { useEffect, useMemo, useRef, useState } from "react";
import { Accordion, Card, Collapse, ToastContainer } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
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

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/table/Table";
import Footer from "../../../components/admin/footer/Footer";
import {
  fetchReseller,
  getAllPackages,
  resellerCustomerReport,
} from "../../../features/apiCalls";
import ReportView from "../../report/modal/ReportView";
import EditReport from "../../report/modal/EditReport";
import FormatNumber from "../../../components/common/NumberFormat";
import PrintReport from "../../report/ReportPDF";

const ResellerCollection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // get user & current user data form useISPOwner
  const { ispOwnerData, ispOwnerId, userData } = useISPowner();

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

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // reseller customer collection main data state
  const [currentData, setCurrentData] = useState([]);

  // report id state
  const [viewId, setViewId] = useState("");
  const [reportId, setReportId] = useState("");

  // note state
  const [note, setNote] = useState("");

  // table card handle
  const [open, setOpen] = useState(false);

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  //filter options state
  const [filterOption, setFilterOption] = useState({
    reseller: "",
    medium: "",
    startDate: firstDay,
    endDate: today,
  });

  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  useEffect(() => {
    // get reseller api
    reseller.length === 0 && fetchReseller(dispatch, ispOwnerId, setDataLoader);

    // get ispOwner all pakcages api
    allPackages.length === 0 &&
      getAllPackages(dispatch, ispOwnerId, setPackageLoading);
  }, []);

  useEffect(() => {
    if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
      setFilterOption({
        ...filterOption,
        startDate: selectDate,
        endDate: today,
      });
    } else {
      setFilterOption({
        ...filterOption,
        startDate: selectDate,
        endDate: lastDate,
      });
    }

    if (filterDate.getMonth() + 1 && ispOwnerId) {
      resellerCustomerReport(
        dispatch,
        ispOwnerId,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
    }
  }, [filterDate, ispOwnerId]);

  useEffect(() => {
    setCurrentData(collectionReport);
  }, [collectionReport]);

  //reload handler
  const reloadHandler = () => {
    resellerCustomerReport(
      dispatch,
      ispOwnerId,
      filterDate.getFullYear(),
      filterDate.getMonth() + 1,
      setIsLoading
    );
  };

  //filter handler
  const filterHandler = () => {
    let tempReport = collectionReport.reduce((acc, c) => {
      const { reseller, medium, startDate, endDate } = filterOption;

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        reseller: reseller ? reseller === c.reseller : true,
        medium: medium ? medium === c.medium : true,
        filterDate:
          startDate && endDate
            ? new Date(c.createdAt) >=
                new Date(startDate).setHours(0, 0, 0, 0) &&
              new Date(c.createdAt) <=
                new Date(endDate).setHours(23, 59, 59, 999)
            : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true

      let isPass = false;

      isPass = conditions["reseller"];
      if (!isPass) return acc;

      isPass = conditions["medium"];
      if (!isPass) return acc;

      isPass = conditions["filterDate"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer in customer state
    setCurrentData(tempReport);
  };

  // filter options reset handler
  const filterReset = () => {
    setFilterOption({
      reseller: "",
      medium: "",
      startDate: selectDate,
      endDate:
        lastDate.getMonth() + 1 === today.getMonth() + 1 ? today : lastDate,
    });
    setCurrentData(collectionReport);
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

  // admin reseller commission handler function
  const adminResellerCommission = (data) => {
    // single reseller find in customer report data
    const singleReseller = reseller.find((item) => item.id === data.reseller);

    // customer bill amount
    let commissionAmount = data.amount;

    // customer bill amount ispOwner commission and reseller commission
    let ispOwnerCommission = 0;
    let resellerCommission = 0;

    if (
      commissionAmount != 0 &&
      data.medium !== "cash" &&
      data.billType === "bill"
    ) {
      // handle packageBased resellers
      if (singleReseller?.commissionType === "packageBased") {
        // find reseller packages rate
        const resellerPackageRate = singleReseller?.resellerPackageRates.find(
          (pack) => pack.mikrotikPackage === data?.customer.mikrotikPackage
        );

        // check commission style is percentage or fixedRate
        if (singleReseller?.commissionStyle === "percentage") {
          ispOwnerCommission =
            (resellerPackageRate?.ispOwnerRate * Number(commissionAmount)) /
            100;
          resellerCommission = commissionAmount - ispOwnerCommission;
        }
        if (singleReseller?.commissionStyle === "fixedRate") {
          ispOwnerCommission = resellerPackageRate?.ispOwnerRate;
          resellerCommission = commissionAmount - ispOwnerCommission;
        }
      } else {
        // handle other resellers
        ispOwnerCommission =
          (singleReseller.commissionRate.isp * Number(commissionAmount)) / 100;
        resellerCommission = commissionAmount - ispOwnerCommission;
      }
    } else {
      ispOwnerCommission = data.ispOwnerCommission;
      resellerCommission = data.resellerCommission;
    }
    // set ispOwner & reseller commission
    return {
      resellerCommission,
      ispOwnerCommission,
    };
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
        Header: t("PPIPHp"),
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
        Header: t("admin"),
        Cell: ({ row: { original } }) => (
          <div>{adminResellerCommission(original)?.ispOwnerCommission}</div>
        ),
      },
      {
        width: "10%",
        Header: t("reseller"),
        Cell: ({ row: { original } }) => (
          <div>{adminResellerCommission(original)?.resellerCommission}</div>
        ),
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
                {value.note && value.note.slice(0, 15)}
                <span>{value?.note && value?.note?.length > 15 && "..."}</span>
              </p>
              {value?.start && value?.end && (
                <span className="badge bg-secondary">
                  {moment(value.start).format("YYYY/MM/DD")}--
                  {moment(value.end).format("YYYY/MM/DD")}
                </span>
              )}
              <p>
                {value?.month && value.month.slice(0, 15)}
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

  // find select reseller
  const resellerName = reseller.find(
    (item) => item.id === filterOption?.reseller
  );

  // print filter table data heading
  const filterData = {
    reseller: resellerName?.name ? resellerName.name : t("all"),
    medium: filterOption ? filterOption?.medium : t("all"),
    startDate: filterOption?.startDate,
    endDate: filterOption?.endDate,
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
      previous.resellerCommission += current.resellerCommission
        ? current.resellerCommission
        : 0;

      // sum of all ispOwner commission
      previous.ispOwnerCommission += current.ispOwnerCommission
        ? current.ispOwnerCommission
        : 0;

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
        <div>
          {t("collection")} :
          <span className="fw-bold"> ৳{FormatNumber(totalSum().amount)}</span>
        </div>
      )}
      <div className="mx-3">
        {t("admin")} :
        <span className="fw-bold">
          &nbsp; ৳{FormatNumber(totalSum().ispOwnerCommission)}
        </span>
      </div>
      <div>
        {t("reseller")} :
        <span className="fw-bold">
          &nbsp;৳{FormatNumber(totalSum().resellerCommission)}
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
                              minDate={
                                new Date(
                                  new Date(userData?.createdAt).getTime()
                                )
                              }
                              maxDate={new Date()}
                            />
                          </div>

                          <div>
                            <select
                              className="form-select mt-0 mw-100"
                              id="resellerCollection"
                              onChange={(e) => {
                                setFilterOption({
                                  ...filterOption,
                                  reseller: e.target.value,
                                });
                              }}
                            >
                              <option
                                value=""
                                selected={filterOption.reseller == ""}
                              >
                                {t("selectReseller")}
                              </option>
                              {reseller?.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <select
                              className="form-select mt-0 mw-100"
                              onChange={(e) => {
                                setFilterOption({
                                  ...filterOption,
                                  medium: e.target.value,
                                });
                              }}
                            >
                              <option
                                value=""
                                selected={filterOption.medium == ""}
                              >
                                {t("medium")}
                              </option>

                              <option value="cash">{t("handCash")}</option>
                              <option value="bKashPG"> {t("bKash")} </option>
                              <option value="uddoktapay">
                                {t("uddoktaPay")}
                              </option>
                              <option value="sslcommerz">
                                {t("sslCommerz")}
                              </option>
                            </select>
                          </div>

                          <div>
                            <DatePicker
                              className="form-control"
                              selected={filterOption.startDate}
                              onChange={(date) => {
                                setFilterOption({
                                  ...filterOption,
                                  startDate: date,
                                });
                              }}
                              dateFormat="MMM dd yyyy"
                              minDate={selectDate}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <div>
                            <DatePicker
                              className="form-control"
                              selected={filterOption.endDate}
                              onChange={(date) => {
                                setFilterOption({
                                  ...filterOption,
                                  endDate: date,
                                });
                              }}
                              dateFormat="MMM dd yyyy"
                              minDate={selectDate}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <div className="displayGrid1 mt-0">
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              onClick={filterHandler}
                            >
                              {t("filter")}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={filterReset}
                            >
                              {t("reset")}
                            </button>
                          </div>
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
                        isLoading={isLoading}
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
