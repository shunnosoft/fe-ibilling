import moment from "moment";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { badge } from "../../../components/common/Utils";

const CustomerPdf = forwardRef((props, ref) => {
  const { t } = useTranslation();

  // ispOwner
  const ispOwner = useSelector((state) => state.persistedReducer.auth.userData);

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  const { customerData, status } = props;
  return (
    <div className="mt-3 p-4" ref={ref}>
      <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
        <div className="logo_side">
          <div className="company_logo">
            <img src="/assets/img/logo.png" alt="Company Logo" />
          </div>
          <div className="company_name">{ispOwner.company}</div>
        </div>
        <div className="details_side">
          <p>
            {t("companyName")} {ispOwner.company}
          </p>
          {ispOwner.address && (
            <p>
              {t("address")} : {ispOwner?.address}
            </p>
          )}
        </div>
      </div>

      {status && status === "discount" ? (
        <table className="table table-striped ">
          <thead className="text-center">
            <tr className="spetialSortingRow">
              <th scope="col">{t("id")}</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("mobile")}</th>
              <th scope="col">{t("status")}</th>
              <th scope="col">{t("paymentStatus")}</th>
              <th scope="col">{t("package")}</th>
              <th scope="col">{t("discount")}</th>
              <th scope="col">{t("monthly")}</th>
              <th scope="col">{t("balance")}</th>
              <th scope="col">{t("bill")}</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {customerData &&
              customerData.map((val, key) => (
                <tr key={key} id={val.id}>
                  <td className="prin_td">{val.customer.customerId}</td>
                  <td className="prin_td">{val.customer.name}</td>
                  <td className="prin_td">{val.customer.mobile}</td>
                  <td className="prin_td">{badge(val.customer.status)}</td>
                  <td className="prin_td">{badge(val.paymentStatus)}</td>
                  <td className="prin_td">
                    {getCustomerPackage(val.customer.mikrotikPackage)?.name}
                  </td>
                  <td className="prin_td">{val.discount}</td>
                  <td className="prin_td">{val.customer.monthlyFee}</td>
                  <td className="prin_td">{val.balance}</td>
                  <td className="prin_td">
                    {moment(val.billingCycle).format("YYYY/MM/DD hh:mm A")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <table className="table table-striped ">
          <thead className="text-center">
            <tr className="spetialSortingRow">
              <th scope="col">{t("id")}</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("PPPoE")}</th>
              <th scope="col">{t("status")}</th>
              <th scope="col">{t("paymentStatus")}</th>
              <th scope="col">{t("package")}</th>
              <th scope="col">{t("mountly")}</th>
              <th scope="col">{t("balance")}</th>
              <th scope="col">{t("bill")}</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {customerData &&
              customerData.map((val, key) => (
                <tr key={key} id={val.id}>
                  <td className="prin_td">{val.customerId}</td>
                  <td className="prin_td">{val.name}</td>
                  <td className="prin_td">{val.pppoe.name}</td>
                  <td className="prin_td">{badge(val.status)}</td>
                  <td className="prin_td">{badge(val.paymentStatus)}</td>
                  <td className="prin_td">{val.pppoe.profile}</td>
                  <td className="prin_td">{val.monthlyFee}</td>
                  <td className="prin_td">{val.balance}</td>
                  <td className="prin_td">
                    {moment(val.billingCycle).format("MMM DD YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

export default CustomerPdf;
