import React, { useRef, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
// import { Check, X, ThreeDots } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";

// internal import
import { FtextField } from "../../components/common/FtextField";
import "./diposit.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useCallback, useEffect } from "react";
import {
  addDeposit,
  depositAcceptReject,
  getCollector,
  getDeposit,
  getDepositforReseller,
  // getMyDeposit,
  getTotalbal,
} from "../../features/apiCallReseller";
import { useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import {
  ArrowClockwise,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import PrintCustomer from "./customerPDF";
import DatePicker from "react-datepicker";
import { badge } from "../../components/common/Utils";
import { Accordion } from "react-bootstrap";

export default function Diposit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const componentRef = useRef(); //reference of pdf export component

  // for validation -- Collector
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });

  // get Current date
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);

  // get ispOwner Id -- Collector
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get user role form redux
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);

  // get user data from redux
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  // get collector from redux -- Reseller
  const collectors = useSelector((state) => state.collector?.collector);

  // get all deposit from redux -- Reseller
  const allDeposit = useSelector((state) => state.payment.allDeposit);

  // get collector balance -- Collector
  const balancee = useSelector((state) => state.payment.balance);

  // get Own deposit from redux -- Collector
  const ownDeposits = useSelector((state) => state.payment.myDeposit);

  // start date state -- Reseller
  const [startDate, setStartDate] = useState(firstDay);

  // end date state -- Reseller
  const [endDate, setEndDate] = useState(today);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // reseller page loader -- Reseller
  const [resellerPageLoader, setResellerPageLoader] = useState(false);

  // accepting loading -- Reseller
  const [acceptLoading, setAccLoading] = useState(false);

  // reseller state -- Reseller
  const [resellerData, setResellerData] = useState([]);

  // collector state -- collector
  const [collectorData, setCollectorData] = useState([]);

  // collector id state -- Reseller
  const [collectorIds, setCollectorIds] = useState("all");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // diposit accept & reject handler -- Reseller
  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id, setAccLoading);
  };

  // filter handler -- Reseller / Collector
  const onClickFilter = () => {
    let filterData = userRole === "reseller" ? allDeposit : ownDeposits;

    if (userRole === "reseller") {
      if (collectorIds !== "all") {
        filterData = filterData.filter((bill) => bill.user === collectorIds);
      } else {
        filterData = filterData;
      }
    }

    // date filter -- Reseller / Collector
    filterData = filterData.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    if (userRole === "reseller") {
      setResellerData(filterData);
    } else {
      setCollectorData(filterData);
    }
  };

  // find specific collector for PDF filter data -- Reseller
  let findFilterCollector;
  if (collectorIds !== "all") {
    findFilterCollector = collectors.find((item) => item.user === collectorIds);
  }

  // PDF Filter Data -- Reseller
  const filterData_pdf = {
    collector: findFilterCollector?.name
      ? findFilterCollector.name
      : t("all collector"),
    startDate: moment(startDate).format("lll"),
    endDate: moment(endDate).format("lll"),
  };

  // Deposit Handler -- Collector
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: userRole,
      amount: data.amount,
      balance: data.balance,
      user: userData?.user.id,
      ispOwner: ispOwner,
      reseller: userData.collector.reseller,
    };
    addDeposit(dispatch, sendingData, setIsLoading);
  };

  // reload handling
  const reloadHandler = () => {
    // for -- Reseller
    if (userRole === "reseller") {
      getDepositforReseller(
        dispatch,
        userData.reseller.id,
        setResellerPageLoader
      );
    }

    // for -- Collector
    if (userRole === "collector") {
      getDeposit(dispatch, setResellerPageLoader);
    }
  };

  // set data to state -- Reseller / Collector
  useEffect(() => {
    if (userRole === "reseller") {
      // for Reseller
      if (allDeposit) setResellerData(allDeposit);
    } else {
      // for collector
      if (ownDeposits) setCollectorData(ownDeposits);
    }

    // initial filter -- Reseller
    let initialFilter = userRole === "reseller" ? allDeposit : ownDeposits;

    // date filter -- Reseller / Collector
    initialFilter = initialFilter.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );
    if (userRole === "reseller") {
      // for reseller
      setResellerData(initialFilter);
    } else {
      // for collector
      setCollectorData(initialFilter);
    }
  }, [allDeposit, ownDeposits]);

  // api call -- Collector
  useEffect(() => {
    if (userRole === "collector") {
      getTotalbal(dispatch, setIsLoading);
      getDeposit(dispatch, setResellerPageLoader);
    }
  }, []);

  // api call
  useEffect(() => {
    // For -- Reseller
    if (userRole === "reseller") {
      getDepositforReseller(
        dispatch,
        userData.reseller.id,
        setResellerPageLoader
      );
      getCollector(dispatch, userData.reseller.id, setIsLoading);
    }
  }, []);

  // calculation total deposit -- Reseller
  const getTotalDeposit = useCallback(() => {
    const initialValue = 0;
    const sumWithInitial = resellerData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return FormatNumber(sumWithInitial);
  }, [resellerData]);

  // calculate own deposit -- Collector
  const getTotalOwnDeposit = useCallback(() => {
    let initialValue = 0;
    const collectorDeposit = collectorData.map((val) => {
      if (val.status === "accepted") {
        return (initialValue += val.amount);
      }
    });
    // const sumWithInitial = collectorData.reduce(
    //   (previousValue, currentValue) => previousValue + currentValue.amount,
    //   initialValue
    // );
    return FormatNumber(initialValue);
  }, [collectorData]);

  // sending table header data
  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {userRole !== "reseller" ? (
        <div>
          {t("ownDeposit")} {getTotalOwnDeposit()} {t("tk")}
        </div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          {t("totalDeposit")} {getTotalDeposit()} {t("tk")}
        </div>
      )}
    </div>
  );

  // deposit report column -- Reseller
  const resellerColumn = React.useMemo(() => [
    {
      width: "10%",
      Header: "#",
      id: "row",
      accessor: (row) => Number(row.id + 1),
      Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
    },
    {
      width: "31%",
      Header: t("collector"),
      accessor: "user",
      Cell: ({ cell: { value } }) => {
        const performer = collectors.find((item) => item.user === value);

        return <div>{performer && performer.name}</div>;
      },
    },
    {
      width: "15%",
      Header: t("amount"),
      accessor: "amount",
      Cell: ({ row: { original } }) => (
        <div>৳ {FormatNumber(original.amount)}</div>
      ),
    },
    {
      width: "22%",
      Header: <div className="text-center"> {t("action")} </div>,
      id: "option1",

      Cell: ({ row: { original } }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {original.status === "pending" ? (
              acceptLoading ? (
                <div className="loaderDiv">
                  <Loader />
                </div>
              ) : (
                <div className="AcceptRejectBtn">
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
                    {t("cancel")}
                  </span>
                </div>
              )
            ) : (
              <>
                {original.status === "accepted" && (
                  <span>{badge(original.status)}</span>
                )}
                {original.status === "rejected" && (
                  <span>{badge(original.status)}</span>
                )}
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      width: "22%",
      Header: t("date"),
      accessor: "createdAt",
      Cell: ({ cell: { value } }) => {
        return moment(value).format("YYYY/MM/DD hh:mm a");
      },
    },
  ]);

  // table column -- Collector
  const collectorColumn = React.useMemo(() => [
    {
      width: "15%",
      Header: "#",
      id: "row",
      accessor: (row) => Number(row.id + 1),
      Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
    },
    {
      width: "26%",
      Header: t("amount"),
      accessor: "amount",
      Cell: ({ row: { original } }) => (
        <div>৳ {FormatNumber(original.amount)}</div>
      ),
    },
    {
      width: "27%",
      Header: t("status"),
      accessor: "status",
      Cell: ({ cell: { value } }) => <span>{badge(value)}</span>,
    },
    {
      width: "32%",
      Header: t("date"),
      accessor: "createdAt",
      Cell: ({ cell: { value } }) => {
        return moment(value).format("YYYY/MM/DD hh:mm a");
      },
    },
  ]);

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
                    <div>{t("diposit")}</div>
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
                      {resellerPageLoader ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                    {userRole === "reseller" && (
                      <>
                        <div className="addAndSettingIcon">
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
                        </div>
                        <div style={{ display: "none" }}>
                          <PrintCustomer
                            filterData={filterData_pdf}
                            currentCustomers={resellerData}
                            ref={componentRef}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </FourGround>

              {userRole === "reseller" && (
                <FourGround>
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <div className="selectFilteringg">
                            <select
                              className="form-select me-2 mt-0"
                              onChange={(e) => setCollectorIds(e.target.value)}
                            >
                              <option value="all" defaultValue>
                                {t("all collector")}
                              </option>
                              {collectors?.map((c, key) => (
                                <option key={key} value={c.user}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <div>
                              <DatePicker
                                className="form-control mw-100 mt-0"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText={t("selectBillDate")}
                              />
                            </div>
                            <div className="mx-2">
                              <DatePicker
                                className="form-control mw-100 mt-0"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText={t("selectBillDate")}
                              />
                            </div>
                            <button
                              className="btn btn-outline-primary w-140 mt-0 chartFilteritem"
                              type="button"
                              onClick={onClickFilter}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="collectorWrapper pb-2">
                      <div className="tableSection">
                        <Table
                          isLoading={resellerPageLoader}
                          customComponent={customComponent}
                          data={resellerData}
                          columns={resellerColumn}
                        ></Table>
                      </div>
                    </div>
                  </div>
                </FourGround>
              )}

              {userRole === "collector" && (
                <FourGround>
                  <div className="collectorWrapper mt-2 py-2">
                    <div className="managerDipositToIsp">
                      <Formik
                        initialValues={{
                          amount: balancee,
                          balance: balancee, //put the value from api
                        }}
                        validationSchema={BillValidatoin}
                        onSubmit={(values) => {
                          billDipositHandler(values);
                        }}
                        enableReinitialize
                      >
                        {() => (
                          <Form>
                            <div className="displayGridForDiposit">
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
                              <button
                                type="submit"
                                className="btn btn-outline-primary w-140 dipositSubmitBtn"
                              >
                                {isLoading ? <Loader></Loader> : t("submit")}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>

                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item
                        eventKey="filter"
                        className="accordionBorder"
                      >
                        <Accordion.Body className="accordionPadding">
                          <div className="selectFilteringg">
                            <div>
                              <DatePicker
                                className="form-control mw-100 mt-0"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText={t("selectBillDate")}
                              />
                            </div>
                            <div className="mx-2">
                              <DatePicker
                                className="form-control mw-100 mt-0"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText={t("selectBillDate")}
                              />
                            </div>
                            <button
                              className="btn btn-outline-primary w-140 mt-0 chartFilteritem"
                              type="button"
                              onClick={onClickFilter}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="tableSection">
                      <Table
                        isLoading={isLoading}
                        customComponent={customComponent}
                        data={collectorData}
                        columns={collectorColumn}
                      ></Table>
                    </div>
                  </div>
                </FourGround>
              )}

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
