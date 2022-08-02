import React, { useRef, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
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
  getDeposit,
  getMyDeposit,
  getTotalbal,
} from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import { ArrowClockwise, PrinterFill } from "react-bootstrap-icons";
import ReactToPrint from "react-to-print";
import PrintCustomer from "./customerPDF";

export default function Diposit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef(); //reference of pdf export component

  // get balance from redux
  const balancee = useSelector(
    (state) => state?.persistedReducer?.payment?.balance
  );

  // get all deposit form redux
  const allDeposit = useSelector(
    (state) => state?.persistedReducer?.payment?.allDeposit
  );

  const collectorDeposite = useSelector(
    (state) => state?.persistedReducer?.payment?.collectorDeposite
  );
  // get manager from redux
  const manager = useSelector(
    (state) => state?.persistedReducer?.manager?.manager
  );

  // get isp owner id from redux
  const ispOwner = useSelector(
    (state) => state.persistedReducer?.auth?.ispOwnerId
  );

  // get current user from redux
  const currentUser = useSelector(
    (state) => state.persistedReducer?.auth?.currentUser
  );

  // get user role form redux
  const userRole = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get own deposit from redux
  let ownDeposits = useSelector(
    (state) => state?.persistedReducer?.payment?.myDeposit
  );

  // get all collector form redux
  const allCollector = useSelector(
    (state) => state?.persistedReducer?.collector?.collector
  );

  // get owner users
  const ownerUsers = useSelector(
    (state) => state?.persistedReducer?.ownerUsers?.ownerUser
  );

  // get current date
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // all initial local state
  const [dateStart, setStartDate] = useState(firstDay);

  const [ownDepositStart, setOwnDepositStart] = useState(firstDay);

  const [ownDepositEnd, setOwnDepositEnd] = useState(today);

  const [dateEnd, setEndDate] = useState(today);

  const [collectorIds, setCollectorIds] = useState("all");

  const [mainData, setMainData] = useState([]);

  const [ownDepositData, setOwnDepositData] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const [acceptLoading, setAccLoading] = useState(false);
  const [selectedCollector, setSelectedCustomer] = useState("");
  // add deposit form validation
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });

  // add bill deposit
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: currentUser?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: currentUser?.user.id,
      ispOwner: ispOwner,
    };
    addDeposit(dispatch, sendingData, setLoading);
    data.amount = "";
  };

  // bill report accept & reject handler
  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id, setAccLoading);
  };

  // reload handler
  const reloadHandler = () => {
    if (userRole != "ispOwner") {
      getMyDeposit(dispatch, setLoading);
    }
    if (userRole === "ispOwner") {
      getDeposit(
        dispatch,
        {
          depositerRole: "manager",
          ispOwnerID: ispOwner,
        },
        userRole,
        setLoading
      );

      getDeposit(
        dispatch,
        {
          depositerRole: "collector",
          ispOwnerID: ispOwner,
        },
        userRole,
        setLoading
      );
    }

    if (userRole === "manager") {
      getDeposit(
        dispatch,
        {
          depositerRole: "collector",
          ispOwnerID: ispOwner,
        },
        userRole,
        setLoading
      );
    }
  };

  // get own deposit, ownerUser & total balance api call
  useEffect(() => {
    if (userRole != "ispOwner") {
      if (allDeposit.length === 0) getMyDeposit(dispatch, setLoading);
    }

    getOwnerUsers(dispatch, ispOwner);
    if (userRole !== "ispOwner") getTotalbal(dispatch, setLoading);
  }, [userRole]);

  useEffect(() => {
    if (userRole === "ispOwner") {
      if (allDeposit.length === 0)
        getDeposit(
          dispatch,
          {
            depositerRole: "manager",
            ispOwnerID: ispOwner,
          },
          userRole,
          setLoading
        );

      if (allDeposit.length === 0)
        getDeposit(
          dispatch,
          {
            depositerRole: "collector",
            ispOwnerID: ispOwner,
          },
          userRole,
          setLoading
        );
    }

    if (userRole === "manager") {
      if (allDeposit.length === 0)
        getDeposit(
          dispatch,
          {
            depositerRole: "collector",
            ispOwnerID: ispOwner,
          },
          userRole,
          setLoading
        );
    }
  }, []);

  useEffect(() => {
    setOwnDepositData(ownDeposits);
    if (userRole === "ispOwner" && allDeposit && collectorDeposite) {
      return setMainData([...allDeposit, ...collectorDeposite]);
    } else {
      setMainData(allDeposit);
    }
  }, [allDeposit, collectorDeposite, ownDeposits]);
  // filter section
  const onClickFilter = () => {
    let arr = [...allDeposit, ...collectorDeposite];
    if (collectorIds !== "all") {
      arr = arr.filter((bill) => bill.user === collectorIds);
    } else {
      arr = arr;
    }
    //collector Filter
    if (selectedCollector)
      arr = arr.filter((item) => item.user === selectedCollector);

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

  const ownDepositDateFilter = () => {
    let ownDepositFilter = [...ownDepositData];
    // date filter
    ownDepositFilter = ownDepositFilter.filter(
      (original) =>
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(ownDepositStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(original.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(ownDepositEnd).format("YYYY-MM-DD")).getTime()
    );

    setOwnDepositData(ownDepositFilter);
  };

  // send filter data to print
  const collector = allCollector.find((item) => item.user === collectorIds);

  const filterData = {
    collector: collector?.name ? collector.name : t("all collector"),
    startDate: moment(dateStart).format("YYYY-MM-DD"),
    endDate: moment(dateEnd).format("YYYY-MM-DD"),
  };

  // deposit report column
  const columns = React.useMemo(
    () => [
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
        width: "22%",
        Header: t("action"),

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
                ) : (userRole === "ispOwner" &&
                    original.depositBy === "manager") ||
                  (userRole === "manager" &&
                    original.depositBy === "collector") ? (
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
                      {t("cancel")}
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
                      {original.depositBy === "manager"
                        ? t("adminAccepted")
                        : t("managerAccepted")}
                    </span>
                  )}
                  {original.status === "rejected" && (
                    <span className="badge bg-danger">
                      {original.depositBy === "manager"
                        ? t("adminCanceled")
                        : t("managerCanceled")}
                    </span>
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
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
    ],
    [t, ownerUsers]
  );

  // own deposit column
  const columns2 = React.useMemo(
    () => [
      {
        width: "14%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "27%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "27%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original.status === "accepted" && (
              <span className="badge bg-success">
                {userRole === "manager"
                  ? t("adminAccepted")
                  : t("managerAccepted")}
              </span>
            )}
            {original.status === "rejected" && (
              <span className="badge bg-danger">
                {userRole === "manager"
                  ? t("adminCanceled")
                  : t("managerCanceled")}
              </span>
            )}
            {original.status === "pending" && (
              <span className="badge bg-warning">
                {userRole === "manager"
                  ? t("adminPending")
                  : t("managerPending")}
              </span>
            )}
          </div>
        ),
      },

      {
        width: "27%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
    ],
    [t]
  );

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
      {(userRole === "ispOwner" || userRole === "manager") && (
        <div style={{ marginRight: "10px" }}>
          {t("totalDiposit")} {getTotalDeposit()} {t("tk")}
        </div>
      )}
    </div>
  );

  const ownDepositSum = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {userRole !== "ispOwner" && (
        <div>
          {t("newDiposit")} {getTotalOwnDeposit()} {t("tk")}
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("diposit")}</div>
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
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 pt-2">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey={
                        userRole !== "collector" ? "profile" : "contact"
                      }
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      {(userRole === "manager" || userRole === "collector") && (
                        <Tab eventKey="home" title={t("diposit")}>
                          <div className="managerDipositToIsp">
                            <Formik
                              initialValues={{
                                amount: "",
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
                                      {isLoading ? (
                                        <Loader></Loader>
                                      ) : (
                                        t("submit")
                                      )}
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                        </Tab>
                      )}

                      {userRole !== "collector" && (
                        <Tab eventKey="profile" title={t("depositReport")}>
                          <div>
                            <div className="selectFilteringg">
                              {userRole === "ispOwner" && (
                                <select
                                  className="form-select"
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
                                  <option value={manager?.user}>
                                    {manager?.name}
                                  </option>
                                </select>
                              )}
                              <div className="mx-2">
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  onChange={(e) =>
                                    setSelectedCustomer(e.target.value)
                                  }
                                >
                                  <option value="">Select Collector</option>
                                  {allCollector.map((item) => (
                                    <option value={item.user}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="">
                                <input
                                  className="form-select"
                                  type="date"
                                  id="start"
                                  name="trip-start"
                                  value={moment(dateStart).format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    setStartDate(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="mx-2">
                                <input
                                  className="form-select"
                                  type="date"
                                  id="end"
                                  name="trip-start"
                                  value={moment(dateEnd).format("YYYY-MM-DD")}
                                  onChange={(e) => {
                                    setEndDate(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="">
                                <button
                                  className="btn btn-outline-primary w-140 mt-2"
                                  type="button"
                                  onClick={onClickFilter}
                                >
                                  {t("filter")}
                                </button>
                              </div>
                              <div style={{ display: "none" }}>
                                <PrintCustomer
                                  filterData={filterData}
                                  currentCustomers={mainData}
                                  ref={componentRef}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="table-section">
                            <Table
                              customComponent={depositReportSum}
                              columns={columns}
                              data={mainData}
                              isLoading={isLoading}
                            ></Table>
                          </div>
                        </Tab>
                      )}

                      {(userRole === "manager" || userRole === "collector") && (
                        <Tab eventKey="contact" title={t("ownDeposit")}>
                          <div className="selectFilteringg">
                            <div className="dateDiv  ">
                              <input
                                className="form-select"
                                type="date"
                                id="start"
                                name="trip-start"
                                value={moment(ownDepositStart).format(
                                  "YYYY-MM-DD"
                                )}
                                onChange={(e) => {
                                  setOwnDepositStart(e.target.value);
                                }}
                              />
                            </div>
                            <div className="dateDiv">
                              <input
                                className="form-select"
                                type="date"
                                id="end"
                                name="trip-start"
                                value={moment(ownDepositEnd).format(
                                  "YYYY-MM-DD"
                                )}
                                onChange={(e) => {
                                  setOwnDepositEnd(e.target.value);
                                }}
                              />
                            </div>
                            <div className="submitDiv">
                              <button
                                className="btn btn-outline-primary w-140 mt-2"
                                type="button"
                                onClick={ownDepositDateFilter}
                              >
                                {t("filter")}
                              </button>
                            </div>
                          </div>
                          <div className="table-section">
                            <Table
                              customComponent={ownDepositSum}
                              data={ownDepositData}
                              columns={columns2}
                              isLoading={isLoading}
                            ></Table>
                          </div>
                        </Tab>
                      )}
                    </Tabs>
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
