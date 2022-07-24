import React from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, filterData } = props;
  const ispOwnerData = useSelector(
    (state) => state?.persistedReducer?.auth?.userData
  );

  // get owner users
  const ownerUsers = useSelector(
    (state) => state?.persistedReducer?.ownerUsers?.ownerUser
  );

  const getName = (userId) => {
    const performer = ownerUsers.find((item) => item[userId]);

    return (
      <div>
        {performer &&
          performer[userId].name + "(" + performer[userId].role + ")"}
      </div>
    );
  };

  return (
    <div ref={ref}>
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
              {t("address")} {ispOwnerData?.address}
            </p>
          )}
        </div>
      </div>

      <ul className="d-flex justify-content-evenly filter_list">
        <li>
          {t("all collector")} : {filterData.collector}
        </li>
        <li>
          {t("startDate")} : {filterData.startDate}
        </li>
        <li>
          {t("endDate")} : {filterData.endDate}
        </li>
      </ul>
      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">{t("name")}</th>
            <th scope="col">{t("total")}</th>
            <th scope="col">{t("action")}</th>
            <th scope="col">{t("date")}</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{getName(val.user)}</td>
              <td className="prin_td">{FormatNumber(val.amount)}</td>
              <td className="prin_td">{val.status}</td>

              <td className="prin_td">
                {moment(val.createdAt).format("DD-MM-YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="pdf_footer_line"></div>
      <div className="signature_text text-mute">সাক্ষর এবং তারিখ</div>
      <div className="signature_container">
        <div className="p-3 signature_wraper">
          <div className="signamture_field">ম্যানেজার</div>
          <div className="signamture_field">এডমিন</div>
        </div>
      </div> */}
    </div>
  );
});

export default PrintCustomer;
