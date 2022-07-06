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
  // getMyDeposit,
  getTotalbal,
} from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function Diposit() {
  const { t } = useTranslation();
  const balancee = useSelector(
    (state) => state?.persistedReducer?.payment?.balance
  );
  const allDeposit = useSelector(
    (state) => state?.persistedReducer?.payment?.allDeposit
  );
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  const manager = useSelector(
    (state) => state?.persistedReducer?.manager?.manager
  );
  const collectors = useSelector(
    (state) => state?.persistedReducer?.collector?.collector
  );
  const ispOwner = useSelector(
    (state) => state.persistedReducer?.auth?.ispOwnerId
  );
  const currentUser = useSelector(
    (state) => state.persistedReducer?.auth?.currentUser
  );
  //To do after api impliment
  const ownDeposits = useSelector(
    (state) => state?.persistedReducer?.payment?.myDeposit
  );

  const [collectorIds, setCollectorIds] = useState([]);
  const [mainData, setMainData] = useState(allDeposit);
  console.log(mainData);

  const userRole = useSelector((state) => state?.persistedReducer?.auth?.role);

  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const balance = useSelector(
    (state) => state.persistedReducer.payment.balance
  );

  // bill amount
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: currentUser?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: currentUser?.user.id,
      ispOwner: ispOwner,
    };
    addDeposit(dispatch, sendingData, setLoading);
  };

  const [acceptLoading, setAccLoading] = useState(false);

  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id, setAccLoading);
  };
  const allCollector = useSelector(
    (state) => state?.persistedReducer?.collector?.collector
  );

  const getTotalDeposit = useCallback(() => {
    const initialValue = 0;
    const sumWithInitial = mainData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return sumWithInitial.toString();
  }, [mainData]);

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

  useEffect(() => {
    if (userRole !== "ispOwner") getTotalbal(dispatch, setLoading);
  }, [dispatch, userRole]);

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

  useEffect(() => {
    if (userRole !== "collector") {
      getDeposit(dispatch, {
        depositerRole:
          userRole === "ispOwner"
            ? "manager"
            : userRole === "manager"
            ? "collector"
            : "",
        ispOwnerID: ispOwner,
      });
    }
  }, [ispOwner, userRole, dispatch]);

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
            {t("nam")} {userRole === "ispOwner" ? "(ম্যানেজার)" : "(কালেক্টর)"}
          </div>
        ),
      },
      {
        width: "22%",
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
                    <span className="statusClass">{t("accepted")}</span>
                  )}
                  {original.status === "rejected" && (
                    <span className="rejectClass">{t("cancled")}</span>
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
            {original.status === "accepted" && (
              <span className="statusClass">{t("accepted")}</span>
            )}
            {original.status === "rejected" && (
              <span className="rejectClass">{t("cancled")}</span>
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

  const customComponent = (
    <div style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
      {userRole === "ispOwner" || userRole === "manager" ? (
        <div style={{ marginRight: "10px" }}>
          {t("totalDiposit")} {getTotalDeposit()} {t("tk")}
        </div>
      ) : (
        ""
      )}
      {userRole !== "ispOwner" ? (
        <div>
          {t("newDiposit")} {getTotalOwnDeposit()} {t("tk")}
        </div>
      ) : (
        ""
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
                <h2 className="collectorTitle"> {t("diposit")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey="profile"
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
                                      className="btn btn-success dipositSubmitBtn"
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

                      <Tab eventKey="profile" title={t("diposit")}>
                        <div>
                          <div className="selectFilteringg">
                            {userRole === "ispOwner" && (
                              <select
                                className="form-select"
                                onChange={(e) =>
                                  onChangeCollector(e.target.value)
                                }
                              >
                                <option value="" defaultValue>
                                  {t("all collector")}
                                </option>
                                {collectors?.map((c, key) => (
                                  <option key={key} value={c.user}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            )}
                            <div className="dateDiv  ">
                              <input
                                className="form-select"
                                type="date"
                                id="start"
                                name="trip-start"
                                value={moment(dateStart).format("YYYY-MM-DD")}
                                onChange={(e) => {
                                  setStartDate(e.target.value);
                                }}
                                // value="2018-07-22"
                                // min="2018-01-01"
                                // max="2018-12-31"
                              />
                            </div>
                            <div className="dateDiv">
                              <input
                                className="form-select"
                                type="date"
                                id="end"
                                name="trip-start"
                                value={moment(dateEnd).format("YYYY-MM-DD")}
                                onChange={(e) => {
                                  setEndDate(e.target.value);
                                }}
                                // value="2018-07-22"
                                // min="2018-01-01"
                                // max="2018-12-31"
                              />
                            </div>
                            <div className="submitDiv">
                              <button
                                className="btn btn-outline-primary w-140 mt-2"
                                type="button"
                                onClick={onClickFilter}
                              >
                                {t("filter")}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="table-section">
                          <Table
                            customComponent={customComponent}
                            columns={columns}
                            data={mainData}
                          ></Table>
                        </div>
                      </Tab>

                      {(userRole === "manager" || userRole === "collector") && (
                        <Tab eventKey="contact" title={t("ownDeposit")}>
                          <Table
                            customComponent={customComponent}
                            data={ownDeposits}
                            columns={columns2}
                          ></Table>
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
