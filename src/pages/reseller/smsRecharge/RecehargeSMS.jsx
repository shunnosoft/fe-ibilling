import React, { useEffect } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../../assets/js/theme";
// import
import { ToastContainer } from "react-toastify";
import RechargeModal from "./modal/RechargeModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceHistory,
  getParchaseHistory,
} from "../../../features/resellerParchaseSmsApi";
import moment from "moment";
import Table from "../../../components/table/Table";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loader from "../../../components/common/Loader";
import {
  ArrowClockwise,
  CurrencyDollar,
  ThreeDots,
} from "react-bootstrap-icons";
import { Tab, Tabs } from "react-bootstrap";
import { badge } from "../../../components/common/Utils";
import FormatNumber from "../../../components/common/NumberFormat";
import { showModal } from "../../../features/uiSlice";
const RecehargeSMS = () => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // ger resller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.reseller?.id
  );

  // get data
  const data = useSelector((state) => state?.smsHistory?.smsParchase);
  console.log(data);
  // get history with netfee
  const netfeeinvoice = useSelector(
    (state) => state?.smsHistory?.smsParchaseNetfee
  );
  console.log(netfeeinvoice);
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // history loading state
  const [historyLoading, setHistoryLoading] = useState(false);

  // get accept status
  const acceptStatus = data.filter((item) => item.status === "pending");

  // reload handler
  const reloadHandler = () => {
    getParchaseHistory(resellerId, dispatch, setIsLoading);
    getInvoiceHistory(resellerId, dispatch, setHistoryLoading);
  };

  // api call
  useEffect(() => {
    getParchaseHistory(resellerId, dispatch, setIsLoading);
    getInvoiceHistory(resellerId, dispatch, setHistoryLoading);
  }, []);

  // table columns
  const columns = React.useMemo(
    () => [
      {
        width: "25%",
        Header: t("amount"),
        accessor: "smsAmount",
      },
      {
        width: "25%",
        Header: t("moneyAmount"),
        accessor: "smsCost",
      },
      {
        width: "25%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original.status === "accepted" && (
              <span className="badge bg-success">{original.status}</span>
            )}
            {original.status === "pending" && (
              <span className="badge bg-warning">{original.status}</span>
            )}
            {original.status === "rejected" && (
              <span className="badge bg-danger">{original.status}</span>
            )}
          </div>
        ),
      },
      {
        width: "25%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ row: { original } }) =>
          moment(original.createdAt).format("MMM DD YYYY hh:mm a"),
      },
    ],
    [t]
  );

  // parchase from netfee
  // column
  const historyColumn = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "11%",
        Header: t("amount"),
        accessor: "amount",
        Cell: ({ row: { original } }) => <td>{original.amount} Tk</td>,
      },

      {
        width: "18%",
        Header: t("smsAmunt"),
        accessor: "numberOfSms",
        Cell: ({ cell: { value } }) => {
          return FormatNumber(value);
        },
      },
      {
        width: "18%",
        Header: t("smsPurchaseType"),
        accessor: "smsPurchaseType",
      },

      {
        width: "13%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "18%",
        Header: t("invoiceDate"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "15%",
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
                {original.status === "unpaid" && (
                  <li
                    onClick={() => {
                      dispatch(showModal(original));
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">Pay</p>
                      </div>
                    </div>
                  </li>
                )}
                {/* {original.type === "smsPurchase" &&
                  original.status &&
                  "unpaid" && (
                    <li onClick={() => deleteInvoiceHandler(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <CurrencyDollar />
                          <p className="actionP">{t("delete")}</p>
                        </div>
                      </div>
                    </li>
                  )} */}
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
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied">
          <div className="container homeWrapper">
            <ToastContainer position="top-right" theme="colored" />
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("smsHistory")}</div>
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
                  <div
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#smsRechargeModal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-envelope-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                      <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                  </div>
                </div>
              </FourGround>
              <div class="card">
                <div class="card-body">
                  <Tabs
                    defaultActiveKey={"owner"}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="owner" title="From IspOwner">
                      <div className="recdharge_sms">
                        <Table
                          isLoading={isLoading}
                          data={data}
                          columns={columns}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="netFee" title="From NetFee">
                      <div className="table-section">
                        <Table
                          isLoading={historyLoading}
                          data={netfeeinvoice}
                          columns={historyColumn}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </FontColor>
          </div>
        </div>
      </div>
      <RechargeModal status={acceptStatus} />
    </>
  );
};

export default RecehargeSMS;
