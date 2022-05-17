import React, { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
// import { Check, X, ThreeDots } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
// import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
// import * as Yup from "yup";

// internal import
// import { FtextField } from "../../components/common/FtextField";
import "./diposit.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useCallback, useEffect } from "react";
import {
  rechargeHistoryfunc,
  // getMyDeposit,
} from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import moment from "moment";
import { rechargeHistoryfuncR } from "../../features/apiCallReseller";
// import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";

export default function RechargeHistoryofReseller() {
  // const balancee = useSelector(state => state.payment.balance);
  // const allDeposit = useSelector(state => state.payment.allDeposit);
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const rechargeHistory = useSelector(
    (state) => state.persistedReducer.recharge.rechargeHistory
  );

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  // const manager = useSelector(state => state.manager.manager);
  const collectors = useSelector(
    (state) => state.persistedReducer.reseller.reseller
  );
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const [cusSearch, setCusSearch] = useState("");
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  // const currentUser = useSelector(state => state.auth?.currentUser);
  //To do after api impliment
  const [collectorIds, setCollectorIds] = useState([]);
  const [mainData, setMainData] = useState(rechargeHistory);
  const [mainData2, setMainData2] = useState(rechargeHistory);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  // const [depositAccepted, setDepositAccepet] = useState("")

  // const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const balance = useSelector(state=>state.persistedReducer.payment.balance)

  // bill amount
  // const allCollector = useSelector(state => state.reseller.reseller);

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

  //todo
  const getTotalRecharge = useCallback(() => {
    const initialValue = 0;
    const sumWithInitial = mainData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return sumWithInitial.toString();
  }, [mainData]);

  useEffect(() => {
    const keys = ["amount", "createdAt", "reseller+name"];
    setMainData(
      mainData2.filter((item) =>
        keys.some((key) =>
          key.split("+")[1]
            ? typeof item[key.split("+")[0]][key.split("+")[1]] === "string"
              ? item[key.split("+")[0]][key.split("+")[1]]
                  ?.toString()
                  ?.toLowerCase()
                  .includes(cusSearch)
              : item[key.split("+")[0]][key.split("+")[1]]
                  ?.toString()
                  .includes(cusSearch)
            : typeof item[key] === "string"
            ? item[key] === "createdAt"
              ? moment(item[key]).format("YYYY-MM-DD").includes(cusSearch)
              : item[key]
                  .toString()
                  .toString()
                  .toLowerCase()
                  .includes(cusSearch)
            : item[key].toString().includes(cusSearch)
        )
      )
    );
  }, [cusSearch, mainData2]);

  useEffect(() => {
    userRole === "reseller"
      ? rechargeHistoryfuncR(dispatch, userData.id)
      : rechargeHistoryfunc(dispatch, ispOwner);
  }, [dispatch, ispOwner, userRole, userData]);

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
      rechargeHistory.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [rechargeHistory]);

  // useEffect(() => {
  //   if (userRole !== "collector") {
  //     getDeposit(dispatch, {
  //       depositerRole:
  //         userRole === "ispOwner"
  //           ? "manager"
  //           : userRole === "manager"
  //           ? "collector"
  //           : "",
  //       ispOwnerID: ispOwner,
  //     });
  //   }
  // }, [ispOwner, userRole, dispatch]);

  const onChangeReseller = (userId) => {
    if (userId) {
      setCollectorIds([userId]);
    } else {
      let collectorUserIdsArr = [];
      collectors.map((item) => collectorUserIdsArr.push(item.id));
      setCollectorIds(collectorUserIdsArr);
    }
  };

  const onClickFilter = () => {
    // let arr = getNames();
    let arr = rechargeHistory;
    if (collectorIds.length) {
      arr = rechargeHistory.filter((recharge) =>
        collectorIds.includes(recharge.reseller.id)
      );
    }
    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );
    setMainData(arr);
    setMainData2(arr);
  };

  const columns2 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "নাম",
        accessor: "reseller.name",
        Cell: ({ cell: { value } }) => {
          return <div>{userRole === "ispOwner" ? value : userData?.name}</div>;
        },
      },
      {
        Header: "পরিমান",
        accessor: "amount",
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
      {userRole === "ispOwner" ? (
        <div>মোট রিচার্জঃ {getTotalRecharge()} টাকা</div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          মোট রিচার্জঃ {getTotalRecharge()} টাকা
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
                <h2 className="collectorTitle">রিচার্জ হিস্ট্রি</h2>
              </FourGround>

              {userRole !== "collector" ? (
                <FourGround>
                  <div className="collectorWrapper">
                    <div className="selectFilteringg">
                      {userRole === "ispOwner" && (
                        <select
                          className="form-select"
                          onChange={(e) => onChangeReseller(e.target.value)}
                        >
                          <option value="" defaultValue>
                            সকল রিসেলার{" "}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.id}>
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

                    <Table
                      customComponent={customComponent}
                      data={mainData}
                      columns={columns2}
                    ></Table>
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
