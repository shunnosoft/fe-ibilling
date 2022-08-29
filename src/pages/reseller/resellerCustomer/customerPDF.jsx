import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, filterData } = props;
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );
  // console.log(ispOwnerData);
  return (
    <div ref={ref}>
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
              {t("address")} {ispOwnerData?.address}
            </p>
          )}
        </div>
      </div>

      <ul className="d-flex justify-content-evenly filter_list">
        {filterData.reseller && (
          <li>
            {t("reseller")} : {filterData.reseller}
          </li>
        )}
        <li>
          {t("status")} : {filterData.status}
        </li>
        <li>
          {t("paymentStatus")} : {filterData.payment}
        </li>
      </ul>
      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("id")}</th>
            <th scope="col">{t("name")}</th>
            <th scope="col">{t("address")}</th>
            <th scope="col">{t("mobile")}</th>
            <th scope="col">{t("status")}</th>
            <th scope="col">{t("paymentStatus")}</th>
            <th scope="col">{t("package")}</th>
            <th scope="col">{t("month")}</th>
            <th scope="col">{t("balance")}</th>
            <th scope="col">{t("billingCycle")}</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{val.customerId}</td>
              <td className="prin_td">{val.name}</td>
              <td className="prin_td">{val.address}</td>
              <td className="prin_td">{val.mobile}</td>
              <td className="prin_td">{badge(val.status)}</td>
              <td className="prin_td">{badge(val.paymentStatus)}</td>
              <td className="prin_td">{val.pppoe.profile}</td>
              <td className="prin_td">{FormatNumber(val.monthlyFee)}</td>
              <td className="prin_td">
                <strong>{FormatNumber(val.balance)}</strong>
              </td>
              <td className="prin_td">
                {moment(val.billingCycle).format("DD-MM-YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintCustomer;
