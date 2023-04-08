import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-bootstrap";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Loader from "../../../components/common/Loader";
import { ArrowClockwise, PenFill, ThreeDots } from "react-bootstrap-icons";
import Table from "../../../components/table/Table";
import Footer from "../../../components/admin/footer/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReseller,
  resellerCustomerReport,
} from "../../../features/apiCalls";
import moment from "moment";
import ReportView from "../../report/modal/ReportView";
import EditReport from "../../report/modal/EditReport";
import DatePicker from "react-datepicker";

const ResellerCollection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current date set
  let lastDate = new Date();
  let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get reseller
  const reseller = useSelector((state) => state.reseller?.reseller);

  //get reseller collection report data
  const collectionReport = useSelector(
    (state) => state.reseller?.resellerCollection
  );

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  //reseller id state
  const [resellerId, setResellerId] = useState(reseller[0]?.id);

  // reseller customer collection main data state
  const [currentData, setCurrentData] = useState(collectionReport);

  //payment type state
  const [paymentType, setPaymentType] = useState();

  // report id state
  const [viewId, setViewId] = useState();
  const [reportId, setReportId] = useState();

  // note state
  const [note, setNote] = useState();

  // set date state
  const [startDate, setStartDate] = useState(firstDate);
  const [endDate, setEndDate] = useState(lastDate);

  //filter handler
  const filterHandler = () => {
    let mainData = [...collectionReport];

    if (paymentType !== "All") {
      if (paymentType === "onlinePayment") {
        mainData = mainData.filter(
          (paymentStatus) =>
            paymentStatus.medium === "sslcommerz" ||
            paymentStatus.medium === "uddoktapay" ||
            paymentStatus.medium === "sslpay" ||
            paymentStatus.medium === "bKashPG"
        );
      } else {
        mainData = mainData.filter((item) => item.medium === paymentType);
      }
    }

    mainData = mainData.filter(
      (item) =>
        new Date(moment(item.createdAt).format("YYYY-DD-MM")).getTime() >=
          new Date(moment(firstDate).format("YYYY-DD-MM")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-DD-MM")).getTime() <=
          new Date(moment(lastDate).format("YYYY-DD-MM")).getTime()
    );
    setCurrentData(mainData);
  };

  //reseller customer collection report handler
  const resellerCollectionReport = (e) => {
    setResellerId(e.target.value);
  };

  // set Report function
  const getReportId = (id) => {
    setReportId(id);
    setNote("");
  };

  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "10%",
        Header: t("PPPoEName"),
        accessor: "customer.pppoe.name",
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "customer.mikrotikPackage.name",
      },
      {
        width: "7%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "8%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "8%",
        Header: t("agent"),
        accessor: "medium",
      },
      {
        width: "11%",
        Header: t("collector"),
        accessor: "name",
      },
      {
        width: "14%",
        Header: t("note"),
        accessor: (data) => {
          return {
            id: data.id,
            note: data.note,
            start: data.start,
            end: data.end,
            month: data.month,
          };
        },
        Cell: ({ cell: { value } }) => {
          return (
            <>
              <p>
                {value.note && value.note.slice(0, 15)}{" "}
                <span>{value?.note && value?.note?.length > 15 && "..."}</span>
              </p>
              {value?.start && value?.end && (
                <span className="badge bg-secondary">
                  {moment(value.start).format("DD/MM/YY")}--
                  {moment(value.end).format("DD/MM/YY")}
                </span>
              )}
              <p>
                {value?.month && value.month.slice(0, 15)}{" "}
                <span>
                  {value?.month && value?.month?.length > 15 && "..."}
                </span>
              </p>
              <span
                className="see_more"
                data-bs-toggle="modal"
                data-bs-target="#reportView"
                onClick={() => {
                  setViewId(value?.id);
                }}
              >
                ...See More
              </span>
            </>
          );
        },
      },

      {
        width: "12%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "6%",
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
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#reportEditModal"
                  onClick={() => {
                    getReportId(original?.id);
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

  //reload handler
  const reloadHandler = () => {
    resellerCustomerReport(dispatch, setIsLoading, resellerId);
  };

  useEffect(() => {
    fetchReseller(dispatch, ispOwnerId, setIsLoading);
    if (resellerId) {
      resellerCustomerReport(dispatch, setIsLoading, resellerId);
    }
  }, [resellerId]);

  useEffect(() => {
    var initialToday = new Date();
    var initialFirst = new Date(
      initialToday.getFullYear(),
      initialToday.getMonth(),
      1
    );
    initialToday.setHours(0, 0, 0, 0);
    initialFirst.setHours(23, 59, 59, 999);

    setCurrentData(
      collectionReport.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [collectionReport]);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("activeCustomer")}</div>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper p-4">
                  <div className="d-flex justify-content-center">
                    <div className="form-group px-2">
                      <h6 className="mb-0">{t("reseller")}</h6>
                      <select
                        className="form-select mt-0"
                        id="resellerCollection"
                        onChange={resellerCollectionReport}
                      >
                        {reseller?.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group px-2">
                      <h6 className="mb-0">{t("paymentType")}</h6>
                      <select
                        className="form-select mt-0"
                        onChange={(e) => setPaymentType(e.target.value)}
                      >
                        <option value="All" selected>
                          {t("medium")}
                        </option>

                        <option value="cash">{t("handCash")}</option>
                        <option value="onlinePayment">
                          {t("onlinePayment")}
                        </option>
                        <option value="bKash"> {t("bKash")} </option>
                        <option value="rocket"> {t("rocket")} </option>
                        <option value="nagad"> {t("nagad")} </option>
                        <option value="others"> {t("others")} </option>
                      </select>
                    </div>

                    <div className="ms-2">
                      <h6 className="mb-0">{t("startDate")}</h6>
                      <DatePicker
                        className="form-control w-140 mt-0"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText={t("selectBillDate")}
                      />
                    </div>
                    <div className="mx-2">
                      <h6 className="mb-0">{t("endDate")}</h6>
                      <DatePicker
                        className="form-control w-140 mt-0"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText={t("selectBillDate")}
                      />
                    </div>

                    <div>
                      <button
                        className="btn btn-outline-primary w-110 mt-2"
                        type="button"
                        onClick={filterHandler}
                      >
                        {t("filter")}
                      </button>
                    </div>
                  </div>

                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={currentData}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <EditReport
        reportId={reportId}
        note={note}
        setNote={setNote}
        status="resellerCustomerReport"
      />
      <ReportView reportId={viewId} status="resellerCustomerReport" />
    </>
  );
};

export default ResellerCollection;
