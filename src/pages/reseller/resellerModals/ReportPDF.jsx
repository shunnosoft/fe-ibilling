import React from "react";
import { ArrowDownUp } from "react-bootstrap-icons";
import moment from "moment";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FormatNumber from "../../../components/common/NumberFormat";

const PrintReport = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, name } = props;
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  return (
    <>
      <div ref={ref}>
        <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
          <div className="logo_side">
            <div className="company_logo">
              <img src="/assets/img/logo.png" alt="" />
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
        <ul className="d-flex justify-content-around filter_list">
          <li>
            {t("name")} {name}
          </li>
          <li>
            {t("totalData")} {currentCustomers.length}
          </li>
        </ul>
        <table className="table table-striped">
          <thead>
            <tr className="spetialSortingRow">
              <th style={{ fontFamily: "sans-serif" }} scope="col">
                #
                <ArrowDownUp className="arrowDownUp" />
              </th>
              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("bill")}
                <ArrowDownUp className="arrowDownUp" />
              </th>

              <th style={{ fontFamily: "sans-serif" }} scope="col">
                {t("date")}
                <ArrowDownUp className="arrowDownUp" />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((val, key) => (
              <tr key={key} id={val?.id}>
                <td className="p-1">{key + 1}</td>
                <td className="p-1">{FormatNumber(val?.amount)}</td>
                <td className="p-1">
                  {moment(val?.createdAt).format("DD-MM-YYYY hh:mm:ss A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className="page-footer">
          <div className="signature_container">
            <div className="p-3 signature_wraper">
              <div className="signamture_field">{t("manager")}</div>
              <div className="signamture_field">{t("admin")}</div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
});

export default PrintReport;
