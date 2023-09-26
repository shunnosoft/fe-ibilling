import React, { forwardRef } from "react";
import FormatNumber from "../../../components/common/NumberFormat";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { badge } from "../../../components/common/Utils";

const InvoicePrint = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, ispOwnerData } = props;
  return (
    <div className="mt-3 p-4" ref={ref}>
      <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
        <div className="logo_side">
          <div className="company_logo">
            <img src="/assets/img/logo.png" alt="Company Logo" />
          </div>
          <div className="company_name">{ispOwnerData.company}</div>
        </div>
        <div className="details_side">
          <p>
            {t("companyName")} {ispOwnerData.company}
          </p>
          {ispOwnerData.address && (
            <p>
              {t("address")} : {ispOwnerData?.address}
            </p>
          )}
        </div>
      </div>

      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("id")}</th>
            <th scope="col">{t("pppoe")}</th>
            <th scope="col">{t("package")}</th>
            <th scope="col">{t("monthly")}</th>
            <th scope="col">{t("amount")}</th>
            <th scope="col">{t("balance")}</th>
            <th scope="col">{t("paymentStatus")}</th>
            <th scope="col">{t("discount")}</th>
            <th scope="col">{t("due")}</th>
            <th scope="col">{t("createAt")}</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{val.customer?.customerId}</td>
              <td className="prin_td">
                {val.customer?.userType === "pppoe"
                  ? val.customer?.pppoe?.name
                  : val.customer?.userType === "firewall-queue"
                  ? val.customer?.queue?.address
                  : val.customer?.userType === "core-queue"
                  ? val.customer?.queue?.srcAddress
                  : val.customer?.queue?.target}
              </td>
              <td className="prin_td">{val?.package}</td>
              <td className="prin_td">{val.customer?.monthlyFee}</td>
              <td className="prin_td">{val?.amount}</td>
              <td className="prin_td">
                <strong>{FormatNumber(val?.balance)}</strong>
              </td>
              <td className="prin_td">{badge(val?.paymentStatus)}</td>
              <td className="prin_td">{val?.discount}</td>
              <td className="prin_td">{FormatNumber(val?.due)}</td>
              <td className="prin_td">
                {moment(val.createdAt).format("YYYY-MM-DD")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default InvoicePrint;
