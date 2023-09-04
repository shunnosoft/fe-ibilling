import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
  ArrowClockwise,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import ReactToPrint from "react-to-print";
import { ToastContainer } from "react-toastify";

// internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FtextField } from "../../components/common/FtextField";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import Table from "../../components/table/Table";
import FormatNumber from "../../components/common/NumberFormat";
import {
  addDeposit,
  depositAcceptReject,
  getCollector,
  getDepositReport,
  getMyDeposit,
  getTotalbal,
} from "../../features/apiCalls";
import PrintCustomer from "./customerPDF";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";

const ManagerDeposit = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // current month date
  let date = new Date();
  var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);

  firstDate.setHours(0, 0, 0, 0);
  date.setHours(23, 59, 59, 999);

  // deposit form validation
  const billValidation = Yup.object().shape({
    amount: Yup.string().required("Please insert amount."),
  });

  // get isp owner id from redux
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get user data form redux
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // get balance from redux
  const balance = useSelector((state) => state?.payment?.balance);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get own deposit from redux
  let ownDeposits = useSelector((state) => state?.payment?.myDeposit);

  // collector deposit
  const collectorDeposit = useSelector(
    (state) => state?.payment?.collectorDeposit
  );

  // get all collector form redux
  const allCollector = useSelector((state) => state?.collector?.collector);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [acceptLoading, setAccLoading] = useState(false);

  // collector deposit report
  const [mainData, setMainData] = useState([]);

  // current month own deposit
  const [ownDepositData, setOwnDepositData] = useState([]);

  // tabs change event key
  const [tabEventKey, setTabEventKey] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // select collector id
  const [collectorIds, setCollectorIds] = useState("all");

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDate);

  // deposit report start & end date
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());

  // own deposit report monthly filter
  const [ownFilter, setOwnFilter] = useState(firstDate);

  // Owner deposit start & end date
  const [ownDepositStart, setOwnDepositStart] = useState(new Date());
  const [ownDepositEnd, setOwnDepositEnd] = useState(new Date());

  // current month start & end date
  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );
  var ownSelectDate = new Date(
    ownFilter.getFullYear(),
    ownFilter.getMonth(),
    1
  );
  var ownLastDate = new Date(
    ownFilter.getFullYear(),
    ownFilter.getMonth() + 1,
    0
  );

  // get api calls
  useEffect(() => {
    if (tabEventKey === "deposit") {
      getTotalbal(dispatch);
    }

    if (tabEventKey === "depositReport" && filterDate) {
      setStartDate(selectDate);

      if (lastDate.getMonth() + 1 === date.getMonth() + 1) {
        setEndDate(date);
      } else {
        setEndDate(lastDate);
      }
      filterDate.getMonth() + 1 &&
        getDepositReport(
          dispatch,
          userData.manager?.id,
          filterDate.getFullYear(),
          filterDate.getMonth() + 1,
          setIsLoading
        );

      ownerUsers.length === 0 && getOwnerUsers(dispatch, ispOwner);
      allCollector.length === 0 &&
        getCollector(dispatch, ispOwner, setIsLoading);
    }

    if (tabEventKey === "ownDeposit" && ownFilter) {
      setOwnDepositStart(ownSelectDate);

      if (ownLastDate.getMonth() + 1 === date.getMonth() + 1) {
        setOwnDepositEnd(date);
      } else {
        setOwnDepositEnd(ownLastDate);
      }
      ownFilter.getMonth() + 1 &&
        getMyDeposit(
          dispatch,
          ownFilter.getFullYear(),
          ownFilter.getMonth() + 1,
          setIsLoading
        );
    }
  }, [tabEventKey, filterDate, ownFilter]);

  useEffect(() => {
    setMainData(collectorDeposit);
  }, [collectorDeposit]);

  useEffect(() => {
    let monthDeposit = [...ownDeposits];
    monthDeposit = monthDeposit.filter(
      (original) =>
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(ownDepositStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(ownDepositEnd).format("YYYY-MM-DD")).getTime()
    );

    setOwnDepositData(monthDeposit);
  }, [ownDeposits]);

  // reload handler
  const reloadHandler = () => {
    if (tabEventKey === "depositReport") {
      getDepositReport(
        dispatch,
        userData.manager?.id,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );

      getOwnerUsers(dispatch, ispOwner);
      getCollector(dispatch, ispOwner, setIsLoading);
    }

    if (tabEventKey === "ownDeposit") {
      getMyDeposit(dispatch, setIsLoading);
    }
  };

  // add bill deposit
  const billDepositHandler = (data) => {
    const sendingData = {
      depositBy: userData?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: userData?.user.id,
      ispOwner: ispOwner,
      note: data.note,
    };
    addDeposit(dispatch, sendingData, setIsLoading);
    data.amount = "";
  };

  // bill report accept & reject handler
  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id, setAccLoading);
  };

  // filter section
  const onClickFilter = () => {
    let arr = [...collectorDeposit];
    if (collectorIds !== "all") {
      arr = arr.filter((bill) => bill.user === collectorIds);
    } else {
      arr = arr;
    }

    // date filter
    arr = arr.filter(
      (original) =>
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );
    setMainData(arr);
  };

  // own deposit filter
  const ownDepositDateFilter = () => {
    let monthDeposit = [...ownDeposits];
    monthDeposit = monthDeposit.filter(
      (original) =>
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(ownDepositStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(ownDepositEnd).format("YYYY-MM-DD")).getTime()
    );

    setOwnDepositData(monthDeposit);
  };

  // total deposit calculation
  let depositCalculation;
  const getTotalDeposit = useCallback(() => {
    depositCalculation = mainData.filter((item) => item.status === "accepted");

    const sumWithInitial = depositCalculation.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      0
    );
    return sumWithInitial.toString();
  }, [mainData]);

  // own deposit column
  let ownDepositCalculation;
  const getTotalOwnDeposit = useCallback(() => {
    ownDepositCalculation = ownDepositData.filter(
      (item) => item.status === "accepted"
    );
    const initialValue = 0;
    const sumWithInitial = ownDepositCalculation.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return sumWithInitial.toString();
  }, [ownDepositData]);

  // send sum deposit of table header
  const depositReportSum = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {getTotalDeposit() > 0 && (
        <div style={{ marginRight: "10px" }}>
          {t("totalDiposit")}:-৳{getTotalDeposit()}
        </div>
      )}
    </div>
  );

  // send sum own deposits of table
  const ownDepositSum = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {getTotalOwnDeposit() > 0 && (
        <div>
          {t("totalDiposit")}:-৳{getTotalOwnDeposit()}
        </div>
      )}
    </div>
  );

  // send filter data to print
  const collector = allCollector.find((item) => item.user === collectorIds);

  const filterData = {
    collector: collector?.name ? collector.name : t("all collector"),
    startDate: moment(dateStart).format("YYYY-MM-DD"),
    endDate: moment(dateEnd).format("YYYY-MM-DD"),
  };

  // deposit report column
  const columns = useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "30%",
        Header: t("collector"),
        accessor: "user",
        Cell: ({ cell: { value } }) => {
          const performer = ownerUsers.find((item) => item[value]);

          return (
            <div>
              {performer &&
                performer[value].name + "(" + performer[value].role + ")"}
            </div>
          );
        },
      },
      {
        width: "15%",
        Header: t("total"),
        accessor: "amount",
        Cell: ({ row: { original } }) => (
          <div>৳ {FormatNumber(original.amount)}</div>
        ),
      },
      {
        width: "25%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div>
              {original.status === "pending" ? (
                acceptLoading ? (
                  <div className="loaderDiv">
                    <Loader />
                  </div>
                ) : original.depositBy === "collector" ? (
                  <div className="">
                    <span
                      style={{ cursor: "pointer" }}
                      class="badge bg-success shadow me-1"
                      onClick={() => {
                        depositAcceptRejectHandler("accepted", original.id);
                      }}
                    >
                      {t("accept")}
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      class="badge bg-danger shadow"
                      onClick={() => {
                        depositAcceptRejectHandler("rejected", original.id);
                      }}
                    >
                      {t("rejected")}
                    </span>
                  </div>
                ) : (
                  <span class="badge bg-warning shadow">
                    {t("managerPending")}
                  </span>
                )
              ) : (
                <>
                  {original.status === "accepted" && (
                    <span className="badge bg-success">
                      {t("managerAccepted")}
                    </span>
                  )}
                  {original.status === "rejected" && (
                    <span className="badge bg-danger">
                      {t("managerCanceled")}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ),
      },
      {
        width: "25%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
    ],
    [t, ownerUsers]
  );

  // own deposit column
  const columns2 = useMemo(
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
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "20%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original.status === "accepted" && (
              <span className="badge bg-success">{t("adminAccepted")}</span>
            )}
            {original.status === "rejected" && (
              <span className="badge bg-danger">{t("adminCanceled")}</span>
            )}
            {original.status === "pending" && (
              <span className="badge bg-warning">{t("adminPending")}</span>
            )}
          </div>
        ),
      },
      {
        width: "25%",
        Header: t("note"),
        accessor: "note",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original?.note && original?.note?.slice(0, 70)}
              <span
                className="text-primary see-more"
                data-bs-toggle="modal"
                data-bs-target="#dipositNoteDetailsModal"
                // onClick={() => setMessage(original?.note)}
              >
                {original?.note?.length > 70 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },
      {
        width: "20%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
    ],
    [t]
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
                  <div>{t("deposit")}</div>

                  <div className="d-flex justify-content-center align-items-center">
                    {tabEventKey !== "deposit" && (
                      <>
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
                              onClick={() => reloadHandler()}
                            ></ArrowClockwise>
                          )}
                        </div>

                        <ReactToPrint
                          documentTitle="গ্রাহক লিস্ট"
                          trigger={() => (
                            <PrinterFill
                              title={t("print")}
                              className="addcutmButton"
                            />
                          )}
                          content={() => componentRef.current}
                        />
                      </>
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey="deposit"
                      id="uncontrolled-tab-example"
                      onSelect={(eventKey) => setTabEventKey(eventKey)}
                    >
                      <Tab eventKey="deposit" title={t("deposit")}>
                        <Formik
                          initialValues={{
                            amount: balance,
                            balance: balance, //put the value from api
                            note: "",
                          }}
                          validationSchema={billValidation}
                          onSubmit={(values) => {
                            billDepositHandler(values);
                          }}
                          enableReinitialize
                        >
                          {() => (
                            <Form>
                              <div className="displayGrid3 mt-4">
                                <FtextField
                                  type="text"
                                  name="balance"
                                  label={t("totalBalance")}
                                  disabled
                                />
                                <FtextField
                                  type="text"
                                  name="amount"
                                  label={t("dipositAmount")}
                                />
                                <FtextField
                                  type="text"
                                  name="note"
                                  label={t("note")}
                                />
                                <button
                                  type="submit"
                                  className="btn btn-outline-primary w-140 dipositSubmitBtn"
                                >
                                  {isLoading ? <Loader /> : t("submit")}
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </Tab>

                      <Tab eventKey="depositReport" title={t("depositReport")}>
                        <Accordion alwaysOpen activeKey={activeKeys}>
                          <Accordion.Item
                            eventKey="filter"
                            className="accordionBorder"
                          >
                            <Accordion.Body className="accordionPadding">
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
                                    minDate={new Date(userData?.createdAt)}
                                  />
                                </div>

                                <select
                                  className="form-select mt-0"
                                  onChange={(e) =>
                                    setCollectorIds(e.target.value)
                                  }
                                >
                                  <option value="all" defaultValue>
                                    {t("all collector")}
                                  </option>
                                  {allCollector?.map((c, key) => (
                                    <option key={key} value={c.user}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>

                                <div>
                                  <DatePicker
                                    className="form-control"
                                    selected={dateStart}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="MMM dd yyyy"
                                    minDate={selectDate}
                                    maxDate={
                                      lastDate.getMonth() + 1 ===
                                      date.getMonth() + 1
                                        ? date
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
                                      date.getMonth() + 1
                                        ? date
                                        : lastDate
                                    }
                                    placeholderText={t("selectBillDate")}
                                  />
                                </div>

                                <div className="">
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

                        {tabEventKey === "depositReport" && (
                          <div style={{ display: "none" }}>
                            <PrintCustomer
                              filterData={filterData}
                              currentCustomers={mainData}
                              ref={componentRef}
                              status="depositReport"
                            />
                          </div>
                        )}
                        <div className="table-section">
                          <Table
                            customComponent={depositReportSum}
                            columns={columns}
                            data={mainData}
                            isLoading={isLoading}
                          ></Table>
                        </div>
                      </Tab>

                      <Tab eventKey="ownDeposit" title={t("ownDeposit")}>
                        <Accordion alwaysOpen activeKey={activeKeys}>
                          <Accordion.Item
                            eventKey="filter"
                            className="accordionBorder"
                          >
                            <Accordion.Body className="accordionPadding">
                              <div className="displayGrid6">
                                <div>
                                  <DatePicker
                                    className="form-control mw-100 mt-0"
                                    selected={ownFilter}
                                    onChange={(date) => setOwnFilter(date)}
                                    dateFormat="MMM-yyyy"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    maxDate={new Date()}
                                    minDate={new Date(userData?.createdAt)}
                                  />
                                </div>

                                <div>
                                  <DatePicker
                                    className="form-control"
                                    selected={ownDepositStart}
                                    onChange={(date) =>
                                      setOwnDepositStart(date)
                                    }
                                    dateFormat="MMM dd yyyy"
                                    minDate={ownSelectDate}
                                    maxDate={
                                      ownLastDate.getMonth() + 1 ===
                                      date.getMonth() + 1
                                        ? date
                                        : ownLastDate
                                    }
                                    placeholderText={t("selectBillDate")}
                                  />
                                </div>
                                <div>
                                  <DatePicker
                                    className="form-control"
                                    selected={ownDepositEnd}
                                    onChange={(date) => setOwnDepositEnd(date)}
                                    dateFormat="MMM dd yyyy"
                                    minDate={ownSelectDate}
                                    maxDate={
                                      ownLastDate.getMonth() + 1 ===
                                      date.getMonth() + 1
                                        ? date
                                        : ownLastDate
                                    }
                                    placeholderText={t("selectBillDate")}
                                  />
                                </div>
                                <div>
                                  <button
                                    className="btn btn-outline-primary w-140"
                                    type="button"
                                    onClick={ownDepositDateFilter}
                                  >
                                    {t("filter")}
                                  </button>
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>

                        {tabEventKey === "ownDeposit" && (
                          <div style={{ display: "none" }}>
                            <PrintCustomer
                              currentCustomers={ownDepositData}
                              ref={componentRef}
                              status="ownDeposit"
                            />
                          </div>
                        )}

                        <div className="table-section">
                          <Table
                            customComponent={ownDepositSum}
                            data={ownDepositData}
                            columns={columns2}
                            isLoading={isLoading}
                          ></Table>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDeposit;
