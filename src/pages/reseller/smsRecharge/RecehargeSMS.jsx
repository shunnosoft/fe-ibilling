import React, { useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowClockwise,
  CurrencyDollar,
  EnvelopePlus,
  ThreeDots,
} from "react-bootstrap-icons";
import { Tab, Tabs } from "react-bootstrap";

// internal import
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../../assets/js/theme";
import {
  getInvoiceHistory,
  getParchaseHistory,
} from "../../../features/resellerParchaseSmsApi";
import Table from "../../../components/table/Table";
import Loader from "../../../components/common/Loader";
import { badge } from "../../../components/common/Utils";
import FormatNumber from "../../../components/common/NumberFormat";
import { showModal } from "../../../features/uiSlice";
import SMSPurchase from "../../message/SMSPurchase";

const RecehargeSMS = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // ger resller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.reseller?.id
  );

  // get data
  const data = useSelector((state) => state?.smsHistory?.smsParchase);

  // get history with ibilling
  const netfeeinvoice = useSelector(
    (state) => state?.smsHistory?.smsParchaseNetfee
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // history loading state
  const [historyLoading, setHistoryLoading] = useState(false);

  // modal show handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

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

  // parchase from ibilling
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
          <div className="d-flex justify-content-center align-items-center">
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("smsHistory")}</div>

                  <div className="d-flex justify-content-center align-items-center">
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        />
                      )}
                    </div>

                    <div
                      className="d-flex align-items-center"
                      onClick={() => {
                        setModalStatus("buySMS");
                        setShow(true);
                      }}
                    >
                      <div className="textButton">
                        <EnvelopePlus className="text_icons" /> {t("buySms")}
                      </div>
                    </div>
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
                    <Tab eventKey="iBilling" title="From iBilling">
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

      {/* component modals */}

      {/* sms purchase modal */}
      {modalStatus === "buySMS" && (
        <SMSPurchase show={show} setShow={setShow} />
      )}
    </>
  );
};

export default RecehargeSMS;
