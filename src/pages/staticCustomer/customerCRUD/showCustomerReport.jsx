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
  const billRefwithOutNote = useRef();
  const [isLoading, setIsLoading] = useState(false);

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
                              <p>{val.note}</p>
                              {val.start && val.end && (
                                <span className="badge bg-secondary">
                                  {moment(val.start).format("MMM/DD/YY")}--
                                  {moment(val.end).format("MMM/DD/YY")}
                                </span>
                              )}
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
                                      billType: val.billType,
                                      paymentDate: val.createdAt,
                                      medium: val.medium,
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
                                      content={() => billRefwithOutNote.current}
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
