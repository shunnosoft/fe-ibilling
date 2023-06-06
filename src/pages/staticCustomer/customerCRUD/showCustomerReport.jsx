import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import apiLink from "../../../api/apiLink";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import BillCollectInvoice from "../../Customer/customerCRUD/customerBillCollectInvoicePDF";
import ReactToPrint from "react-to-print";
import { PrinterFill, TrashFill } from "react-bootstrap-icons";
import BillCollectInvoiceWithNote from "../../Customer/customerCRUD/customerBillCollectInvoicePDF";
import BillCollectInvoiceWithoutNote from "../../Customer/customerCRUD/customerBillReportPDFwithNote";
import TdLoader from "../../../components/common/TdLoader";
import { useTranslation } from "react-i18next";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";

export default function CustomerReport({ single }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [customerReport, setCustomerReport] = useState([]);
  const billRefwithNote = useRef();
  const billRefStaticWithOutNote = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [printVal, setPrintVal] = useState({});
  const [status, setStatus] = useState("");

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const userPackage = ppPackage.find(
    (item) => item?.id === single?.mikrotikPackage
  );

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerData?.id,
      mikrotikId: single?.mikrotik,
    };
    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsLoading);
    }
  }, [single?.mikrotik]);

  useEffect(() => {
    const getCustoemrReport = async () => {
      try {
        const res = await apiLink(`/bill/customer/${single?.id}`);
        const data = await res.data;
        setCustomerReport(data);
      } catch (err) {
        console.log("Error to get report: ", err);
      }
    };
    single?.id && getCustoemrReport();
  }, [single]);

  const deletReport = async (reportId) => {
    const con = window.confirm(t("deleteAlert"));
    if (con) {
      try {
        const res = await apiLink.delete(`/bill/monthlyBill/${reportId}`);
        const updatedState = customerReport.filter(
          (item) => item.id !== reportId
        );
        setCustomerReport(updatedState);
        // dispatch(editCustomerSuccess(res.data.customer));
        toast.success(t("deleteAlertSuccess"));
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error);
      }
    }
  };

  //delaying the print click for 100 ms time
  const handlePrint = (val, stat) => {
    setStatus(stat);
    setPrintVal(val);
    console.log(val);
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
                                  {moment(val.prevState?.billingCycle).format(
                                    "MMM DD YYYY hh:mm a"
                                  )}
                                </b>
                              </p>
                            </td>
                            <td>
                              <p>
                                {t("billDate")}{" "}
                                <b className="text-secondary">
                                  {moment(val.current?.billingCycle).format(
                                    "MMM DD YYYY hh:mm a"
                                  )}
                                </b>
                              </p>
                              <p>
                                {t("promiseDate")}{" "}
                                <b className="text-secondary">
                                  {moment(val.current?.billingCycle).format(
                                    "MMM DD YYYY hh:mm a"
                                  )}
                                </b>
                              </p>
                            </td>

                            <td>
                              <p>{val.note}</p>
                              {val.start && val.end && (
                                <span className="badge bg-secondary">
                                  {moment(val.start).format("MMM/DD/YY")}--
                                  {moment(val.end).format("MMM/DD/YY")}
                                </span>
                              )}
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
                                      month: printVal.month,
                                      note: printVal.note,
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
                                {permission?.billPrint ||
                                role !== "collector" ? (
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
                                          <button id="PrintWithNote">
                                            btn
                                          </button>
                                        </div>
                                      )}
                                      content={() => billRefwithNote.current}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                {(role === "ispOwner" &&
                                  bpSettings?.reportDelete) ||
                                (role === "manager" &&
                                  permission?.reportDelete) ? (
                                  <div title={t("deleteReport")}>
                                    <button
                                      className="border-0 bg-transparent"
                                      onClick={() => deletReport(val.id)}
                                    >
                                      <TrashFill
                                        color="#dc3545"
                                        style={{ cursor: "pointer" }}
                                      />
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            ) : (
                              <td className="text-center">
                                <div style={{ display: "none" }}>
                                  <BillCollectInvoiceWithoutNote
                                    ref={billRefStaticWithOutNote}
                                    customerData={single}
                                    billingData={{
                                      amount: printVal.amount,
                                      due: printVal.due,
                                      discount: printVal.discount,
                                      billType: printVal.billType,
                                      paymentDate: printVal.createdAt,
                                      medium: printVal.medium,
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
                                {permission?.billPrint ||
                                role !== "collector" ? (
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
                                      content={() =>
                                        billRefStaticWithOutNote.current
                                      }
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                {(role === "ispOwner" &&
                                  bpSettings?.reportDelete) ||
                                (role === "manager" &&
                                  permission?.reportDelete) ? (
                                  <div title={t("deleteReport")}>
                                    <button
                                      className="border-0 bg-transparent"
                                      onClick={() => deletReport(val.id)}
                                    >
                                      <TrashFill
                                        color="#dc3545"
                                        style={{ cursor: "pointer" }}
                                      />
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <td colSpan={5}>
                        <h5 className="text-center">
                          {" "}
                          {t("doNotGetAnyData")}{" "}
                        </h5>
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
