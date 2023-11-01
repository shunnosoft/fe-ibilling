import moment from "moment";
import React, { useEffect, useState } from "react";
import { PrinterFill, TrashFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Accordion, Card } from "react-bootstrap";

//internal import
import "../customer.css";
import TdLoader from "../../../components/common/TdLoader";
import {
  deleteCustomerReport,
  getCustoemrReport,
} from "../../../features/apiCalls";
import { FontColor } from "../../../assets/js/theme";
import PrintOptions from "../../../components/common/PrintOptions";

const CustomerBillReport = ({ customerId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //get customer bill report form state
  const report = useSelector((state) => state.payment?.billReport);

  // loading state
  const [show, setShow] = useState(false);

  // print report data
  const [tableData, setTableData] = useState("");

  //get specific customer report
  useEffect(() => {
    getCustoemrReport(dispatch, customerId, setIsLoading);
  }, []);

  //customer single report delete handle
  const singleReportDelete = async (reportId) => {
    const con = window.confirm(t("deleteAlert"));
    if (con) {
      deleteCustomerReport(dispatch, reportId);
    }
  };

  const printBillReportHandle = (id) => {
    const billReport = report?.find((val) => val.id === id);
    if (billReport) {
      setShow(true);
      setTableData(billReport);
    }
  };

  //bill report customer or customer & office copy print options
  const printOptions = [
    {
      id: 5016,
      value: "customer",
      label: "customer",
      checked: true,
    },
    {
      id: 5017,
      value: "both",
      label: "office&customer",
      checked: false,
    },
  ];

  return (
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("billReport")}</h5>
      </Card.Title>

      <Card.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <TdLoader colspan={5} />
          </div>
        ) : report.length > 0 ? (
          report?.map((val) => {
            return (
              <Accordion className="my-1">
                <Accordion.Item eventKey={val?.user}>
                  <div className="reportHeader">
                    <Accordion.Button className="reportAccordion">
                      <p className="reportName">
                        {val?.month} &nbsp;
                        {new Date(val?.createdAt).getFullYear()}
                      </p>
                    </Accordion.Button>
                    <div className="reportAction" style={{ cursor: "pointer" }}>
                      <PrinterFill
                        title={t("print")}
                        size={19}
                        className="text-primary"
                        onClick={() => printBillReportHandle(val?.id)}
                      />

                      <TrashFill
                        size={19}
                        className="text-danger ms-2"
                        title={t("delete")}
                        onClick={() => singleReportDelete(val?.id)}
                      />
                    </div>
                  </div>

                  <Accordion.Body className="p-0">
                    <div className="shadow-sm bg-white rounded">
                      <h5 className="reportCollect mb-0">{val?.name}</h5>

                      <FontColor>
                        <div className="displayGridHorizontalFill5_5 collectReport">
                          <div className="reportOptions row gt-1">
                            <p>
                              {t("amount")}
                              <b>{val?.amount}</b>
                            </p>
                            <p>
                              {t("billType")} <b>{val?.billType}</b>
                            </p>
                            <p>
                              {t("medium")} <b>{val?.medium}</b>
                            </p>
                            <p>
                              {t("discount")} <b>{val?.discount}</b>
                            </p>
                            <p>
                              {t("due")} <b>{val?.due}</b>
                            </p>
                            <p>
                              {t("previousBalance")}
                              <b>{val?.prevState?.balance}</b>
                            </p>
                            <p>
                              {t("currentBalance")}
                              <b>{val?.currentState?.balance}</b>
                            </p>
                          </div>

                          <div className="reportOptions">
                            {/* customer bill report create date */}
                            <p>
                              {t("createDate")}
                              <b>
                                {moment(val.createdAt).format(
                                  "MMM DD YYYY hh:mm A"
                                )}
                              </b>
                            </p>
                            {/* customer previous billing & promise date state */}
                            <p className="clintTitle border border-1 ps-1">
                              {t("previousState")}
                            </p>
                            <p className="mt-1">
                              {t("billDate")}
                              <b className="text-secondary">
                                {moment(val.prevState?.billingCycle).format(
                                  "MMM DD YYYY hh:mm A"
                                )}
                              </b>
                            </p>
                            <p>
                              {t("promiseDate")}
                              <b className="text-secondary">
                                {moment(val.prevState?.promiseDate).format(
                                  "MMM DD YYYY hh:mm A"
                                )}
                              </b>
                            </p>

                            {/* customer current billing & promise date state */}
                            <p className="clintTitle border border-1 ps-1 mt-1">
                              {t("currentState")}
                            </p>
                            <p className="mt-1">
                              {t("billDate")}
                              <b className="text-secondary">
                                {moment(val.currentState?.billingCycle).format(
                                  "MMM DD YYYY hh:mm A"
                                )}
                              </b>
                            </p>
                            <p>
                              {t("promiseDate")}
                              <b className="text-secondary">
                                {moment(val.currentState?.promiseDate).format(
                                  "MMM DD YYYY hh:mm A"
                                )}
                              </b>
                            </p>
                          </div>
                        </div>
                      </FontColor>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          })
        ) : (
          <h5 className="text-center"> {t("noDataFound")} </h5>
        )}
      </Card.Body>

      {/* customer single report print option */}
      <PrintOptions
        show={show}
        setShow={setShow}
        printOptions={printOptions}
        tableData={tableData}
        page={"billReport"}
      />
    </>
  );
};

export default CustomerBillReport;
