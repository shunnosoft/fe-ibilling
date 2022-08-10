import React from "react";
import moment from "moment";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers } = props;
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

      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("type")}</th>
            <th scope="col">{t("amount")}</th>
            <th scope="col">{t("status")}</th>
            <th scope="col">{t("date")}</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">
                {val.type === "registration"
                  ? t("registration")
                  : val.type === "migration"
                  ? t("packageMigration")
                  : val.type === "smsPurchase"
                  ? t("message")
                  : t("monthFee")}
              </td>
              <td className="prin_td">{val.amount}</td>
              <td className="prin_td">{badge(val.status)}</td>

              <td className="prin_td">
                {moment(val.createdAt).format("MMM DD YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintCustomer;
