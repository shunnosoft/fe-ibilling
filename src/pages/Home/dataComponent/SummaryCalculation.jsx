import React from "react";
import { useTranslation } from "react-i18next";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import FormatNumber from "../../../components/common/NumberFormat";

//summary Calculation function
const SummaryCalculation = (mainData) => {
  const { t } = useTranslation();

  // get user & current user data form useISPOwner hooks
  const { role, permissions } = useISPowner();

  const initialValue = {
    totalTodayCollection: 0,
    totalCollection: 0,
    totalDue: 0,
  };

  const calculatedValue = mainData.reduce((previous, current) => {
    // sum of today collection
    previous.totalTodayCollection += current.todayBillCollection;

    // sum of all bill collection
    previous.totalCollection += current.totalBillCollected;

    // sum of due amount
    previous.totalDue += current.balance;

    return previous;
  }, initialValue);

  return (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {calculatedValue?.totalTodayCollection > 0 && (
        <div>
          {t("todayCollection")}: ৳
          {FormatNumber(calculatedValue?.totalTodayCollection)}
        </div>
      )}
      &nbsp;&nbsp;
      {(role === "ispOwner" || permissions?.dashboardCollectionData) &&
        calculatedValue?.totalCollection > 0 && (
          <div>
            {t("totalCollection")}: ৳
            {FormatNumber(calculatedValue?.totalCollection)}
          </div>
        )}
      &nbsp;&nbsp;
      {(role === "ispOwner" || permissions?.dashboardCollectionData) &&
        calculatedValue?.totalDue < 0 && (
          <div>
            {t("due")}: ৳{FormatNumber(calculatedValue?.totalDue)}
          </div>
        )}
    </div>
  );
};

export default SummaryCalculation;
