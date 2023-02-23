import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const CollectionOverviewPdf = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const { allCollectionData } = props;

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
        <thead className="text-center">
          <tr className="spetialSortingRow">
            <th scope="col">{t("name")}</th>
            <th scope="col">{t("todayBillCollection")}</th>
            <th scope="col">{t("totalBillCollected")}</th>
            <th scope="col">{t("totalDepositCollector")}</th>
            <th scope="col">{t("balance")}</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {allCollectionData.collectorStat &&
            allCollectionData.collectorStat.map((val, key) => (
              <tr key={key} id={val.id}>
                <td className="prin_td">{val.name}</td>
                <td className="prin_td">{val.todayBillCollection}</td>
                <td className="prin_td">{val.totalBillCollected}</td>
                <td className="prin_td">{val.totalDeposit}</td>
                <td className="prin_td">{val.balance}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
});

export default CollectionOverviewPdf;
