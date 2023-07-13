import React, { useMemo } from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, filterData, printOptions } = props;

  //user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  //user Data
  const userData = useSelector((state) =>
    userRole === "manager"
      ? state.persistedReducer.auth.ispOwnerData
      : state.persistedReducer.auth.userData
  );
  //total monthly fee and due calculation
  const monthlyFee = useMemo(() => {
    let totalMonthlyFee = 0;

    currentCustomers.map((item) => {
      // sum of all monthly fee
      totalMonthlyFee += item.monthlyFee;
    });

    return { totalMonthlyFee };
  }, [currentCustomers]);

  // console.log(ispOwnerData);
  return (
    <div ref={ref}>
      <div className="page_header letter_header d-flex justify-content-end align-items-center pb-3 ">
        {/* <div className="logo_side">
          <div className="company_logo">
            <img src="/assets/img/logo.png" alt="Company Logo" />
          </div>
          <div className="company_name">{ispOwnerData.company}</div>
        </div> */}
        <div className="details_side">
          <p>
            {t("companyName")} {userData.company}
          </p>
          {userData?.address && (
            <p>
              {t("address")} {userData?.address}
            </p>
          )}
        </div>
      </div>

      <ul className="d-flex justify-content-evenly filter_list">
        <li>
          {t("area")} : {filterData?.area}
        </li>
        <li>
          {t("subArea")} : {filterData?.subArea}
        </li>
        <li>
          {t("status")} : {filterData?.status}
        </li>
        <li>
          {t("paymentStatus")} : {filterData?.payment}
        </li>
      </ul>

      <ul className="d-flex justify-content-evenly filter_list">
        <li>
          {t("totalCustomer")} : {currentCustomers.length}
        </li>
        <li>
          {t("totalMonthlyFee")} : {FormatNumber(monthlyFee.totalMonthlyFee)}
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
