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
import { Accordion, Card } from "react-bootstrap";
import { getCustoemrReport } from "../../../features/apiCalls";

export default function CustomerBillReport({ customerId }) {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const billRefwithNote = useRef();
  const billRefwithOutNote = useRef();

  // one year month
  const month = [
    { value: "January", name: "january" },
    { value: "February", name: "february" },
    { value: "March", name: "march" },
    { value: "April", name: "april" },
    { value: "May", name: "may" },
    { value: "June", name: "june" },
    { value: "July", name: "July" },
    { value: "August", name: "august" },
    { value: "September", name: "september" },
    { value: "October", name: "october" },
    { value: "November", name: "november" },
    { value: "December", name: "december" },
  ];

  const [printVal, setPrintVal] = useState({});
  const [status, setStatus] = useState("");

  const [customerReport, setCustomerReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //get isp owner data
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

  //get customer bill report form state
  const report = useSelector((state) => state.payment?.billReport);

  //get specific customer report
  useEffect(() => {
    getCustoemrReport(dispatch, customerId, setIsLoading);
  }, []);

  //delete report
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
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("billReport")}</h5>
      </Card.Title>

      <Card.Body>
        {isLoading ? (
          <TdLoader colspan={5} />
        ) : (
          report?.map((val) => {
            return (
              <Accordion className="my-1">
                <Accordion.Item eventKey={val?.user}>
                  <Accordion.Header className="reportAccordion">
                    <div className="reportHeader">
                      <p className="reportName">{val?.month}</p>
                      <div className="reportAction">
                        <ReactToPrint
                          documentTitle={t("billReport")}
                          trigger={() => (
                            <PrinterFill
                              title={t("print")}
                              size={19}
                              className="text-success"
                            />
                          )}
                          content={() => billRefwithNote.current}
                        />
                        <TrashFill
                          size={19}
                          className="text-danger ms-2"
                          title={t("delete")}
                        />
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body></Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })
        )}
      </Card.Body>
    </>
  );
}
