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
import { ArrowClockwise, PrinterFill } from "react-bootstrap-icons";
import PrintCustomer from "./customerPDF";

export default function Diposit() {
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component
  const balancee = useSelector((state) => state.payment.balance);
  console.log(balancee);

  const allDeposit = useSelector((state) => state.payment.allDeposit);

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // const userData = useSelector(state=>state.persistedReducer.auth.userData)
  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  const manager = useSelector((state) => state.manager.manager);
  const collectors = useSelector((state) => state.collector?.collector);

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );
  //To do after api impliment
  const ownDeposits = useSelector((state) => state.payment.myDeposit);
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );
  const [collectorIds, setCollectorIds] = useState("all");
  const [mainData, setMainData] = useState(allDeposit);
  const [mainData2, setMainData2] = useState(allDeposit);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  // const [depositAccepted, setDepositAccepet] = useState("")
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const balance = useSelector(state=>state.payment.balance)

  // bill amount
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: currentUser?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: currentUser?.user.id,
      ispOwner: ispOwner,
      reseller: userData.collector.reseller,
    };
    addDeposit(dispatch, sendingData, setLoading);
  };

  const [acceptLoading, setAccLoading] = useState(false);

  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id, setAccLoading);
  };
  const allCollector = useSelector((state) => state.collector.collector);

  useEffect(() => {
    var arr = [];
    allDeposit.forEach((original) => {
      var match = allCollector.find((c) => c.user === original.user);

      if (match) {
        arr.push({ ...original, name: match.name });
      }
    });
    setMainData(arr);
    setMainData2(arr);
  }, [allCollector, allDeposit, userRole, manager]);

  const getTotalDeposit = useCallback(() => {
    const initialValue = 0;
    const sumWithInitial = mainData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return sumWithInitial.toString();
  }, [mainData]);

  const getTotalOwnDeposit = useCallback(() => {
    const initialValue = 0;
    const sumWithInitial = ownDeposits.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return sumWithInitial.toString();
  }, [ownDeposits]);

  const getNames = useCallback(() => {
    var arr = [];
    allDeposit.forEach((original) => {
      var match =
        userRole === "ispOwner"
          ? manager
          : allCollector.find((c) => c.user === original.user);

      if (match) {
        arr.push({ ...original, name: match.name });
      }
    });

    return arr;
  }, [allCollector, userRole, manager, allDeposit]);

  // useEffect(() => {
  //   if (userRole !== "ispOwner") getTotalbal(dispatch, setLoading);
  // }, [dispatch, userRole]);

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
      getNames().filter(
        (original) =>
          Date.parse(original.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(original.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [getNames]);

  // reload handler
  const reloadHandler = () => {
    getDepositforReseller(dispatch, userData?.reseller?.id, setLoading);
  };

  useEffect(() => {
    if (userData.user.role === "collector")
      if (ownDeposits.length === 0) getDeposit(dispatch);
      else if (userData.user.role === "reseller")
        if (allDeposit.length === 0)
          getDepositforReseller(dispatch, userData.reseller.id, setLoading);
  }, [dispatch, userData]);

  // const onChangeCollector = (userId) => {
  //   if (userId) {
  //     setCollectorIds([userId]);
  //   } else {
  //     let collectorUserIdsArr = [];
  //     collectors.map((original) => collectorUserIdsArr.push(original.user));
  //     setCollectorIds(collectorUserIdsArr);
  //   }
  // };

  const onClickFilter = () => {
    let arr = getNames();
    if (collectorIds !== "all") {
      arr = arr.filter((bill) => bill.user === collectorIds);
    } else {
      arr = arr;
    }

    // if (collectorIds.length) {
    //   arr = arr.filter((bill) => collectorIds.includes(bill.user));
    // }

    arr = arr.filter(
      (original) =>
        Date.parse(original.createdAt) >= Date.parse(dateStart) &&
        Date.parse(original.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
    // setMainData2(arr);
  };

  // send filter data to print
  const collector = collectors.find((item) => item.user === collectorIds);

  const filterData = {
    collector: collector?.name ? collector.name : t("all collector"),
    startDate: moment(dateStart).format("YYYY-MM-DD"),
    endDate: moment(dateEnd).format("YYYY-MM-DD"),
  };

  const columns2 = React.useMemo(
    () => [
      {
        width: "25%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("amount"),
        accessor: "amount",
        Cell: ({ row: { original } }) => <div>৳ {FormatNumber(original)}</div>,
      },
      {
        width: "25%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.status === "accepted" && (
              <span className="statusClass"> {t("acceptable")}</span>
            )}
            {original?.status === "rejected" && (
              <span className="rejectClass">{t("rejected")}</span>
            )}
          </div>
        ),
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
    [t]
  );
  const columns = React.useMemo(
    () => [
      {
        width: "12%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "22%",
        Header: t("name"),
        accessor: "name",
        Cell: ({ row: { original } }) => (
          <div>
            {t("name")}
            {userRole ===
              `ispOwner" ? "(${t("manager")})" : "(${t("collector")})`}
          </div>
        ),
      },
      {
        width: "22%",
        Header: t("total"),
        accessor: "amount",
        Cell: ({ row: { original } }) => <div>৳ {FormatNumber(original)}</div>,
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
                    <button
                      onClick={() => {
                        depositAcceptRejectHandler("accepted", original.id);
                      }}
                    >
                      {t("accept")}
                    </button>
                    <button
                      onClick={() => {
                        depositAcceptRejectHandler("rejected", original.id);
                      }}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                )
              ) : (
                <>
                  {original.status === "accepted" && (
                    <span className="statusClass">{t("acceptable")}</span>
                  )}
                  {original.status === "rejected" && (
                    <span className="rejectClass">{t("rejected")}</span>
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
    [t]
  );
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

              {userRole !== "reseller" && (
                <FourGround>
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
                              {isLoading ? <Loader></Loader> : t("submit")}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </FourGround>
              )}

              {/* table */}
              {userRole === "collector" && (
                <FourGround>
                  <Table
                    customComponent={customComponent}
                    isLoading={isLoading}
                    data={mainData}
                    columns={columns2}
                  ></Table>
                </FourGround>
              )}

              {userRole !== "collector" && (
                <FourGround>
                  <div className="collectorWrapper mt-2 py-2">
                    <div className="selectFilteringg">
                      {userRole === "reseller" && (
                        <select
                          className="form-select"
                          onChange={(e) => setCollectorIds(e.target.value)}
                        >
                          <option value="all" defaultValue>
                            {t("all collector")}{" "}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.user}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      )}

                      <input
                        className="form-select mx-3"
                        type="date"
                        id="start"
                        name="trip-start"
                        value={moment(dateStart).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                      />
                      <input
                        className="form-select me-3"
                        type="date"
                        id="end"
                        name="trip-start"
                        value={moment(dateEnd).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                      />
                      <button
                        className="btn btn-outline-primary w-140 mt-2 chartFilteritem"
                        type="button"
                        onClick={onClickFilter}
                      >
                        {t("filter")}
                      </button>
                      <div style={{ display: "none" }}>
                        <PrintCustomer
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                        />
                      </div>
                    </div>

                    <div className="submitdiv d-grid gap-2"></div>

                    {/* table */}
                    <div className="tableSection">
                      <Table
                        customComponent={customComponent}
                        isLoading={isLoading}
                        data={ownDeposits}
                        columns={columns}
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
