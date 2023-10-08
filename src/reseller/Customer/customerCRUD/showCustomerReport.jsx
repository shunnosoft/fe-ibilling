import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import apiLink from "../../../api/apiLink";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { useTranslation } from "react-i18next";
import TdLoader from "../../../components/common/TdLoader";
import BillCollectInvoiceWithoutNote from "./customerBillReportPDFwithNote";
import BillCollectInvoiceWithNote from "./customerBillCollectInvoicePDF";
import ReactToPrint from "react-to-print";
import { PrinterFill } from "react-bootstrap-icons";
export default function CustomerReport({ single }) {
  const { t } = useTranslation();
  const [customerReport, setCustomerReport] = useState([]);
  const billRefwithNote = useRef();
  const billRefwithOutNote = useRef();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  //get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [printVal, setPrintVal] = useState({});
  const [status, setStatus] = useState("");

  //get specific customer report
  useEffect(() => {
    const getCustoemrReport = async () => {
      try {
        setIsLoading(true);
        const res = await apiLink(`/reseller/bills/customer/${single?.id}`);
        const data = await res.data;
        setCustomerReport(data);
      } catch (err) {
        console.log("Error to get report: ", err);
      }
      setIsLoading(false);
    };
    single?.id && getCustoemrReport();
  }, [single]);

  //delaying the print click for 100 ms time
  const handlePrint = (val, stat) => {
    setStatus(stat);
    setPrintVal(val);
    setTimeout(function () {
      if (val.note || val.start || val.end || val.month) {
        document.getElementById("PrintPppoeWithNote").click();
      } else {
        document.getElementById("PrintPppoeWithoutNote").click();
      }
    }, 100);
  };

  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerReport"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {single?.name} - {t("report")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <table className="table table-striped">
              <thead>
                <tr className="spetialSortingRow">
                  <th scope="col">{t("package")}</th>
                  <th scope="col">{t("collected")}</th>
                  <th scope="col">{t("amount")}</th>
                  <th scope="col">{t("previousState")}</th>
                  <th scope="col">{t("currentState")}</th>
                  <th scope="col">{t("note")}</th>
                  <th scope="col">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TdLoader colspan={5} />
                ) : customerReport.length > 0 ? (
                  customerReport.map((val, index) => {
                    return (
                      <tr className="spetialSortingRow" key={index}>
                        <td>
                          <p>
                            {t("bandWith")}{" "}
                            <b className="text-secondary">
                              {single.pppoe.profile}
                            </b>
                          </p>
                          <p>
                            {t("amount")}{" "}
                            <b className="text-secondary">
                              {FormatNumber(val.amount)}
                            </b>
                          </p>
                          <p>
                            {t("type")}{" "}
                            <b className="text-secondary">{val.billType}</b>
                          </p>
                          <p>
                            {t("medium")}{" "}
                            <b className="text-secondary">{val.medium}</b>
                          </p>
                        </td>

                        <td>
                          <p>
                            {t("collected")}{" "}
                            <b className="text-secondary">{val.name}</b>
                          </p>
                          <p>
                            {t("createdAt")}{" "}
                            <b className="text-secondary">
                              {moment(val.createdAt).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("discount")}{" "}
                            <b className="text-secondary">
                              {FormatNumber(val?.discount)}
                            </b>
                          </p>
                          <p>
                            {t("due")}{" "}
                            <b className="text-secondary">
                              {FormatNumber(val.due)}
                            </b>
                          </p>
                          <p>
                            {t("previousBalance")}{" "}
                            <b className="text-secondary">
                              {FormatNumber(val?.prevState?.balance)}
                            </b>
                          </p>
                          <p>
                            {t("currentBalance")}{" "}
                            <b className="text-secondary">
                              {FormatNumber(val?.currentState?.balance)}
                            </b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("billDate")}{" "}
                            <b className="text-secondary">
                              {moment(val.prevState?.billingCycle).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                          <p>
                            {t("promiseDate")}{" "}
                            <b className="text-secondary">
                              {moment(val.prevState?.promiseDate).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("billDate")}{" "}
                            <b className="text-secondary">
                              {moment(val.currentState?.billingCycle).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                          <p>
                            {t("promiseDate")}{" "}
                            <b className="text-secondary">
                              {moment(val.currentState?.promiseDate).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                        </td>

                        <td>
                          <p>
                            {val.note && val.note.slice(0, 20)}
                            <span>
                              {val?.note && val?.note?.length > 20 && "..."}
                            </span>
                          </p>
                          {val.start && val.end && (
                            <span className="badge bg-secondary">
                              {moment(val.start).format("MMM/DD/YY")}--
                              {moment(val.end).format("MMM/DD/YY")}
                            </span>
                          )}
                          <p>
                            {val?.month && val.month.slice(0, 20)}
                            <span>
                              {val?.month && val?.month?.length > 20 && "..."}
                            </span>
                          </p>
                        </td>
                        {/* conditional rendering because print component doesnot perform with conditon  */}

                        {val.note || val.start || val.end || val.month ? (
                          <td>
                            <div style={{ display: "none" }}>
                              <BillCollectInvoiceWithNote
                                ref={billRefwithNote}
                                customerData={single}
                                billingData={{
                                  amount: printVal.amount,
                                  due: printVal.due,
                                  discount: printVal.discount,
                                  billType: printVal.billType,
                                  collectedBy: printVal.collectedBy,
                                  paymentDate: printVal.createdAt,
                                  medium: printVal.medium,
                                  startDate: printVal.start,
                                  endDate: printVal.end,
                                  note: printVal.note,
                                  month: printVal.month,
                                  billingCycle:
                                    printVal?.prevState?.billingCycle,
                                  promiseDate: printVal?.prevState?.promiseDate,
                                  status: status,
                                }}
                                ispOwnerData={ispOwnerData}
                                paymentDate={printVal.createdAt}
                              />
                            </div>
                            {permission?.billPrint || role !== "collector" ? (
                              <>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handlePrint(val, "both"); //button for printing
                                  }}
                                  className="d-flex"
                                >
                                  <PrinterFill className="me-1 mt-1 text-success" />
                                  <span>{t("office&customer")}</span>
                                </div>

                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handlePrint(val, "customer"); //button for printing
                                  }}
                                  className="d-flex"
                                >
                                  <PrinterFill className="me-1 mt-1 text-primary" />
                                  <span>{t("customer")}</span>
                                </div>

                                <ReactToPrint
                                  documentTitle={t("billIvoice")}
                                  trigger={() => (
                                    <div
                                      className="d-none"
                                      title={t("printInvoiceBill")}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <button id="PrintPppoeWithNote">
                                        btn
                                      </button>
                                    </div>
                                  )}
                                  content={() => billRefwithNote.current}
                                />
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                        ) : (
                          <td>
                            <div style={{ display: "none" }}>
                              <BillCollectInvoiceWithoutNote
                                ref={billRefwithOutNote}
                                customerData={single}
                                billingData={{
                                  amount: printVal.amount,
                                  due: printVal.due,
                                  discount: printVal.discount,
                                  billType: printVal.billType,
                                  collectedBy: printVal.collectedBy,
                                  paymentDate: printVal.createdAt,
                                  billingCycle:
                                    printVal?.prevState?.billingCycle,
                                  promiseDate: printVal?.prevState?.promiseDate,
                                  medium: printVal.medium,
                                  status: status,
                                }}
                                ispOwnerData={ispOwnerData}
                                paymentDate={printVal.createdAt}
                              />
                            </div>
                            <div>
                              {permission?.billPrint || role !== "collector" ? (
                                <>
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val, "both"); //button for printing
                                    }}
                                    className="d-flex"
                                  >
                                    <PrinterFill className="me-1 mt-1 text-success" />
                                    <span>{t("office&customer")}</span>
                                  </div>

                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val, "customer"); //button for printing
                                    }}
                                    className="d-flex"
                                  >
                                    <PrinterFill className="me-1 mt-1 text-primary" />
                                    <span>{t("customer")}</span>
                                  </div>

                                  <ReactToPrint
                                    documentTitle={t("billIvoice")}
                                    trigger={() => (
                                      <div
                                        className="d-none"
                                        title={t("printInvoiceBill")}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <button id="PrintPppoeWithoutNote">
                                          btn
                                        </button>
                                      </div>
                                    )}
                                    content={() => billRefwithOutNote.current}
                                  />
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <td colSpan={5}>
                    <h5 className="text-center">{t("doNotGetAnyData")}</h5>
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
