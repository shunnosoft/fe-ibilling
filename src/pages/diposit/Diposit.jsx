import React, { useRef, useState } from "react";
import { useCallback, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  ArrowClockwise,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import ReactToPrint from "react-to-print";

// internal import
import "./diposit.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import {
  depositAcceptReject,
  getCollector,
  getDeposit,
  getManger,
} from "../../features/apiCalls";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import PrintCustomer from "./customerPDF";
import NoteDetailsModal from "./NoteDetailsModal";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";

export default function Diposit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef(); //reference of pdf export component

  // get all deposit form redux
  const allDeposit = useSelector((state) => state?.payment?.allDeposit);

  // get manager from redux
  const manager = useSelector((state) => state?.manager?.manager);

  // get isp owner id from redux
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get current user from redux
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // get all collector form redux
  const allCollector = useSelector((state) => state?.collector?.collector);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // get current date
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // loading statue
  const [isLoading, setIsLoading] = useState(false);
  const [acceptLoading, setAccLoading] = useState(false);

  // all deposit
  const [mainData, setMainData] = useState([]);

  // manager message note
  const [message, setMessage] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  //select depositor id
  const [collectorIds, setCollectorIds] = useState("all");
  const [depositedName, setDepositedName] = useState("");

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  // all initial local state
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  // current month start & end date
  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  useEffect(() => {
    setStartDate(selectDate);

    if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
      setEndDate(today);
    } else {
      setEndDate(lastDate);
    }

    filterDate.getMonth() + 1 &&
      getDeposit(
        dispatch,
        ispOwner,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
  }, [filterDate]);

  useEffect(() => {
    allCollector.length === 0 && getCollector(dispatch, ispOwner, setIsLoading);
    manager.length === 0 && getManger(dispatch, ispOwner);
    ownerUsers.length === 0 && getOwnerUsers(dispatch, ispOwner);
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  useEffect(() => {
    setMainData(allDeposit);
  }, [allDeposit]);

  // reload handler
  const reloadHandler = () => {
    getDeposit(
      dispatch,
      ispOwner,
      filterDate.getFullYear(),
      filterDate.getMonth() + 1,
      setIsLoading
    );
  };

  // deposit report accept & reject handler
  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id, setAccLoading, "ispOwner");
  };

  // filter section
  const onClickFilter = () => {
    let arr = [...allDeposit];

    if (collectorIds !== "all") {
      arr = arr.filter((bill) => bill.user === collectorIds);
    } else {
      arr = arr;
    }

    // date filter
    arr = arr.filter(
      (val) =>
        new Date(moment(val.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(val.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );
    setMainData(arr);
  };

  const filterData = {
    deposit: depositedName ? depositedName : t("all"),
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
        width: "15%",
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
        width: "15%",
        Header: t("depositBy"),
        Cell: ({ row: { original } }) => {
          const performer = manager.find(
            (item) => item.id === original.manager
          );

          return <div>{performer?.name || "Owner"}</div>;
        },
      },
      {
        width: "20%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div>
              {original.status === "pending" &&
              original.depositBy === "manager" ? (
                acceptLoading ? (
                  <div className="loaderDiv">
                    <Loader />
                  </div>
                ) : original.depositBy === "manager" ? (
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
                      {t("rejected")}
                    </span>
                  </div>
                ) : (
                  ""
                )
              ) : original.depositBy === "collector" ? (
                <div>
                  {original.status === "accepted" && (
                    <span className="badge bg-success">
                      {t("managerAccepted")}
                    </span>
                  )}
                  {original.status === "rejected" && (
                    <span className="badge bg-danger">
                      {t("managerCanceled")}
                    </span>
                  )}
                  {original.status === "pending" && (
                    <span className="badge bg-warning">
                      {t("managerPending")}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  {original.status === "accepted" && (
                    <span className="badge bg-success">
                      {t("adminAccepted")}
                    </span>
                  )}
                  {original.status === "rejected" && (
                    <span className="badge bg-danger">
                      {t("adminCanceled")}
                    </span>
                  )}
                  {original.status === "pending" && (
                    <span className="badge bg-warning">
                      {t("adminPending")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("note"),
        accessor: "note",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original?.note && original?.note?.slice(0, 70)}
              <span
                className="text-primary see-more"
                // data-bs-toggle="modal"
                // data-bs-target="#dipositNoteDetailsModal"
                // onClick={() => setMessage(original?.note)}
              >
                {original?.note?.length > 70 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },
      {
        width: "10%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
    ],
    [t, ownerUsers]
  );

  // total deposit calculation
  let depositCalculation;
  const getTotalDeposit = useCallback(() => {
    depositCalculation = mainData.filter(
      (item) => item.depositBy === "manager" && item.status === "accepted"
    );

    const sumWithInitial = depositCalculation.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      0
    );
    return sumWithInitial.toString();
  }, [mainData]);

  // send sum deposit of table header
  const depositReportSum = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {getTotalDeposit() > 0 && (
        <div style={{ marginRight: "10px" }}>
          {t("totalDiposit")}:-৳{getTotalDeposit()}
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("deposit")}</div>

                  <div className="d-flex justify-content-center align-items-center">
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

                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

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
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="displayGrid6">
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={filterDate}
                              onChange={(date) => setFilterDate(date)}
                              dateFormat="MMM-yyyy"
                              showMonthYearPicker
                              showFullMonthYearPicker
                              maxDate={new Date()}
                              minDate={new Date(userData?.createdAt)}
                            />
                          </div>

                          <select
                            className="form-select mt-0"
                            onChange={(e) => {
                              setCollectorIds(e.target.value);
                              setDepositedName(e.target.name);
                            }}
                          >
                            <option value="all" defaultValue>
                              {t("all collector")}
                            </option>
                            {manager.map((val) => (
                              <option name={val.name} value={val?.user}>
                                {val?.name} (Manager)
                              </option>
                            ))}
                            {allCollector?.map((c, key) => (
                              <option key={key} name={c.name} value={c.user}>
                                {c.name}
                              </option>
                            ))}
                          </select>

                          <div>
                            <DatePicker
                              className="form-control"
                              selected={dateStart}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={selectDate}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <div>
                            <DatePicker
                              className="form-control"
                              selected={dateEnd}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={selectDate}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <div className="">
                            <button
                              className="btn btn-outline-primary w-140"
                              type="button"
                              onClick={onClickFilter}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="addCollector">
                      <div className="d-none">
                        <PrintCustomer
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                        />
                      </div>

                      <div className="table-section">
                        <Table
                          isLoading={isLoading}
                          columns={columns}
                          data={mainData}
                          customComponent={depositReportSum}
                        ></Table>
                      </div>
                    </div>
                  </div>
                </div>

                {(butPermission?.deposit || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* modals */}
      <NoteDetailsModal message={message} />
    </>
  );
}
