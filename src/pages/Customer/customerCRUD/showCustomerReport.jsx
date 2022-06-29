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

export default function CustomerReport({ single }) {
  const billRefwithNote = useRef();
  const billRefwithOutNote = useRef();
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const [customerReport, setCustomerReport] = useState([]);
  // const [canDelete, setDelete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
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
    const con = window.confirm("আপনি কি বিল ডিলিট করতে চান?");
    if (con) {
      try {
        const res = await apiLink.delete(`/bill/monthlyBill/${reportId}`);
        const updatedState = customerReport.filter(
          (item) => item.id !== reportId
        );
        setCustomerReport(updatedState);
        dispatch(editCustomerSuccess(res.data.customer));
        toast.success("বিল ডিলিট সফল হয়েছে");
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
                {single?.name} - রিপোর্ট
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
                      <th style={{ width: "10%" }} scope="col">
                        প্যাকেজ
                      </th>

                      <th style={{ width: "10%" }} scope="col">
                        বিল
                      </th>
                      <th style={{ width: "30%" }} scope="col">
                        তারিখ
                      </th>
                      <th style={{ width: "7%" }} scope="col">
                        মাধ্যম
                      </th>
                      <th style={{ width: "15%" }} scope="col">
                        কালেক্টর
                      </th>
                      <th style={{ width: "40%" }} scope="col">
                        নোট
                      </th>
                      <th style={{ width: "8%" }} scope="col">
                        একশন
                      </th>
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
                            <td>
                              {moment(val.createdAt).format(
                                "MMM-DD-YYYY hh:mm:ss A"
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
                                <div>
                                  <ReactToPrint
                                    documentTitle="বিল ইনভয়েস"
                                    trigger={() => (
                                      <div
                                        title="প্রিন্ট বিল ইনভয়েস"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <PrinterFill />
                                      </div>
                                    )}
                                    content={() => billRefwithNote.current}
                                  />
                                </div>
                                <div title="ডিলিট রিপোর্ট">
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
                                <div>
                                  <ReactToPrint
                                    documentTitle="বিল ইনভয়েস"
                                    trigger={() => (
                                      <div
                                        title="প্রিন্ট বিল ইনভয়েস"
                                        style={{ cursor: "pointer" }}
                                      >
                                        <PrinterFill />
                                      </div>
                                    )}
                                    content={() => billRefwithOutNote.current}
                                  />
                                </div>
                                <div title="ডিলিট রিপোর্ট">
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
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <td colSpan={5}>
                        <h5 className="text-center">কোন ডাটা পাওয়া যাই নি !</h5>
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
