import React, { useState } from "react";
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

export default function Diposit() {
  const { t } = useTranslation();
  const balancee = useSelector(
    (state) => state.persistedReducer.payment.balance
  );
  const allDeposit = useSelector(
    (state) => state.persistedReducer.payment.allDeposit
  );

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // const userData = useSelector(state=>state.auth.userData)
  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  const manager = useSelector(
    (state) => state.persistedReducer.manager.manager
  );
  const collectors = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  // console.log(collectors);
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );
  //To do after api impliment
  const ownDeposits = useSelector(
    (state) => state.persistedReducer.payment.myDeposit
  );
  const userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );
  const [collectorIds, setCollectorIds] = useState([]);
  const [mainData, setMainData] = useState(allDeposit);
  const [mainData2, setMainData2] = useState(allDeposit);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  // const [depositAccepted, setDepositAccepet] = useState("")
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const balance = useSelector(state=>state.persistedReducer.payment.balance)

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
  const allCollector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );

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
  // console.log(mainData);
  // console.log(ownDeposits);
  // useEffect(() => {
  //   getMyDeposit(dispatch);
  // }, [dispatch]);

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

    // Temp varialbe for search
    // setMainData2(
    //   getNames().filter(
    //     (original) =>
    //       Date.parse(original.createdAt) >= Date.parse(initialFirst) &&
    //       Date.parse(original.createdAt) <= Date.parse(initialToday)
    //   )
    // );
  }, [getNames]);

  useEffect(() => {
    if (userData.user.role === "collector") getDeposit(dispatch);
    else if (userData.user.role === "reseller")
      getDepositforReseller(dispatch, userData.reseller.id);
  }, [dispatch, userData]);

  const onChangeCollector = (userId) => {
    if (userId) {
      setCollectorIds([userId]);
    } else {
      let collectorUserIdsArr = [];
      collectors.map((original) => collectorUserIdsArr.push(original.user));
      setCollectorIds(collectorUserIdsArr);
    }
  };

  const onClickFilter = () => {
    let arr = getNames();

    if (collectorIds.length) {
      arr = arr.filter((bill) => collectorIds.includes(bill.user));
    }

    arr = arr.filter(
      (original) =>
        Date.parse(original.createdAt) >= Date.parse(dateStart) &&
        Date.parse(original.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
    // setMainData2(arr);
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
                      {t("cancle")}
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
    <div style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
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
                <h2 className="collectorTitle">{t("diposit")}</h2>
              </FourGround>

              {userRole !== "reseller" ? (
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
                              label="মোট ব্যালান্স"
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
              ) : (
                ""
              )}

              {/* table */}
              {userRole === "collector" ? (
                <FourGround>
                  <Table
                    customComponent={customComponent}
                    data={mainData}
                    columns={columns2}
                  ></Table>
                </FourGround>
              ) : (
                ""
              )}
              {userRole !== "collector" ? (
                <FourGround>
                  <div className="collectorWrapper">
                    <div className="selectFilteringg">
                      {userRole === "reseller" && (
                        <select
                          className="form-select"
                          onChange={(e) => onChangeCollector(e.target.value)}
                        >
                          <option value="" defaultValue>
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
                    </div>

                    <div className="submitdiv d-grid gap-2"></div>

                    {/* table */}
                    <div className="tableSection">
                      <Table
                        customComponent={customComponent}
                        data={ownDeposits}
                        columns={columns}
                      ></Table>
                    </div>
                  </div>
                </FourGround>
              ) : (
                ""
              )}

              {/* Diposit status */}
              {/* <FourGround>
                <div className="DipositStatusSection">
                  <h6 className="dipositStatusCheck">ডিপোজিট স্ট্যাটাস</h6>
                  <div className="dipositStatus">
                    <div className="table-responsive-lg">
                      <table className="table table-striped ">
                        <thead>
                          <tr>
                            <td>
                              নাম {userRole === "manager" ? "(ম্যানেজার)" : ""}
                              {userRole === "collector" ? "(কালেক্টর)" : ""}
                            </td>
                            <td>জমা</td>
                            <td className="textAlignCenter">স্ট্যাটাস</td>
                            <td>তারিখ</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <h5 className="ACPbtn acceptBtn">Accepted</h5>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <h5 className="ACPbtn rejectBtn">Rejected</h5>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <h5 className="ACPbtn pendingBtn">Pending</h5>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </FourGround> */}

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
