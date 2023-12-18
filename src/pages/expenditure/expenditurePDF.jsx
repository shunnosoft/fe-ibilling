import React from "react";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

let serial = 0;

const PrintExpenditure = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { allExpenditures, filterData } = props;
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get expenditure purpose
  const expenditurePurpose = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // find expenditure purpose method
  const findExpenditureType = (expenditureTypeId) => {
    const matchExpenditure = expenditurePurpose.find(
      (item) => item.id === expenditureTypeId
    );
    return matchExpenditure?.name;
  };

  // find expenditure user
  const performer = (value) => {
    let expenditureUser = ownerUsers.find((item) => item[value]);

    return expenditureUser && expenditureUser[value];
  };

  return (
    <>
      <div ref={ref}>
        {/* <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
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
        </div> */}

        <ul className="d-flex justify-content-evenly letter_header mb-1">
          <li>
            {t("totalData")} {allExpenditures.length}
          </li>
          <li className="ms-4">
            {t("amount")} : ৳{FormatNumber(filterData?.totalAmount)}
          </li>
          <li>
            {t("name")} : {filterData?.name}
          </li>
          <li>
            {t("type")} : {filterData?.expenditureType}
          </li>
        </ul>

        <table className="table table-striped ">
          <thead className="spetialSortingRow">
            <tr>
              <th scope="col">{t("serial")}</th>
              <th scope="col">{t("type")}</th>
              <th scope="col">{t("expenseDefination")}</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("amount")}</th>
              <th scope="col">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {allExpenditures?.map((val, key) => (
              <tr key={key}>
                <td className="prin_td align-middle">{++serial}</td>
                <td className="prin_td align-middle">
                  {findExpenditureType(val.expenditurePurpose)}
                </td>
                <td className="prin_td align-middle">{val.description}</td>
                <td className="prin_td align-middle">
                  {val.user &&
                    performer(val.user)?.name +
                      "(" +
                      performer(val.user)?.role +
                      ")"}
                </td>
                <td className="prin_td align-middle">
                  {FormatNumber(val.amount)}
                </td>
                <td className="prin_td align-middle">
                  {moment(val.createdAt).format("YYYY-MM-DD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default PrintExpenditure;
