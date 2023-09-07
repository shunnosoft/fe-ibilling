import React from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { currentCustomers, filterData, status } = props;

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

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
              {t("address")} : {ispOwnerData?.address}
            </p>
          )}
        </div>
      </div>

      {status !== "ownDeposit" && (
        <ul className="d-flex justify-content-evenly filter_list">
          <li>
            {t("deposit")} : {filterData.deposit}
          </li>
          <li>
            {t("totalData")} : {currentCustomers.length}
          </li>
          <li>
            {t("startDate")} : {filterData.startDate}
          </li>
          <li>
            {t("endDate")} : {filterData.endDate}
          </li>
        </ul>
      )}

      <table className="table table-striped ">
        {status !== "ownDeposit" ? (
          <>
            <thead>
              <tr className="spetialSortingRow">
                <th scope="col">{t("id")}</th>
                <th scope="col">{t("name")}</th>
                <th scope="col">{t("total")}</th>
                <th scope="col">{t("action")}</th>
                <th scope="col">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((val, key) => (
                <tr key={key} id={val.id}>
                  <td className="prin_td">{key + 1}</td>
                  <td className="prin_td">{getName(val.user)}</td>
                  <td className="prin_td">{FormatNumber(val.amount)}</td>
                  <td className="prin_td">{val.status}</td>

                  <td className="prin_td">
                    {moment(val.createdAt).format("DD-MM-YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <>
            <thead>
              <tr className="spetialSortingRow">
                <th scope="col">{t("id")}</th>
                <th scope="col">{t("amount")}</th>
                <th scope="col">{t("status")}</th>
                <th scope="col">{t("not")}</th>
                <th scope="col">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((val, key) => (
                <tr key={key} id={val.id}>
                  <td className="prin_td">{key + 1}</td>
                  <td className="prin_td">{FormatNumber(val.amount)}</td>
                  <td className="prin_td">
                    <div>
                      {val.status === "accepted" && (
                        <span className="badge bg-success">
                          {t("adminAccepted")}
                        </span>
                      )}
                      {val.status === "rejected" && (
                        <span className="badge bg-danger">
                          {t("adminCanceled")}
                        </span>
                      )}
                      {val.status === "pending" && (
                        <span className="badge bg-warning">
                          {t("adminPending")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="prin_td">{val?.note}</td>
                  <td className="prin_td">
                    {moment(val.createdAt).format("DD-MM-YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
});

export default PrintCustomer;
