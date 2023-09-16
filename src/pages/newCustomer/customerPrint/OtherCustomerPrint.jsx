import React, { forwardRef } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";

const OtherCustomerPrint = forwardRef((props, ref) => {
  const { t } = useTranslation();

  // print data props
  const { currentCustomers, filterData } = props;

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // customer current package find
  const getCustomerPackage = (value) => {
    if (value?.userType === "hotspot") {
      const findPack = hotsPackage.find((item) =>
        item.id.includes(value?.hotspotPackage)
      );
      return findPack;
    } else {
      const findPack = allPackages.find((item) =>
        item.id.includes(value?.mikrotikPackage)
      );
      return findPack;
    }
  };

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

      <ul className="d-flex justify-content-evenly">
        <li>
          {t("customerType")} :
          {filterData.customerType ? filterData.customerType : t("all")}
        </li>
        <li>
          {t("totalData")} :{currentCustomers.length}
        </li>
        <li>
          {t("startDate")} :
          {moment(filterData?.startDate).format("DD MMM YYYY")}
        </li>
        <li>
          {t("endDate")} : {moment(filterData?.endDate).format("DD MMM YYYY")}
        </li>
      </ul>
      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("id")}</th>
            <th scope="col">{t("name")}</th>
            <th scope="col">{t("pppoeIp")}</th>
            <th scope="col">{t("mobile")}</th>
            <th scope="col">{t("status")}</th>
            <th scope="col">{t("paymentStatus")}</th>
            <th scope="col">{t("package")}</th>
            <th scope="col">{t("monthly")}</th>
            <th scope="col">{t("balance")}</th>
            <th scope="col">{t("bill")}</th>
            <th scope="col">{t("createdAt")}</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{val.customerId}</td>
              <td className="prin_td">{val.name}</td>
              <td className="prin_td">
                {val?.userType === "pppoe"
                  ? val?.pppoe.name
                  : val?.userType === "firewall-queue"
                  ? val?.queue.address
                  : val?.userType === "core-queue"
                  ? val?.queue.srcAddress
                  : val?.userType === "simple-queue"
                  ? val?.queue.target
                  : val?.hotspot.name}
              </td>
              <td className="prin_td">{val.mobile}</td>
              <td className="prin_td">{badge(val.status)}</td>
              <td className="prin_td">{badge(val.paymentStatus)}</td>
              <td className="prin_td">
                {val && getCustomerPackage(val)?.name}
              </td>
              <td className="prin_td">{FormatNumber(val.monthlyFee)}</td>
              <td className="prin_td">
                <strong>{FormatNumber(val.balance)}</strong>
              </td>
              <td className="prin_td">
                {moment(val.billingCycle).format("DD MMM YYYY")}
              </td>
              <td className="prin_td">
                {moment(val.createdAt).format("DD MMM YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default OtherCustomerPrint;
