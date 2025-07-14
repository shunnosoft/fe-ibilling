import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { PrinterFill, TrashFill } from "react-bootstrap-icons";
import ReactToPrint from "react-to-print";

// internal import
import {
  deleteCustomerSingleReport,
  getCustomerRechargeReport,
} from "../../../../features/hotspotApi";
import TdLoader from "../../../../components/common/TdLoader";
import FormatNumber from "../../../../components/common/NumberFormat";
import CustomerInvoicePrint from "../../../customerInvoice/customerInvoicePrint/CustomerInvoicePrint";

const HotspotCustomerReport = ({ show, setShow, customerData }) => {
  const { t } = useTranslation();
  const billReport = useRef();
  const dispatch = useDispatch();

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get user permission form user data
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get all role form redux
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get bpSettings form ispOwner data
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // single customer reports data state
  const [customerReport, setCustomerReport] = useState([]);

  // status handle state
  const [status, setStatus] = useState("");

  // single customer invoice state
  const [singleInvoice, setSingleInvoice] = useState({});

  // get api call
  useEffect(() => {
    getCustomerRechargeReport(setCustomerReport, customerData, setIsLoading);
  }, [customerData]);

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  // invoice print handler
  const invoicePrintHandler = (value, status) => {
    setSingleInvoice(value);
    setStatus(status);

    setTimeout(function () {
      document.getElementById("invoicePrint").click();
    }, 100);
  };

  // single report delete
  const deleteReport = async (reportId) => {
    const con = window.confirm(t("deleteAlert"));
    if (con) {
      deleteCustomerSingleReport(
        dispatch,
        customerReport,
        setCustomerReport,
        reportId
      );
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title text-success">
              {customerData?.name} - {t("report")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="table-responsive-lg">
            <table className="table table-striped">
              <thead>
                <tr className="spetialSortingRow">
                  <th scope="col">{t("package")}</th>
                  <th scope="col">{t("collected")}</th>
                  <th scope="col">{t("amount")}</th>
                  <th scope="col">{t("previousState")}</th>
                  <th scope="col">{t("currentState")}</th>
                  <th scope="col">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TdLoader colspan={5} />
                ) : (
                  customerReport.length > 0 &&
                  customerReport.map((val, index) => {
                    return (
                      <tr className="spetialSortingRow" key={index}>
                        <td>
                          <p>
                            {t("bandWith")}:
                            <b className="text-secondary">{val.package}</b>
                          </p>
                          <p>
                            {t("amount")}:
                            <b className="text-secondary">
                              {FormatNumber(val.amount)}
                            </b>
                          </p>
                          <p>
                            {t("type")}:
                            <b className="text-secondary">{val.billType}</b>
                          </p>
                          <p>
                            {t("medium")}:
                            <b className="text-secondary">{val.medium}</b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("collected")}:
                            <b className="text-secondary">{val.name}</b>
                          </p>
                          <p>
                            {t("createdAt")}:
                            <b className="text-secondary">
                              {moment(val.createdAt).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("discount")}:
                            <b className="text-secondary">
                              {FormatNumber(val?.discount)}
                            </b>
                          </p>
                          <p>
                            {t("due")}:
                            <b className="text-secondary">
                              {FormatNumber(val.due)}
                            </b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("billDate")}:
                            <b className="text-secondary">
                              {moment(val.prevState?.billingCycle).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {t("billDate")}:
                            <b className="text-secondary">
                              {moment(val.currentState?.billingCycle).format(
                                "MMM DD YYYY hh:mm a"
                              )}
                            </b>
                          </p>
                        </td>

                        <td>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              invoicePrintHandler(val, "customer");
                            }}
                            className="d-flex"
                          >
                            <PrinterFill className="me-1 mt-1 text-primary" />
                            <span>{t("customer")}</span>
                          </div>

                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              invoicePrintHandler(val, "both");
                            }}
                            className="d-flex"
                          >
                            <PrinterFill className="me-1 mt-1 text-success" />
                            <span>{t("office&customer")}</span>
                          </div>

                          {(permission?.billPrint || role !== "collector") && (
                            <>
                              <div style={{ display: "none" }}>
                                <ReactToPrint
                                  documentTitle={t("billInvoice")}
                                  trigger={() => (
                                    <div type="button" id="invoicePrint"></div>
                                  )}
                                  content={() => billReport.current}
                                />
                                <CustomerInvoicePrint
                                  ref={billReport}
                                  invoiceData={{
                                    name: singleInvoice?.name,
                                    mobile:
                                      singleInvoice?.hotspotCustomer?.mobile,
                                    address: singleInvoice?.address,
                                    package: singleInvoice.package,
                                    amount: singleInvoice.amount,
                                    due: singleInvoice.due,
                                    discount: singleInvoice.discount,
                                    billType: singleInvoice.billType,
                                    medium: singleInvoice.medium,
                                    billingCycle: singleInvoice?.updatedAt,
                                    status: status,
                                  }}
                                  ispOwnerData={ispOwnerData}
                                />
                              </div>
                            </>
                          )}
                          {((role === "ispOwner" && bpSettings?.reportDelete) ||
                            (role === "manager" && permission?.reportDelete) ||
                            (role === "collector" &&
                              bpSettings?.reportDelete &&
                              permission?.billDelete)) && (
                            <div
                              className="border-0 bg-transparent me-4"
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteReport(val.id)}
                            >
                              <TrashFill
                                color="#dc3545"
                                style={{ cursor: "pointer" }}
                              />
                              <span> {t("delete")}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default HotspotCustomerReport;
