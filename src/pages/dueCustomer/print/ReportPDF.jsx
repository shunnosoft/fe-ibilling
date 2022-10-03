import React from "react";
import { ArrowDownUp } from "react-bootstrap-icons";
import moment from "moment";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { badge } from "../../../components/common/Utils";

const PrintReport = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers } = props;
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  return (
    <>
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
              <th scope="col">{t("id")}</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("pppoe")}</th>
              <th scope="col">{t("mobile")}</th>
              <th scope="col">{t("status")}</th>
              <th scope="col">{t("paymentStatus")}</th>
              <th scope="col">{t("package")}</th>
              <th scope="col">{t("month")}</th>
              <th scope="col">{t("balance")}</th>
              <th scope="col">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((val, key) => (
              <tr key={key} id={val.id}>
                <td className="prin_td">{val.customerId}</td>
                <td className="prin_td">{val.name}</td>
                <td className="prin_td">{val.pppoe?.name}</td>

                <td className="prin_td">{val.mobile}</td>
                <td className="prin_td">{badge(val.status)}</td>
                <td className="prin_td">{badge(val.paymentStatus)}</td>
                <td className="prin_td">{val.pppoe.profile}</td>
                <td className="prin_td">{val.monthlyFee}</td>
                <td className="prin_td">
                  <strong>{val.balance}</strong>
                </td>
                <td className="prin_td">
                  {moment(val.billingCycle).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default PrintReport;
