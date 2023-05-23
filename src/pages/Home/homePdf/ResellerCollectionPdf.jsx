import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ResellerCollectionPdf = forwardRef((props, ref) => {
  const { t } = useTranslation();

  // ispOwner
  const ispOwner = useSelector((state) => state.persistedReducer.auth.userData);

  const { resellerCollectionData } = props;
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

      <table className="table table-striped ">
        <thead className="text-center">
          <tr className="spetialSortingRow">
            <th scope="col">{t("name")}</th>
            <th scope="col">{t("balance")}</th>
            <th scope="col">{t("billCollected")}</th>
            <th scope="col">{t("billDue")}</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {resellerCollectionData?.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{val.name}</td>
              <td className="prin_td">{Math.floor(val.currentBalance)}</td>
              <td className="prin_td">{val.totalBillCollected}</td>
              <td className="prin_td">{val.totalDueAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ResellerCollectionPdf;
