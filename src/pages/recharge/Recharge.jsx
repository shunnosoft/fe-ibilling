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
import { useTranslation } from "react-i18next";

export default function RechargeHistoryofReseller() {
  const { t } = useTranslation();
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const rechargeHistory = useSelector(
    (state) => state.recharge.rechargeHistory
  );

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const collectors = useSelector((state) => state.reseller.reseller);
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const [cusSearch, setCusSearch] = useState("");

  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  const [collectorIds, setCollectorIds] = useState([]);
  const [mainData, setMainData] = useState(rechargeHistory);
  const [mainData2, setMainData2] = useState(rechargeHistory);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  // const [depositAccepted, setDepositAccepet] = useState("")

  // const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
        width: "17%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "30%",
        Header: t("name"),
        accessor: "reseller.name",
        Cell: ({ cell: { value } }) => {
          return <div>{userRole === "ispOwner" ? value : userData?.name}</div>;
        },
      },
      {
        width: "36%",
        width: "17%",
        Header: t("amount"),
        accessor: "amount",
      },

      {
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
      {userRole === "ispOwner" ? (
        <div>
          {t("totalRecharge")} {getTotalRecharge()} {t("tk")}
        </div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          {t("totalRecharge")} {getTotalRecharge()} {t("tk")}
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
                <h2 className="collectorTitle"> {t("rechargeHistory")} </h2>
              </FourGround>

              {userRole !== "collector" ? (
                <FourGround>
                  <div className="collectorWrapper py-2">
                    <div className="selectFilteringg">
                      {userRole === "ispOwner" && (
                        <select
                          className="form-select"
                          onChange={(e) => onChangeReseller(e.target.value)}
                        >
                          <option value="" defaultValue>
                            {t("allReseller")}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      )}

                      <input
                        className="form-select mx-2"
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
                      {/* <div className="submitdiv d-grid gap-2"> */}
                      <button
                        className="btn btn-outline-primary w-140 mt-2 ms-2"
                        type="button"
                        onClick={onClickFilter}
                      >
                        {t("filter")}
                      </button>
                      {/* </div> */}
                    </div>

                    {/* table */}
                    <div className="table-section">
                      <Table
                        customComponent={customComponent}
                        data={mainData}
                        columns={columns2}
                      ></Table>
                    </div>
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
