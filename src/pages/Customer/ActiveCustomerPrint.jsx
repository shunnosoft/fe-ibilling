import React, { forwardRef } from "react";
import { Wifi, WifiOff } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { badge } from "../../components/common/Utils";

const ActiveCustomerPrint = forwardRef((props, ref) => {
  const { t } = useTranslation();

  // print data props
  const { currentCustomers, filterData, status } = props;

  // get isp owner data form redux
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );
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
          {t("mikrotik")} :{filterData.mikrotik}
        </li>
        <li>
          {t("totalData")} :{currentCustomers.length}
        </li>
        {status !== "static" && (
          <>
            <li>
              {t("area")} :{filterData.area ? filterData.area : t("all")}
            </li>
            <li>
              {t("subarea")} :{" "}
              {filterData.subarea ? filterData.subarea : t("all")}
            </li>
          </>
        )}
        <li>
          {t("customer")} :
          {filterData.customerType ? filterData.customerType : t("all")}
        </li>
      </ul>
      <table className="table table-striped text-center">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("id")}</th>
            <th scope="col">{t("status")}</th>
            <th scope="col">{t("name")}</th>
            {status === "pppoe" ? (
              <>
                <th scope="col">{t("pppoeName")}</th>
                <th scope="col">{t("IPMac")}</th>
                <th scope="col">{t("package")}</th>
                <th scope="col">{t("loggedInOut")}</th>
              </>
            ) : (
              <>
                <th scope="col">{t("ipAddress")}</th>
                <th scope="col">{t("macAddress")}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{val.customerId}</td>
              {status === "pppoe" ? (
                <td className="prin_td">
                  <div>
                    {val?.running === true ? (
                      <p>{badge("online")}</p>
                    ) : (
                      <p>{badge("offline")}</p>
                    )}
                  </div>
                </td>
              ) : (
                <td className="prin_td">
                  <div>
                    {val?.complete === true ? (
                      <p>{badge("online")}</p>
                    ) : (
                      <p>{badge("offline")}</p>
                    )}
                  </div>
                </td>
              )}

              <td className="prin_td">{val.name}</td>
              {status === "pppoe" ? (
                <>
                  <td className="prin_td">{val?.pppoe?.name}</td>
                  <td className="prin_td">
                    <p>{val.ip}</p>
                    <p>{val.callerId}</p>
                  </td>
                  <td className="prin_td">{val?.pppoe?.profile}</td>
                  <td className="prin_td">
                    <p>{val.lastLinkUpTime}</p>
                    <p>{val.lastLogoutTime}</p>
                  </td>
                </>
              ) : (
                <>
                  <td className="prin_td">{val.ipAddress}</td>
                  <td className="prin_td">{val.macAddress}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
export default ActiveCustomerPrint;
