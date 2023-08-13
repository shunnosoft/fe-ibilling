import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import { ArrowClockwise } from "react-bootstrap-icons";
import Footer from "../../components/admin/footer/Footer";
import { useTranslation } from "react-i18next";
import {
  getResellerWithdrawalRequest,
  patchResellerWithdrawalRequest,
} from "../../features/resellerSmsRequestApi";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import moment from "moment";
import { badge } from "../../components/common/Utils";
import FormatNumber from "../../components/common/NumberFormat";

const WithdrawalPaymentRequest = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.ispOwner?.id
  );

  // get reseller withdrawal history
  const resellerWithdrawal = useSelector(
    (state) => state.resellerSmsRequest?.withdrawalHistory
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [acceptLoading, setAccLoading] = useState(false);

  useEffect(() => {
    resellerWithdrawal.length === 0 &&
      getResellerWithdrawalRequest(
        dispatch,
        ispOwner,
        year,
        month,
        setIsLoading
      );
  }, []);

  // reload handle
  const reloadHandler = () => {
    getResellerWithdrawalRequest(dispatch, ispOwner, year, month, setIsLoading);
  };

  // withdrawal report accept & reject handler
  const withdrawAcceptRejectHandler = (status, id, amount) => {
    const data = {
      status: status,
      balance: amount,
    };
    patchResellerWithdrawalRequest(dispatch, id, data, setAccLoading);
  };

  const resellerWithdrawPayment = useCallback(() => {
    let initialValue = 0;
    const totalWithdraw = resellerWithdrawal.map((val) => {
      if (val.status === "accepted") {
        return (initialValue += val.amount);
      }
    });

    return FormatNumber(totalWithdraw);
  }, [resellerWithdrawal]);

  // sending table header data
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {resellerWithdrawPayment?.totalWithdraw > 0 && (
        <div>
          {t("totalWithdraw")}:-৳
          {FormatNumber(resellerWithdrawPayment.totalWithdraw)}
        </div>
      )}
    </div>
  );

  const columns = useMemo(
    () => [
      {
        width: "20%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "20%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "20%",
        Header: t("action"),
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div>
              {original.status === "pending" ? (
                acceptLoading ? (
                  <div className="loaderDiv">
                    <Loader />
                  </div>
                ) : (
                  <div className="d-flex justify-content-evenly">
                    <span
                      style={{ cursor: "pointer" }}
                      class="badge bg-success shadow me-1"
                      onClick={() => {
                        withdrawAcceptRejectHandler(
                          "accepted",
                          original.id,
                          original.amount
                        );
                      }}
                    >
                      {t("accept")}
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      class="badge bg-danger shadow"
                      onClick={() => {
                        withdrawAcceptRejectHandler(
                          "rejected",
                          original.id,
                          original.amount
                        );
                      }}
                    >
                      {t("cancel")}
                    </span>
                  </div>
                )
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        ),
      },
      {
        width: "20%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
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
                  <div>{t("paymentWithdrawalRequest")}</div>

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
                </div>
              </FourGround>
              <FourGround>
                <div>
                  {/* <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item
                      eventKey="filter"
                      className="accordionBorder"
                    >
                      <Accordion.Body className="accordionPadding">
                        <div className="selectFilteringg">
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div className="mx-2">
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <button
                            className="btn btn-outline-primary w-140 mt-0 chartFilteritem"
                            type="button"
                            onClick={onClickFilter}
                          >
                            {t("filter")}
                          </button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion> */}

                  <div className="collectorWrapper mt-2 py-2">
                    <div className="addCollector">
                      <div className="table-section">
                        <Table
                          isLoading={isLoading}
                          customComponent={customComponent}
                          columns={columns}
                          data={resellerWithdrawal}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawalPaymentRequest;
