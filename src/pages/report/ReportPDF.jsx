import React from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PrintReport = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, filterData, status } = props;

  //user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  //user Data
  const userData = useSelector((state) =>
    userRole === "manager"
      ? state.persistedReducer.auth.ispOwnerData
      : state.persistedReducer.auth.userData
  );
  const startDate = moment(filterData.startDate).format("DD/MM/YYYY");
  const endDate = moment(filterData.endDate).format("DD/MM/YYYY");
  return (
    <>
      <div ref={ref}>
        <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
          <div className="logo_side">
            <div className="company_logo">
              <img src="/assets/img/logo.png" alt="" />
            </div>
            <div className="company_name">{userData.company}</div>
          </div>
          <div className="details_side">
            <p>
              {t("companyName")} {userData.company}
            </p>
            {userData.address && (
              <p>
                {t("address")} : {userData?.address}
              </p>
            )}
          </div>
        </div>

        {status === "report" && (
          <ul className="d-flex justify-content-around filter_list">
            <li>
              {t("area")} : {filterData.area}
            </li>
            <li>
              {t("subArea")} : {filterData.subArea}
            </li>
            <li>
              {t("collector")} : {filterData.collector}
            </li>
            <li>
              {t("date")} : {startDate} - {endDate}
            </li>
          </ul>
        )}

        {status === "collection" && (
          <ul className="d-flex justify-content-around filter_list">
            <li>
              {t("reseller")} : {filterData.reseller}
            </li>
            <li>
              {t("medium")} : {filterData.medium}
            </li>
            <li>
              {t("date")} : {startDate} - {endDate}
            </li>
          </ul>
        )}

        <ul className="d-flex justify-content-center filter_list">
          <li>
            {t("totalData")} {currentCustomers.length}
          </li>
          <li className="ms-4">
            {t("totalBill")}
            {filterData.totalBill}
          </li>
        </ul>
        <table className="table table-striped text-center align-center">
          <thead>
            <tr className="spetialSortingRow">
              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("id")}
              </th>

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("name")}
              </th>

              {status === "report" && (
                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  {t("pppoeIp")}
                </th>
              )}

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("package")}
              </th>

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("bill")}
              </th>

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("discount")}
              </th>

              {status === "report" && (
                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  {t("due")}
                </th>
              )}

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("collector")}
              </th>

              {status !== "report" && (
                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  {t("rslrC")}
                </th>
              )}

              {status !== "report" && (
                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  {t("ispC")}
                </th>
              )}

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("note")}
              </th>

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((val, key) => (
              <tr key={key} id={val?.id}>
                <td className="p-1">{val?.customer?.customerId}</td>
                <td className="p-1">{val?.customer?.name}</td>
                {status === "report" && (
                  <td className="p-1">
                    {val?.customer?.userType === "pppoe"
                      ? val?.customer?.pppoe.name
                      : val?.customer?.userType === "firewall-queue"
                      ? val?.customer?.queue.address
                      : val?.customer?.userType === "core-queue"
                      ? val?.customer?.queue.srcAddress
                      : val?.customer?.userType === "simple-queue"
                      ? val?.customer?.queue.target
                      : ""}
                  </td>
                )}
                <td className="p-1">
                  {val?.customer?.mikrotikPackage?.name
                    ? val.customer?.mikrotikPackage?.name
                    : val.customer?.userType === "pppoe"
                    ? val.customer?.pppoe?.profile
                    : ""}
                </td>
                <td className="p-1">{FormatNumber(val?.amount)}</td>
                <td className="p-1">{FormatNumber(val?.discount)}</td>
                {status === "report" && (
                  <td className="p-1">{FormatNumber(val?.due)}</td>
                )}
                <td className="p-1">{val?.name}</td>
                {status !== "report" && (
                  <td className="p-1">{val?.resellerCommission}</td>
                )}
                {status !== "report" && (
                  <td className="p-1">{val?.ispOwnerCommission}</td>
                )}
                <td className="p-1">{val?.month}</td>
                <td className="p-1">
                  {moment(val?.createdAt).format("DD-MM-YYYY hh:mm:ss A")}
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
