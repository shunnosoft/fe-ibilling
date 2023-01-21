import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { badge } from "../../components/common/Utils";
const StaffPdf = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const { allStaffData } = props;

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

      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("id")}</th>
            <th scope="col">{t("name")}</th>
            <th scope="col">{t("mobile")}</th>
            <th scope="col">{t("status")}</th>
            <th scope="col">{t("salary")}</th>
            <th scope="col">{t("due")}</th>
          </tr>
        </thead>
        <tbody>
          {allStaffData.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{key + 1}</td>
              <td className="prin_td">{val.name}</td>
              <td className="prin_td">{val.mobile}</td>
              <td className="prin_td">{badge(val.status)}</td>
              <td className="prin_td">{val.salary}</td>
              <td className="prin_td">{val.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default StaffPdf;
