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
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);

  //get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
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
        document.getElementById("PrintWithNote").click();
      } else {
        document.getElementById("PrintWithoutNote").click();
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
            <div className="modal-body">
              <div className="table-responsive-lg">
                <table className="table table-striped ">
                  <thead>
                    <tr className="spetialSortingRow">
                      <th scope="col">{t("package")}</th>
                      <th scope="col">{t("amount")}</th>
                      <th scope="col">{t("type")}</th>
                      <th scope="col">{t("due")}</th>
                      <th scope="col">{t("previousBalance")}</th>
                      <th scope="col">{t("date")}</th>
                      <th scope="col">{t("billingCycle")}</th>
                      <th scope="col">{t("promiseDate")}</th>
                      <th scope="col">{t("medium")}</th>
                      <th scope="col">{t("collector")}</th>
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
                            <td>{single.pppoe.profile}</td>
                            <td>{FormatNumber(val.amount)}</td>
                            <td>{val.billType}</td>
                            <td>{FormatNumber(val.due)}</td>
                            <td>{FormatNumber(val?.prevState?.balance)}</td>
                            <td>
                              {moment(val.createdAt).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </td>
                            <td>
                              {moment(val.prevState?.billingCycle).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </td>
                            <td>
                              {moment(val.prevState?.promiseDate).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </td>

                            <td>{val.medium}</td>
                            <td>{val.name}</td>

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
                                  {val?.month &&
                                    val?.month?.length > 20 &&
                                    "..."}
                                </span>
                              </p>
                            </td>
                            {/* conditional rendering because print component doesnot perform with conditon  */}
                            {val.note || val.start || val.end || val.month ? (
                              <td className="text-center">
                                <div style={{ display: "none" }}>
                                  <BillCollectInvoiceWithNote
                                    ref={billRefwithNote}
                                    customerData={single}
                                    billingData={{
                                      amount: printVal.amount,
                                      due: printVal.due,
                                      discount: printVal.discount,
                                      billType: printVal.billType,
                                      paymentDate: printVal.createdAt,
                                      medium: printVal.medium,
                                      startDate: printVal.start,
                                      endDate: printVal.end,
                                      note: printVal.note,
                                      month: printVal.month,
                                      billingCycle:
                                        printVal?.prevState?.billingCycle,
                                      promiseDate:
                                        printVal?.prevState?.promiseDate,
                                      status: status,
                                    }}
                                    ispOwnerData={ispOwnerData}
                                    paymentDate={printVal.createdAt}
                                  />
                                </div>
                                {/* <div>
                                  <PrinterFill
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val);
                                    }}
                                  />
                                  <ReactToPrint
                                    documentTitle={t("billIvoice")}
                                    trigger={() => (
                                      <div
                                        className="d-none"
                                        title={t("printInvoiceBill")}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <button id="pressPrintReseller">
                                          btn
                                        </button>
                                      </div>
                                    )}
                                    content={() => billRefwithNote.current}
                                  />
                                </div> */}
                                <div>
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val, "both"); //button for printing
                                    }}
                                    className="d-flex"
                                  >
                                    <PrinterFill className="me-1 mt-1" />
                                    <span>{t("office&customer")}</span>
                                  </div>

                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val, "customer"); //button for printing
                                    }}
                                    className="d-flex"
                                  >
                                    <PrinterFill className="me-1 mt-1" />
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
                                        <button id="PrintWithNote">btn</button>
                                      </div>
                                    )}
                                    content={() => billRefwithNote.current}
                                  />
                                </div>
                              </td>
                            ) : (
                              <td className="text-center">
                                <div style={{ display: "none" }}>
                                  <BillCollectInvoiceWithoutNote
                                    ref={billRefwithOutNote}
                                    customerData={single}
                                    billingData={{
                                      amount: printVal.amount,
                                      due: printVal.due,
                                      discount: printVal.discount,
                                      billType: printVal.billType,
                                      paymentDate: printVal.createdAt,
                                      billingCycle:
                                        printVal?.prevState?.billingCycle,
                                      promiseDate:
                                        printVal?.prevState?.promiseDate,
                                      medium: printVal.medium,
                                      status: status,
                                    }}
                                    ispOwnerData={ispOwnerData}
                                    paymentDate={printVal.createdAt}
                                  />
                                </div>
                                {/* <div className="d-flex">
                                  <div className="mx-2">
                                    <PrinterFill
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        handlePrint(val);
                                      }}
                                    />
                                    <ReactToPrint
                                      documentTitle={t("billIvoice")}
                                      trigger={() => (
                                        <div
                                          className="d-none"
                                          title={t("printInvoiceBill")}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <button id="pressPrintReseller">
                                            btn
                                          </button>
                                        </div>
                                      )}
                                      content={() => billRefwithOutNote.current}
                                    />
                                  </div>
                                </div> */}
                                <div>
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val, "both"); //button for printing
                                    }}
                                    className="d-flex"
                                  >
                                    <PrinterFill className="me-1 mt-1" />
                                    <span>{t("office&customer")}</span>
                                  </div>

                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handlePrint(val, "customer"); //button for printing
                                    }}
                                    className="d-flex"
                                  >
                                    <PrinterFill className="me-1 mt-1" />
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
                                        <button id="PrintWithoutNote">
                                          btn
                                        </button>
                                      </div>
                                    )}
                                    content={() => billRefwithOutNote.current}
                                  />
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
      </div>
    </div>
  );
}
