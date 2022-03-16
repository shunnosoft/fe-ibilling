import { useState } from "react";
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
  getMyDeposit,
  getTotalbal,
} from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import moment from "moment";

export default function Diposit() {
  const balancee = useSelector((state) => state.payment.balance);
  const allDeposit = useSelector((state) => state.payment.allDeposit);
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  const manager = useSelector((state) => state.manager.manager);
  const collectors = useSelector((state) => state.collector.collector);
  const ispOwner = useSelector((state) => state.auth?.ispOwnerId);
  const currentUser = useSelector((state) => state.auth?.currentUser);
  //To do after api impliment
  const ownDeposits = useSelector((state) => state.payment.myDeposit);

  const [collectorIds, setCollectorIds] = useState([]);
  const [mainData, setMainData] = useState(allDeposit);
  // const [mainData2, setMainData2] = useState(allDeposit);
  const userRole = useSelector((state) => state.auth.role);
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
    };
    addDeposit(dispatch, sendingData, setLoading);
  };

  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id);
  };
  const allCollector = useSelector((state) => state.collector.collector);

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

  useEffect(() => {
    getMyDeposit(dispatch);
  }, [dispatch]);

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
                              সাবমিট
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
              {userRole === "collector" ? (
                <div className="row searchCollector">
                  <div className="col-sm-8">
                    <h4 className="allCollector">
                      নিজ ডিপোজিট (মোট): <span>{getTotalOwnDeposit()}</span>
                    </h4>
                  </div>

                  <div className="col-sm-4">
                    <div className=" collectorSearch">
                      {/* <Search className="serchingIcon" /> */}
                      <input
                        type="text"
                        className="search"
                        placeholder="সার্চ"
                        // onChange={(e) => setCusSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* table */}
              <div className="table-responsive-lg">
                <table className="table table-striped ">
                  <thead>
                    <tr>
                      <td>পরিমান</td>
                      <td className="textAlignCenter">স্টেটাস</td>
                      <td>তারিখ</td>
                    </tr>
                  </thead>
                  <tbody>
                    {ownDeposits?.map((item, key) => (
                      <tr key={key}>
                        <td>৳ {item.amount}</td>
                        <td>{item.status}</td>
                        <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {userRole !== "collector" ? (
                <FourGround>
                  <div className="collectorWrapper">
                    <div className="selectFilteringg">
                      {userRole !== "ispOwner" && (
                        <select
                          className="form-selectt"
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
                          className="form-selectt"
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
                          className="form-selectt"
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

                    {userRole !== "ispOwner" ? (
                      <div className="row searchCollector">
                        <div className="col-sm-8">
                          <h4 className="allCollector">
                            কালেক্টর ডিপোজিট: <span>{getTotalDeposit()}</span>
                          </h4>
                        </div>

                        <div className="col-sm-4">
                          <div className=" collectorSearch">
                            {/* <Search className="serchingIcon" /> */}
                            <input
                              type="text"
                              className="search"
                              placeholder="সার্চ"
                              // onChange={(e) => setCusSearch(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* table */}
                    <div className="table-responsive-lg">
                      <table className="table table-striped ">
                        <thead>
                          <tr>
                            <td>
                              নাম{" "}
                              {userRole === "ispOwner"
                                ? "(ম্যানেজার)"
                                : "(কালেক্টর)"}
                            </td>
                            <td>মোট</td>
                            <td className="textAlignCenter">অ্যাকশন</td>
                            <td>তারিখ</td>
                          </tr>
                        </thead>
                        <tbody>
                          {mainData?.map((item, key) => (
                            <tr key={key}>
                              <td>{item.name}</td>
                              <td>৳ {item.amount}</td>
                              <td>
                                {item.status === "pending" ? (
                                  <div className="AcceptRejectBtn">
                                    <button
                                      onClick={() => {
                                        depositAcceptRejectHandler(
                                          "accepted",
                                          item.id
                                        );
                                      }}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => {
                                        depositAcceptRejectHandler(
                                          "rejected",
                                          item.id
                                        );
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="statusClass">
                                    {item.status}
                                  </span>
                                )}
                              </td>
                              <td>
                                {moment(item.createdAt).format("DD-MM-YYYY")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {userRole !== "ispOwner" ? (
                      <div className="row searchCollector">
                        <div className="col-sm-8">
                          <h4 className="allCollector">
                            নিজ ডিপোজিট: <span>{getTotalOwnDeposit()}</span>
                          </h4>
                        </div>

                        <div className="col-sm-4">
                          <div className=" collectorSearch">
                            {/* <Search className="serchingIcon" /> */}
                            <input
                              type="text"
                              className="search"
                              placeholder="সার্চ"
                              // onChange={(e) => setCusSearch(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* table */}
                   {  userRole !== "ispOwner" ? <div className="table-responsive-lg">
                      <table className="table table-striped ">
                        <thead>
                          <tr>
                            <td>পরিমান</td>
                            <td className="textAlignCenter">স্টেটাস</td>
                            <td>তারিখ</td>
                          </tr>
                        </thead>
                        <tbody>
                          {ownDeposits?.map((item, key) => (
                            <tr key={key}>
                              <td>৳ {item.amount}</td>
                              <td>{item.status}</td>
                              <td>
                                {moment(item.createdAt).format("DD-MM-YYYY")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>:""}
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
