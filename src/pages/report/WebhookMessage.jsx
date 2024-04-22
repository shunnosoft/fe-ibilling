import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useISPowner from "../../hooks/useISPOwner";
import { getAllWebhookMessage } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FilterCircle,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { Accordion, Card, Collapse } from "react-bootstrap";
import DatePicker from "react-datepicker";

const WebhookMessage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current date state
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // get user & current user data form useISPOwner hook
  const { ispOwnerData, ispOwnerId, bpSettings, userData } = useISPowner();

  // // get customer webhook paymnet message data from redux store
  // const allMessage = useSelector((state) => state?.payment);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // Collapse handle state
  const [open, setOpen] = useState(false);

  // get customer webhook paymnet message data
  const [allMessage, setAllMessage] = useState([]);
  const [mainData, setMainData] = useState([]);

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
  const dataGet = {
    netfeeId: ispOwnerData.netFeeId,
    startDate: selectFirstDay,
    endDate: selectLastDay,
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
      getAllWebhookMessage(dispatch, dataGet, setIsLoading, setAllMessage);
  }, [filterDate]);

  useEffect(() => {
    setMainData(allMessage);
  }, [allMessage]);

  // reload handler
  const reloadHandler = () => {
    getAllWebhookMessage(dispatch, dataGet, setIsLoading, setAllMessage);
  };

  //
  const onClickFilter = () => {
    let arr = [...allMessage];

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
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "50%",
        Header: t("message"),
        accessor: "message",
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
        width: "15%",
        Header: t("medium"),
        accessor: "from",
      },
      {
        width: "15%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY-MM-DD hh:mm A");
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

                    {/* <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            <div className="addAndSettingIcon">
                              <CSVLink
                                data={reportForCsVTableInfo}
                                filename={userData.company}
                                headers={reportForCsVTableInfoHeader}
                                title="Bill Report"
                              >
                                <FiletypeCsv className="addcutmButton" />
                              </CSVLink>
                            </div>

                            <div className="addAndSettingIcon">
                              <ReactToPrint
                                documentTitle={t("billReport")}
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
                        </Card>
                      </div>
                    </Collapse> */}

                    {!open && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}

                    {open && (
                      <ArrowBarRight
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
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
    </>
  );
};
export default WebhookMessage;
