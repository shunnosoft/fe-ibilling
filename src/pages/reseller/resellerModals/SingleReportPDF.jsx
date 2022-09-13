import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { ArrowDownUp } from "react-bootstrap-icons";
import FormatNumber from "../../../components/common/NumberFormat";
import { useSelector } from "react-redux";

const SingleReportPDF = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { ispOwnerData, reportData } = props;
  //get recharge history
  const data = useSelector((state) => state.recharge.singleHistory);

  const single = data.find((item) => item.id == reportData);

  console.log(single);
  return (
    <>
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
              {t("companyName")}
              {ispOwnerData.company}
            </p>
            {ispOwnerData.address && (
              <p>
                {t("address")} : {ispOwnerData?.address}
              </p>
            )}
          </div>
        </div>

        <div className="container mt-3 mb-5">
          <ul className="d-flex justify-content-around filter_list">
            <li>{/* {t("name")} {name} */}</li>
          </ul>
          <table className="table table-striped">
            <thead>
              <tr className="spetialSortingRow">
                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  #
                  <ArrowDownUp className="arrowDownUp" />
                </th>
                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  {t("recharge")}
                  <ArrowDownUp className="arrowDownUp" />
                </th>

                <th style={{ fontFamily: "sans-serif" }} scope="col">
                  {t("date")}
                  <ArrowDownUp className="arrowDownUp" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1">1</td>
                <td className="p-1">{single?.amount}</td>
                <td className="p-1">
                  {moment(single?.createdAt).format("DD-MM-YYYY hh:mm:ss A")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="page-footer">
            <div className="signature_container">
              <div className="p-3 signature_wraper">
                <div className="signamture_field">{t("Proprietor")}</div>
                <div className="signamture_field">{t("customer")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default SingleReportPDF;
