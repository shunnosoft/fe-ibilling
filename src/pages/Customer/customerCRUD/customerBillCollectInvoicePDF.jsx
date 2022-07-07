import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
const BillCollectInvoiceWithNote = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { billingData, ispOwnerData, customerData, paymentDate } = props;
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
              {t("companyName")} {ispOwnerData.company}
            </p>
            {ispOwnerData.address && (
              <p>
                {t("address")} : {ispOwnerData?.address}
              </p>
            )}
          </div>
        </div>

        {/* <table className="table table-striped ">
          <thead>
            <tr>
              <th scope="col">নাম</th>
              <th scope="col">মোবাইল</th>
              <th scope="col">বিল টাইপ</th>
              <th scope="col">বিলের ধরণ</th>
              <th scope="col">এমাউন্ট</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{customerData?.name}</td>
              <td>{customerData?.mobile}</td>
              <td>{customerData?.billPayType}</td>
              <td>{billingData?.billType == "bill" ? "বিল" : "কানেকশন ফি"}</td>
              <td>{billingData?.amount && customerData?.monthlyFee}</td>
            </tr>
          </tbody>
        </table> */}
        {/* <div className="page-footer">
          <div className="signature_container">
            <div className="p-3 signature_wraper">
              <div className="signamture_field">ম্যানেজার</div>
              <div className="signamture_field">এডমিন</div>
            </div>
          </div>
        </div>
        </div>
        */}

        <div className="container mt-3 mb-5">
          <table>
            <tbody>
              <tr>
                <td>{t("customerData")}</td>
              </tr>
              <tr>
                <td className="font-weight-bold">
                  {t("name")} : {customerData.name}
                  {customerData.mobile && (
                    <>
                      <br />
                      {t("mobile")} : {customerData.mobile}
                    </>
                  )}
                  {customerData.address && (
                    <>
                      <br />
                      {t("address")} : {customerData.address}
                    </>
                  )}
                  <br />
                  {`PPPOE  ${t("name")}: ${customerData.pppoe.name}`}
                </td>
              </tr>
            </tbody>
          </table>
          <table className="table table-bordered mt-2">
            <tbody>
              <tr>
                <th>{t("billType")}</th>
                <th>{t("billDhoron")}</th>
                <th>{t("package")}</th>
                <th>{t("amount")}</th>
                <th>{t("medium")}</th>
                <th style={{ width: "30%" }}> {t("paidDate")} </th>
              </tr>

              <tr>
                <td>{customerData?.billPayType}</td>
                <td>
                  {billingData?.billType == "bill"
                    ? t("bill")
                    : t("connectionFee")}
                </td>

                <td>
                  {customerData.userType === "simple-queue" ||
                  customerData.userType === "firewall-queue"
                    ? customerData.queue.package
                    : customerData.pppoe.profile}
                </td>
                <td>{billingData?.amount}</td>
                <td>{billingData?.medium}</td>
                <td>{moment(paymentDate).format("MMM-DD-YYYY")}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <strong>{t("note")} :</strong>{" "}
            {moment(billingData?.startDate).format("MMM/DD/YYYY")}-
            {moment(billingData?.endDate).format("MMM/DD/YYYY")}{" "}
            {t("Periodic bills have been paid.")}
          </div>

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
export default BillCollectInvoiceWithNote;
