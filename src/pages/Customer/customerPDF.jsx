import React from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, filterData, printOptions } = props;
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
        <li>
          {t("area")} : {filterData.area}
        </li>
        <li>
          {t("subArea")} : {filterData.subArea}
        </li>
        <li>
          {t("status")} : {filterData.status}
        </li>
        <li>
          {t("payment")} : {filterData.payment}
        </li>
      </ul>
      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            {printOptions.map(
              (item) =>
                item.checked && (
                  <>
                    <th scope="col">{t(item.value)}</th>
                  </>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(
            (val, key) =>
              printOptions.length > 0 && (
                <tr key={key} id={val.id}>
                  {printOptions[0].checked && (
                    <td className="prin_td">{val.customerId}</td>
                  )}
                  {printOptions[1].checked && (
                    <td className="prin_td">{val.name}</td>
                  )}
                  {printOptions[2].checked && (
                    <td className="prin_td">{val.address}</td>
                  )}
                  {printOptions[3].checked && (
                    <td className="prin_td">{val.mobile}</td>
                  )}
                  {printOptions[4].checked && (
                    <td className="prin_td">{val.pppoe.name}</td>
                  )}
                  {printOptions[5].checked && (
                    <td className="prin_td">{badge(val.status)}</td>
                  )}
                  {printOptions[6].checked && (
                    <td className="prin_td">{badge(val.paymentStatus)}</td>
                  )}
                  {printOptions[7].checked && (
                    <td className="prin_td">{val.pppoe.profile}</td>
                  )}
                  {printOptions[8].checked && (
                    <td className="prin_td">{FormatNumber(val.monthlyFee)}</td>
                  )}
                  {printOptions[9].checked && (
                    <td className="prin_td">
                      <strong>{FormatNumber(val.balance)}</strong>
                    </td>
                  )}
                  {printOptions[10].checked && (
                    <td className="prin_td">
                      {moment(val.billingCycle).format("DD-MM-YYYY")}
                    </td>
                  )}
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
});

export default PrintCustomer;
