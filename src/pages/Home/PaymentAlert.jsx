import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PaymentAlert = ({ invoice }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // invoice type
  const invoiceType = {
    monthlyServiceCharge: t("monthly"),
    registration: t("register"),
  };

  return (
    <>
      <div className="col-md-12 mb-3 pt-3 pb-3 badge bg-primary text-wrap fs-5 text">
        <div className="mb-1 pt-1 pb-1">{`${t("netFee")} ${
          invoiceType[invoice.type]
        } ${t("fee")} ${invoice.amount} ${t("expiredFee")} ${moment(
          invoice.dueDate
        ).format("DD-MM-YYYY hh:mm:ss A")}`}</div>

        <button
          type="button"
          className="btn btn-success fs-5 text"
          onClick={() => navigate("/payment", { state: invoice })}
        >
          {t("payment")}
        </button>
      </div>
    </>
  );
};

export default PaymentAlert;
