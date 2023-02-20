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

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

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
                            {val.start && val.end ? (
                              <td className="text-center">
                                <div style={{ display: "none" }}>
                                  <BillCollectInvoiceWithNote
                                    ref={billRefwithNote}
                                    customerData={single}
                                    billingData={{
                                      amount: val.amount,
                                      due: val.due,
                                      discount: val.discount,
                                      billType: val.billType,
                                      paymentDate: val.createdAt,
                                      medium: val.medium,
                                      startDate: val.start,
                                      endDate: val.end,
                                      note: val.note,
                                      month: val.month,
                                      billingCycle:
                                        val?.prevState?.billingCycle,
                                      promiseDate: val?.prevState?.promiseDate,
                                    }}
                                    ispOwnerData={ispOwnerData}
                                  />
                                </div>
                                <div>
                                  <ReactToPrint
                                    documentTitle={t("billIvoice")}
                                    trigger={() => (
                                      <div
                                        title={t("printInvoiceBill")}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <PrinterFill />
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
                                      amount: val.amount,
                                      due: val.due,
                                      discount: val.discount,
                                      billType: val.billType,
                                      paymentDate: val.createdAt,
                                      billingCycle:
                                        val?.prevState?.billingCycle,
                                      promiseDate: val?.prevState?.promiseDate,
                                      medium: val.medium,
                                    }}
                                    ispOwnerData={ispOwnerData}
                                  />
                                </div>
                                <div className="d-flex">
                                  <div className="mx-2">
                                    <ReactToPrint
                                      documentTitle={t("billIvoice")}
                                      trigger={() => (
                                        <div
                                          title={t("printInvoiceBill")}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <PrinterFill />
                                        </div>
                                      )}
                                      content={() => billRefwithOutNote.current}
                                    />
                                  </div>
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
