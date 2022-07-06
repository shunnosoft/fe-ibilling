import React from "react";
import { ArrowDownUp } from "react-bootstrap-icons";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

let serial = 0;

const PrintExpenditure = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { allExpenditures } = props;
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
        <table className="table table-striped ">
          <thead>
            <tr>
              <th>{t("serial")}</th>
              <th>{t("expenseSector")}</th>
              <th>{t("amount")}</th>
              <th>{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {allExpenditures?.map((val, key) => (
              <tr key={key}>
                <td>{++serial}</td>
                <td>{val.expenditureName}</td>
                <td>{val.amount}</td>
                <td> {moment(val.createdAt).format("DD-MM-YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="page-footer">
          <div className="signature_container">
            <div className="p-3 signature_wraper">
              <div className="signamture_field">{t("manager")}</div>
              <div className="signamture_field">{t("admin")}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default PrintExpenditure;
