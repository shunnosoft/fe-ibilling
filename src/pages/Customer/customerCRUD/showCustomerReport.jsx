import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import apiLink from "../../../api/apiLink";
import TdLoader from "../../../components/common/TdLoader";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { toast } from "react-toastify";
import { PrinterFill, TrashFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { editCustomerSuccess } from "../../../features/customerSlice";
import ReactToPrint from "react-to-print";
import BillCollectInvoiceWithNote from "./customerBillCollectInvoicePDF";
import BillCollectInvoiceWithoutNote from "./customerBillReportPDFwithNote";
import { useTranslation } from "react-i18next";

export default function CustomerReport(props) {
  const { single } = props;
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const billRefwithNote = useRef();
  const billRefwithOutNote = useRef();

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );
  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const [customerReport, setCustomerReport] = useState([]);
  console.log(customerReport);

  // const [canDelete, setDelete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCustoemrReport = async () => {
      setIsLoading(true);
      try {
        const res = await apiLink(`/bill/customer/${single?.id}`);
        const data = await res.data;
        setCustomerReport(data);
        setIsLoading(false);
      } catch (err) {
        console.log("Error to get report: ", err);
        setIsLoading(false);
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
        dispatch(editCustomerSuccess(res.data.customer));
        toast.success(t("deleteAlertSuccess"));
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error);
      }
    }
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
                <table className="table table-striped text-center">
                  <thead>
                    <tr className="spetialSortingRow">
                      <th scope="col">{t("package")}</th>
                      <th scope="col">{t("amount")}</th>
                      <th scope="col">{t("type")}</th>
                      <th scope="col">{t("discount")}</th>
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
                            <td>{FormatNumber(val?.discount)}</td>
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
                                      billType: val.billType,
                                      paymentDate: val.createdAt,
                                      medium: val.medium,
                                      startDate: val.start,
                                      endDate: val.end,
                                    }}
                                    ispOwnerData={ispOwnerData}
                                  />
                                </div>
                                {permission?.billPrint ||
                                role !== "collector" ? (
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
                                    ref={billRefwithOutNote}
                                    customerData={single}
                                    billingData={{
                                      amount: val.amount,
                                      due: val.due,
                                      discount: val.discount,
                                      billType: val.billType,
                                      paymentDate: val.createdAt,
                                      billingCycle: val.prevState.billingCycle,
                                      promiseDate: val.prevState.promiseDate,
                                      medium: val.medium,
                                    }}
                                    ispOwnerData={ispOwnerData}
                                  />
                                </div>
                                <div className="d-flex">
                                  {permission?.billPrint ||
                                  role !== "collector" ? (
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
                                        content={() =>
                                          billRefwithOutNote.current
                                        }
                                      />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {(role === "ispOwner" &&
                                    bpSettings?.reportDelete) ||
                                  (role === "manager" &&
                                    permission?.reportDelete) ||
                                  (role === "collector" &&
                                    bpSettings?.reportDelete &&
                                    permission?.billDelete) ? (
                                    <div title={t("deleteReport")}>
                                      <button
                                        className="border-0 bg-transparent"
                                        onClick={() => deletReport(val.id)}
                                        disabled={props?.hideReportDelete}
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
