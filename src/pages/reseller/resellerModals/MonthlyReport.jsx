import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import TdLoader from "../../../components/common/TdLoader";
import { prevMonthReport } from "../../../features/apiCalls";

const MonthlyReport = ({ resellerID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get recharge history
  const data = useSelector((state) => state.recharge?.prevMonthReport);

  useEffect(() => {
    if (resellerID) {
      prevMonthReport(ispOwnerId, resellerID, setIsLoading, dispatch);
    }
  }, [resellerID]);

  return (
    <div
      className="modal fade"
      id="monthlyReport"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("prevMonthReport")}
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-section">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">{t("package")}</th>
                    <th scope="col">{t("totalCustomer")}</th>
                    <th scope="col">{t("totalPaidCustomer")}</th>
                    <th scope="col">{t("totalPaidBill")}</th>
                    <th scope="col">{t("totalUnpaidCustomer")}</th>
                    <th scope="col">{t("totalDueBill")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <TdLoader colspan={6} />
                  ) : (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.mikrotikPackage}</td>
                        <td>{item.totalCustomer}</td>
                        <td>{item.paidCustomerCount}</td>
                        <td>{item.totalBillCollected}</td>
                        <td>{item.unpaidCustomerCount}</td>
                        <td>{item.unpaidCustomerTotalMonthlyFee}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
