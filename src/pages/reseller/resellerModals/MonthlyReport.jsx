import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import TdLoader from "../../../components/common/TdLoader";
import { prevMonthReport } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const MonthlyReport = ({ show, setShow, resellerID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get recharge history
  const data = useSelector((state) => state.recharge?.prevMonthReport);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resellerID) {
      prevMonthReport(ispOwnerId, resellerID, setIsLoading, dispatch);
    }
  }, [resellerID]);

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"lg"}
        header={t("prevMonthReport")}
      >
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
      </ComponentCustomModal>
    </>
  );
};

export default MonthlyReport;
