import moment from "moment";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ReactToPrint from "react-to-print";
import FormatNumber from "../../../components/common/NumberFormat";
import TdLoader from "../../../components/common/TdLoader";
import { getResellerRechargeHistioty } from "../../../features/apiCalls";
import PrintReport from "./ReportPDF";

const RechargeReport = ({ resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  //get recharge history
  let data = useSelector((state) => state.recharge.singleHistory);

  // get all reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // start date state
  const [startDate, setStartDate] = useState(firstDay);

  // end date state
  const [endDate, setEndDate] = useState(today);

  // loading state
  const [isLoading, setIsLoading] = useState();

  // report data state
  const [mainData, setMainData] = useState([]);

  // find select reseller
  const findName = reseller.find((item) => item?.id === resellerId);

  useEffect(() => {
    setMainData(data);
  }, [data]);

  // filter handler
  const onClickFilter = () => {
    let filterData = [...data];
    // date filter
    filterData = filterData.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );
    setMainData(filterData);
  };

  useEffect(() => {
    if (resellerId) {
      getResellerRechargeHistioty(resellerId, setIsLoading, dispatch);
    }
  }, [resellerId]);

  return (
    <>
      <div
        className="modal fade"
        id="rechargeReport"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {findName?.name} {t("report")}
              </h5>
              <ReactToPrint
                documentTitle={t("rechargeHistory")}
                trigger={() => (
                  <PrinterFill title={t("print")} className="addcutmButton" />
                )}
                content={() => componentRef.current}
              />
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* filter selector */}
              <div className="selectFilteringg">
                <div>
                  <ReactDatePicker
                    className="form-control mw-100"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMM dd yyyy"
                    placeholderText={t("selectBillDate")}
                  />
                </div>
                <div className="mx-2">
                  <ReactDatePicker
                    className="form-control mw-100"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="MMM dd yyyy"
                    placeholderText={t("selectBillDate")}
                  />
                </div>
                <div className="">
                  <button
                    className="btn btn-outline-primary w-140 "
                    type="button"
                    onClick={onClickFilter}
                  >
                    {t("filter")}
                  </button>
                </div>
              </div>
              <div className="table-section">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">{t("amount")}</th>
                      <th scope="col">{t("date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <TdLoader colspan={4} />
                    ) : mainData?.length > 0 ? (
                      mainData?.map((item, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{FormatNumber(item.amount)}</td>
                              <td>
                                {moment(item.createdAt).format(
                                  "MMM DD YYYY hh:mm a"
                                )}
                              </td>
                            </tr>
                          </>
                        );
                      })
                    ) : (
                      <td colSpan={4}>
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
      <div style={{ display: "none" }}>
        <PrintReport
          currentCustomers={data}
          name={findName?.name}
          ref={componentRef}
        />
      </div>
      {/* print report end*/}
    </>
  );
};

export default RechargeReport;
