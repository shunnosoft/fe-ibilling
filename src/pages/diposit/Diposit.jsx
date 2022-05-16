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

export default function Diposit() {
  const balancee = useSelector(
    (state) => state.persistedReducer.payment.balance
  );
  const allDeposit = useSelector(
    (state) => state.persistedReducer.payment.allDeposit
  );
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

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

  const [collectorIds, setCollectorIds] = useState([]);
  const [mainData, setMainData] = useState(allDeposit);
  // const [mainData2, setMainData2] = useState(allDeposit);
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

  // useEffect(()=>{

  //   var arr = []
  //   allDeposit.forEach((item)=>{
  //     var match = userRole==="ispOwner"? manager :( allCollector.find((c) => c.user === item.user))

  //     if(match) {
  //       arr.push({...item,name:match.name})
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
    allDeposit.forEach((item) => {
      var match =
        userRole === "ispOwner"
          ? manager
          : allCollector.find((c) => c.user === item.user);

      if (match) {
        arr.push({ ...item, name: match.name });
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
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );

    // Temp varialbe for search
    // setMainData2(
    //   getNames().filter(
    //     (item) =>
    //       Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
    //       Date.parse(item.createdAt) <= Date.parse(initialToday)
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
      collectors.map((item) => collectorUserIdsArr.push(item.user));
      setCollectorIds(collectorUserIdsArr);
    }
  };

  const onClickFilter = () => {
    let arr = getNames();

    if (collectorIds.length) {
      arr = arr.filter((bill) => collectorIds.includes(bill.user));
    }

    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
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
        Cell: ({ row: { val } }) => (
          <div>
            নাম {userRole === "ispOwner" ? "(ম্যানেজার)" : "(কালেক্টর)"}
          </div>
        ),
      },
      {
        Header: "মোট",
        accessor: "amount",
        Cell: ({ row: { val } }) => <div>৳ {FormatNumber(val)}</div>,
      },

      {
        Header: <div className="text-center">অ্যাকশন</div>,
        id: "option1",

        Cell: ({ row: { item } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              {item.status === "pending" ? (
                acceptLoading ? (
                  <div className="loaderDiv">
                    <Loader />
                  </div>
                ) : (
                  <div className="AcceptRejectBtn">
                    <button
                      onClick={() => {
                        depositAcceptRejectHandler("accepted", item.id);
                      }}
                    >
                      গ্রহণ
                    </button>
                    <button
                      onClick={() => {
                        depositAcceptRejectHandler("rejected", item.id);
                      }}
                    >
                      বাতিল
                    </button>
                  </div>
                )
              ) : (
                <>
                  {item.status === "accepted" && (
                    <span className="statusClass">গ্রহণ করা হয়েছে</span>
                  )}
                  {item.status === "rejected" && (
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
        Cell: ({ row: { val } }) => <div>৳ {FormatNumber(val)}</div>,
      },
      {
        Header: "স্টেটাস",
        accessor: "status",
        Cell: ({ row: { item } }) => (
          <div>
            {item.status === "accepted" && (
              <span className="statusClass">গ্রহণ করা হয়েছে</span>
            )}
            {item.status === "rejected" && (
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

              {userRole !== "ispOwner" ? (
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
              ) : (
                ""
              )}

              <br />

              {/* table */}
              {userRole === "collector" ? (
                <Table data={ownDeposits} columns={columns2}></Table>
              ) : (
                ""
              )}
              {userRole !== "collector" ? (
                <FourGround>
                  <div className="collectorWrapper">
                    <div className="selectFilteringg">
                      {userRole !== "ispOwner" && (
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
                    </div>

                    <div className="submitdiv d-grid gap-2">
                      <button
                        className="btn fs-5 btn-success w-100"
                        type="button"
                        onClick={onClickFilter}
                      >
                        ফিল্টার
                      </button>
                    </div>

                    {/* table */}
                    <Table columns={columns} data={mainData}></Table>

                    {/* table */}
                    {userRole !== "ispOwner" ? (
                      <Table data={ownDeposits} columns={columns2}></Table>
                    ) : (
                      ""
                    )}
                  </div>
                </FourGround>
              ) : (
                ""
              )}

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
