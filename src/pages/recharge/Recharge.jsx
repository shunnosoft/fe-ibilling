import React, { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "./diposit.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useCallback, useEffect } from "react";
import { fetchReseller, rechargeHistoryfunc } from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import { rechargeHistoryfuncR } from "../../features/apiCallReseller";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import { FilterCircle, PenFill, ThreeDots } from "react-bootstrap-icons";
import CommentEdit from "./modal/CommentEdit";
import FormatNumber from "../../components/common/NumberFormat";
import { Accordion } from "react-bootstrap";

const Recharge = () => {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // get user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // get user data
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get recharge history
  let rechargeHistory = useSelector((state) => state.recharge.rechargeHistory);

  // get all resellers
  const resellers = useSelector((state) => state.reseller.reseller);

  // recharge data state
  const [rechargeData, setRechargeData] = useState([]);

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // date start state
  const [dateStart, setStartDate] = useState(firstDay);

  // date end filter
  const [dateEnd, setEndDate] = useState(today);

  // reseller data loading state
  const [resellerLoading, setResellerLoading] = useState(false);

  // recharge history loading
  const [rechargeLoading, setRechargeLoading] = useState(false);

  // reseller id state
  const [resellerId, setResellerId] = useState();

  // recharge id state
  const [rechargeId, setRechargeId] = useState();

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // data filter
  const onClickFilter = () => {
    let filterData = [...rechargeHistory];

    if (resellerId) {
      filterData = filterData.filter(
        (item) => item.reseller?.id === resellerId
      );
    }

    filterData = filterData.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );

    setRechargeData(filterData);
  };

  useEffect(() => {
    // set recharge data to state
    setRechargeData(rechargeHistory);

    // initial filter
    // var initialToday = new Date();
    // var initialFirst = new Date(
    //   initialToday.getFullYear(),
    //   initialToday.getMonth(),
    //   1
    // );

    // initialFirst.setHours(0, 0, 0, 0);
    // initialToday.setHours(23, 59, 59, 999);
    // setRechargeData(
    //   rechargeHistory.filter(
    //     (item) =>
    //       Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
    //       Date.parse(item.createdAt) <= Date.parse(initialToday)
    //   )
    // );
  }, [rechargeHistory]);

  useEffect(() => {
    // api calls
    rechargeHistoryfunc(dispatch, ispOwnerId, setRechargeLoading);
    fetchReseller(dispatch, ispOwnerId, setResellerLoading);
  }, []);

  // total amount calculation
  const getTotalRecharge = useCallback(() => {
    const initialValue = 0;
    const sumWithInitial = rechargeData.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      initialValue
    );
    return sumWithInitial;
  }, [rechargeData]);

  // send to table header
  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {userRole === "ispOwner" ? (
        <div>
          {t("totalRecharge")} {FormatNumber(getTotalRecharge())} {t("tk")}
        </div>
      ) : (
        <div style={{ marginRight: "10px" }}>
          {t("totalRecharge")} {FormatNumber(getTotalRecharge())} {t("tk")}
        </div>
      )}
    </div>
  );

  // table column
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
        width: "20%",
        Header: t("name"),
        accessor: "reseller.name",
        Cell: ({ cell: { value } }) => {
          return <div>{userRole === "ispOwner" ? value : userData?.name}</div>;
        },
      },
      {
        width: "18%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "30%",
        Header: t("comment"),
        accessor: "comment",
      },

      {
        width: "22%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "7%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="resellerDropdown">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#rechargeCommentEdit"
                  onClick={() => {
                    setRechargeId(original?.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <h2> {t("rechargeHistory")} </h2>
                  </div>

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
                </div>
              </FourGround>

              {userRole !== "collector" && (
                <FourGround>
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <div className="selectFilteringg">
                            {userRole === "ispOwner" && (
                              <select
                                className="form-select mt-0"
                                onChange={(e) => setResellerId(e.target.value)}
                              >
                                <option value="" defaultValue>
                                  {t("allReseller")}
                                </option>
                                {resellers?.map((item, key) => (
                                  <option key={key} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            )}

                            <div className="ms-2">
                              <DatePicker
                                className="form-control"
                                selected={dateStart}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText={t("selectBillDate")}
                              />
                            </div>
                            <div className="mx-2">
                              <DatePicker
                                className="form-control"
                                selected={dateEnd}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="MMM dd yyyy"
                                placeholderText={t("selectBillDate")}
                              />
                            </div>
                            <button
                              className="btn btn-outline-primary w-140"
                              type="button"
                              onClick={onClickFilter}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div className="collectorWrapper py-2">
                      <div className="table-section">
                        <Table
                          customComponent={customComponent}
                          data={rechargeData}
                          columns={columns}
                          isLoading={resellerLoading}
                        ></Table>
                      </div>
                    </div>
                  </div>
                </FourGround>
              )}

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <CommentEdit rechargeId={rechargeId} />
    </>
  );
};

export default Recharge;
