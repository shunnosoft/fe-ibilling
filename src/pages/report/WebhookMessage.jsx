import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  ArrowClockwise,
  FilterCircle,
  PencilSquare,
  PlayBtn,
  SendCheck,
  SendX,
} from "react-bootstrap-icons";
import { Accordion } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";

// internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import useISPowner from "../../hooks/useISPOwner";
import { getAllWebhookMessage } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import Loader from "../../components/common/Loader";
import ReferenceIDEdit from "./modal/ReferenceIDEdit";
import PlayTutorial from "../tutorial/PlayTutorial";

const WebhookMessage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current date state
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // get user & current user data form useISPOwner hook
  const { ispOwnerData, userData } = useISPowner();

  // get customers webhook paymnet message data
  const messages = useSelector((state) => state?.payment?.webhookMessage);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get customer webhook paymnet message data
  const [mainData, setMainData] = useState([]);

  // modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // message id state
  const [message, setMessage] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // status state
  const [status, setStatus] = useState("");

  // medium state
  const [medium, setMedium] = useState("");

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  // curr & priv date state
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  // filter date state
  var selectFirstDay = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth(),
    1
  );

  var selectLastDay = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  selectFirstDay.setHours(0, 0, 0, 0);
  selectLastDay.setHours(23, 59, 59, 999);

  // get customer webhook paymnet message sending data from api
  const limit = localStorage.getItem("webhook");
  const dataGet = {
    netfeeId: ispOwnerData.netFeeId,
    startDate: selectFirstDay,
    endDate: selectLastDay,
    limit,
  };

  // api call
  useEffect(() => {
    setStartDate(selectFirstDay);

    if (selectLastDay.getMonth() + 1 === today.getMonth() + 1) {
      setEndDate(today);
    } else {
      setEndDate(selectLastDay);
    }

    filterDate.getMonth() + 1 &&
      getAllWebhookMessage(dispatch, dataGet, setIsLoading);
  }, [filterDate]);

  // set webhook message in state
  useEffect(() => {
    setMainData(messages);
  }, [messages]);

  // reload handler
  const reloadHandler = () => {
    getAllWebhookMessage(dispatch, dataGet, setIsLoading);
  };

  //
  const onClickFilter = () => {
    let arr = [...messages];

    if (status) {
      arr = arr.filter((item) => item.status === status);
    }

    if (medium) {
      arr = arr.filter((item) => item.from === medium);
    }

    arr = arr.filter(
      (item) =>
        new Date(item.createdAt) >= new Date(dateStart).setHours(0, 0, 0, 0) &&
        new Date(item.createdAt) <= new Date(dateEnd).setHours(23, 59, 59, 999)
    );

    setMainData(arr);
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      // {
      //   width: "10%",
      //   Header: t("mobile"),
      //   accessor: "mobile",
      // },
      // {
      //   width: "10%",
      //   Header: t("amount"),
      //   accessor: "amount",
      // },
      {
        width: "35%",
        Header: t("message"),
        accessor: "message",
      },
      {
        width: "10%",
        Header: t("trxID"),
        accessor: "trxID",
      },
      {
        width: "10%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => {
          if (original.status === "REJECTED") {
            return (
              <span className="badge bg-danger">
                {original.rejectionValue + " " + original.status}
              </span>
            );
          }
          return badge(original.status);
        },
      },
      {
        width: "10%",
        Header: t("medium"),
        accessor: "from",
      },
      {
        width: "10%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY-MM-DD hh:mm A");
        },
      },
      {
        width: "5%",
        Header: t("action"),
        id: "option",
        Cell: ({ row: { original } }) => {
          return (
            <div className="d-flex justify-content-center align-items-center">
              {original.status === "REJECTED" ? (
                <PencilSquare
                  size={20}
                  color="red"
                  cursor="pointer"
                  title={t("edit")}
                  onClick={() => {
                    setModalStatus("reference");
                    setMessage(original);
                    setShow(true);
                  }}
                />
              ) : original.status === "SENT" ? (
                <SendCheck size={20} color="green" />
              ) : (
                <SendX size={20} color="red" />
              )}
            </div>
          );
        },
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
                  <div>{t("webhookMessage")}</div>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
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
                          onClick={() => reloadHandler()}
                          title={t("refresh")}
                        />
                      )}
                    </div>

                    <div className="addAndSettingIcon">
                      <PlayBtn
                        className="addcutmButton"
                        onClick={() => {
                          setModalStatus("playTutorial");
                          setShow(true);
                        }}
                        title={t("tutorial")}
                      />
                    </div>
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
                              minDate={new Date(userData?.createdAt)}
                              maxDate={new Date()}
                            />
                          </div>
                          <div>
                            <DatePicker
                              className="form-control"
                              selected={dateStart}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={selectFirstDay}
                              maxDate={
                                selectLastDay.getMonth() + 1 ===
                                today.getMonth() + 1
                                  ? today
                                  : selectLastDay
                              }
                            />
                          </div>

                          <div>
                            <DatePicker
                              className="form-control"
                              selected={dateEnd}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={selectFirstDay}
                              maxDate={
                                selectLastDay.getMonth() + 1 ===
                                today.getMonth() + 1
                                  ? today
                                  : selectLastDay
                              }
                            />
                          </div>

                          <select
                            className="form-select mt-0"
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("status")}
                            </option>
                            <option value="SENT">{t("sent")}</option>
                            <option value="UNSENT">{t("unSent")}</option>
                            <option value="REJECTED">{t("rejected")}</option>
                            <option value="TRASH">{t("trash")}</option>
                          </select>

                          <select
                            className="form-select mt-0"
                            onChange={(e) => setMedium(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("medium")}
                            </option>
                            <option value="16216">{t("16216")}</option>
                            <option value="bKash">{t("bKash")}</option>
                            <option value="Nagad">{t("nagad")}</option>
                            <option value="rocket">{t("rocket")}</option>
                            <option value="sslCommerz">
                              {t("sslCommerz")}
                            </option>
                            <option value="uddoktapay">
                              {t("uddoktaPay")}
                            </option>
                            <option value="upay">{t("upay")}</option>
                            <option value="mCash">{t("mCash")}</option>
                            <option value="sureCash">{t("sureCash")}</option>
                          </select>

                          <div>
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
                      <div className="table-section">
                        <Table
                          isLoading={isLoading}
                          // customComponent={customComponent}
                          columns={columns}
                          data={mainData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>

      {/* webhook message reference id edit modal */}
      {modalStatus === "reference" && (
        <ReferenceIDEdit show={show} setShow={setShow} message={message} />
      )}

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "report",
          }}
        />
      )}
    </>
  );
};
export default WebhookMessage;
