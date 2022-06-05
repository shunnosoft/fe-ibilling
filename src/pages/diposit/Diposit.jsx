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

export default function Diposit() {
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

  // useEffect(()=>{

  //   var arr = []
  //   allDeposit.forEach((original)=>{
  //     var match = userRole==="ispOwner"? manager :( allCollector.find((c) => c.user === original.user))

  //     if(match) {
  //       arr.push({...original,name:match.name})
  //     }

  //   })
  //   setMainData(arr)
  //   setMainData2(arr)
  // },[allCollector,allDeposit,userRole,manager])

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
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "নাম",
        accessor: "name",
        Cell: ({ row: { original } }) => (
          <div>
            নাম {userRole === "ispOwner" ? "(ম্যানেজার)" : "(কালেক্টর)"}
          </div>
        ),
      },
      {
        Header: "মোট",
        accessor: "amount",
        Cell: ({ row: { original } }) => (
          <div>৳ {FormatNumber(original.amount)}</div>
        ),
      },

      {
        Header: <div className="text-center">অ্যাকশন</div>,
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
                      গ্রহণ
                    </button>
                    <button
                      onClick={() => {
                        depositAcceptRejectHandler("rejected", original.id);
                      }}
                    >
                      বাতিল
                    </button>
                  </div>
                )
              ) : (
                <>
                  {original.status === "accepted" && (
                    <span className="statusClass">গ্রহণ করা হয়েছে</span>
                  )}
                  {original.status === "rejected" && (
                    <span className="rejectClass">বাতিল হয়েছে</span>
                  )}
                </>
              )}
            </div>
          </div>
        ),
      },
      {
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    ],
    []
  );
  const columns2 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "পরিমান",
        accessor: "amount",
        Cell: ({ row: { original } }) => <div>৳ {FormatNumber(original)}</div>,
      },
      {
        Header: "স্টেটাস",
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original.status === "accepted" && (
              <span className="statusClass">গ্রহণ করা হয়েছে</span>
            )}
            {original.status === "rejected" && (
              <span className="rejectClass">বাতিল হয়েছে</span>
            )}
          </div>
        ),
      },

      {
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    ],
    []
  );

  const customComponent = (
    <div style={{ fontSize: "20px", display: "flex", alignItems: "center" }}>
      {userRole === "ispOwner" || userRole === "manager" ? (
        <div style={{ marginRight: "10px" }}>
          মোট ডিপোজিটঃ {getTotalDeposit()} টাকা
        </div>
      ) : (
        ""
      )}
      {userRole !== "ispOwner" ? (
        <div>নিজ ডিপোজিটঃ {getTotalOwnDeposit()} টাকা</div>
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
                <h2 className="collectorTitle">ডিপোজিট</h2>
              </FourGround>

              <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                {(userRole === "manager" || userRole === "collector") && (
                  <Tab eventKey="home" title="ডিপোজিট করুন">
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
                                  label="ডিপোজিট পরিমান"
                                />
                                <button
                                  type="submit"
                                  className="btn btn-success dipositSubmitBtn"
                                >
                                  {isLoading ? <Loader></Loader> : " সাবমিট"}
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </FourGround>
                  </Tab>
                )}

                <Tab eventKey="profile" title="ডিপোজিট">
                  <FourGround>
                    <div>
                      <div className="selectFilteringg">
                        {userRole === "ispOwner" && (
                          <select
                            className="form-select"
                            onChange={(e) => onChangeCollector(e.target.value)}
                          >
                            <option value="" defaultValue>
                              সকল কালেক্টর{" "}
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
                            className="btn btn-success mt-2"
                            type="button"
                            onClick={onClickFilter}
                          >
                            ফিল্টার
                          </button>
                        </div>
                      </div>
                    </div>
                    <Table
                      customComponent={customComponent}
                      columns={columns}
                      data={mainData}
                    ></Table>
                  </FourGround>
                </Tab>

                {(userRole === "manager" || userRole === "collector") && (
                  <Tab eventKey="contact" title="নিজ ডিপোজিট">
                    <FourGround>
                      <Table
                        customComponent={customComponent}
                        data={ownDeposits}
                        columns={columns2}
                      ></Table>
                    </FourGround>
                  </Tab>
                )}
              </Tabs>

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
